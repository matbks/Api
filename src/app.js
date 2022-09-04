"use strict";
exports.__esModule = true;
// Supports ES6
var venom_bot_1 = require("venom-bot");
var screens_json_1 = require("./screens.json");
(0, venom_bot_1.create)({
    session: 'session-name',
    multidevice: true // for version not multidevice use false.(default: true)
})
    .then(function (client) { return start(client); })["catch"](function (erro) {
    console.log(erro);
});
function start(client) {
    client.onMessage(function (message) {
        switch (message) {
            case "menu":
                {
                }
                break;
        }
        if (message.body === 'Hi' && message.isGroupMsg === false) {
            client
                .sendButtons(message.from, screens_json_1["default"].menu.menuTitle, screens_json_1["default"].menu.menuButtons, screens_json_1["default"].menu.menuDescription)
                .then(function (result) {
                console.log('Result: ', result); //return object success
            })["catch"](function (erro) {
                console.error('Error when sending: ', erro); //return object error
            });
        }
    });
}
