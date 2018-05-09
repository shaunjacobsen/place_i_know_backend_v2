module.exports = {
  filterTrainGroupData: (trainGroups) => {
    let data = [];
    trainGroups.forEach(group => {
      let trainList = [];
      let newObj = { ...group.dataValues };
      if (group.confirmed) {
        const confirmedTrain = group.trains.filter(train => {
          return train.status.toLowerCase() === 'confirmed';
        })[0];
        trainList = [confirmedTrain.train_id];
      } else {
        trainList = group.trains.map(train => {
          return train.train_id;
        });
      }
      newObj.trains = trainList;
      data.push(newObj);
    });
    return data;
  }
}