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

function format(content: string) {
  return content;
}

export async function headingCase({
  root = process.cwd(),
}: {
  root?: string;
} = {}) {
  const files = await globMarkdownFiles(root);
  for (const file of files) {
    const content = await fs.promises.readFile(file, 'utf-8');
    const formatted = format(content);
    if (formatted !== content) {
      await fs.promises.writeFile(file, formatted);
      logger.success(`${color.green('Formatted')} ${color.dim(file)}`);
    }
  }
}
