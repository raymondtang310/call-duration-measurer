import { resolve } from 'path';
import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import { uglify } from 'rollup-plugin-uglify';
import { babel } from '@rollup/plugin-babel';

const tsconfigOverrideOptions = { compilerOptions: { declaration: false } };
const babelPluginOptions = { babelHelpers: 'bundled' };

export default [
  {
    input: resolve(__dirname, 'src', 'index.ts'),
    output: { file: 'dist/esm/index.js' },
    plugins: [typescript({ typescript: ttypescript }), babel(babelPluginOptions), uglify()],
  },
  {
    input: resolve(__dirname, 'src', 'CallDurationMeasurer', 'index.ts'),
    output: { file: 'dist/esm/CallDurationMeasurer/index.js' },
    plugins: [
      typescript({ typescript: ttypescript, tsconfigOverride: tsconfigOverrideOptions }),
      babel(babelPluginOptions),
      uglify(),
    ],
  },
  {
    input: resolve(__dirname, 'src', 'inlineMeasurer', 'index.ts'),
    output: { file: 'dist/esm/inlineMeasurer/index.js' },
    plugins: [
      typescript({ typescript: ttypescript, tsconfigOverride: tsconfigOverrideOptions }),
      babel(babelPluginOptions),
      uglify(),
    ],
  },
];
