(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("http"),
            t = require("https"),
            r = require("querystring");
        module.exports = {
            sendRequest: function (o, n) {
                let s = o.host,
                    i = o.path,
                    a = "https" === o.protocol ? t : e,
                    d = r.stringify(o.data || {}),
                    h = o.port || 443,
                    l = o.method || "GET",
                    u = o.headers || {};
                u["User-Agent"] || (u["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) CocosCreator/1.0.0 Chrome/45.0.2454.85 Electron/0.33.8 Safari/537.36"), "GET" === l ? i += "?" + d : d += "\n";
                let p = "",
                    c = a.request({
                        method: l,
                        host: s,
                        port: h,
                        path: i,
                        headers: u
                    }, e => {
                        if (200 !== e.statusCode) return n(new Error("Connect Failed"), p), void 0;
                        e.on("data", e => {
                            p += e
                        }).on("end", () => {
                            n(null, p)
                        })
                    }).on("error", e => {
                        n(e, p)
                    });
                c.write(d), c.end()
            }
        };
    }.call(this, exports, require, module, __filename, __dirname);
});