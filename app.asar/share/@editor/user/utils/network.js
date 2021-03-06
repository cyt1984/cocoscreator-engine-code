(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const {
            parse: e
        } = require("url"), {
            stringify: r
        } = require("querystring"), {
            request: t
        } = require("https");
        exports.sendPostRequest = function (o, n) {
            return new Promise((i, a) => {
                let s = e(o),
                    u = {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": (n = r(n || {})).length,
                        "User-Agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36"
                    },
                    d = {
                        method: "POST",
                        host: s.hostname,
                        port: s.port || 443,
                        path: s.pathname,
                        headers: u
                    },
                    l = "",
                    p = t(d, e => {
                        if (200 !== e.statusCode) return a(new Error("Connect Failed")), void 0;
                        e.on("data", e => {
                            l += e
                        }).on("end", () => {
                            var e = null;
                            try {
                                e = JSON.parse(l)
                            } catch (e) {
                                return a(e), void 0
                            }
                            i(e)
                        })
                    }).on("error", e => {
                        a(e)
                    }).setTimeout(8e3, () => {
                        a(new Error("timeout"))
                    });
                p.write(n), p.end()
            })
        }, exports.sendGetRequest = function (o, n) {
            return new Promise((i, a) => {
                var s = e(o);
                n = r(n || {});
                var u = {
                        method: "GET",
                        host: s.hostname,
                        port: s.port || 443,
                        path: s.pathname + "?" + n,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36"
                        }
                    },
                    d = "";
                t(u, e => {
                    if (200 !== e.statusCode) return a(new Error("Connect Failed")), void 0;
                    e.on("data", e => {
                        d += e
                    }).on("end", () => {
                        var e = null;
                        try {
                            e = JSON.parse(d)
                        } catch (e) {
                            return a(e)
                        }
                        i(e)
                    })
                }).on("error", e => {
                    a(e)
                }).setTimeout(8e3, () => {
                    a(new Error("timeout"))
                }).end()
            })
        };
    }.call(this, exports, require, module, __filename, __dirname);
});