module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'jest-environment-jsdom' || pkg.name === 'jsdom') {
        delete pkg.peerDependencies?.canvas;
        delete pkg.peerDependenciesMeta?.canvas;
      }

      if (pkg.name === 'pdfjs-dist') {
        delete pkg.optionalDependencies?.canvas;
      }

      return pkg;
    }
  }
};
