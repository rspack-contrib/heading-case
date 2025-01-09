import fs from 'node:fs';
import color from 'picocolors';
import { logger } from 'rslog';
import { glob } from 'tinyglobby';

export async function globMarkdownFiles(cwd: string) {
  return glob(['**/*.md', '**/*.mdx'], {
    cwd,
    ignore: ['**/node_modules', '**/dist', '**/.git', '**/.cache', '**/temp'],
    absolute: true,
  });
}

function formatContent(content: string) {
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('#')) {
    }
  }

  return lines.join('\n');
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
    const result = await formatFile(file);
    if (result) {
      count++;
    }
  }

  logger.success(
    `[heading-case] Formatted ${color.green(count.toString())} files.`,
  );
}
