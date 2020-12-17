import app from './app';

import logger from './lib/logger';

async function main() {
  app.listen(app.get('port'), () => {
    logger.info('Servidor en el puerto ' + app.get('port'));
  }).on('error', function (e) {
    logger.info({
      level: 'error',
      message: e.message,
      service: 'Index'
    });
  });
}

main();