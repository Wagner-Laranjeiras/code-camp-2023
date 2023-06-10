import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import yargs from 'yargs-parser';
import { initKnex } from './db';
import { ApiHandlers } from './api';

function registerHandlers(
  registerHandler: (path: string, handlerName: keyof ApiHandlers) => void
) {
  registerHandler('/api/listpakete', 'handleListPakete');
  registerHandler('/api/listinvoice', 'handleListInvoice');
  registerHandler('/api/createinvoice', 'handleCreateInvoice');

  // TODO to add more APIs you can write new functions in the ApiHandlers calls
  // then add a call to registerHandler here to add a mapping to a URL of the server
  // The URL must start with /api/
}

async function startApiServer(serverPort: number, serverIp: string) {
  const app = express();
  const server = http.createServer(app);

  app.use(bodyParser.json());

  const knex = await initKnex();

  const handlers = new ApiHandlers(knex);

  const registerHandler = (path: string, handler: keyof ApiHandlers) => {
    const h = handlers[handler];

    app.use(path, async (req, res) => {
      try {
        await h.call(handlers, req, res);
      } catch (e) {
        console.log('Error handling API call ' + path, e);
        res.sendStatus(500);
      }
    });
  };

  registerHandlers(registerHandler);

  server.listen(serverPort, serverIp, undefined, () => {
    console.log(`Server online on http://${serverIp}:${serverPort}`);
  });
}

(async () => {
  const argv = yargs(process.argv.slice(2));

  const port = argv.port;
  const ip = argv.ip;

  await startApiServer(port, ip);
})();
