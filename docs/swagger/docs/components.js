module.exports = {
  components: {
    schemas: {
      RideRequest: {
        type: 'object',
        description: 'Object that holds data to save',
        properties: {
          start_lat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Starting latitude',
          },
          start_long: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Starting longitude',
          },
          end_lat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Ending latitude',
          },
          end_long: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Ending longitude',
          },
          rider_name: {
            type: 'string',
            minLength: 1,
            required: true,
            description: 'Passenger\'s name',
          },
          driver_name: {
            type: 'string',
            minLength: 1,
            required: true,
            description: 'Driver\'s name',
          },
          driver_vehicle: {
            type: 'string',
            minLength: 1,
            required: true,
            description: 'Driver\'s vehicle',
          },
        },
      },
      RideResponse: {
        type: 'object',
        description: 'Object representation of saved ride',
        properties: {
          rideID: {
            type: 'number',
            description: 'ID of saved ride entity',
            required: true,
            example: 1,
          },
          startLat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Starting latitude',
          },
          startLong: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Starting longitude',
          },
          endLat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Ending latitude',
          },
          endLong: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            exclusiveMinimum: true,
            exclusiveMaximum: true,
            required: true,
            description: 'Ending longitude',
          },
          riderName: {
            type: 'string',
            minLength: 1,
            required: true,
            description: 'Passenger\'s name',
          },
          driverName: {
            type: 'string',
            minLength: 1,
            required: true,
            description: 'Driver\'s name',
          },
          driverVehicle: {
            type: 'string',
            minLength: 1,
            required: true,
            description: 'Driver\'s vehicle',
          },
          created: {
            type: 'number',
            required: true,
            description: 'Entity creation timestamp',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error_code: {
            type: 'string',
            description: 'Short representation of error',
          },
          message: {
            type: 'string',
            description: 'Detailed description of error',
          },
        },
        examples: {
          'Server Error': {
            value: {
              error_code: 'SERVER_ERROR',
              message: 'Unknown error',
            },
          },
        },
      },
    },
    examples: {
      serverError: {
        value: {
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        },
        summary: 'Sample server error response',
      },
      missingRides: {
        value: {
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        },
        summary: 'Sample missing ride(s) response',
      },
      validationMissingStartLat: {
        value: {
          error_code: 'VALIDATION_ERROR',
          message: 'Start latitude must be between -90 and 90 degrees',
        },
        summary: 'Invalid starting latitude',
      },
      validationMissingRider: {
        value: {
          error_code: 'VALIDATION_ERROR',
          message: 'Rider name must be a non empty string',
        },
        summary: 'Missing rider name',
      },
    },
  },
};
