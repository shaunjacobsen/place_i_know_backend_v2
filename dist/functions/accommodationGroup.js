module.exports = {
    filterAccommodationGroupData: (accommodationGroups) => {
        let data = [];
        accommodationGroups.forEach(group => {
            let accommodationList = [];
            let newObj = Object.assign({}, group.dataValues);
            if (group.status === 'confirmed') {
                const confirmedAccommodation = group.accommodation.filter(accommodation => {
                    return accommodation.status.toLowerCase() === 'confirmed';
                })[0];
                accommodationList = [confirmedAccommodation.accommodation_id];
            }
            else {
                accommodationList = group.accommodation.map(accommodation => {
                    return accommodation.accommodation_id;
                });
            }
            newObj.accommodation = accommodationList;
            data.push(newObj);
        });
        return data;
    }
};
