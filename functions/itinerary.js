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

module.exports = { reduceDaysToArray };
