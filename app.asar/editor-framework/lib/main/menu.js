(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("electron"),
            n = require("fire-path"),
            t = require("lodash");
        let r = {},
            i = !1;
        class a {
            constructor(n, t) {
                if (!n) return this.nativeMenu = new e.Menu, void 0;
                a.convert(n, t), this.nativeMenu = e.Menu.buildFromTemplate(n)
            }
            dispose() {
                this.nativeMenu = null
            }
            reset(n) {
                a.convert(n), this.nativeMenu = e.Menu.buildFromTemplate(n)
            }
            clear() {
                this.nativeMenu = new e.Menu
            }
            add(t, r) {
                if (!Array.isArray(r) && !r.label && "separator" !== r.type) {
                    let e = t.lastIndexOf("/"); - 1 !== e && (r.label = t.slice(e + 1), t = t.slice(0, e))
                }
                let i = o(this.nativeMenu, t, !0);
                if (!i) return u.error(`Failed to find menu in path: ${t}`), !1;
                if ("submenu" !== i.type || !i.submenu) return u.error(`Failed to add menu at ${t}, it is not a submenu`), !1;
                Array.isArray(r) || (r = [r]), a.convert(r);
                let l = e.Menu.buildFromTemplate(r);
                for (let e = 0; e < l.items.length; ++e) {
                    let r = l.items[e];
                    if (i.submenu.items.some(e => e.label === r.label)) return u.error(`Failed to add menu to ${t},\n          a menu item ${n.posix.join(t,r.label)} you tried to add already exists`), !1
                }
                for (let e = 0; e < l.items.length; ++e) {
                    let n = l.items[e];
                    i.submenu.append(n)
                }
                return !0
            }
            insert(t, r, i) {
                if (!Array.isArray(i) && !i.label && "separator" !== i.type) {
                    let e = t.lastIndexOf("/"); - 1 !== e && (i.label = t.slice(e + 1), t = t.slice(0, e))
                }
                let l = n.dirname(t);
                if ("." === l) {
                    Array.isArray(i) || (i = [i]), a.convert(i);
                    let n = e.Menu.buildFromTemplate(i),
                        u = new e.MenuItem({
                            label: t,
                            id: t.toLowerCase(),
                            submenu: new e.Menu,
                            type: "submenu"
                        });
                    for (let e = 0; e < n.items.length; ++e) {
                        let t = n.items[e];
                        u.submenu.append(t)
                    }
                    return this.nativeMenu.insert(r, u), !0
                }
                let s = n.basename(t),
                    m = o(this.nativeMenu, l);
                if (!m) return u.error(`Failed to find menu in path: ${l}`), !1;
                if ("submenu" !== m.type || !m.submenu) return u.error(`Failed to insert menu at ${l}, it is not a submenu`), !1;
                let d = m.submenu.items.some(e => e.label === s);
                Array.isArray(i) || (i = [i]), a.convert(i);
                let p = e.Menu.buildFromTemplate(i);
                if (d) {
                    let e = o(this.nativeMenu, t, !0);
                    for (let n = 0; n < p.items.length; ++n) {
                        let t = p.items[n];
                        e.submenu.append(t)
                    }
                    return !1
                } {
                    let n = new e.MenuItem({
                        label: s,
                        id: s.toLowerCase(),
                        submenu: new e.Menu,
                        type: "submenu"
                    });
                    for (let e = 0; e < p.items.length; ++e) {
                        let t = p.items[e];
                        n.submenu.append(t)
                    }
                    return m.submenu.insert(r, n), !0
                }
            }
            remove(t) {
                let r = new e.Menu;
                return function e(t, r, i, a) {
                    let u = !1;
                    for (let l = 0; l < r.items.length; ++l) {
                        let s = r.items[l],
                            o = n.posix.join(a, s.label);
                        if (!n.contains(o, i)) {
                            t.append(s);
                            continue
                        }
                        if (o === i) {
                            u = !0;
                            continue
                        }
                        let d = m(s);
                        if ("submenu" !== d.type) {
                            t.append(d);
                            continue
                        }
                        let p = e(d.submenu, s.submenu, i, o);
                        p && (u = !0), d.submenu.items.length > 0 && t.append(d)
                    }
                    return u
                }(r, this.nativeMenu, t, "") ? (this.nativeMenu = r, !0) : (u.error(`Failed to remove menu in path: ${t} (could not be found)`), !1)
            }
            update(e, r) {
                let i = function (e, r) {
                    let i = e,
                        a = r.split("/"),
                        u = "";
                    for (let e = 0; e < a.length; e++) {
                        let r = e === a.length - 1,
                            l = a[e],
                            s = null;
                        u = n.posix.join(u, l);
                        let o = t.findIndex(i.items, e => e.label === l);
                        if (-1 !== o && (s = i.items[o]), !s) return -1;
                        if (r) return o;
                        if (!s.submenu || "submenu" !== s.type) return -1;
                        i = s.submenu
                    }
                    return -1
                }(this.nativeMenu, e);
                return this.remove(e), this.insert(e, i, r)
            }
            exists(e) {
                return !!o(this.nativeMenu, e, !1)
            }
            set(e, n) {
                let t = o(this.nativeMenu, e, !1);
                return !!t && ("separator" === t.type ? (u.error(`Failed to set menu in path ${e}: menu item is a separator`), !1) : (void 0 !== n.icon && (t.icon = n.icon), void 0 !== n.enabled && (t.enabled = n.enabled), void 0 !== n.visible && (t.visible = n.visible), void 0 !== n.checked && (t.checked = n.checked), !0))
            }
            static set showDev(e) {
                i = e
            }
            static get showDev() {
                return i
            }
            static convert(e, n) {
                if (!Array.isArray(e)) return u.error("template must be an array"), void 0;
                for (let t = 0; t < e.length; ++t) {
                    d(e, t, n) && (e.splice(t, 1), --t)
                }
            }
            static register(e, n, t) {
                return "function" != typeof n ? (u.warn(`Cannot register menu ${e}, "fn" must be a function`), void 0) : !t && r[e] ? (u.warn(`Cannot register menu "${e}" (already exists).`), void 0) : (r[e] = n, void 0)
            }
            static unregister(e) {
                if (!r[e]) return u.warn(`Cannot find menu "${e}"`), void 0;
                delete r[e]
            }
            static getMenu(e) {
                let n = r[e];
                return n ? n() : []
            }
            static walk(e, n) {
                Array.isArray(e) || (e = [e]), e.forEach(e => {
                    n(e), e.submenu && a.walk(e.submenu, n)
                })
            }
        }
        module.exports = a;
        const u = require("./console"),
            l = require("./ipc"),
            s = e.ipcMain;

        function o(r, i, a) {
            let l = r;
            "boolean" != typeof a && (a = !1);
            let s = i.split("/"),
                o = "";
            for (let r = 0; r < s.length; r++) {
                let m = r === s.length - 1,
                    d = s[r],
                    p = null;
                o = n.posix.join(o, d);
                let b = t.findIndex(l.items, e => e.label === d);
                if (-1 !== b && (p = l.items[b]), p) {
                    if (m) return p;
                    if (!p.submenu || "submenu" !== p.type) return u.warn(`Cannot add menu in ${i}, the ${o} is already used`), null;
                    l = p.submenu
                } else {
                    if (!a) return null;
                    if (p = new e.MenuItem({
                        label: d,
                        id: d.toLowerCase(),
                        submenu: new e.Menu,
                        type: "submenu"
                    }), 0 === r) {
                        let e = Math.max(l.items.length - 1, 0);
                        l.insert(e, p)
                    } else l.append(p); if (m) return p;
                    l = p.submenu
                }
            }
            return null
        }

        function m(n) {
            let r = t.pick(n, ["click", "role", "type", "label", "sublabel", "accelerator", "icon", "enabled", "visible", "checked", "id", "position"]);
            return "submenu" === r.type && (r.submenu = new e.Menu), new e.MenuItem(r)
        }

        function d(e, r, s) {
            let o = e[r],
                m = o.path || o.label;
            if (o.dev && !1 === i) return !0;
            if (o.message) {
                o.click && u.error(`Skip 'click' in menu item '${m}', already has 'message'`), o.command && u.error(`Skip 'command' in menu item '${m}', already has 'message'`);
                let e = [o.message];
                if (o.params) {
                    if (!Array.isArray(o.params)) return u.error(`Failed to add menu item '${m}', 'params' must be an array`), !0;
                    e = e.concat(o.params)
                }
                o.panel && e.unshift(o.panel), o.panel ? o.click = (() => {
                    setImmediate(() => {
                        l.sendToPanel.apply(null, e)
                    })
                }) : o.click = s ? () => {
                    setImmediate(() => {
                        s.send.apply(s, e)
                    })
                } : () => {
                    setImmediate(() => {
                        l.sendToMain.apply(null, e)
                    })
                }
            } else if (o.command) {
                o.click && u.error(`Skipping "click" action in menu item '${m}' since it's already mapped to a command.`);
                let e = t.get(global, o.command, null);
                if (!e || "function" != typeof e) return u.error(`Failed to add menu item '${m}', cannot find global function ${o.command} in main process for 'command'.`), !0;
                let n = [];
                if (o.params) {
                    if (!Array.isArray(o.params)) return u.error("message parameters must be an array"), void 0;
                    n = n.concat(o.params)
                }
                o.click = (() => {
                    e.apply(null, n)
                })
            } else o.submenu && a.convert(o.submenu, s);
            let d = !1;
            return o.path ? (o.label && u.warn(`Skipping label "${o.label}" in menu item "${o.path}"`), d = function (e, r) {
                let i = e[r];
                if (!i.path) return;
                let a = i.path.split("/");
                if (1 === a.length) return e[r].label = a[0], !1;
                let l = e,
                    s = null,
                    o = "",
                    m = !1;
                for (let e = 0; e < a.length - 1; e++) {
                    let d = e === a.length - 2,
                        p = a[e];
                    o = n.posix.join(o, p), s = null;
                    let b = t.findIndex(l, e => e.label === p);
                    if (-1 !== b && (s = l[b]), s ? 0 === e && (m = !0) : (s = {
                        label: p,
                        type: "submenu",
                        submenu: []
                    }, 0 === e ? l[r] = s : l.push(s)), !s.submenu || "submenu" !== s.type) return u.warn(`Cannot add menu in ${i.path}, the ${o} is already used`), void 0;
                    if (d) break;
                    l = s.submenu
                }
                return i.label = a[a.length - 1], s.submenu.push(i), m
            }(e, r)) : void 0 === o.label && "separator" !== o.type && u.warn("Missing label for menu item"), d
        }
        s.on("menu:popup", (n, t, r, i) => {
            void 0 !== r && (r = Math.floor(r)), void 0 !== i && (i = Math.floor(i));
            let u = new a(t, n.sender);
            u.nativeMenu.popup(e.BrowserWindow.fromWebContents(n.sender), r, i), u.dispose()
        }), s.on("menu:register", (e, n, t, r) => {
            a.register(n, () => JSON.parse(JSON.stringify(t)), r)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});