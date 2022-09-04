import { create, Whatsapp } from 'venom-bot';

let screens = require('./screens.json');

let menuLastClick = ''

create({
  session: 'session-name', //name of session
  multidevice: true // for version not multidevice use false.(default: true)
})
  .then((client: any) => start(client))
  .catch((erro: any) => {
    console.log(erro);
  });


function start(client: any) {

  client.onMessage((message: any) => {
     
    let newMessage : string = message.body.toLowerCase()

    switch (message.body) {

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

      // case "outro usuário deseja alterar sua senha":

      //   console.log("outro usuário deseja alterar sua senha")

      //   this.sendText(message.from, "Digite o número de telefone do usuário")

      //   menuLastClick = "numero de telefone do usuario"
      //   break;

      default:


        break;
    }

  });

}