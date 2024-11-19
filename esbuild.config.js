const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'renderer.js')],
  bundle: true,
  outfile: path.join(__dirname, 'static', 'dist', 'renderer.bundle.js'),
  platform: 'browser',
  sourcemap: !isProduction, 
  minify: isProduction, 
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  loader: {
    '.js': 'js',
    '.jsx': 'jsx',
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css',
    '.scss': 'css',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.webp': 'file',
    '.svg': 'file',
    '.html': 'text',
    '.json': 'json',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file',
  },
}).catch(() => process.exit(1));