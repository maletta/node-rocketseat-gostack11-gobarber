import { connect } from 'amqplib';

export default class RabbitmqServer {
  constructor() {
    this.conn = null;
    this.channel = null;
    this.QUEUES = {
      APPOINTMENT_CANCELATION_MAIL: 'APPOINTMENT_CANCELATION_MAIL',
    };
  }

  // create connection, create channel
  async start() {
    this.conn = await connect(this.generateDefaultURI());
    this.channel = await this.conn.createChannel();
  }

  // @param queue fila que será criada
  // método para criação de filas
  async assertQueue(queue) {
    await this.channel
      .assertQueue(queue)
      .then((response) => {
        console.log('create queue Rabbitmq ', queue);
        return response;
      })
      .catch((response) => {
        console.log('error on create queue Rabbitmq ', queue);
        return response;
      });
  }

  // publica diretamente em uma fila nomeado pelo parâmetro queue
  async publishInQueue(queue, message) {
    console.log('******************************** ');
    console.log('publish ', queue, message);
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  // publica no exchange, vai para a fila vinculado ao exchange
  async publishInExchange(exchange, routingKey, message) {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  // @param queue parâmetro com o nome da fila
  // @param callback função utilizada para processar a mensagem
  async consume(queue, callback) {
    const onMessage = (message) => {
      callback(message);
      // ack é uma função que avisa a fila de que mensagem foi lida
      // então remove a mensagem da fila
      this.channel.ack(message);
    };
    this.channel.consume(queue, onMessage);
  }

  generateDefaultURI() {
    // user and password defined in dockerfile
    const rabbitUser = 'admin';
    const rabbitPassword = 'admin';
    const rabbitmqHost = process.env.RABBITMQ_HOST;
    const rabbitmqPort = process.env.RABBITMQ_PORT;
    const generatedURI = `amqp://${rabbitUser}:${rabbitPassword}@${rabbitmqHost}:${rabbitmqPort}`;
    return generatedURI;
  }
}
