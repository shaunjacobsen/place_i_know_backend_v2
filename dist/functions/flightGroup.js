module.exports = {
    filterFlightGroupData: (flightGroups) => {
        let data = [];
        flightGroups.forEach(group => {
            let flightList = [];
            let newObj = Object.assign({}, group.dataValues);
            if (group.confirmed) {
                const confirmedBooking = group.flights.filter(flight => {
                    return flight.status.toLowerCase() === 'confirmed';
                })[0];
                flightList = [confirmedBooking.flight_id];
            }
            else {
                flightList = group.flights.map(flight => {
                    return flight.flight_id;
                });
            }
            newObj.flights = flightList;
            data.push(newObj);
        });
        return data;
    }
};
