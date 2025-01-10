import assert from 'node:assert';
import test from 'node:test';
import { formatLine } from '../dist/index.js';

test('should format line as expected', () => {
  // Basic
  assert.deepStrictEqual(formatLine('# Hello World'), '# Hello world');
  assert.deepStrictEqual(formatLine('## Hello World'), '## Hello world');
  assert.deepStrictEqual(formatLine('### Hello World'), '### Hello world');
  assert.deepStrictEqual(formatLine('#### Hello World'), '#### Hello world');
  assert.deepStrictEqual(formatLine('##### Hello World'), '##### Hello world');
  assert.deepStrictEqual(
    formatLine('###### Hello World'),
    '###### Hello world',
  );

  // Same words
  assert.deepStrictEqual(
    formatLine('# Hello Hello Hello World'),
    '# Hello hello hello world',
  );

  // Term
  assert.deepStrictEqual(
    formatLine('# A New Method for Creating JavaScript Rollovers'),
    '# A new method for creating JavaScript rollovers',
  );

  // Number
  assert.deepStrictEqual(formatLine('# 1. Hello World'), '# 1. Hello world');

  // Chinese
  assert.deepStrictEqual(
    formatLine('# 你好 Hello World'),
    '# 你好 Hello world',
  );
});
