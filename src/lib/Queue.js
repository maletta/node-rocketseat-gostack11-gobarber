import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// array de jobs, array de instâncias de classes que possuem principalmente
// @key, atributo que será usado como chave para identificar as filas no redis, endereço de cacheamento
// @handle, método que será usado para processar as mensagens pertencentes a sua fila
const jobs = [CancellationMail];

class Queue {
  constructor() {
    // vai ter dois parâmetros cada objeto dentro do array this.queue
    // @bee, que é a instancia de uma fila cacheada no redis, essa fila vai ter o nome da 'key' do job
    //  para o qual essa fila irá servir mensagens
    // @handle que é o método que será processará para cada mensagem na fila
    this.queues = [];

    this.init();
  }

  // cria uma fila pra cada job no array de jobs
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // método para adicionar itens a alguma fila
  // @queue atributo que especifica a fila em que será adicionado
  // @job atributo que contém os dados que serão adicionados na mensagem
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // método para processar cada mensagem de cada fila
  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle);
    });
  }
}

export default new Queue();
