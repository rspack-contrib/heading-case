import abbreviates from 'case-police/dict/abbreviates.json' with {
  type: 'json',
};
import brands from 'case-police/dict/brands.json' with { type: 'json' };
import general from 'case-police/dict/general.json' with { type: 'json' };
import products from 'case-police/dict/products.json' with { type: 'json' };
import softwares from 'case-police/dict/softwares.json' with { type: 'json' };

export const dict = [
  ...Object.values(abbreviates),
  ...Object.values(brands),
  ...Object.values(general),
  ...Object.values(products),
  ...Object.values(softwares),
  'Angular',
  'App Router',
  'Create React App',
  'Cloudflare Pages',
  'CSS Modules',
  'Docusaurus',
  'Docusaurus Faster',
  'EJS',
  'Emotion',
  'Fast Refresh',
  'GitHub Actions',
  'GitHub Pages',
  'I',
  'Lightning CSS',
  'Lynx',
  'Module Federation',
  'Nextra',
  'Netlify',
  'Kinsta',
  'Relay',
  'Page Router',
  'Parcel',
  'Preact',
  'Preact Refresh',
  'React',
  'React Compiler',
  'React Router',
  'React Scan',
  'React Server Components',
  'Rollup',
  'Rsbuild',
  'Rsdoctor',
  'Rslib',
  'Rspack',
  'Rstack',
  'Rspack Stack',
  'Rspress',
  'Rstest',
  'Solid',
  'Svelte',
  'Server Action',
  'Service Worker',
  'TanStack Router',
  'Vite',
  'Vue',
  'Web Workers',
  'Xcode',
  'Zeabur',
];
