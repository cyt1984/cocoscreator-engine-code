(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("electron"),
            i = require("fire-url"),
            t = require("fire-fs"),
            n = require("lodash"),
            s = require("events"),
            o = e.BrowserWindow,
            a = "1.1.1";
        let r = [],
            d = null,
            l = "",
            h = null;
        class u extends s {
            constructor(i, s) {
                if (super(), s = s || {}, n.defaultsDeep(s, {
                    windowType: "dockable",
                    width: 400,
                    height: 300,
                    acceptFirstMouse: !0,
                    disableAutoHideCursor: !0,
                    backgroundColor: "#333",
                    webPreferences: {
                        preload: p.url("editor-framework://renderer.js")
                    },
                    defaultFontSize: 13,
                    defaultMonospaceFontSize: 13
                }), this._loaded = !1, this._currentSessions = {}, this._panels = [], this._layout = null, d) {
                    let e = d.data;
                    e.windows && e.windows[i] && (this._layout = e.windows[i].layout)
                }
                switch (this.name = i, this.hideWhenBlur = !1, this.windowType = s.windowType, this.save = s.save, "boolean" != typeof this.save && (this.save = !0), this.windowType) {
                case "dockable":
                    s.resizable = !0, s.alwaysOnTop = !1;
                    break;
                case "float":
                    s.resizable = !0, s.alwaysOnTop = !0;
                    break;
                case "fixed-size":
                    s.resizable = !1, s.alwaysOnTop = !0;
                    break;
                case "quick":
                    s.resizable = !0, s.alwaysOnTop = !0, this.hideWhenBlur = !0
                }
                if (this.nativeWin = new o(s), void 0 === s.x && void 0 === s.y && u.main) {
                    let i = e.screen.getDisplayMatching(u.main.nativeWin.getBounds()),
                        t = this.nativeWin.getSize(),
                        n = .5 * (i.workArea.width - t[0]),
                        s = .5 * (i.workArea.height - t[1]);
                    n = Math.floor(n), s = Math.floor(s), n < 0 || s < 0 ? (this.nativeWin.setPosition(i.workArea.x, i.workArea.y), setImmediate(() => {
                        this.nativeWin.center()
                    })) : this.nativeWin.setPosition(n, s)
                }
                this.hideWhenBlur && this.nativeWin.setAlwaysOnTop(!0), this.nativeWin.on("focus", () => {
                    c.focused || (c.focused = !0, c.emit("focus"))
                }), this.nativeWin.on("blur", () => {
                    setImmediate(() => {
                        o.getFocusedWindow() || (c.focused = !1, c.emit("blur"))
                    }), this.hideWhenBlur && this.nativeWin.hide()
                }), this.nativeWin.on("close", e => {
                    "quick" === this.windowType && (e.preventDefault(), this.nativeWin.hide()), u._saveWindowStates()
                }), this.nativeWin.on("closed", () => {
                    for (let e in this._currentSessions) {
                        y._closeSessionThroughWin(e);
                        let i = this._currentSessions[e];
                        i && i()
                    }
                    this._currentSessions = {}, this.isMainWindow ? (u.removeWindow(this), u.main = null, w._quit()) : u.removeWindow(this), this.dispose()
                }), this.nativeWin.on("unresponsive", e => {
                    v.error(`Window "${this.name}" unresponsive: ${e}`)
                }), this.nativeWin.webContents.on("dom-ready", () => {
                    ["theme://globals/common.css", "theme://globals/layout.css"].forEach(e => {
                        let i = t.readFileSync(w.url(e), "utf8");
                        this.nativeWin.webContents.insertCSS(i)
                    })
                }), this.nativeWin.webContents.on("did-finish-load", () => {
                    this._loaded = !0
                }), this.nativeWin.webContents.on("crashed", e => {
                    v.error(`Window "${this.name}" crashed: ${e}`)
                }), this.nativeWin.webContents.on("will-navigate", (i, t) => {
                    i.preventDefault(), e.shell.openExternal(t)
                }), u.addWindow(this)
            }
            dispose() {
                this.nativeWin = null
            }
            load(e, n) {
                let s = p.url(e);
                if (!s) return v.error(`Failed to load page ${e} for window "${this.name}"`), void 0;
                this._url = e, this._loaded = !1;
                let o = n ? encodeURIComponent(JSON.stringify(n)) : void 0;
                if (t.existsSync(s)) return s = i.format({
                    protocol: "file",
                    pathname: s,
                    slashes: !0,
                    hash: o
                }), this.nativeWin.loadURL(s), void 0;
                o && (s = `${s}#${o}`), this.nativeWin.loadURL(s)
            }
            show() {
                this.nativeWin.show()
            }
            hide() {
                this.nativeWin.hide()
            }
            close() {
                this._loaded = !1, this.nativeWin.close()
            }
            forceClose() {
                this._loaded = !1, u._saveWindowStates(), this.nativeWin && this.nativeWin.destroy()
            }
            focus() {
                this.nativeWin.focus()
            }
            minimize() {
                this.nativeWin.minimize()
            }
            restore() {
                this.nativeWin.restore()
            }
            openDevTools(e) {
                e = e || {
                    mode: "detach"
                }, this.nativeWin.openDevTools(e)
            }
            closeDevTools() {
                this.nativeWin.closeDevTools()
            }
            adjust(i, t, n, s) {
                let o = !1;
                "number" != typeof i && (o = !0, i = 0), "number" != typeof t && (o = !0, t = 0), ("number" != typeof n || n <= 0) && (o = !0, n = 800), ("number" != typeof s || s <= 0) && (o = !0, s = 600);
                let a = e.screen.getDisplayMatching({
                    x: i,
                    y: t,
                    width: n,
                    height: s
                });
                this.nativeWin.setSize(n, s), this.nativeWin.setPosition(a.workArea.x, a.workArea.y), o ? this.nativeWin.center() : this.nativeWin.setPosition(i, t)
            }
            resetLayout(e) {
                let i, n = w.url(e);
                n || (n = w.url(l));
                try {
                    i = JSON.parse(t.readFileSync(n))
                } catch (e) {
                    w.error(`Failed to load default layout: ${e.message}`), i = null
                }
                i && (y._closeAllSessions(), this.send("editor:reset-layout", i))
            }
            emptyLayout() {
                y._closeAllSessions(), this.send("editor:reset-layout", null)
            }
            _send(...e) {
                let i = this.nativeWin.webContents;
                return i ? (i.send.apply(i, e), !0) : (v.error(`Failed to send "${e[0]}" to ${this.name} because web contents are not yet loaded`), !1)
            }
            _sendToPanel(e, i, ...t) {
                if ("string" != typeof i) return v.error(`The message ${i} sent to panel ${e} must be a string`), void 0;
                let n = y._popReplyAndTimeout(t);
                if (!n) return t = ["editor:ipc-main2panel", e, i, ...t], !1 === this._send.apply(this, t) && v.failed(`send message "${i}" to panel "${e}" failed, no response received.`), void 0;
                let s = y._newSession(i, `${e}@main`, n.reply, n.timeout, this);
                return this._currentSessions[s] = n.reply, t = ["editor:ipc-main2panel", e, i, ...t, y.option({
                    sessionId: s,
                    waitForReply: !0,
                    timeout: n.timeout
                })], this._send.apply(this, t), s
            }
            _closeSession(e) {
                this.nativeWin && delete this._currentSessions[e]
            }
            _addPanel(e) {
                -1 === this._panels.indexOf(e) && this._panels.push(e)
            }
            _removePanel(e) {
                let i = this._panels.indexOf(e); - 1 !== i && this._panels.splice(i, 1)
            }
            _removeAllPanels() {
                this._panels = []
            }
            send(e, ...i) {
                if ("string" != typeof e) return v.error(`Send message failed for '${e}'. The message must be a string`), void 0;
                let t = y._popReplyAndTimeout(i);
                if (!t) return i = [e, ...i], !1 === this._send.apply(this, i) && v.failed(`send message "${e}" to window failed. No response was received.`), void 0;
                let n = y._newSession(e, `${this.nativeWin.id}@main`, t.reply, t.timeout, this);
                return this._currentSessions[n] = t.reply, i = ["editor:ipc-main2renderer", e, ...i, y.option({
                    sessionId: n,
                    waitForReply: !0,
                    timeout: t.timeout
                })], this._send.apply(this, i), n
            }
            popupMenu(e, i, t) {
                void 0 !== i && (i = Math.floor(i)), void 0 !== t && (t = Math.floor(t));
                let n = this.nativeWin.webContents,
                    s = new m(e, n);
                s.nativeMenu.popup(this.nativeWin, i, t), s.dispose()
            }
            get isMainWindow() {
                return u.main === this
            }
            get isFocused() {
                return this.nativeWin.isFocused()
            }
            get isMinimized() {
                return this.nativeWin.isMinimized()
            }
            get isLoaded() {
                return this._loaded
            }
            get panels() {
                return this._panels
            }
            static get defaultLayoutUrl() {
                return l
            }
            static set defaultLayoutUrl(e) {
                l = e
            }
            static get windows() {
                return r.slice()
            }
            static set main(e) {
                return h = e
            }
            static get main() {
                return h
            }
            static find(e) {
                if ("string" == typeof e) {
                    for (let i = 0; i < r.length; ++i) {
                        let t = r[i];
                        if (t.name === e) return t
                    }
                    return null
                }
                if (e instanceof o) {
                    for (let i = 0; i < r.length; ++i) {
                        let t = r[i];
                        if (t.nativeWin === e) return t
                    }
                    return null
                }
                for (let i = 0; i < r.length; ++i) {
                    let t = r[i];
                    if (t.nativeWin && t.nativeWin.webContents === e) return t
                }
                return null
            }
            static addWindow(e) {
                r.push(e)
            }
            static removeWindow(e) {
                let i = r.indexOf(e);
                if (-1 === i) return v.warn(`Cannot find window ${e.name}`), void 0;
                r.splice(i, 1)
            }
            static getPanelWindowState(e) {
                if (d) {
                    let i = d.data.panels[e];
                    if (i) return {
                        x: i.x,
                        y: i.y,
                        width: i.width,
                        height: i.height
                    }
                }
                return {}
            }
            static _saveWindowStates() {
                if ("test" === w.argv._command) return;
                if (!u.main) return;
                if (!d) return;
                let e = d.data;
                e.version = a, e.windows = {};
                for (let i = 0; i < r.length; ++i) {
                    let t = r[i],
                        n = t.nativeWin.getBounds();
                    if (t.save ? (n.width || (v.warn(`Failed to commit window state. Invalid window width: ${n.width}`), n.width = 800), n.height || (v.warn(`Failed to commit window state. Invalid window height ${n.height}`), n.height = 600), e.windows[t.name] = {
                        main: t.isMainWindow,
                        url: t._url,
                        windowType: t.windowType,
                        x: n.x,
                        y: n.y,
                        width: n.width,
                        height: n.height,
                        layout: t._layout,
                        panels: t._panels
                    }) : e.windows[t.name] = {}, !t.isMainWindow && 1 === t.panels.length) {
                        let e = t.panels[0];
                        d.data.panels[e] = {
                            x: n.x,
                            y: n.y,
                            width: n.width,
                            height: n.height
                        }
                    }
                }
                d.save()
            }
            static _loadWindowStates() {
                (d = f.load("profile://local/layout.windows.json", {
                    version: a,
                    windows: {},
                    panels: {}
                })).data.version !== a && d.reset({
                    version: a,
                    windows: {},
                    panels: {}
                })
            }
            static _restoreWindowStates(e) {
                if (d) {
                    let i = Object.assign({}, e);
                    for (let e in d.data.windows) {
                        let t, n = d.data.windows[e];
                        p.url(n.url) && (n.main ? (i.show = !1, i.windowType = n.windowType, t = new u(e, i), u.main = t) : t = new u(e, {
                            show: !1,
                            windowType: n.windowType
                        }), "simple" === n.windowType && (t._panels = n.panels), !n.main && n.panels && n.panels.length && t.nativeWin.setMenuBarVisibility(!1), t.adjust(n.x, n.y, n.width, n.height), t.show(), t.load(n.url))
                    }
                    if (u.main) return u.main.focus(), !0
                }
                return !1
            }
        }
        module.exports = u;
        const w = require("./editor"),
            p = require("./protocol"),
            c = require("./app"),
            f = require("electron-profile"),
            v = require("./console"),
            m = require("./menu"),
            y = require("./ipc"),
            W = e.ipcMain;
        W.on("editor:window-open", (e, i, t, n) => {
            let s = new u(i, n = n || {});
            s.nativeWin.setMenuBarVisibility(!1), n.width && n.height && s.nativeWin.setContentSize(n.width, n.height), s.load(t, n.argv), s.show()
        }), W.on("editor:window-query-layout", e => {
            let i = o.fromWebContents(e.sender),
                n = u.find(i);
            if (!n) return v.warn("Failed to query layout, cannot find the window."), e.reply(), void 0;
            let s = n._layout;
            if (n.isMainWindow && !s) {
                let e = p.url(l);
                if (t.existsSync(e)) try {
                    s = JSON.parse(t.readFileSync(e))
                } catch (e) {
                    v.error(`Failed to load default layout: ${e.message}`), s = null
                }
            }
            e.reply(null, s)
        }), W.on("editor:window-save-layout", (e, i) => {
            let t = o.fromWebContents(e.sender),
                n = u.find(t);
            if (!n) return v.warn("Failed to save layout, cannot find the window."), void 0;
            n._layout = i, u._saveWindowStates()
        }), W.on("editor:window-focus", e => {
            let i = o.fromWebContents(e.sender),
                t = u.find(i);
            if (!t) return v.warn("Failed to focus, cannot find the window."), void 0;
            t.isFocused || t.focus()
        }), W.on("editor:window-load", (e, i, t) => {
            let n = o.fromWebContents(e.sender),
                s = u.find(n);
            if (!s) return v.warn("Failed to focus, cannot find the window."), void 0;
            s.load(i, t)
        }), W.on("editor:window-resize", (e, i, t, n) => {
            let s = o.fromWebContents(e.sender),
                a = u.find(s);
            if (!a) return v.warn("Failed to focus, cannot find the window."), void 0;
            n ? a.nativeWin.setContentSize(i, t) : a.nativeWin.setSize(i, t)
        }), W.on("editor:window-center", e => {
            let i = o.fromWebContents(e.sender),
                t = u.find(i);
            if (!t) return v.warn("Failed to focus, cannot find the window."), void 0;
            t.nativeWin.center()
        }), W.on("editor:window-inspect-at", (e, i, t) => {
            let n = o.fromWebContents(e.sender);
            if (!n) return v.warn(`Failed to inspect at ${i}, ${t}, cannot find the window.`), void 0;
            n.inspectElement(i, t), n.devToolsWebContents && n.devToolsWebContents.focus()
        }), W.on("editor:window-remove-all-panels", e => {
            let i = o.fromWebContents(e.sender),
                t = u.find(i);
            if (!t) return e.reply(), void 0;
            t._removeAllPanels(), e.reply()
        });
    }.call(this, exports, require, module, __filename, __dirname);
});