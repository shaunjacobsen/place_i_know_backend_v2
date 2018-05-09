module.exports = {
  filterFlightGroupData: (flightGroups) => {
    let data = [];
    flightGroups.forEach(group => {
      let flightList = [];
      let newObj = { ...group.dataValues };
      if (group.confirmed) {
        const confirmedFlight = group.flights.filter(flight => {
          return flight.status.toLowerCase() === 'confirmed';
        })[0];
        flightList = [confirmedFlight.flight_id];
      } else {
        flightList = group.flights.map(flight => {
          return flight.flight_id;
        });
      }
      newObj.flights = flightList;
      data.push(newObj);
    });
    return data;
  }
}