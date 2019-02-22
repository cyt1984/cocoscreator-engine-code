(function (exports, require, module, __filename, __dirname, process, global, Buffer) {
    return function (exports, require, module, __filename, __dirname) {
        "use strict";
        let Debugger = {};
        module.exports = Debugger;
        const Electron = require("electron"),
            ChildProcess = require("child_process"),
            Repl = require("repl"),
            MainMenu = require("./main-menu"),
            i18n = require("./i18n"),
            Chalk = require("chalk"),
            Console = require("./console");
        let _replServer = null,
            _nodeInspector = null,
            _dbgPort = 3030;

        function _eval(cmd, context, filename, callback) {
            try {
                let result = eval(cmd);
                callback(null, result)
            } catch (e) {
                console.log(Chalk.red(e.stack))
            }
        }
        Debugger.toggleRepl = function () {
            return _replServer ? Debugger.stopRepl() : Debugger.startRepl(), null !== _replServer
        }, Debugger.startRepl = function () {
            let e = i18n.formatPath("i18n:MAIN_MENU.developer.title/i18n:MAIN_MENU.developer.toggle_repl");
            _replServer = Repl.start({
                prompt: "editor$ > ",
                eval: _eval
            }).on("exit", () => {
                console.info("Repl debugger closed"), _replServer = null, MainMenu.set(e, {
                    checked: !1
                })
            }), MainMenu.set(e, {
                checked: !0
            })
        }, Debugger.stopRepl = function () {
            _replServer && _replServer.write(".exit\n")
        }, Debugger.toggleNodeInspector = function () {
            return _nodeInspector ? Debugger.stopNodeInspector() : Debugger.startNodeInspector(), null !== _nodeInspector
        }, Debugger.startNodeInspector = function () {
            let e = Electron.app.getPath("exe"),
                r = i18n.formatPath("i18n:MAIN_MENU.developer.title/i18n:MAIN_MENU.developer.toggle_node_inspector"),
                t = `http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=${_dbgPort}`;
            try {
                _nodeInspector = ChildProcess.spawn(e, ["node_modules/node-inspector/bin/inspector.js", `--debug-port=${_dbgPort}`], {
                    stdio: "inherit",
                    env: {
                        ELECTRON_RUN_AS_NODE: !0
                    }
                }), MainMenu.set(r, {
                    checked: !0
                }), _nodeInspector.on("close", () => {
                    _nodeInspector = null, MainMenu.set(r, {
                        checked: !1
                    }), Console.info("node-inspector stopped")
                })
            } catch (e) {
                return Console.failed(`Failed to start node-inspector: ${e.message}`), _nodeInspector = null, void 0
            }
            Console.info(`node-inspector started: ${t}`)
        }, Debugger.stopNodeInspector = function () {
            _nodeInspector && _nodeInspector.kill()
        }, Debugger.activeDevtron = function () {
            try {
                Electron.BrowserWindow.addDevToolsExtension(require("devtron").path)
            } catch (e) {
                Console.error(`Failed to activate devtron: ${e.message}`)
            }
        }, Object.defineProperty(Debugger, "debugPort", {
            enumerable: !0,
            get: () => _dbgPort,
            set(e) {
                _dbgPort = e
            }
        }), Object.defineProperty(Debugger, "isReplEnabled", {
            enumerable: !0,
            get: () => null !== _replServer
        }), Object.defineProperty(Debugger, "isNodeInspectorEnabled", {
            enumerable: !0,
            get: () => null !== _nodeInspector
        });
    }.call(this, exports, require, module, __filename, __dirname);
});