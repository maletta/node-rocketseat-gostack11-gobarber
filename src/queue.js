import Queue from './lib/Queue';

// arquivo necessário para executar os jobs em outro processo diferente do processo da api web (server.js)
Queue.processQueue();
