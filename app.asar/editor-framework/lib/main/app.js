(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("electron"),
            t = require("events"),
            r = require("fire-path"),
            n = e.app,
            i = new t;
        module.exports = {
            name: n.getName(),
            version: n.getVersion(),
            path: n.getAppPath(),
            home: r.join(n.getPath("home"), `.${n.getName()}`),
            focused: !1,
            extend(e) {
                Object.assign(this, e)
            },
            on(e, t) {
                return i.on.apply(this, [e, t])
            },
            off(e, t) {
                return i.removeListener.apply(this, [e, t])
            },
            once(e, t) {
                return i.once.apply(this, [e, t])
            },
            emit(e, ...t) {
                return i.emit.apply(this, [e, ...t])
            }
        };
    }.call(this, exports, require, module, __filename, __dirname);
});