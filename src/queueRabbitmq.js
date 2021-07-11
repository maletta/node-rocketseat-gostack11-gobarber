import CancellationMailJob from './app/jobs/CancellationMail';
import RabbitmqServer from './lib/RabbitmqServer';

const customEnv = require('custom-env');
// seleciona o arquivo .env de acordo com a variável definida nos scripts do package.json
customEnv.env(process.env.NODE_ENV);

async function handleOnMessage(messageObject) {
  // propriedade content é um array de buffer
  const messageBufferedToString = messageObject.content.toString();
  const messageStringfyToJson = JSON.parse(messageBufferedToString);
  // formatando a mensagem para o objeto que pode ser lido por CancellationMailJob
  // executando job de envio de email
  CancellationMailJob.handle({
    data: { appointment: messageStringfyToJson },
  });
}

async function consumer() {
  const rabbit = new RabbitmqServer();
  await rabbit.start();
  // consome mensagem e marca como ack e a remove da fila
  rabbit.consume(rabbit.QUEUES.APPOINTMENT_CANCELATION_MAIL, handleOnMessage);
}

consumer();
