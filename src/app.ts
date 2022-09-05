import express, { Request, Response, Router } from "express"
import { create, Whatsapp } from 'venom-bot';

let screens = require('./screens.json');

let menuLastClick = ''

let cliente: Whatsapp

const app = express()
app.use(express.json())

app.post('/send', (request, response) => {

  console.log('/send')

  try {
    let { number, message } = request.body
    number = number.toLowerCase();
    console.log(number)
    console.log(message)
    cliente.sendText(number, message)
    return response.sendStatus(200).json();
  }
  catch (error) {
    console.error(error);
    response.send(500).json({ status: "error", message: error })
  }

})

create({
  session: 'session-name', //name of session
  multidevice: true // for version not multidevice use false.(default: true)
})
  .then((client: any) => start(client))
  .catch((erro: any) => {
    console.log(erro);
  });

function start(client: any) {

  cliente = client

  client.onMessage((message: any) => {

    let newMessage: string = message.body.toLowerCase()

    switch (newMessage) {

      case "menu":

        client
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

      default:

        switch (menuLastClick) {

          case "alterar minha senha":

            console.log("salvar nova senha")
            let value = 0
            let headers = { 'content-type': 'text/xml; charset=utf-8' }
            let body = `
                      <?xml version="1.0" encoding="UTF-8"?>
                      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
                      <soapenv:Header/>
                      <soapenv:Body>
                      <urn:ZfmSecIot>
                      <Input>
                  `
            body += value
            body += ` </Input>
                      </urn:ZfmSecIot>
                      </soapenv:Body>
                      </soapenv:Envelope>
                  `

            // const response =  fetch( "http://vm31.4hub.cloud:53100/sap/bc/srt/rfc/sap/zwsseciot/100/zwsseciot/zwsseciotb" , {
            //   method: 'POST',
            //   body: body,
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} });

            // if (!response.ok) { /* Handle */ }

            // ENVIAR NOVA SENHA PARA O SAP
            // SE RETORAR SUCESSO EXIBE MENSAGEM  
            client.sendText(message.from, "Senha alterada com sucesso")

            menuLastClick = "senha alterada"

            break;

          case "numero de telefone do usuario":

            console.log("enviar mensagem ao usuario")

            // ENVIAR NOVA SENHA PARA O SAP
            // SE RETORAR SUCESSO EXIBE MENSAGEM  
            client.sendText(message.from, "Menu enviado ao usuário")

            menuLastClick = "menu enviado"

            break;

        }

        break;

    }

  });

  app.listen(5000);

}