'use strict'

import commonjs from 'rollup-plugin-commonjs'

export default {
  exports: 'named',
  entry: './dist/main.js',
  dest: './dist/main-es.js',
  plugins: [
    commonjs({})
  ]
}
