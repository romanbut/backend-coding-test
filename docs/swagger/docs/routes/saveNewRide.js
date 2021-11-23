module.exports = {
  post: {
    tags: ['Rides API endpoints'],
    description: 'Save new ride',
    summary: 'Save new ride',
    operationId: 'saveNewRide',
    requestBody: {
      description: 'Data to save as a new Ride',
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/RideRequest',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Entity that has been saved in the DB',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RideResponse',
            },
          },
        },
      },
      400: {
        description: 'Data has incorrect values',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            examples: {
              validationMissingStartLat: {
                $ref: '#/components/examples/validationMissingStartLat',
              },
              validationMissingRider: {
                $ref: '#/components/examples/validationMissingRider',
              },
            },
          },
        },
      },
      500: {
        description: 'Server error',
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
