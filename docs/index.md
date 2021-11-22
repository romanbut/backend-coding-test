# Backend coding exercise for r.but

## 1. General info

Simple application that allows retrieval and creation of
[`Ride`](./api/rides.md#Scheme) entity  

## 2. Technical specifications

1. Requirements:
   - `node (>8.6 and <= 10)` and `npm` are installed
2. Installation:
   - Run `npm install`
3. Optional params:

   -`DB_NAME` - By default, app uses in-memory DB storage.  
   You could change that by providing path via  
   `DB_NAME` env variable (path must be already existing)

## 3. API details

- [Rides](./api/rides.md)

- [Util](./api/utils.md)

## 4. Scripts

To run project:
`npm run start`

To run tests:
`npm run test`

### 4.1. Load testing

- Install required dependencies:
  - `npm i -g artillery@1.6.1` - (exact version required,
  since project runs on NodeJS v10,
  and this is the last version which _officially_ supports it)
  - `npm i -g forever`

- Run load testing script (report could be found in `logs/artillery.report.json`):
  - `npm run test:load`

## 5. Credentials

Author:

- Roman But (**r.but**)
- [roman.but-husaim@aimprosoft.com](mailto:roman.but-husaim@aimprosoft.com)
- **GITHUB**: [r.but](https://github.com/romanbut)
- [Aimprosoft](https://aimprosoft.com)
