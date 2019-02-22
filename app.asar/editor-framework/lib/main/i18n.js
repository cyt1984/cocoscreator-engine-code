(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("../share/i18n");
        module.exports = e, require("electron").ipcMain.on("editor:get-i18n-phrases", r => {
            r.returnValue = e.polyglot.phrases
        });
    }.call(this, exports, require, module, __filename, __dirname);
});