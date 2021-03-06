(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("../../@base/electron-base-ipc"),
            t = require("../../@editor/user"),
            {
                EventEmitter: a
            } = require("events"),
            {
                shell: r
            } = require("electron");
        let o = Editor.Profile.load("profile://global/user_token.json"),
            i = function () {
                return o.reload(), o
            },
            n = function (e) {
                let a = t.getData(),
                    r = module.exports.enable();
                var o = `${Editor.T("SHARED.help")}/${Editor.T("MAIN_MENU.account.none")}`,
                    i = `${Editor.T("SHARED.help")}/${Editor.T("MAIN_MENU.account.logged_user",{username:a.nickname})}`,
                    n = `${Editor.T("SHARED.help")}/${Editor.T("MAIN_MENU.account.logout")}`;
                Editor.MainMenu.exists(o) && Editor.MainMenu.remove(o), Editor.MainMenu.exists(i) && Editor.MainMenu.remove(i), Editor.MainMenu.exists(n) && Editor.MainMenu.remove(n), e ? (Editor.MainMenu.add(Editor.T("SHARED.help"), {
                    label: Editor.T("MAIN_MENU.account.logged_user", {
                        username: a.nickname
                    }),
                    enabled: r,
                    visible: !!a.nickname && r
                }), Editor.MainMenu.add(Editor.T("SHARED.help"), {
                    label: Editor.T("MAIN_MENU.account.logout"),
                    click() {
                        module.exports.logout()
                    },
                    enabled: r
                })) : Editor.MainMenu.add(Editor.T("SHARED.help"), {
                    label: Editor.T("MAIN_MENU.account.none"),
                    enabled: !1
                })
            };
        t.on("info-update", () => {
            o.clear();
            let e = t.getData();
            Object.assign(o.data, e), o.save()
        }), t.on("login", () => {
            o.clear();
            let e = t.getData();
            Object.keys(e).forEach(t => {
                o.data[t] = e[t]
            }), o.save(), n(!0)
        }), t.on("logout", () => {
            n(!1), o.clear();
            let e = t.getData();
            Object.keys(e).forEach(t => {
                o.data[t] = e[t]
            }), o.save()
        });
        let s = module.exports = new class extends a {
            constructor() {
                super(), this._enable = !0
            }
            enable(t) {
                return void 0 !== t && (this._enable = !!t, e.broadcast("creator-lib-user:flag", "_enable", this._enable)), this._enable
            }
            async isLoggedIn(e) {
                e && Editor.warn("'isLoggedIn' returns a standard 'promise' , please use 'await' to wait for the data");
                let a = i();
                t.setData(a.data);
                let r = !1;
                try {
                    r = await t.isLoggedIn()
                } catch (e) {
                    return n(!1), Promise.resolve(!1)
                }
                return n(r), Promise.resolve(r)
            }
            async login(a, r) {
                let o, n = i();
                t.setData(n.data), this.emit("waiting"), e.broadcast("creator-lib-user:emit", "waiting");
                try {
                    o = await t.login(a, r)
                } catch (e) {
                    return Promise.reject(e)
                }
                return Promise.resolve(o)
            }
            async logout() {
                let a, r = i();
                t.setData(r.data), this.emit("waiting"), e.broadcast("creator-lib-user:emit", "waiting");
                try {
                    a = await t.logout()
                } catch (e) {
                    return Promise.reject(e)
                }
                return Promise.resolve(a)
            }
            async getUserToken() {
                return await t.getUserToken()
            }
            async getSessionCode(e, a) {
                return a && Editor.warn("'getSessionCode' returns a standard 'promise' , please use 'await' to wait for the data"), await t.getSessionCode(e)
            }
            getUserData() {
                let e = t.getData();
                return {
                    nickname: e.nickname,
                    email: e.email
                }
            }
            redirect(e) {
                e = `https://creator-api.cocos.com/api/account/client_signin?session_id=${t.getData().session_id}&redirect_url=${e}`, r.openExternal(e)
            }
            getUserId() {
                return t.getData().cocos_uid
            }
        };
        e.on("creator-libs-user:call", async(e, t, ...a) => {
            let r, o = s[t];
            try {
                r = await o.call(s, ...a)
            } catch (t) {
                return e.reply(t.message, null)
            }
            e.reply(null, r)
        }), e.on("creator-lib-user:query", (e, t) => module.exports[t]), t.on("login", () => {
            module.exports.emit("login")
        }), t.on("logout", () => {
            module.exports.emit("logout")
        }), t.on("exception", e => {
            module.exports.emit("exception", e)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});