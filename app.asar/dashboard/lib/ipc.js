(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        const e = require("lodash/pullAll"),
            r = require("fire-fs"),
            o = require("fire-path"),
            t = require("../../share/manual"),
            n = require("electron").ipcMain;
        n.on("app:query-recent", e => {
            let r = Editor.App._profile,
                o = r.data["recently-opened"],
                t = !1,
                n = o.map(e => new Promise((r, n) => {
                    Editor.App.getProjectInfo(e, n => {
                        if (!n) {
                            let r = o.indexOf(e);
                            o.splice(r, 1), t = !0
                        }
                        r(n || null)
                    })
                }));
            Promise.all(n).then(o => {
                o = o.filter(e => !!e), t && r.save(), e.reply(null, o)
            })
        }), n.on("app:query-templates", async t => {
            try {
                const n = "manifest.txt";
                let l, i, a = Editor.url("unpack://templates");
                if (!r.existsSync(a) || !r.isDirSync(a)) return console.log(`Can not find folder ${a}.`), t.reply(null, []);
                try {
                    l = r.readFileSync(o.join(a, n), "utf8").split(/\r?\n/).filter(Boolean)
                } catch (e) {
                    console.log(`Failed to read manifest.txt from ${a}: ${e.message}`), l = []
                }
                try {
                    i = r.readdirSync(a)
                } catch (e) {
                    console.log(`Can not read dir "${a}": ${e.message}`), i = []
                }
                i = i.filter(e => e !== n), e(i, l), i = l.concat(i);
                let p = await Promise.all(i.map(e => {
                    e = o.join(a, e);
                    let t = o.join(e, "template.json");
                    return new Promise((n, l) => {
                        r.readJson(t, (r, l) => {
                            if (r) return console.error(`Can not read "${t}": ${r}`), n(null);
                            l.banner = o.join(e, l.banner), l.name = Editor.T(l.name), l.desc = Editor.T(l.desc), l.path = e, n(l)
                        })
                    })
                }));
                p = p.filter(Boolean), t.reply(null, p)
            } catch (e) {
                console.error(`Failed to query templates: ${e}`), t.reply(null, [])
            }
        }), n.on("app:create-project", (e, r) => {
            Editor.log(`Creating new project from template: ${r.template}`), Editor.App.createProject(r, o => {
                if (o) return e.reply(Editor.Utils.wrapError(o)), void 0;
                Editor.App.runEditor(r.path, Editor.requireLogin, Editor.dev, () => {
                    Editor.App.addProject(r.path), Editor.Window.main.close(), e.reply(null)
                })
            })
        }), n.on("app:open-project", (e, r, o) => {
            Editor.App.checkProject(r, t => {
                if (t) return e.reply(Editor.Utils.wrapError(t)), void 0;
                let n = Editor.requireLogin;
                o || (n = !1), Editor.App.runEditor(r, n, Editor.dev, () => {
                    Editor.App.addProject(r), Editor.Window.main.close(), e.reply(null)
                })
            })
        }), n.on("app:close-project", (e, r) => {
            Editor.App.removeProject(r)
        }), n.on("app:window-minimize", () => {
            Editor.Window.main.minimize()
        }), n.on("app:window-close", () => {
            Editor.Window.main.close()
        }), n.on("app:get-last-create", e => {
            let r = Editor.App._profile.data["last-create"];
            void 0 === r && (r = null), e.returnValue = r
        }), n.on("app:open-manual-doc", (e, r) => {
            t.openManual(r), e.reply(null)
        }), n.on("app:open-api-doc", (e, r) => {
            t.openAPI(r), e.reply(null)
        }), n.on("app:query-last-create-path", (e, r) => {
            let o = Editor.App._profile.data;
            e.reply(null, o["last-create-path"] || null)
        });
    }.call(this, exports, require, module, __filename, __dirname);
});