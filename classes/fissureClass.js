const WFWS = require("warframe-worldstate-data");
const missionType = WFWS.missionTypes;
const nodeData = WFWS.solNodes;
const Mission = require("./missionClass.js");

module.exports = class FissureMission extends Mission {
  constructor(missionType, modifier, location, expiration) {
    super(missionType, location, expiration);
    this.modifier = modifier;
  }

  translate() {
    let codedModOrder = ["VoidT1", "VoidT2", "VoidT3", "VoidT4"];
    let modOrder = ["Lith", "Meso", "Neo", "Axi"];
    let mod = modOrder[codedModOrder.indexOf(this.modifier)];
    const mishTranslate = {
      mission: missionType[this.missionType].value,
      modifier: mod,
      node: nodeData[this.location].value,
      timeLeft: this.getTimeLeft(this.expiration),
      enemy: nodeData[this.location].enemy
    };
    return mishTranslate;
  }
};
