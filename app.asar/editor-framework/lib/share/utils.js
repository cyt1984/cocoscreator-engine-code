(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = {
            padLeft: (e, t, r) => (t -= (e = e.toString()).length) > 0 ? new Array(t + 1).join(r) + e : e,
            toFixed(e, t, r) {
                let l = Math.pow(10, t),
                    o = (Math.round(e * l) / l).toFixed(t);
                if (r) {
                    let e = new RegExp("0{1," + r + "}$");
                    o = o.replace(e, ""), r >= t && "." === o[o.length - 1] && (o = o.slice(0, -1))
                }
                return o
            },
            formatFrame(t, r) {
                let l = Math.floor(Math.log10(r)) + 1,
                    o = "";
                return t < 0 && (o = "-", t = -t), o + Math.floor(t / r) + ":" + e.padLeft(t % r, l, "0")
            },
            smoothScale(e, t) {
                let r = e;
                return r = Math.pow(2, .002 * t) * r
            },
            wrapError: e => ({
                message: e.message,
                stack: e.stack
            }),
            arrayCmpFilter(e, t) {
                let r = [];
                for (let l = 0; l < e.length; ++l) {
                    let o = e[l],
                        a = !0;
                    for (let e = 0; e < r.length; ++e) {
                        let l = r[e];
                        if (o === l) {
                            a = !1;
                            break
                        }
                        let n = t(l, o);
                        if (n > 0) {
                            a = !1;
                            break
                        }
                        n < 0 && (r.splice(e, 1), --e)
                    }
                    a && r.push(o)
                }
                return r
            },
            fitSize(e, t, r, l) {
                let o, a;
                return e > r && t > l ? (o = r, (a = t * r / e) > l && (a = l, o = e * l / t)) : e > r ? (o = r, a = t * r / e) : t > l ? (o = e * l / t, a = l) : (o = e, a = t), [o, a]
            },
            prettyBytes(e) {
                if ("number" != typeof e || Number.isNaN(e)) throw new TypeError("Expected a number, got " + typeof e);
                let t = e < 0,
                    r = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
                if (t && (e = -e), e < 1) return (t ? "-" : "") + e + " B";
                let l = Math.min(Math.floor(Math.log(e) / Math.log(1e3)), r.length - 1);
                return e = Number((e / Math.pow(1e3, l)).toFixed(2)), `${t?"-":""}${e} ${r[l]}`
            },
            run(e, ...t) {
                (0, require("child_process").spawn)(e, t, {
                    detached: !0
                }).unref()
            }
        };
        module.exports = e;
    }.call(this, exports, require, module, __filename, __dirname);
});