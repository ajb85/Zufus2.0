const WFWS = require("warframe-worldstate-data");
const rewardsData = WFWS.languages;
const nodeData = WFWS.solNodes;

module.exports = class InvasionMission {
  constructor(attackerReward, defenderReward, location, count, goal) {
    this.location = location;
    this.attackerReward = attackerReward;
    this.defenderReward = defenderReward;
    this.count = count;
    this.goal = goal;
  }

  translate() {
    //countedItem = [item, count]
    //items = [item]
    let atkReward = "";
    let defReward = "";
    let reward = "";
    //If reward can't be translated, coded name is given for debugging
    //There is always a defender reward but not always an attacker reward
    //Thus, this condition is only necessary for invasions
    if (this.attackerReward.length) {
      reward = this.attackerReward;
      atkReward = reward[0].toLowerCase();
    }
    //.length determines if the reward is countedItem or items.
    //rewardsdata[] verifies the item can be translated (avoids undefined error)
    if (reward.length === 2 && rewardsData[reward[0].toLowerCase()]) {
      atkReward = `${reward[1]} ${rewardsData[reward[0].toLowerCase()].value}`;
    } else if (reward.length === 1 && rewardsData[reward[0].toLowerCase()]) {
      atkReward = `${rewardsData[reward[0].toLowerCase()].value}`;
    }

    //Repeat above for defender rewards
    reward = this.defenderReward;
    defReward = reward[0].toLowerCase();
    if (reward.length === 2 && rewardsData[reward[0].toLowerCase()]) {
      defReward = `${reward[1]} ${rewardsData[reward[0].toLowerCase()].value}`;
    } else if (reward.length === 1 && rewardsData[reward[0].toLowerCase()]) {
      defReward = `${rewardsData[reward[0].toLowerCase()].value}`;
    }

    const mishTranslate = {
      atkRewardName: atkReward,
      defRewardName: defReward,
      node: nodeData[this.location].value,
      completion: `${Math.round(Math.abs(this.count / this.goal) * 100)}%`
    };
    return mishTranslate;
  }
};
