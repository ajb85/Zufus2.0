const WFWS = require("warframe-worldstate-data");
const rewardsData = WFWS.languages;
const nodeData = WFWS.solNodes;
const Mission = require("./missionClass.js");

module.exports = class BaroRewards extends Mission {
  constructor(
    id,
    startTime,
    expiration,
    location,
    ducatsPrice,
    creditsPrice,
    reward,
    missionType
  ) {
    super(missionType, location, expiration);
    this.id = id;
    this.startTime = startTime;
    this.ducatsPrice = ducatsPrice;
    this.creditsPrice = creditsPrice;
    this.reward = reward;
  }
  translate() {
    let credits = "";
    let ducats = "";
    let rewards = "";
    if (this.reward) {
      rewards = rewardsData[this.reward.toLowerCase()].value;
      credits = `${this.numberWithCommas(this.creditsPrice)} Credits`;
      ducats = this.ducatsPrice > 0 ? `${this.ducatsPrice} Ducats & ` : "";
    }
    let timeDiff = this.startTime - new Date(); //974394329
    const mishTranslate = {
      id: this.id,
      startTime: this.getTimeLeft(this.startTime),
      expiration: this.getTimeLeft(this.expiration),
      node: nodeData[this.location].value,
      reward: rewards,
      cost: `${ducats}${credits}`
    };
    return mishTranslate;
  }
};
