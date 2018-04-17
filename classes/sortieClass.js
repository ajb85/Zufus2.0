const WFWS = require("warframe-worldstate-data");
const missionType = WFWS.missionTypes;
const nodeData = WFWS.solNodes;
const sortieData = WFWS.sortie;
const Mission = require("./missionClass.js");

module.exports = class SortieMission extends Mission {
  constructor(bossName, missionType, modifierType, location, expiration) {
    super(missionType, location, expiration);
    this.bossName = bossName;
    this.modifierType = modifierType;
  }
  translate() {
    let mishTranslate = {
      bossName: sortieData.bosses[this.bossName].name,
      timeLeft: this.getTimeLeft(this.expiration),
      mission: missionType[this.missionType].value,
      modifier: sortieData.modifierTypes[this.modifierType],
      node: nodeData[this.location].value
    };
    return mishTranslate;
  }
};
