This is a [Next.js](https://nextjs.org/) project for a queue replacement at UQ.

## Requirements:
- ```nodejs``` and ```npm```
- ```mongodb``` installed with a local database called ```uqueue```

## Installation
```bash
npm install 
npm run dev
```
This will start a development server at the address below.

Open [http://localhost:8081](http://localhost:8081) with your browser to see the result.

## General Project Structure
- __server.js__ : The entrypoint and server for the app.
- __components/__ : The react components used in the pages
- __models/__ : The mongoDB Models for writing to the database.
- __pages/__ : The navigable _next.js_ pages and api calls.
- __helpers/__ : Some helper functions for the server and queue logic.

## Tech stack
- Next.js / React.js for frontend and api calls.
- express.js for the server.
- MongoDB database
- sockets.io for communication between client and server.
