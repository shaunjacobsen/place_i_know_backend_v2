const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
  res.header("Access-Control-Expose-Headers", "x-auth");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/user/user')(app);
require('./routes/trip/trip')(app);
require('./routes/bookings/accommodation')(app);
require('./routes/bookings/flight')(app);
require('./routes/bookings/train')(app);
require('./routes/itinerary/itinerary')(app);
require('./routes/event/event')(app);
require('./routes/place/place')(app);
require('./routes/documents/document')(app);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.log(`Server up on ${process.env.PORT}`);
  });
}

module.exports = { app };