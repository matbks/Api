import parsePhoneNumber, { isValidPhoneNumber, isPossiblePhoneNumber, PhoneNumber } from "libphonenumber-js"
import { create, Whatsapp } from 'venom-bot';
import express from 'express'
import * as screens from './screens.json'
import fetch, { Headers } from 'node-fetch';

let menuLastClick:string = ''
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
app.post('/handle', function async(req, res) {
  res.send(req.body);
  console.info(req.body)
});

function validNumber(phoneNumber: string): string {

  console.log("Validando", phoneNumber)
  phoneNumber = parsePhoneNumber(phoneNumber, "BR")
    ?.format("E.164")
    ?.replace("+", "")
    ?.replace("-", "") as string

  phoneNumber = phoneNumber.includes("55")
    ? phoneNumber
    : `55${phoneNumber}`

  console.info("sera se tem 9", phoneNumber)
  console.info(phoneNumber[4])
  if (phoneNumber.length < 13) {
    console.info("n tem nova", phoneNumber)
    phoneNumber = phoneNumber.slice(0, 4) + '9' + phoneNumber.slice(4, phoneNumber.length)
  }

  phoneNumber = phoneNumber.includes("@c.us")
    ? phoneNumber
    : `${phoneNumber}@c.us`

  if (phoneNumber.length == 18) { console.info("Sucesso"); console.info(phoneNumber) } else { console.info("erro"); console.info(phoneNumber); phoneNumber = '' }

  return phoneNumber

}


function turnIntoNumber(get: any): Promise<number> {
  return new Promise((resolve, reject) => {
    let shouldbeNumber: number = Number(get);
    resolve(shouldbeNumber);
  });
}

async function request(phoneNumber: string) {

  // console.log("Requesting", phoneNumber)
  console.log("Requesting", phoneNumber)

  const url  = 'http://vm31.4hub.cloud:53100/sap/bc/srt/rfc/sap/zwsseciot/100/zwsseciot/zwsseciotb';

  const body =  '<?xml version="1.0" encoding="UTF-8"?>' +
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
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

  const requestHeaders: any = new Headers();
  requestHeaders.set('Content-Type', 'text/xml');
  requestHeaders.set('Authorization', 'Basic ' + Buffer.from("MBACKHAUS" + ":" + "Red@2020").toString('base64'));

  const responseLogin = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: body
  });

  return responseLogin.status;

}

async function start(client: any) {

  cliente = client

  client.onMessage(async (message: any) => {

    if (message.body && message.isGroupMsg === false) {

      let newMessage: string = message.body.toLowerCase()

      switch (newMessage) {

        case "sim":
          console.log("enviando menu")
          await client
            .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
            .then((result: any) => {
              console.log('Result: ', result); 
            })
            .catch((erro: any) => {
              console.error('Error when sending: ', erro); 
            });

          break;

        case "desbloquear":
          console.log("enviando menu")
          await client
            .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
            .then((result: any) => {
              console.log('Result: ', result); 
            })
            .catch((erro: any) => {
              console.error('Error when sending: ', erro); 
            });

          break;

        case "desbloquear senha":

          console.log("enviando menu")

          await client
            .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
            .then((result: any) => {
              console.log('Result: ', result); 
            })
            .catch((erro: any) => {
              console.error('Error when sending: ', erro); 
            });

          break;

        case "alterar minha senha":

          console.log("alterar minha senha")

          client.sendText(message.from, "Digite sua nova senha")

          menuLastClick = "alterar minha senha"

          break;

        case "desbloquear senha de outro usuário":

          console.log("desbloquear senha de outro usuário")

          client.sendText(message.from, "Digite o número de telefone do usuário")

          menuLastClick = "numero de telefone do usuario"

        break;

        case "desbloquear minha senha":

          console.log("Desbloquear minha senha")

          let phone = validNumber(message.from)
          let requestReturn
          console.log("Phone", phone)
          if (phone != '') {
            requestReturn = await request(phone.substring(0, 13));
          }

          let requestRetur = await turnIntoNumber(requestReturn)
          console.log("retorno", requestRetur)
          if (requestRetur == 200) {
            console.log("Senha desbloqueada com sucesso")
            client.sendText(message.from, "Senha desbloqueada")
          }
          else {
            client.sendText(message.from, "Falha no desbloqueio")
          }
          menuLastClick = "senha desbloqueada"

          break;

        default:

          switch (menuLastClick) {

            case "numero de telefone do usuario":

              console.log("enviar mensagem ao usuario")

              let phone = validNumber(newMessage)
              let requestReturn
              console.log("Phone", phone)

              if (phone != '') {

                console.log("enviando menu")
                await client
                  .sendButtons(phone, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
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

            default:

              break;

          }

          break;

      }

    }

  });

  app.listen(5000);

}