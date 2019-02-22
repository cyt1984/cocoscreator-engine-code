(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use stirct";
        const {
            EventEmitter: e
        } = require("events"), {
            network: s
        } = require("../utils"), t = require("../../../@base/electron-base-ipc"), a = require("../package.json"), i = `${a.name}@${a.version}`;
        let o = {};
        let n = module.exports = new class extends e {
            setData(e) {
                o = e
            }
            getData() {
                return o
            }
            async isLoggedIn() {
                if (!o.session_key) return !1;
                let e;
                try {
                    e = await s.sendPostRequest("https://creator-api.cocos.com/api/account/is_online", {
                        session_key: o.session_key
                    })
                } catch (e) {
                    return this.emit("exception", e.message), t.broadcast(`${i}:emit`, "exception", e.message), !1
                }
                return 0 == e.status && (o.session_id = e.data.session_id, o.session_key = e.data.session_key, o.cocos_uid = e.data.cocos_uid, o.email = e.data.email, o.nickname = e.data.nickname, this.emit("info-update"), t.broadcast(`${i}:emit`, "info-update"), !0)
            }
            async login(e, a) {
                let n;
                try {
                    n = await s.sendPostRequest("https://creator-api.cocos.com/api/account/signin", {
                        username: e,
                        password: a
                    })
                } catch (e) {
                    throw this.emit("exception", e.message), t.broadcast(`${i}:emit`, "exception", e.message), e
                }
                if (0 != n.status) throw new Error(n.msg);
                return o.session_id = n.data.session_id, o.session_key = n.data.session_key, o.cocos_uid = n.data.cocos_uid, o.email = n.data.email, o.nickname = n.data.nickname, this.emit("login"), t.broadcast(`${i}:emit`, "login"), {
                    nickname: o.nickname,
                    email: o.email
                }
            }
            async logout() {
                let e;
                try {
                    e = await s.sendPostRequest("https://creator-api.cocos.com/api/user/signout", {
                        session_id: o.session_id
                    })
                } catch (e) {
                    throw this.emit("exception", e.message), t.broadcast(`${i}:emit`, "exception", e.message), e
                }
                if (0 != e.status) throw new Error(e.msg);
                return this.emit("logout"), t.broadcast(`${i}:emit`, "logout"), o = {}, !0
            }
            async getUserToken() {
                let e;
                try {
                    e = await s.sendPostRequest("https://creator-api.cocos.com/api/user/cocos_token", {
                        session_id: o.session_id
                    })
                } catch (e) {
                    throw this.emit("exception", e.message), t.broadcast(`${i}:emit`, "exception", e.message), e
                }
                if (0 != e.status) throw new Error(e.msg);
                return e.data
            }
            async getSessionCode(e) {
                let a;
                try {
                    a = s.sendPostRequest("https://creator-api.cocos.com/api/session/code", {
                        session_id: o.session_id,
                        plugin_id: e
                    })
                } catch (e) {
                    throw this.emit("exception", e.message), t.broadcast(`${i}:emit`, "exception", e.message), e
                }
                if (0 != a.status) throw new Error(a.msg);
                return a.data
            }
        };
        t.on(`${i}:call`, async(e, s, ...t) => {
            let a, i = n[s];
            try {
                a = await i.call(n, ...t)
            } catch (s) {
                return e.reply(s, null), void 0
            }
            e.reply(null, a)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});