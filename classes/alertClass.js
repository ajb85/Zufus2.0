const WFWS = require("warframe-worldstate-data");
const missionType = WFWS.missionTypes;
const rewardsData = WFWS.languages;
const nodeData = WFWS.solNodes;
const Mission = require("./missionClass.js");

module.exports = class AlertMission extends Mission {
  constructor(
    missionReward,
    rewardCount,
    credits,
    missionType,
    location,
    expiration,
    mishID
  ) {
    super(missionType, location, expiration);
    this.missionReward = missionReward;
    this.rewardCount = rewardCount;
    this.credits = credits;
    this.mishID = mishID;
  }
  translate() {
    let reward = "";
    let translated = rewardsData[this.missionReward.toLowerCase()];
    if (this.rewardCount > 1 && translated) {
      reward = `${this.numberWithCommas(this.rewardCount)} ${
        rewardsData[this.missionReward.toLowerCase()].value
      }`;
    } else if (translated) {
      reward = translated.value;
    } else {
      reward = this.missionReward;
    }
    let mishTranslate = {
      rewardName: reward,
      credits: `${this.numberWithCommas(this.credits)} credits`,
      mission: missionType[this.missionType].value,
      node: nodeData[this.location].value,
      timeLeft: this.getTimeLeft(this.expiration),
      mishID: this.mishID
    };
    return mishTranslate;
  }
  translateRewardName() {
    let translated = rewardsData[this.missionReward.toLowerCase()];
    if (translated) {
      return translated.value;
    } else {
      return this.missionReward;
    }
  }
};
