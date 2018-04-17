const BaroRewards = require("../classes/baroClass.js");

module.exports = function(baroData) {
  let baro = [];
  let id = baroData._id.$oid;
  let startTime = baroData.Activation.$date.$numberLong;
  let expiration = baroData.Expiry.$date.$numberLong;
  let location = baroData.Node;
  if (baroData.Manifest) {
    baroData.Manifest.forEach(function(baroReward) {
      const codedBaro = new missionClasses.BaroRewards(
        id,
        startTime,
        expiration,
        location,
        baroReward.PrimePrice,
        baroReward.RegularPrice,
        baroReward.ItemType
      );
      baro.push(codedBaro);
    });
  } else {
    const codedBaro = new BaroRewards(
      id,
      startTime,
      expiration,
      location,
      0,
      0,
      0
    );
    baro.push(codedBaro);
  }
  return baro;
};
