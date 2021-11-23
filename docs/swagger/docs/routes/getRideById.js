module.exports = {
  get: {
    tags: ['Rides API endpoints'],
    description: 'GET Ride by ID',
    summary: 'GET Ride by ID',
    operationId: 'getRideById',
    parameters: [
      {
        name: 'id',
        description: 'ID of a Ride to fetch',
        in: 'path',
        schema: {
          type: 'number',
          minValue: 1,
        },
        required: true,
        example: 1,
      },
    ],
    responses: {
      200: {
        description: 'Successful response with data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RideResponse',
            },
          },
        },
      },
      404: {
        description: 'Error response when Ride with provided ID was not found',
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
