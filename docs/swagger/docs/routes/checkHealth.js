module.exports = {
  get: {
    tags: ['Server Status API endpoints'],
    description: 'Provides server status',
    summary: 'Provides server status',
    operationId: 'checkHealth',
    responses: {
      200: {
        description: 'Indicates that server is up and running',
        content: {
          'text/html': {
            schema: {
              type: 'string',
              example: 'Healthy',
            },
          },
        },
      },
    },
  },
};
