(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let e = new(require("node-polyglot")),
            t = /^i18n:/;
        module.exports = {
            format: r => t.test(r) ? e.t(r.substr(5)) : r,
            formatPath(e) {
                let t = e.split("/");
                return (t = t.map(e => this.format(e))).join("/")
            },
            t: (t, r) => e.t(t, r),
            extend(t) {
                e.extend(t)
            },
            replace(t) {
                e.replace(t)
            },
            unset(t) {
                e.unset(t)
            },
            clear() {
                e.clear()
            },
            _phrases: () => e.phrases,
            get polyglot() {
                return e
            }
        };
    }.call(this, exports, require, module, __filename, __dirname);
});