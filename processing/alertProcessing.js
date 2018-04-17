const AlertMission = require("../classes/alertClass.js");

module.exports = function(data) {
  let alertMish = [];
  data.forEach(function(mission) {
    let rewardPath = mission.MissionInfo.missionReward;
    //Items are listed in the WF API as  an array with 1 or 2 indices.
    //"countedItems" will have 2 indices while "items"
    //Only have one.  Only one exists so one of the next
    //two letiables will always be undefined
    let countedItemsPath = rewardPath.countedItems;
    let itemsPath = rewardPath.items;
    let credits = rewardPath.credits;
    let reward = "";
    let rewardCount = 1;
    //Figures out which item exists and grabs the relevant data
    if (itemsPath) {
      reward = itemsPath[0];
    } else if (countedItemsPath) {
      reward = countedItemsPath[0].ItemType;
      rewardCount = countedItemsPath[0].ItemCount;
    }
    //Verifies there is a reward to avoid undefined errors
    if (reward.length) {
      let dir = mission.MissionInfo;
      let codedAlert = new AlertMission(
        reward,
        rewardCount,
        credits,
        dir.missionType,
        dir.location,
        mission.Expiry.$date.$numberLong,
        mission._id.$oid
      );
      alertMish.push(codedAlert);
    }
  });
  return alertMish;
};
