(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const {
            app: e,
            dialog: o,
            BrowserWindow: r
        } = require("electron"), {
            spawn: t
        } = require("child_process"), {
            join: n
        } = require("path");
        let i = [],
            s = e.getPath("exe");
        exports.startup = function (r, d, a) {
            let l = n(r, "local/logs/project.log"),
                p = [Editor.App.path, "--path", r, "--logfile", l];
            d || p.push("--nologin"), a && p.push("--dev"), Editor.showInternalMount && p.push("--internal");
            let c = t(s, p, {
                    stdio: [0, 1, 2, "ipc"]
                }),
                h = [],
                u = !1,
                f = function () {
                    if (u) return;
                    u = !0;
                    let e = h.shift();
                    if (1 !== o.showMessageBox({
                        type: "error",
                        buttons: ["OK", "Abort"],
                        title: "Error",
                        message: e.message,
                        detail: e.stack,
                        defaultId: 0,
                        cancelId: 0
                    })) return h.length > 0 && f(), u = !1, void 0;
                    setTimeout(() => {
                        h.length = 0, c.kill(), u = !1
                    }, 200)
                };
            return c.on("message", e => {
                "show-dashboard" === e.channel ? (Editor.App._profile.reload(), Editor.Ipc.sendToMainWin("dashboard:refresh-recent-project"), Editor.Ipc.sendToMainWin("dashboard:refresh-last-create"), Editor.Window.main.show()) : "editor-error" === e.channel && (h.push(e), f())
            }), c.on("close", () => {
                let o = i.indexOf(c); - 1 !== o && i.splice(o, 1), 0 === i.length && (Editor.App._profile.reload(), Editor.Ipc.sendToMainWin("dashboard:refresh-recent-project"), Editor.Ipc.sendToMainWin("dashboard:refresh-last-create"), Editor.Window.main.show(), e.dock && e.dock.show())
            }), i.push(c), e.dock && e.dock.hide(), c
        }, exports.closeAll = function () {
            for (; i.length > 0;) i.pop().kill()
        }, exports.isEmpty = function () {
            return i.length <= 0
        };
    }.call(this, exports, require, module, __filename, __dirname);
});