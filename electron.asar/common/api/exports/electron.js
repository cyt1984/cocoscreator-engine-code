(function (exports, require, module, __filename, __dirname, process, global, Buffer) { return function (exports, require, module, __filename, __dirname) { const moduleList = require('../module-list')

// Attaches properties to |exports|.
exports.defineProperties = function (exports) {
  const descriptors = {}
  for (const module of moduleList) {
    descriptors[module.name] = {
      enumerable: !module.private,
      get: () => require(`../${module.file}`)
    }
  }
  return Object.defineProperties(exports, descriptors)
}

}.call(this, exports, require, module, __filename, __dirname); });