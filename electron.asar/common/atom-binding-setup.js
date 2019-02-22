(function (exports, require, module, __filename, __dirname, process, global, Buffer) { return function (exports, require, module, __filename, __dirname) { module.exports = function atomBindingSetup (binding, processType) {
    return function atomBinding (name) {
      try {
        return binding(`atom_${processType}_${name}`)
      } catch (error) {
        if (/No such module/.test(error.message)) {
          return binding(`atom_common_${name}`)
        } else {
          throw error
        }
      }
    }
  }
  
  }.call(this, exports, require, module, __filename, __dirname); });