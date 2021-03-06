'use strict';

const Hapi = require('hapi');
const createTodoService= require('./todoService')

const todoService = createTodoService()

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3001
});

// Add the route
server.route({
  method: 'GET',
  path: '/todos',
  handler: () => todoService.getTodos(),
  config: {
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
  },
})
server.route({
  method: 'POST',
  path: '/todos',
  handler: (req) => todoService.addTodo(req.payload.text),
  config: {
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
  },
})
server.route({
  method: 'DELETE',
  path: '/todos/{id}',
  handler: async (req, h) => {
    await todoService.deleteTodo(req.params.id)
    return h.response('No Content').code(204)
  },
  config: {
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
  },
})
server.route({
  method: 'PUT',
  path: '/todos/{id}',
  handler: (req) => todoService.editTodo(req.params.id, req.payload),
  config: {
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
  },
})



// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();