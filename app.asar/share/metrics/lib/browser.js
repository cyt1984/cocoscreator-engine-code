(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("../../@base/electron-base-ipc"),
            {
                EventEmitter: o
            } = require("events"),
            t = require("../../request.js").sendRequest,
            c = require("md5"),
            r = require("getmac"),
            l = require("../lib/config").trackID;
        let i = "",
            n = "";
        let a = module.exports = new class extends o {
            constructor() {
                super(), this.trackID = l
            }
            trackEvent(e, o) {
                if (!i) return console.log("no valid user ID"), void 0;
                if (!n) return console.log("no valid client ID"), void 0;
                let c = {
                    v: 1,
                    tid: l,
                    cid: n,
                    uid: i,
                    t: "event",
                    ec: e.category,
                    ea: e.action
                };
                e.label && (c.el = e.label), t({
                    method: "POST",
                    host: "www.google-analytics.com",
                    path: "/collect",
                    protocol: "https",
                    data: c
                }, function (e, t) {
                    e && console.log(e), o && o(e, t)
                })
            }
            trackException(e, o) {
                if (!n) return console.log("no valid client ID"), void 0;
                t({
                    method: "POST",
                    host: "www.google-analytics.com",
                    path: "/collect",
                    protocol: "https",
                    data: {
                        v: 1,
                        tid: l,
                        cid: n,
                        uid: i,
                        t: "exception",
                        exd: e,
                        exf: 0
                    }
                }, function (e, t) {
                    e && console.log(e), o && o(e, t)
                })
            }
            prepareUserIdentity() {
                let e = Editor.Profile.load("profile://global/user_token.json"),
                    o = e.data;
                e.nickname, e.email, i = o.cocos_uid
            }
            sendAppInfo(e) {
                if (!n) return console.log("no valid client ID"), void 0;
                let o = require("semver"),
                    c = Editor.versions.CocosCreator,
                    r = `${o.major(c)}.${o.minor(c)}.${o.patch(c)}`;
                t({
                    method: "POST",
                    host: "www.google-analytics.com",
                    path: "/collect",
                    protocol: "https",
                    data: {
                        v: 1,
                        tid: l,
                        cid: n,
                        uid: i,
                        t: "screenview",
                        an: "CocosCreator",
                        aid: "com.cocos.creator",
                        av: r,
                        cd: "Home"
                    }
                }, function (o, t) {
                    o && console.log(o), e && e(o, t)
                })
            }
            setClientId(e) {
                r.getMac(function (o, t) {
                    let r = "";
                    if (o) {
                        console.log(o);
                        let e = require("os").networkInterfaces(),
                            t = !1;
                        for (var l in e) {
                            let o = e[l];
                            for (let e = 0; e < o.length; ++e) {
                                let l = o[e];
                                if (!l.internal && l.mac) {
                                    r = c(l.mac), t = !0;
                                    break
                                }
                            }
                            if (t) break
                        }
                        t || (r = c("00:00:00:00:00:00"))
                    } else r = c(t);
                    n = r, e()
                })
            }
        };
        e.on("metrics:track-event", (e, o) => {
            a.trackEvent(o, null)
        }), e.on("metrics:track-exception", (e, o) => {
            a.trackException(o, null)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});