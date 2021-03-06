(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const {
            EventEmitter: e
        } = require("events"), {
            ipcMain: r,
            BrowserWindow: n
        } = require("electron"), {
            WindowSender: s,
            EventSender: t
        } = require("./sender"), {
            MessageEvent: a
        } = require("./event"), l = require("../package.json"), o = `${l.name}@${l.version}`;
        module.exports = new class extends e {
            broadcast(e, ...r) {
                let s = {
                    message: e,
                    arguments: r
                };
                n.getAllWindows().forEach(e => {
                    e.send(`${o}:broadcast`, s)
                })
            }
            emit(e, ...r) {
                let n = this._events[e];
                return n || (n = []), Array.isArray(n) || (n = [n]), new t(n, {
                    message: e,
                    arguments: r
                })
            }
            sendToWin(e, r, ...n) {
                return new s(e, {
                    message: r,
                    arguments: n
                })
            }
        }, r.on(`${o}:send`, (r, n) => {
            let s = new a("renderer");
            s.sender = r.sender, n.needCallback && (s.needCallback = !0, s.reply = function (...e) {
                r.sender.send(`${o}:send-reply`, n.cid, JSON.stringify(e || []))
            }), e.prototype.emit.call(module.exports, n.message, s, ...n.arguments)
        }), r.on(`${o}:sendSync`, (e, r) => {
            let n = new a("renderer"),
                s = module.exports._events[r.message];
            if (!s) return e.returnValue = Object.create(null), void 0;
            if (!Array.isArray(s)) return e.returnValue = {
                value: s(n, ...r.arguments)
            }, void 0;
            let t = [];
            for (let e = 0; e < s.length; e++) {
                let a = s[e];
                t.push(a(n, ...r.arguments))
            }
            e.returnValue = {
                value: t
            }
        }), r.on(`${o}:send-reply`, (e, r, n) => {
            let t = s.query(r);
            if (!t) return console.warn("Sender does not exist"), void 0;
            t._callback && t._callback(...JSON.parse(n)), s.remove(r)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});