(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {
            _checkReplyArgs: function (e) {
                if (0 === e.length) return !0;
                let r = e[0];
                return null === r || r instanceof Error
            }, _popOptions: function (e) {
                let r = e[e.length - 1];
                return r && "object" == typeof r && r.__ipc__ ? (e.pop(), r) : null
            }, _popReplyAndTimeout: function (e) {
                let r, t, n = e[e.length - 1];
                if ("number" == typeof n) {
                    if (e.length < 2) return null;
                    if (t = n, "function" != typeof (n = e[e.length - 2])) return null;
                    r = n, e.splice(-2, 2)
                } else {
                    if ("function" != typeof n) return null;
                    r = n, t = 5e3, e.pop()
                }
                return {
                    reply: r,
                    timeout: t
                }
            }, option: function (e) {
                return e.__ipc__ = !0, e
            }
        };
        e._wrapError = function (e) {
            if (0 === e.length) return !0;
            let r = e[0];
            if (null === r) return !0;
            if (r instanceof Error) return r = {
                __error__: !0,
                stack: r.stack,
                message: r.message,
                code: r.code,
                errno: r.errno,
                syscall: r.syscall
            }, e[0] = r, !0;
            let t = new Error;
            return e.unshift({
                __error__: !0,
                stack: t.stack,
                message: "Invalid argument for event.reply(), first argument must be null or Error",
                code: "EINVALIDARGS"
            }), !1
        }, e._unwrapError = function (e) {
            let r = e[0];
            return r && r.__error__ ? r : null
        };
        e.ErrorTimeout = class extends Error {
            constructor(e, r, t) {
                super(`ipc timeout. message: ${e}, session: ${r}`), this.code = "ETIMEOUT", this.ipc = e, this.sessionId = r, this.timeout = t
            }
        }, e.ErrorNoPanel = class extends Error {
            constructor(e, r) {
                super(`ipc failed to send, panel not found. panel: ${e}, message: ${r}`), this.code = "ENOPANEL", this.ipc = r, this.panelID = e
            }
        }, e.ErrorNoMsg = class extends Error {
            constructor(e, r) {
                super(`ipc failed to send, message not found. panel: ${e}, message: ${r}`), this.code = "ENOMSG", this.ipc = r, this.panelID = e
            }
        }, e.ErrorInterrupt = class extends Error {
            constructor(e) {
                super(`Ipc will not have a callback. message: ${e}`), this.code = "EINTERRUPT", this.ipc = e
            }
        }, module.exports = e;
    }.call(this, exports, require, module, __filename, __dirname);
});