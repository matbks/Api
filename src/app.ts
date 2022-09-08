import parsePhoneNumber, { isValidPhoneNumber, isPossiblePhoneNumber } from "libphonenumber-js"
import { create, Whatsapp } from 'venom-bot';
import express from 'express'
import * as screens from './screens.json'

// const axios = require('axios-https-proxy-fix');
// const fs = require('fs');""
let menuLastClick = ''
import fetch, { Headers } from 'node-fetch';
let cliente: Whatsapp

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())



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



create({
  session: 'session-name', //name of session
  multidevice: true // for version not multidevice use false.(default: true)
})
  .then((client: any) => start(client))
  .catch((erro: any) => {
    console.log(erro);
  });

  // POST method route
app.post('/handle', function async (req, res) {
  res.send(req.body);
  console.info(req.body)
});

function validNumber(phoneNumber: string) {

  phoneNumber = parsePhoneNumber(phoneNumber, "BR")
    ?.format("E.164")
    ?.replace("+", "")
    ?.replace("-", "") as string

  phoneNumber = phoneNumber.includes("55")
    ? phoneNumber
    : `55${phoneNumber}`

  console.info("sera se tem 9", phoneNumber)
  if (phoneNumber.length < 13 && phoneNumber[4] != '9') {
    console.info("n tem nova", phoneNumber)
    phoneNumber = phoneNumber.slice(0, 4) + '9' + phoneNumber.slice(5, phoneNumber.length)
  }

    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`

    return phoneNumber
  
}

async function request(phoneNumber:string) {

  console.log("Requesting")

  const body = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+
    'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<urn:ZfmSecIot>' +
    '<Input>' +
    phoneNumber +
    '</Input>' +
    '</urn:ZfmSecIot>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';

  const url = 'http://vm31.4hub.cloud:53100/sap/bc/srt/rfc/sap/zwsseciot/100/zwsseciot/zwsseciotb';

  const requestHeaders: any = new Headers();
  requestHeaders.set('Content-Type', 'text/xml');
  requestHeaders.set('Authorization', 'Basic ' + Buffer.from("MBACKHAUS" + ":" + "Red@2020").toString('base64'));

  const responseLogin = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: body
  });

  console.log(responseLogin)

}

async function start(client: any) {

  validNumber("5551999015594")

  cliente = client

  client.onMessage(async (message: any) => {

    if (message.body) {

      let newMessage: string = message.body.toLowerCase()

      switch (newMessage) {

        case "sim":

          await client
            .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
            .then((result: any) => {
              console.log('Result: ', result); //return object success
            })
            .catch((erro: any) => {
              console.error('Error when sending: ', erro); //return object error
            });

          break;

        case "alterar minha senha":

          console.log("alterar minha senha")

          client.sendText(message.from, "Digite sua nova senha")

          menuLastClick = "alterar minha senha"

          break;

        case "outro usuário deseja alterar sua senha":

          console.log("outro usuário deseja alterar sua senha")

          client.sendText(message.from, "Digite o número de telefone do usuário")

          menuLastClick = "numero de telefone do usuario"

          break;

        case "desbloquear minha senha":

          console.log("Desbloquear minha senha")

          let phone = validNumber(message.from)
          console.log ("Phone", phone)
          if (phone != '') { 
              request(phone); 
          }

          client.sendText(message.from, "Senha desbloqueada")

          menuLastClick = "senha desbloqueada"

          break;

        default:

          switch (menuLastClick) {

            case "alterar minha senha":

              console.log("salvar nova senha")

              // ENVIAR NOVA SENHA PARA O SAP
              // SE RETORAR SUCESSO EXIBE MENSAGEM  
              client.sendText(message.from, "Senha alterada com sucesso")

              menuLastClick = "senha alterada"

              break;

            case "numero de telefone do usuario":

              console.log("enviar mensagem ao usuario")

              // ENVIAR NOVA SENHA PARA O SAP
              // SE RETORAR SUCESSO EXIBE MENSAGEM
              let userNumber = validNumber(newMessage)

              if (userNumber != '') {

                client
                  .sendButtons(userNumber, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
                  .then((result: any) => {
                    console.log('Result: ', result); //return object success
                    client.sendText(message.from, "Menu enviado ao usuário")
                    menuLastClick = "menu enviado ao usuario"
                  })
                  .catch((erro: any) => {
                    console.error('Error when sending: ', erro); //return object error
                    client.sendText(message.from, "Numéro do usuário inválido")
                    menuLastClick = "menu não enviado ao usuario"
                  });
              }
              else {
                client.sendText(message.from, "Numéro do usuário inválido")
              }

              break;

            default:

              let userNumber2 = validNumber("8956065")

              if (userNumber2 != '') {

                client
                  .sendButtons(userNumber2, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
                  .then((result: any) => {
                    console.log('Result: ', result); //return object success
                    client.sendText(message.from, "Menu enviado ao usuário")
                    menuLastClick = "menu enviado ao usuario"
                  })
                  .catch((erro: any) => {
                    console.error('Error when sending: ', erro); //return object error
                    client.sendText(message.from, "Numéro do usuário inválido")
                    menuLastClick = "menu não enviado ao usuario"
                  });
              }

              break;

          }

          break;

      }

    }

  });



  app.listen(5000);

}