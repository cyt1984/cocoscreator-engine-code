(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        require("./lib/share/polyfills");
        const e = require("./lib/main"),
            o = require("electron"),
            t = require("chalk"),
            r = require("fire-path"),
            n = require("fire-fs"),
            i = require("winston"),
            s = require("async"),
            a = o.app;
        process.removeAllListeners("uncaughtException"), process.on("uncaughtException", e => {
            console.log(t.red.inverse.bold("Uncaught Exception: ") + t.red(e.stack || e))
        }), require("module").globalPaths.push(r.join(a.getAppPath(), "node_modules"));
        const l = require("yargs");
        let c;
        c = "darwin" === process.platform ? r.join(a.getPath("home"), `Library/Logs/${e.App.name}`) : r.join(e.App.home, "logs");
        const d = r.join(c, `${e.App.name}.log`);
        l.help("help").version(a.getVersion()).options({
            dev: {
                type: "boolean",
                global: !0,
                desc: "Run in development environment."
            },
            "show-devtools": {
                type: "boolean",
                global: !0,
                desc: "Open devtools automatically when main window loaded."
            },
            debug: {
                type: "number",
                default: 3030,
                global: !0,
                desc: "Open in browser context debug mode."
            },
            "debug-brk": {
                type: "number",
                default: 3030,
                global: !0,
                desc: "Open in browser context debug mode, and break at first."
            },
            lang: {
                type: "string",
                default: "",
                global: !0,
                desc: "Choose a language"
            },
            logfile: {
                type: "string",
                default: d,
                global: !0,
                desc: "Specific your logfile path"
            }
        }).command("test <path>", "Run specific test", e => e.usage("Command: test <path>").options({
            renderer: {
                type: "boolean",
                desc: "Run tests in renderer."
            },
            package: {
                type: "boolean",
                desc: "Run specific package tests."
            },
            detail: {
                type: "boolean",
                default: !1,
                desc: "Run test in debug mode (It will not quit the test, and open the devtools to help you debug it)."
            },
            reporter: {
                type: "string",
                default: "dot",
                desc: "Test reporter, default is 'dot'"
            }
        }), e => {
            e._command = "test"
        }).command("build <path>", "Build specific package", e => e.usage("Command: build <path>"), e => {
            e._command = "build"
        });
        const p = __dirname,
            u = JSON.parse(n.readFileSync(r.join(p, "package.json")));
        n.ensureDirSync(e.App.home), n.ensureDirSync(r.join(e.App.home, "local")), i.setLevels({
            normal: 0,
            success: 1,
            failed: 2,
            info: 3,
            warn: 4,
            error: 5,
            fatal: 6,
            uncaught: 7
        });
        const g = t.bgBlue,
            m = t.green,
            f = t.yellow,
            b = t.red,
            h = t.cyan,
            v = {
                normal: e => g(`[${process.pid}]`) + " " + e,
                success: e => g(`[${process.pid}]`) + " " + m(e),
                failed: e => g(`[${process.pid}]`) + " " + b(e),
                info: e => g(`[${process.pid}]`) + " " + h(e),
                warn: e => g(`[${process.pid}]`) + " " + f.inverse.bold("Warning:") + " " + f(e),
                error: e => g(`[${process.pid}]`) + " " + b.inverse.bold("Error:") + " " + b(e),
                fatal: e => g(`[${process.pid}]`) + " " + b.inverse.bold("Fatal Error:") + " " + b(e),
                uncaught: e => g(`[${process.id}]`) + " " + b.inverse.bold("Uncaught Exception:") + " " + b(e)
            };
        a.on("window-all-closed", () => {}), a.on("before-quit", () => {
            e.Window.windows.forEach(e => {
                e.forceClose()
            })
        }), a.on("gpu-process-crashed", () => {
            console.log(t.red.inverse.bold("GPU Process Crashed!"))
        }), a.on("ready", () => {
            e.App.beforeInit && e.App.beforeInit(l);
            let o = process.cwd(),
                c = process.argv.slice(1);
            for (let e = 0; e < c.length; ++e)
                if (r.resolve(o, c[e]) === a.getAppPath()) {
                    c.splice(e, 1);
                    break
                }
            let d = l.parse(c);
            if (d.help) return a.quit(), void 0;
            let p = a.getLocale().substring(0, 2);
            if ("" !== d.lang && (p = d.lang), i.remove(i.transports.Console), "test" !== d._command) {
                if (n.ensureDirSync(r.dirname(d.logfile)), n.existsSync(d.logfile)) try {
                    n.unlinkSync(d.logfile)
                } catch (e) {
                    console.log(e)
                }
                i.add(i.transports.File, {
                    level: "uncaught",
                    filename: d.logfile,
                    json: !1
                }), console.log(t.magenta("===== Initializing Editor ====="));
                let e = process.argv.slice(1);
                e = e.map(e => `  ${e}`), console.log(t.magenta(`arguments: \n${e.join("\n")}\n`))
            }("test" !== d._command || d.detail) && i.add(i.transports.Console, {
                level: "uncaught",
                formatter(e) {
                    let o = "";
                    void 0 !== e.message && (o += e.message), e.meta && Object.keys(e.meta).length && (o += " " + JSON.stringify(e.meta));
                    let t = v[e.level];
                    return t ? t(o) : o
                }
            }), e.argv = d, e.dev = d.dev, e.lang = p, e.logfile = d.logfile, e.Protocol.init(e), e.Package.lang = p, e.Package.versions = e.versions, e.Menu.showDev = d.dev, e.Debugger.debugPort = d.debug, e.Ipc.debug = d.dev, e.reset(), s.series([o => {
                    if (!e.App.init) return e.error("The `init` action was not found in your application. Please define it using the `Editor.App.Extend` function.           See https://github.com/cocos-creator/editor-framework/blob/master/docs/getting-started/define-your-app.md           for more information."), a.quit(), void 0;
                    try {
                        e.App.init(d, o)
                    } catch (o) {
                        return e.error(o.stack || o), a.quit(), void 0
                    }
                },
                e => {
                    if (!d._command) return e(), void 0;
                    if ("test" === d._command) {
                        require("./lib/tester").run(d.path, d)
                    } else "build" === d._command
                },
                o => {
                    e.log("Loading packages"), e.loadAllPackages(o)
                },
                o => {
                    e.log("Watching packages"), e.watchPackages(o)
                },
                o => {
                    if (e.log("Run Application"), e.Window._loadWindowStates(), e.connectToConsole(), d.dev && "win32" !== process.platform && e.Debugger.startRepl(), !e.App.run) return e.error('\n          The `run` action was not found in your application.\n          Please define it using the `Editor.App.Extend` function.\n          See "https://github.com/cocos-creator/editor-framework/blob/master/docs/getting-started/define-your-app.md" for more information.\n        '), a.quit(), void 0;
                    try {
                        e.App.run(), o()
                    } catch (o) {
                        return e.error(o.stack || o), a.quit(), void 0
                    }
                }
            ], o => {
                o && (e.error(o.stack || o), a.quit())
            })
        }), e.versions = {
            [a.getName()]: a.getVersion(),
            "editor-framework": u.version
        }, e.frameworkPath = p, module.exports = e;
    }.call(this, exports, require, module, __filename, __dirname);
});