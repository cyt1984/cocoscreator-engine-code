(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("electron"),
            t = require("lodash"),
            i = require("./platform");
        let s, r;
        i.isMainProcess ? (s = require("../main/ipc"), r = require("../main/console")) : (s = require("../renderer/ipc"), r = require("../renderer/console"));
        let n = null,
            l = {};
        const o = "selection:selected",
            c = "selection:unselected",
            a = "selection:activated",
            h = "selection:deactivated",
            f = "selection:hoverin",
            d = "selection:hoverout",
            u = "selection:context",
            v = "selection:changed",
            p = "selection:patch";
        let y = {
            register(e) {
                if (!i.isMainProcess) return r.warn("Editor.Selection.register can only be called in core level."), void 0;
                l[e] || (l[e] = new m(e))
            }, reset() {
                for (let e in l) l[e].clear();
                l = {}
            }, local: () => new m("local"), confirm() {
                for (let e in l) l[e].confirm()
            }, cancel() {
                for (let e in l) l[e].cancel()
            }, confirmed(e) {
                let t = l[e];
                return t ? t.confirmed : (r.error("Cannot find the type %s for selection. Please register it first.", e), !1)
            }, select(e, t, i, s) {
                let n = l[e];
                return n ? t && "string" != typeof t && !Array.isArray(t) ? (r.error("The 2nd argument for `Editor.Selection.select` must be a string or array"), void 0) : (n.select(t, i, s), void 0) : (r.error("Cannot find the type %s for selection. Please register it first.", e), void 0)
            }, unselect(e, t, i) {
                let s = l[e];
                return s ? t && "string" != typeof t && !Array.isArray(t) ? (r.error("The 2nd argument for `Editor.Selection.select` must be a string or array"), void 0) : (s.unselect(t, i), void 0) : (r.error("Cannot find the type %s for selection. Please register it first.", e), void 0)
            }, hover(e, t) {
                let i = l[e];
                if (!i) return r.error("Cannot find the type %s for selection. Please register it first.", e), void 0;
                i.hover(t)
            }, setContext(e, t) {
                let i = l[e];
                return i ? t && "string" != typeof t ? (r.error("The 2nd argument for `Editor.Selection.setContext` must be a string"), void 0) : (i.setContext(t), void 0) : (r.error("Cannot find the type %s for selection. Please register it first.", e), void 0)
            }, patch(e, t, i) {
                let s = l[e];
                if (!s) return r.error("Cannot find the type %s for selection. Please register it first", e), void 0;
                s.patch(t, i)
            }, clear(e) {
                let t = l[e];
                if (!t) return r.error("Cannot find the type %s for selection. Please register it first", e), void 0;
                t.clear()
            }, hovering(e) {
                let t = l[e];
                return t ? t.lastHover : (r.error("Cannot find the type %s for selection. Please register it first", e), null)
            }, contexts(e) {
                let t = l[e];
                return t ? t.contexts : (r.error("Cannot find the type %s for selection. Please register it first.", e), null)
            }, curActivate(e) {
                let t = l[e];
                return t ? t.lastActive : (r.error("Cannot find the type %s for selection. Please register it first.", e), null)
            }, curGlobalActivate: () => n ? {
                type: n.type,
                id: n.lastActive
            } : null, curSelection(e) {
                let t = l[e];
                return t ? t.selection.slice() : (r.error("Cannot find the type %s for selection. Please register it first.", e), null)
            }, filter(e, t, i) {
                let s, r, n, l;
                if ("name" === t) s = e.filter(i);
                else
                    for (s = [], n = 0; n < e.length; ++n) {
                        r = e[n];
                        let t = !0;
                        for (l = 0; l < s.length; ++l) {
                            let e = s[l];
                            if (r === e) {
                                t = !1;
                                break
                            }
                            let n = i(e, r);
                            if (n > 0) {
                                t = !1;
                                break
                            }
                            n < 0 && (s.splice(l, 1), --l)
                        }
                        t && s.push(r)
                    }
                return s
            }
        };

        function g(e, t, ...i) {
            "local" !== t && (s.sendToAll.apply(null, [`_${e}`, t, ...i, s.option({
                excludeSelf: !0
            })]), s.sendToAll.apply(null, [e, t, ...i]))
        }
        module.exports = y;
        class _ {
            constructor(e) {
                this.type = e, this.selection = [], this.lastActive = null, this.lastHover = null, this._context = null
            }
            _activate(e) {
                if (this.lastActive !== e) return null !== this.lastActive && void 0 !== this.lastActive && g(h, this.type, this.lastActive), this.lastActive = e, g(a, this.type, e), n = this, void 0;
                n !== this && (n = this, g(a, this.type, this.lastActive))
            }
            _unselectOthers(e) {
                e = e || [], Array.isArray(e) || (e = [e]);
                let i = t.difference(this.selection, e);
                return !!i.length && (g(c, this.type, i), this.selection = t.intersection(this.selection, e), !0)
            }
            select(e, i, s) {
                let r = !1;
                if (e = e || [], Array.isArray(e) || (e = [e]), (i = void 0 === i || i) && (r = this._unselectOthers(e)), e.length) {
                    let i = t.difference(e, this.selection);
                    i.length && (this.selection = this.selection.concat(i), g(o, this.type, i), r = !0)
                }
                e.length ? this._activate(e[e.length - 1]) : this._activate(null), r && s && g(v, this.type)
            }
            unselect(e, i) {
                let s = !1,
                    r = !1;
                if (e = e || [], Array.isArray(e) || (e = [e]), e.length) {
                    let i = t.intersection(this.selection, e);
                    this.selection = t.difference(this.selection, e), i.length && (-1 !== i.indexOf(this.lastActive) && (r = !0), g(c, this.type, i), s = !0)
                }
                r && (this.selection.length ? this._activate(this.selection[this.selection.length - 1]) : this._activate(null)), s && i && g(v, this.type)
            }
            hover(e) {
                this.lastHover !== e && (null !== this.lastHover && void 0 !== this.lastHover && g(d, this.type, this.lastHover), this.lastHover = e, null !== e && void 0 !== e && g(f, this.type, e))
            }
            setContext(e) {
                this._context = e, g(u, this.type, e)
            }
            patch(e, t) {
                let i = this.selection.indexOf(e); - 1 !== i && (this.selection[i] = t), this.lastActive === e && (this.lastActive = t), this.lastHover === e && (this.lastHover = t), this._context === e && (this._context = t), g(p, this.type, e, t)
            }
            clear() {
                let e = !1;
                this.selection.length && (g(c, this.type, this.selection), this.selection = [], e = !0), this.lastActive && (this._activate(null), e = !0), e && g(v, this.type)
            }
        }
        Object.defineProperty(_.prototype, "contexts", {
            enumerable: !0,
            get() {
                let e = this._context;
                if (!e) return [];
                let t = this.selection.indexOf(e);
                if (-1 === t) return [e];
                let i = this.selection.slice(0),
                    s = i[t];
                return i.splice(t, 1), i.unshift(s), i
            }
        });
        class m extends _ {
            constructor(e) {
                super(e), this.confirmed = !0, this._confirmedSnapShot = []
            }
            _checkConfirm(e) {
                !this.confirmed && e ? this.confirm() : this.confirmed && !e && (this._confirmedSnapShot = this.selection.slice(), this.confirmed = !1)
            }
            _activate(e) {
                this.confirmed && super._activate(e)
            }
            select(e, t, i) {
                i = void 0 === i || i, this._checkConfirm(i), super.select(e, t, i)
            }
            unselect(e, t) {
                t = void 0 === t || t, this._checkConfirm(t), super.unselect(e, t)
            }
            confirm() {
                if (!this.confirmed) {
                    this.confirmed = !0, t.xor(this._confirmedSnapShot, this.selection).length && g(v, this.type), this._confirmedSnapShot = [], this.selection.length > 0 ? this._activate(this.selection[this.selection.length - 1]) : this._activate(null)
                }
            }
            cancel() {
                this.confirmed || (super.select(this._confirmedSnapShot, !0), this.confirmed = !0, this._confirmedSnapShot = [])
            }
            clear() {
                super.clear(), this.confirm()
            }
        }
        let A = null;
        A = i.isMainProcess ? e.ipcMain : e.ipcRenderer, i.isMainProcess && A.on("selection:get-registers", e => {
            let t = [];
            for (let e in l) {
                let i = l[e];
                t.push({
                    type: e,
                    selection: i.selection,
                    lastActive: i.lastActive,
                    lastHover: i.lastHover,
                    context: i._context,
                    isLastGlobalActive: i === n
                })
            }
            e.returnValue = t
        }), i.isRendererProcess && (() => {
            let e = s.sendToMainSync("selection:get-registers");
            for (let t = 0; t < e.length; ++t) {
                let i = e[t];
                if (l[i.type]) return;
                let s = new m(i.type);
                s.selection = i.selection.slice(), s.lastActive = i.lastActive, s.lastHover = i.lastHover, s._context = i.context, l[i.type] = s, i.isLastGlobalActive && (n = s)
            }
        })(), A.on("_selection:selected", (e, t, i) => {
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            1 === (i = i.filter(e => -1 === s.selection.indexOf(e))).length ? s.selection.push(i[0]) : i.length > 1 && (s.selection = s.selection.concat(i))
        }), A.on("_selection:unselected", (e, t, i) => {
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            s.selection = s.selection.filter(e => -1 === i.indexOf(e))
        }), A.on("_selection:activated", (e, t, i) => {
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            n = s, s.lastActive = i
        }), A.on("_selection:deactivated", (e, t, i) => {
            unused(i);
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            n === s && (n = null), s.lastActive = null
        }), A.on("_selection:hoverin", (e, t, i) => {
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            s.lastHover = i
        }), A.on("_selection:hoverout", (e, t, i) => {
            unused(i);
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            s.lastHover = null
        }), A.on("_selection:context", (e, t, i) => {
            let s = l[t];
            if (!s) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            s._context = i
        }), A.on("_selection:patch", (e, t, i, s) => {
            let n = l[t];
            if (!n) return r.error("Cannot find the type %s for selection. Please register it first.", t), void 0;
            let o = n.selection.indexOf(i); - 1 !== o && (n.selection[o] = s), n.lastActive === i && (n.lastActive = s), n.lastHover === i && (n.lastHover = s), n._context === i && (n._context = s)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});