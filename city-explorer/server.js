'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/location', getLocation);
app.get('/weather', getWeather);
// app.get('/movies', getMovie);
// app.get('/yelp', getYelp);
// app.get('/meetups', getMeetup);
// app.get('/trails', getTrail);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//HELPER FUNCTIONS
function handleError (error, response) {
  console.error(error);
  if (response) return response.status(500).send('Sorry something went wrong.');
}

function getLocation (request, response) {
  const url  = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GOOGLE_API_KEY}`;

  return superagent.get(url)
    .then(result => {
      const locationResult = {
        search_query: request.query.data,
        formatted_query: result.body.results[0].formatted_address,
        latitude: result.body.results[0].geometry.location.lat,
        longitude: result.body.results[0].geometry.location.lng
      }
      response.send(locationResult)
    })
    .catch(error => handleError(error));
}

function getWeather (request, response) {
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${request.query.data.latitude},${request.query.data.longitude}`;
  return superagent.get(url)
    .then(result => {
      response.send(result.body.daily.data.map(day => new Weather(day)));
    })
    .catch(error => handleError(error, response));
}

function Weather(day) {
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.forecast = day.summary;
}
