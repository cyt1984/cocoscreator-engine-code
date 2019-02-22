(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {};
        module.exports = e;
        const n = require("electron"),
            t = require("../share/ipc"),
            i = require("./window"),
            l = require("./package"),
            o = require("./panel"),
            r = require("./console");
        let s = 1e3,
            p = {},
            a = !1,
            d = t._checkReplyArgs,
            u = t._popOptions,
            c = t._popReplyAndTimeout,
            f = t._wrapError,
            y = t._unwrapError,
            m = t.ErrorTimeout,
            w = t.ErrorNoPanel,
            g = t.ErrorInterrupt;

        function T(e, n, t, i, l) {
            let o, r = `${n}:${s++}`;
            return -1 !== i && (o = setTimeout(() => {
                let n = p[r];
                n && (n.win && n.win._closeSession(r), delete p[r], n.callback(new m(e, r, i)))
            }, i)), p[r] = {
                sessionId: r,
                timeoutId: o,
                win: l,
                callback: t
            }, r
        }

        function v(e) {
            let n = p[e];
            return n && (delete p[e], n.win && n.win._closeSession(e), n.timeoutId && clearTimeout(n.timeoutId)), n
        }

        function h(e, ...n) {
            n = [e, ...n];
            let t = i.windows.slice();
            for (let e = 0; e < t.length; ++e) {
                let i = t[e];
                i.nativeWin && i._send.apply(i, n)
            }
        }

        function I(e, ...n) {
            let t = i.windows.slice();
            for (let i = 0; i < t.length; ++i) {
                let l = t[i];
                l.nativeWin && (l.nativeWin.webContents !== e && l._send.apply(l, n))
            }
        }

        function _(e, ...n) {
            if (0 === n.length) return h(e), void 0;
            h.apply(null, [e, ...n])
        }

        function b(n, ...t) {
            let i = {
                senderType: "main",
                sender: {
                    send: e.sendToMain
                }
            };
            return 0 === t.length ? k.emit(n, i) : (t = [n, i, ...t], k.emit.apply(k, t))
        }
        e.option = t.option, e.sendToAll = function (e, ...n) {
            if (n.length) {
                let t = !1,
                    i = u(n);
                return i && i.excludeSelf && (t = !0), n = [e, ...n], t || b.apply(null, n), h.apply(null, n), void 0
            }
            b(e), h(e)
        }, e.sendToWins = h, e.sendToMain = function (n, ...t) {
            if ("string" != typeof n) return r.error("Call to `sendToMain` failed. The message must be a string."), void 0;
            let i = c(t);
            if (!i) return t = [n, ...t], !1 === b.apply(null, t) && r.failed(`sendToMain "${n}" failed, no response received.`), void 0;
            let l = T(n, "main", i.reply, i.timeout);
            return t = [n, ...t, e.option({
                sessionId: l,
                waitForReply: !0,
                timeout: i.timeout
            })], !1 === function (n, ...t) {
                let i = {
                    senderType: "main",
                    sender: {
                        send: e.sendToMain
                    }
                };
                if (0 === t.length) return k.emit(n, i);
                let l = u(t);
                if (l && l.waitForReply) {
                    let t = n;
                    i.reply = function (...n) {
                        !1 === f(n) && console.warn(`Invalid argument for event.reply of "${t}": the first argument must be an instance of Error or null`);
                        let o = e.option({
                            sessionId: l.sessionId
                        });
                        return n = ["editor:ipc-reply", i, ...n, o], k.emit.apply(k, n)
                    }
                }
                return t = [n, i, ...t], k.emit.apply(k, t)
            }.apply(null, t) && r.failed(`sendToMain "${n}" failed, no response received.`), l
        }, e.sendToPanel = function (n, t, ...i) {
            let r = o.findWindow(n);
            if (!r) {
                let l = e._popReplyAndTimeout(i);
                return l && l.reply(new w(n, t)), void 0
            }
            let s = l.panelInfo(n);
            if (s) return "simple" === s.type ? (r.send.apply(r, [t, ...i]), void 0) : r._sendToPanel.apply(r, [n, t, ...i])
        }, e.sendToMainWin = function (e, ...n) {
            let t = i.main;
            if (!t) return console.error(`Failed to send "${e}" to main window, the main window is not found.`), void 0;
            t._send.apply(t, [e, ...n])
        }, e.cancelRequest = function (e) {
            v(e)
        }, Object.defineProperty(e, "debug", {
            enumerable: !0,
            get: () => a,
            set(e) {
                a = e
            }
        }), e._closeAllSessions = function () {
            let e = Object.keys(p);
            for (let n = 0; n < e.length; ++n) {
                let t = e[n],
                    i = v(t);
                i.callback && i.callback(new g(t))
            }
        }, e._popReplyAndTimeout = c, e._newSession = T, e._closeSession = v, e._closeSessionThroughWin = function (e) {
            let n = p[e];
            n && (delete p[e], n.timeoutId && clearTimeout(n.timeoutId))
        };
        const k = n.ipcMain;
        k.on("editor:ipc-renderer2all", (e, n, ...t) => {
            let i = u(t);
            (function (e, n, ...t) {
                return 0 === t.length ? k.emit(n, e) : (t = [n, e, ...t], k.emit.apply(k, t))
            }).apply(null, [e, n, ...t]), i && i.excludeSelf ? I.apply(null, [e.sender, n, ...t]) : _.apply(null, [n, ...t])
        }), k.on("editor:ipc-renderer2wins", function (e, n, ...t) {
            let i = u(t);
            if (i && i.excludeSelf) return I.apply(null, [e.sender, n, ...t]), void 0;
            _.apply(null, [n, ...t])
        }), k.on("editor:ipc-renderer2main", (n, t, ...l) => {
            !1 === function (n, t, ...l) {
                if (0 === l.length) return k.emit(t, n);
                let o = u(l);
                if (o && o.waitForReply) {
                    let l = n.sender,
                        s = t,
                        p = i.find(l);
                    n.reply = function (...n) {
                        if (!p.nativeWin) return;
                        a && !d(n) && r.warn(`Invalid argument for event.reply of "${s}": the first argument must be an instance of "Error" or "null"`);
                        let t = e.option({
                            sessionId: o.sessionId
                        });
                        return n = ["editor:ipc-reply", ...n, t], l.send.apply(l, n)
                    }
                }
                return l = [t, n, ...l], k.emit.apply(k, l)
            }.apply(null, [n, t, ...l]) && r.failed(`Message "${t}" from renderer to main failed, no response receieved.`)
        }), k.on("editor:ipc-renderer2panel", (n, t, l, ...o) => {
            (function (n, t, l, ...o) {
                if (0 === o.length) return e.sendToPanel.apply(null, [t, l, ...o]), void 0;
                let r = u(o);
                if (r && r.waitForReply) {
                    let s = n.sender,
                        p = i.find(s),
                        a = T(l, `${t}@main`, function (...n) {
                            if (!p.nativeWin) return;
                            let t = e.option({
                                sessionId: r.sessionId
                            });
                            return n = ["editor:ipc-reply", ...n, t], s.send.apply(s, n)
                        }, r.timeout);
                    o = [t, l, ...o, e.option({
                        sessionId: a,
                        waitForReply: !0,
                        timeout: r.timeout
                    })]
                } else o = [t, l, ...o];
                e.sendToPanel.apply(null, o)
            })(n, t, l, ...o)
        }), k.on("editor:ipc-renderer2mainwin", (e, n, ...t) => {
            let l = i.main;
            if (!l) return console.error(`Failed to send "${n}" because the main page is not initialized.`), void 0;
            t.length ? l._send.apply(l, [n, ...t]) : l._send(n)
        }), k.on("editor:ipc-reply", (e, ...n) => {
            let t = u(n),
                i = y(n);
            if (i) {
                let e = i.stack.split("\n");
                e.shift();
                let t = new Error(i.message);
                t.stack += "\n\t--------------------\n" + e.join("\n"), t.code = i.code, t.code = i.code, t.errno = i.errno, t.syscall = i.syscall, n[0] = t
            }
            let l = v(t.sessionId);
            l && l.callback.apply(null, n)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});