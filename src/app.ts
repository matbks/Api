// Supports ES6
import { create, Whatsapp } from 'venom-bot';
// import screens from './screens.json';
let screens = require('./screens.json');
let lastChoice = ''
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

    switch (message.body) {
      case "menu": {

        client
          .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
          .then((result: any) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro: any) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }

      case "alterar minha senha":

        console.log("alterar minha senha")

        this.sendText(message.from, "Digite sua nova senha:")

        lastChoice = "alterar minha senha"

        break;

      case "outro usuário deseja alterar sua senha":

        console.log("outro usuário deseja alterar sua senha")

        this.sendText(message.from, "Digite o número de telefone do usuário")

        lastChoice = "numero de telefone do usuario"
        break;

      default:

        console.log("default")
        console.log(message.body)

        if (lastChoice == "alterar minha senha") {

          this.sendButtons("5511932735086@c.us", this.menu)
            .then((result) => {
              this.sendText(message.from, "Menu de ajuda enviado ao usuário.")
              console.log('Result: ', result)
              lastChoice = ''
            })
            .catch((erro) => {
              this.sendText(message.from, erro)
              console.error('Error when sending: ', erro)
              lastChoice = ''
            });

          // validNewPass()
          // changePass()
          this.sendText(message.from, "Senha alterada com sucesso!")

          lastChoice = ''

        }

        if (lastChoice == "numero de telefone do usuario") {

          // validNewPass()
          // changePass()

          console.log("outro usu")

          // let userNumber = this.validNumber(message.body)

          // this.sendButtons("5511932735086@c.us", this.menu)
          this.sendButtons(message.from, this.menu)
            .then((result) => {
              this.sendText(message.from, "Menu de ajuda enviado ao usuário.")
              console.log('Result: ', result)
              lastChoice = ''
            })
            .catch((erro) => {
              this.sendText(message.from, erro)
              console.error('Error when sending: ', erro)
              lastChoice = ''
            });


        }

        break;
    }

  });

}