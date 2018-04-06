const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./db/pg');
require('./config/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/user/user')(app);
require('./routes/trip/trip')(app);
require('./routes/itinerary/itinerary')(app);
require('./routes/event/event')(app);
require('./routes/place/place')(app);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.log(`Server up on ${process.env.PORT}`);
  });
}

module.exports = { app };