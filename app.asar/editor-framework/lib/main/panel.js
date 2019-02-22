(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {};
        module.exports = e;
        const n = require("electron"),
            i = require("./window"),
            t = require("./console"),
            o = require("./package");
        e.templateUrl = "editor-framework://static/window.html", e.open = function (n, l) {
            let r = o.panelInfo(n);
            if (!r) return t.error(`Failed to open panel ${n}, panel info not found.`), void 0;
            let a = e.findWindow(n);
            if (a) return a.show(), a.focus(), a.send("editor:panel-run", n, l), void 0;
            let d = `window-${(new Date).getTime()}`,
                p = !0;
            "simple" === r.type && (p = r.devTools);
            let s = {
                    useContentSize: !0,
                    width: parseInt(r.width),
                    height: parseInt(r.height),
                    minWidth: parseInt(r["min-width"]),
                    minHeight: parseInt(r["min-height"]),
                    maxWidth: parseInt(r["max-width"]),
                    maxHeight: parseInt(r["max-height"]),
                    frame: r.frame,
                    resizable: r.resizable,
                    save: void 0 === r.save || r.save,
                    webPreferences: {
                        devTools: p
                    }
                },
                h = !0,
                u = i.getPanelWindowState(n);
            if (u && (u.x && (s.x = parseInt(u.x)), u.y && (s.y = parseInt(u.y)), u.width && (h = !1, s.width = parseInt(u.width)), u.height && (h = !1, s.height = parseInt(u.height))), s.windowType = r.type || "dockable", s.resizable || (h = !0, s.width = parseInt(r.width), s.height = parseInt(r.height)), isNaN(s.width) && (s.width = 400), isNaN(s.height) && (s.height = 400), isNaN(s.minWidth) && (s.minWidth = 200), isNaN(s.minHeight) && (s.minHeight = 200), (a = new i(d, s)).nativeWin.setMenuBarVisibility(!1), h ? a.nativeWin.setContentSize(s.width, s.height) : a.nativeWin.setSize(s.width, s.height), a._addPanel(n), "simple" === r.type) {
                let e = n.split(".");
                a.load(`packages://${e[0]}/${r.main}`, l)
            } else a._layout = {
                type: "dock-v",
                children: [{
                    type: "panel",
                    active: 0,
                    children: [n]
                }]
            }, a.load(e.templateUrl, {
                panelID: n,
                panelArgv: l
            });
            a.focus()
        }, e.close = function (n, i) {
            let l = e.findWindow(n);
            if (!l) return i && i(new Error(`Can not find panel ${n} in main process.`)), void 0;
            let r = o.panelInfo(n);
            return r ? "simple" === r.type ? (l.close(), i && i(null, !0), void 0) : (l.send("editor:panel-unload", n, (e, t) => e ? (i && i(e), void 0) : t ? (l.isMainWindow || 1 !== l.panels.length || l.close(), l._removePanel(n), i && i(null, !0), void 0) : (i && i(null, !1), void 0), -1), void 0) : (t.error(`Failed to close panel ${n}, panel info not found.`), void 0)
        }, e.popup = function (n) {
            let i = e.findWindow(n);
            i && (i.panels.length <= 1 || e.close(n, (i, o) => {
                if (i) return t.error(`Failed to close panel ${n}: ${i.stack}`), void 0;
                o && e.open(n)
            }))
        }, e.findWindow = function (e) {
            for (let n = 0; n < i.windows.length; ++n) {
                let t = i.windows[n];
                if (-1 !== t.panels.indexOf(e)) return t
            }
            return null
        };
        const l = n.ipcMain;
        l.on("editor:panel-query-info", (e, n) => {
            if (!n) return t.error("A `editor:panel-query-info` message failed because the panelID is null or undefined."), e.reply(new Error("Invalid panelID")), void 0;
            let i = o.panelInfo(n);
            if (!i) return e.reply(new Error(`Panel info not found for panel ${n}`)), void 0;
            e.reply(null, i)
        }), l.on("editor:panel-open", (n, i, t) => {
            e.open(i, t)
        }), l.on("editor:panel-dock", (e, t) => {
            let o = n.BrowserWindow.fromWebContents(e.sender);
            i.find(o)._addPanel(t)
        }), l.on("editor:panel-close", (n, i) => {
            e.close(i, (e, i) => {
                n.reply && n.reply(e, i)
            })
        }), l.on("editor:panel-popup", (n, i) => {
            e.popup(i)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});