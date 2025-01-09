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
const isTerm = (word: string) => dict.includes(word);
const isFirstCharUppercase = (word: string) => /^[A-Z][a-z]*$/.test(word);

const formatLine = (originalLine: string) => {
  let line = originalLine;
  const words = line.trim().split(/\s+/);

  for (let index = 0; index < words.length; index++) {
    const word = words[index];

    // Ignore the first word and terms
    // preserve the first-char-uppercase English words
    if (index <= 1 || !isFirstCharUppercase(word) || isTerm(word)) {
      continue;
    }

    const lowerCaseWord = word.toLowerCase();
    if (lowerCaseWord !== word) {
      line = line.replace(new RegExp(`\\b${word}\\b`, 'g'), lowerCaseWord);
    }
  }

  return line;
};

function formatContent(content: string) {
  const lines = content.split('\n');

  return lines
    .map((originalLine) => {
      if (isTitleLine(originalLine)) {
        return formatLine(originalLine);
      }
      return originalLine;
    })
    .join('\n');
}

async function formatFile(filePath: string) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const formatted = formatContent(content);
  const isChanged = formatted !== content;

  if (isChanged) {
    await fs.promises.writeFile(filePath, formatted);
    logger.success(`${color.green('Formatted')} ${color.dim(filePath)}`);
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
    logger.success(
      `[heading-case] formatted ${color.yellow(count.toString())} files.`,
    );
  }
}
