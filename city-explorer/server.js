'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/location', (request, response) => {
  const url  = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GOOGLE_API_KEY}`;
  return superagent.get(url)
    .then(result => {
      const locationResult = {
        search_query: request.query.data,
        formatted_query: result.body.results[0].formatted_address,
        latitude: result.body.results[0].geometry.location.lat,
        longitude: result.body.results[0].geometry.location.lng
      }
      response.send(locationResult);
    })
    .catch(error => handleError(error))
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//HELPER FUNCTIONS
function handleError (error, response) {
  console.error(error);
  if (response) return response.status(500).send('Sorry something went wrong.');
}
