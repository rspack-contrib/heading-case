import fs from 'node:fs';
import color from 'picocolors';
import { logger } from 'rslog';
import { glob } from 'tinyglobby';
import { dict } from './dict.js';

export async function globMarkdownFiles(cwd: string) {
  return glob(['**/*.md', '**/*.mdx'], {
    cwd,
    ignore: ['**/node_modules', '**/dist', '**/.git', '**/.cache', '**/temp'],
    absolute: true,
  });
}

const isTitleLine = (line: string) => /^#{1,6}\s+\S/.test(line.trim());
const isEnglishWord = (word: string) => /^[a-zA-Z]+$/.test(word);
const isFirstCharUppercase = (word: string) => /^[A-Z][a-z]*$/.test(word);

const isTerm = (word: string, line: string) => {
  return dict.some((term) => {
    if (term.includes(` ${word}`) || term.includes(`${word} `)) {
      return line.includes(term);
    }
    return term === word;
  });
};

const shouldWrite = process.argv.includes('--write');

const formatLine = (originalLine: string) => {
  let line = originalLine;
  const words = line.trim().split(/\s+/);
  const englishWords: string[] = [];

  for (let index = 0; index < words.length; index++) {
    const word = words[index];

    if (isEnglishWord(word)) {
      englishWords.push(word);
    }

    if (
      // ignore the first English word
      englishWords.length <= 1 ||
      // ignore terms
      isTerm(word, originalLine) ||
      // only format the first-char-uppercase English words
      !isFirstCharUppercase(word)
    ) {
      continue;
    }

    const lowerCaseWord = word.toLowerCase();
    if (lowerCaseWord !== word) {
      line = line.replace(new RegExp(`\\b${word}\\b`, 'g'), lowerCaseWord);
    }
  }

  return line;
};

function formatContent(content: string, filePath: string) {
  const lines = content.split('\n');

  return lines
    .map((originalLine) => {
      if (isTitleLine(originalLine)) {
        const formattedLine = formatLine(originalLine);

        if (!shouldWrite && formattedLine !== originalLine) {
          logger.error(`Unexpected heading case in ${color.dim(filePath)}`);
          logger.log(`        Current: ${color.cyan(originalLine)}`);
          logger.log(`        Expected: ${color.cyan(formattedLine)}\n`);
        }

        return formattedLine;
      }
      return originalLine;
    })
    .join('\n');
}

async function formatFile(filePath: string) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const formatted = formatContent(content, filePath);
  const isChanged = formatted !== content;

  if (isChanged && shouldWrite) {
    await fs.promises.writeFile(filePath, formatted);
    logger.success(`[heading-case] formatted: ${color.dim(filePath)}`);
  }

  return isChanged;
}

export async function headingCase({
  root = process.cwd(),
}: {
  root?: string;
} = {}) {
  const files = await globMarkdownFiles(root);
  let count = 0;

  for (const file of files) {
    const isFormatted = await formatFile(file);
    if (isFormatted) {
      count++;
    }
  }

  if (count) {
    if (shouldWrite) {
      logger.success(
        `[heading-case] formatted ${color.yellow(count.toString())} files.`,
      );
    } else {
      logger.info(
        `[heading-case] found issues in ${color.yellow(count.toString())} files.`,
      );
      process.exit(1);
    }
  }
}
