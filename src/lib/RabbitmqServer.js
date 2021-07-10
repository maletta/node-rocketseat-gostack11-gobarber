import { connect } from 'amqplib';

export default class RabbitmqServer {
  constructor(uri) {
    this.conn = null;
    this.channel = null;
    this.uri = uri;
  }

  // create connection, create channel
  async start() {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }

  // @param queue fila que será criada
  // método para criação de filas
  async assertQueue(queue) {
    await this.channel
      .assertQueue(queue)
      .then((response) => {
        console.log('queue criada');
        console.log(response);
      })
      .catch((response) => {
        console.log('erro ao criar fila');
        console.log(response);
      });
  }

  // publica diretamente em uma fila nomeado pelo parâmetro queue
  async publishInQueue(queue, message) {
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
}
