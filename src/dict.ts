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
  'Create React App',
  'CSS Modules',
  'EJS',
  'Module Federation',
  'Parcel',
  'React',
  'React Router',
  'Rollup',
  'Rsbuild',
  'Rsdoctor',
  'Rslib',
  'Rspack',
  'Rspress',
  'Rstest',
  'Vite',
  'Web Workers',
];
