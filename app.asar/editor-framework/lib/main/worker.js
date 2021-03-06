(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("electron"),
            i = require("fire-fs"),
            r = require("fire-url"),
            t = require("lodash"),
            o = require("./console"),
            s = require("./protocol"),
            n = require("../share/ipc-listener"),
            l = e.BrowserWindow;
        module.exports = class {
            constructor(e, i) {
                this.options = i || {}, this.ipcListener = new n, t.defaultsDeep(i, {
                    workerType: "renderer",
                    url: ""
                })
            }
            start(e, i) {
                "function" == typeof e && (i = e, e = void 0), "renderer" === this.options.workerType && (this.nativeWin = new l({
                    width: 0,
                    height: 0,
                    show: !1
                }), this.nativeWin.on("closed", () => {
                    this.ipcListener.clear(), this.dispose()
                }), this.nativeWin.webContents.on("dom-ready", () => {
                    i && i()
                }), this._load(this.options.url, e))
            }
            close() {
                "renderer" === this.options.workerType && this.nativeWin.close()
            }
            on(...e) {
                "renderer" === this.options.workerType && this.ipcListener.on.apply(this.ipcListener, e)
            }
            dispose() {
                this.nativeWin = null
            }
            _load(e, t) {
                let n = s.url(e);
                if (!n) return o.error(`Failed to load page ${e} for window "${this.name}"`), void 0;
                this._url = e, this._loaded = !1;
                let l = t ? encodeURIComponent(JSON.stringify(t)) : void 0,
                    h = n;
                if (i.existsSync(n)) return h = r.format({
                    protocol: "file",
                    pathname: n,
                    slashes: !0,
                    hash: l
                }), this.nativeWin.loadURL(h), void 0;
                l && (h = `${n}#${l}`), this.nativeWin.loadURL(h)
            }
        };
    }.call(this, exports, require, module, __filename, __dirname);
});