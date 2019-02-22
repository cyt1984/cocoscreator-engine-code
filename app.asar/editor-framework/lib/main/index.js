(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = require("./editor");
        Object.assign(e, require("../share/platform")), Object.assign(e, require("./console")), e.IpcListener = require("../share/ipc-listener"), e.JS = require("../share/js-utils"), e.KeyCode = require("../share/keycode"), e.Math = require("../share/math"), e.Selection = require("../share/selection"), e.Undo = require("../share/undo"), e.Utils = require("../share/utils"), e.App = require("./app"), e.DevTools = require("./devtools"), e.Dialog = require("./dialog"), e.Ipc = require("./ipc"), e.MainMenu = require("./main-menu"), e.Menu = require("./menu"), e.Debugger = require("./debugger"), e.Package = require("./package"), e.Panel = require("./panel"), e.Profile = require("electron-profile"), e.Protocol = require("./protocol"), e.Window = require("./window"), e.Worker = require("./worker"), e.i18n = require("./i18n"), e.T = e.i18n.t, global.unused = (() => {}), global.deprecate = function (r, i, u) {
            u = void 0 !== u && u;
            let o = !1;
            return function () {
                return u ? e.trace("warn", i) : o || (e.warn(i), o = !0), r.apply(this, arguments)
            }
        }, global.Editor = e, require("./deprecated"), module.exports = e;
    }.call(this, exports, require, module, __filename, __dirname);
});