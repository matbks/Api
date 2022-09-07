"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const libphonenumber_js_1 = __importStar(require("libphonenumber-js"));
const venom_bot_1 = require("venom-bot");
const express_1 = __importDefault(require("express"));
const screens = __importStar(require("./screens.json"));
var soap = require('soap');
// import { createClient } from 'soap';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// import axios from "axios"
const axios = require('axios-https-proxy-fix');
const fs = require('fs');
let menuLastClick = '';
let cliente;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// app.post('/send', (request, response) => {
//   console.log('/send')
//   try {
//     let { number, message } = request.body
//     if (number && message){
//     number = number.toLowerCase();
//     console.log(number)
//     console.log(message)
//     cliente.sendText(number, message)
//     return response.sendStatus(200).json();
//   }
//   }
//   catch (error) {
//     console.error(error);
//     response.send(500).json({ status: "error", message: error })
//   }
// })
request();
(0, venom_bot_1.create)({
    session: 'session-name',
    multidevice: true // for version not multidevice use false.(default: true)
})
    .then((client) => start(client))
    .catch((erro) => {
    console.log(erro);
});
function validNumber(phoneNumber) {
    var _a, _b, _c;
    phoneNumber = (_c = (_b = (_a = (0, libphonenumber_js_1.default)(phoneNumber, "BR")) === null || _a === void 0 ? void 0 : _a.format("E.164")) === null || _b === void 0 ? void 0 : _b.replace("+", "")) === null || _c === void 0 ? void 0 : _c.replace("-", "");
    phoneNumber = phoneNumber.includes("55")
        ? phoneNumber
        : `55${phoneNumber}`;
    console.info("sera se tem 9", phoneNumber);
    if (phoneNumber.length < 11 && phoneNumber[2] != '9') {
        console.info("n tem nova", phoneNumber);
        phoneNumber = phoneNumber.slice(0, 4) + '9' + phoneNumber.slice(5, phoneNumber.length);
    }
    console.info("Resultado", phoneNumber);
    if ((0, libphonenumber_js_1.isPossiblePhoneNumber)(phoneNumber)) {
        console.info("É um numero possível", phoneNumber);
        phoneNumber = phoneNumber.includes("@c.us")
            ? phoneNumber
            : `${phoneNumber}@c.us`;
        console.info("É valido:");
        console.info(phoneNumber);
        return phoneNumber;
    }
    else {
        phoneNumber = '';
        return phoneNumber;
    }
}
function request() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Requesting");
        // let sapWS = require('../invisible/auth.json')
        // let wsdl = require('../invisible/soap.wsdl')
        // let wsdl = require('../invisible/soa.xml')
        // let client = await createClientAsync('./src/soap.wsdl');
        // console.info(client.describe())
        // client.
        // var xmlhttp = new XMLHttpRequest();
        // xmlhttp.open('POST', wsdl , true);
        var value = '2';
        // build SOAP request
        const bodi = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:ZfmSecIot>' +
            '<Input>' +
            value +
            '</Input>' +
            '</urn:ZfmSecIot>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
        // const soapRequest = require('easy-soap-request');
        const fs = require('fs');
        // example data
        const url = 'http://vm31.4hub.cloud:53100/sap/bc/srt/rfc/sap/zwsseciot/100/zwsseciot/zwsseciotb';
        const wsdl_url = 'http://vm31.4hub.cloud:53100/sap/bc/srt/wsdl/flv_10002P111AD1/sdef_url/ZWSSECIOT?sap-client=100';
        const wsd = require('fs').readFileSync('./soap.wsdl', 'utf8');
        // const sampleHeaders = {
        //   'Authorization': { "MBACKHAUS":"Red@2020" },
        //   'Content-Type': 'text/xml;charset=UTF-8'
        // 'soapAction': 'http://vm31.4hub.cloud:53100/sap/bc/srt/rfc/sap/zwsseciot/100/zwsseciot/zwsseciotb',
        // };
        var soap = require('soap');
        // soap.createClient(wsd, (err:any, client:any) => {
        //   client.MyFunction({INPUT:'3'}, function(err:any, result:any) {
        //       console.log(result);
        //   })
        // });
        soap.createClient(wsd, function (err, client) {
            if (err)
                throw err;
            client.describe();
        });
        // const xml = fs.readFileSync('../invisible/request.xml', 'utf-8');
        // // usage of module
        // async () => {
        //   const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 1000 }); // Optional timeout parameter(milliseconds)
        //   const { headers, body, statusCode } = response;
        //   console.log(headers);
        //   console.log(body);
        //   console.log(statusCode);  
        // };
    });
}
// let sapWS = require('../invisible/auth.json')
// console.log(sapWS)
// let value = '1'
// // const headers = { 'content-type': 'text/xml; charset=utf-8' }
// let body = `
//           <?xml version="1.0" encoding="UTF-8"?>
//           <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
//           <soapenv:Header/>
//           <soapenv:Body>
//           <urn:ZfmSecIot>
//           <Input>
//           `
// body += value
// body += ` </Input>
//           </urn:ZfmSecIot>
//           </soapenv:Body>
//           </soapenv:Envelope>
//       `
// // var auth = "Basic " + new Buffer(sapWS.auth.login + ":" + sapWS.auth.password).toString("base64");
// var auth = "Basic " + Buffer.from(sapWS.auth.Username + ":" + sapWS.auth.Password).toString('base64'); 
// // const wsdl = require('../invisible/soap.wsdl')
// createClient(wsdl, (err, client) => {
//   if (client){
//   client.addHttpHeader('Authorization', auth);
//   // console.log(client)
//   // client.addSoapHeader(auth);
//   if (err) return console.log(err);
//   console.log(client);
//   }
// });
// console.log("voposta")
// app.post(sapWS.url, async (req, res) => { 
//   console.log("postano")
//     req.body = body
//     req.headers = headers
//     req.headers.authorization = sapWS.auth   
//     console.log(res)   
// })
// }
function start(client) {
    return __awaiter(this, void 0, void 0, function* () {
        cliente = client;
        client.onMessage((message) => __awaiter(this, void 0, void 0, function* () {
            let newMessage = message.body.toLowerCase();
            switch (newMessage) {
                case "sim":
                    yield client
                        .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
                        .then((result) => {
                        console.log('Result: ', result); //return object success
                    })
                        .catch((erro) => {
                        console.error('Error when sending: ', erro); //return object error
                    });
                    break;
                case "alterar minha senha":
                    console.log("alterar minha senha");
                    client.sendText(message.from, "Digite sua nova senha");
                    menuLastClick = "alterar minha senha";
                    break;
                case "outro usuário deseja alterar sua senha":
                    console.log("outro usuário deseja alterar sua senha");
                    client.sendText(message.from, "Digite o número de telefone do usuário");
                    menuLastClick = "numero de telefone do usuario";
                    break;
                case "desbloquear minha senha":
                    console.log("Desbloquear minha senha");
                    client.sendText(message.from, "Senha desbloqueada");
                    menuLastClick = "senha desbloqueada";
                    break;
                default:
                    switch (menuLastClick) {
                        case "alterar minha senha":
                            console.log("salvar nova senha");
                            let value = 'I_VALUE';
                            let headers = { 'content-type': 'text/xml; charset=utf-8' };
                            let body = `
                      <?xml version="1.0" encoding="UTF-8"?>
                      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
                      <soapenv:Header/>
                      <soapenv:Body>
                      <urn:ZfmSecIot>
                      <Input>
                  `;
                            body += value;
                            body += ` </Input>
                      </urn:ZfmSecIot>
                      </soapenv:Body>
                      </soapenv:Envelope>
                  `;
                            // ENVIAR NOVA SENHA PARA O SAP
                            // SE RETORAR SUCESSO EXIBE MENSAGEM  
                            client.sendText(message.from, "Senha alterada com sucesso");
                            menuLastClick = "senha alterada";
                            break;
                        case "numero de telefone do usuario":
                            console.log("enviar mensagem ao usuario");
                            // ENVIAR NOVA SENHA PARA O SAP
                            // SE RETORAR SUCESSO EXIBE MENSAGEM
                            let userNumber = validNumber(newMessage);
                            if (userNumber != '') {
                                client
                                    .sendButtons(userNumber, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
                                    .then((result) => {
                                    console.log('Result: ', result); //return object success
                                    client.sendText(message.from, "Menu enviado ao usuário");
                                    menuLastClick = "menu enviado ao usuario";
                                })
                                    .catch((erro) => {
                                    console.error('Error when sending: ', erro); //return object error
                                    client.sendText(message.from, "Numéro do usuário inválido");
                                    menuLastClick = "menu não enviado ao usuario";
                                });
                            }
                            else {
                                client.sendText(message.from, "Numéro do usuário inválido");
                            }
                            break;
                        default:
                            // console.log("enviar mensagem ao usuario")
                            // // ENVIAR NOVA SENHA PARA O SAP
                            // // SE RETORAR SUCESSO EXIBE MENSAGEM
                            let userNumber2 = validNumber("8956065");
                            if (userNumber2 != '') {
                                client
                                    .sendButtons(userNumber2, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
                                    .then((result) => {
                                    console.log('Result: ', result); //return object success
                                    client.sendText(message.from, "Menu enviado ao usuário");
                                    menuLastClick = "menu enviado ao usuario";
                                })
                                    .catch((erro) => {
                                    console.error('Error when sending: ', erro); //return object error
                                    client.sendText(message.from, "Numéro do usuário inválido");
                                    menuLastClick = "menu não enviado ao usuario";
                                });
                            }
                            break;
                    }
                    break;
            }
        }));
        app.listen(5000);
    });
}
