// Supports ES6
import { create, Whatsapp } from 'venom-bot';
// import screens from './screens.json';
let screens = require('./screens.json');

  create({
    session: 'session-name', //name of session
    multidevice: true // for version not multidevice use false.(default: true)
  })
  .then((client:any) => start(client))
  .catch((erro:any) => {
    console.log(erro);
  });

function start(client:any) {
  client.onMessage((message:any) => {

    switch (message.body && message.isGroupMsg === false)
    {
        case "menu": {

            client
              .sendButtons(message.from, screens.menu.menuTitle, screens.menu.menuButtons, screens.menu.menuDescription)
              .then((result:any) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro:any) => {
                console.error('Error when sending: ', erro); //return object error
              });
          } 

        
        break;
    }

    });
  
}