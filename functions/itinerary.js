const moment = require('moment');

const reduceDaysToArray = days => {
  let dayObjects = [];
  days.forEach(day => {
    if (
      dayObjects.filter(dayObject => {
        return dayObject.date === day.date;
      }).length > 0
    ) {
      let currentObject = dayObjects.find(dayObject => {
        return dayObject.date === day.date;
      });
      currentObject.day_ids.push(day.day_id);
    } else {
      dayObjects.push({ date: day.date, day_ids: [day.day_id] });
    }
  });
  return dayObjects;
};

const transformEventsForApp = dayEvents => {
  return dayEvents.map(dayEvent => {
    return {
      display_type: 'event',
      itinerary_id: dayEvent.itinerary_id,
      item_id: dayEvent.day_id,
      event_id: dayEvent.event_id,
      sort_index: dayEvent.sort_index,
      date: dayEvent.date,
      title: dayEvent.event.title,
      type: dayEvent.event.type,
      subtype: dayEvent.event.subtype,
      status: dayEvent.event.status,
      start_time: dayEvent.event.start_time,
      start_tz: dayEvent.event.start_tz,
      end_time: dayEvent.event.end_time,
      end_tz: dayEvent.event.end_tz,
      duration: dayEvent.event.duration,
      notes: dayEvent.event.notes,
      price: dayEvent.event.price,
      currency: dayEvent.event.currency,
      prepaid: dayEvent.event.prepaid,
      price_is_approximate: dayEvent.event.price_is_approximate,
      image_url: dayEvent.event.image_url,
      place_name: dayEvent.event.place.name,
      place_address: dayEvent.event.place.full_address,
      place_address_1: dayEvent.event.place.address1,
      place_address_2: dayEvent.event.place.address2,
      place_city: dayEvent.event.place.city,
      place_phone: dayEvent.event.place.phone,
      place_website: dayEvent.event.place.website,
      place_latitude: dayEvent.event.place.latitude,
      place_longitude: dayEvent.event.place.longitude,
      place_type: dayEvent.event.place.type,
      hours:
        dayEvent.event.place.hours[
          moment(dayEvent.date)
            .format('ddd')
            .toLowerCase()
        ],
      // TODO: completed needs to be implemented properly
      completed: false,
    };
  });
};

const transformNotesForApp = notes => {
  return notes.map(note => {
    return {
      display_type: 'note',
      item_id: note.day_id,
      itinerary_id: note.itinerary_id,
      sort_index: note.sort_index,
      date: note.date,
      type: 'note',
      subtype: 'note',
      title: note.day_attributes.title,
      notes: note.day_attributes.body,
    };
  });
};

const transformDirectionsForApp = (directions, places) => {
  return directions.map(direction => {
    const place = places.filter(place => Number(direction.day_attributes.end_place_id) === place.place_id)[0];
    return {
      display_type: 'directions',
      item_id: direction.day_id,
      itinerary_id: direction.itinerary_id,
      sort_index: direction.sort_index,
      date: direction.date,
      type: 'directions',
      place_latitude: place.latitude,
      place_longitude: place.longitude,
      place_name: place.name,
      place_address: place.full_address,
      title: `Directions from ${place.name}`,
      duration: direction.day_attributes.estimated_duration,
      subtype: direction.day_attributes.suggested_mode,
      notes: direction.day_attributes.directions,
    };
  });
};

module.exports = {
  reduceDaysToArray,
  transformEventsForApp,
  transformNotesForApp,
  transformDirectionsForApp,
};
