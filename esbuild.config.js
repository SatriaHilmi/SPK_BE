// esbuild.config.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  // keepNames: true,
  platform: 'node',
  outfile: 'dist/index.js',
  external:['express-list-endpoints', 'express'],
  minify: true
}).catch(() => process.exit(1));