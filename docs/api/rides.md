# Rides API

## Description
Set of endpoints for working with `Ride` entity

## Scheme

```typescript
interface Ride {
    "rideID": number, //PRIMARY KEY AUTOINCREMENT
    "start_lat": number, //NOT NULL (>= 0; <= 90)
    "start_long": number, //NOT NULL (>= 0; <= 180)
    "end_lat": number, //NOT NULL (>= 0; <= 90)
    "end_long": number, //NOT NULL (>= 0; <= 180)
    "rider_name": string, //NOT NULL
    "driver_name": string, //NOT NULL
    "driver_vehicle": string, //NOT NULL
    "created": number //DATETIME
}
```

## Endpoints

- `GET`: `/rides` - fetches all existing entities from DB
    - Params:
      - `offset` _[optional,integer]_ - record to start page from; including; _Default value is 0_ 
      - `limit` _[optional,integer]_ - size of the page; _Default value is 10_

    - Sample response (status code `200`):
   ```json
   [{
      "rideID": 1,
      "startLat": 40,
      "startLong": 50,
      "endLat": 40,
      "endLong": 50,
      "riderName": "John rider",
      "driverName": "Michel Knight",
      "driverVehicle": "Ford GT550"   
    },{
      "rideID": 2,
      "startLat": 40,
      "startLong": 50,
      "endLat": 40,
      "endLong": 50,
      "riderName": "John rider",
      "driverName": "Michel Knight",
      "driverVehicle": "Ford GT550"
   }]
      
    ```
   - Error response (status code `200`)
   ```json
   {
    "error_code": "SERVER_ERROR",
    "message": "Unknown server error"
   }
   ```

- `GET`:`/rides/:id` - fetches entity with specified ID
    - Params:
      - _id_ - id of target entity
    - Sample response (status code `200`)
    ```json
    {
      "rideID": 1,
      "startLat": 40,
      "startLong": 50,
      "endLat": 40,
      "endLong": 50,
      "riderName": "John rider",
      "driverName": "Michel Knight",
      "driverVehicle": "Ford GT550"   
    }
    ```
    - Error response (status code `200`)
    ```json
     {
      "error_code": "SERVER_ERROR",
      "message": "Unknown server error"
     }
     ```

- `POST`:`/rides` - saves new entity to the DB and returns it
    - Request body:
    ```json
    {
      "start_lat": 40, 
      "start_long": 50,
      "end_lat": 40, 
      "end_long": 50,
      "rider_name": "John rider",
      "driver_name": "Michel Knight",
      "driver_vehicle": "Ford GT550"
    }
    ```
    - Sample response (status code `200`)
    ```json
    {
      "rideID": 1,
      "startLat": 40,
      "startLong": 50,
      "endLat": 40,
      "endLong": 50,
      "riderName": "John rider",
      "driverName": "Michel Knight",
      "driverVehicle": "Ford GT550"
    }
    ```
    - Validation error response (status code `200`)
    ```json
    {
      "error_code": "VALIDATION_ERROR",
      "message": "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
    }
    ```
    - Server error response (status code `500`) 
    ```json
     {
      "error_code": "SERVER_ERROR",
      "message": "Unknown server error"
     }
     ```