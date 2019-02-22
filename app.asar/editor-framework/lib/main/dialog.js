(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {};
        module.exports = e;
        const o = require("electron"),
            r = require("./console"),
            n = o.dialog;
        e.openFile = function (...e) {
            try {
                return n.showOpenDialog.apply(n, e)
            } catch (e) {
                r.error(e)
            }
            return null
        }, e.saveFile = function (...e) {
            try {
                return n.showSaveDialog.apply(n, e)
            } catch (e) {
                r.error(e)
            }
            return null
        }, e.messageBox = function (...e) {
            try {
                return n.showMessageBox.apply(n, e)
            } catch (e) {
                r.error(e)
            }
            return null
        };
        const l = o.ipcMain;
        l.on("dialog:open-file", function (o, ...r) {
            let n = e.openFile.apply(e, r);
            void 0 === n && (n = -1), o.returnValue = n
        }), l.on("dialog:save-file", function (o, ...r) {
            let n = e.saveFile.apply(e, r);
            void 0 === n && (n = -1), o.returnValue = n
        }), l.on("dialog:message-box", function (o, ...r) {
            let n = e.messageBox.apply(e, r);
            void 0 === n && (n = -1), o.returnValue = n
        });
    }.call(this, exports, require, module, __filename, __dirname);
});