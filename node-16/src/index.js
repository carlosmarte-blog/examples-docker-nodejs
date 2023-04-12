const fastify = require('fastify')({ logger: true })
const closeWithGrace = require('close-with-grace');

let port = process.env.PORT || 3000;
let host = process.env.HOSTNAME || 'local';

fastify.get('/*', async (request, reply) => {
  return process.env.BUILD_IDENTIFIER
  ? String(process.env.BUILD_IDENTIFIER).split("/")
  : process.version
})

const closeListener = closeWithGrace({ delay: 500 }, async function({ error }) {
  if(error) fastify.log.error(error);
  await fastify.close();
})

fastify.addHook('onClose', (_, done) => {
  closeListener.uninstall();
  done();
})

const useHttps = false;

if(useHttps) {
  host = process.env.HOST || '0.0.0.0';
  port = parseInt(process.env.PORT) || 8443;
}

// Run the server!
const start = async () => {
  try {
    fastify.listen({ port, host }, function(error, address) {
      console.log(`websites: ${address}`);
      if(error) {
        fastify.log.error(error);
        process.exit(1);
      }
      console.log(`listening on port ${port}`)
    });
    fastify.ready().then(() => true).catch(() => false)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()