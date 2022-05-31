import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';



/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: 'src/index.ts',
  output: [
    {
      dir: './lib',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      dir: './lib',
      format: 'umd',
      sourcemap: true,
      entryFileNames: 'index.umd.js',
      name:'Behavior',
    },
    {
      dir: './lib',
      entryFileNames: 'index.es.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [

    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled',
    }),
    typescript(),
    postcss({
      extensions: ['.css'],
    }),

  ],
};

export default options;
