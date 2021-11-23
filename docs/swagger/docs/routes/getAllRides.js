module.exports = {
  get: {
    tags: ['Rides API endpoints'],
    description: 'GET page of Rides',
    summary: 'GET page of Rides',
    operationId: 'getAllRides',
    parameters: [
      {
        name: 'offset',
        description: 'Number of row to start page with',
        in: 'query',
        schema: {
          type: 'number',
          minValue: 0,
        },
        required: false,
        default: 0,
      },
      {
        name: 'limit',
        description: 'Size of the response page',
        in: 'query',
        schema: {
          type: 'number',
          minValue: 1,
        },
        required: false,
        default: 10,
      },
    ],
    responses: {
      200: {
        description: 'Successful response with data',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RideResponse',
              },
            },
          },
        },
      },
      404: {
        description: 'Error response when no data was found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            examples: {
              missingRides: {
                $ref: '#/components/examples/missingRides',
              },
            },
          },
        },
      },
      500: {
        description: 'Error response when something went wrong on the server',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            examples: {
              serverError: {
                $ref: '#/components/examples/serverError',
              },
            },
          },
        },
      },
    },
  },
};
