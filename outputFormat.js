function sortieOutputFormat(sortieData) {
  const embedData = sortieData.map(function(codedMission) {
    let sortie = codedMission.translate();
    if (sortie.mission) {
      return {
        name: `${sortie.mission}`,
        value: `${sortie.modifier}`
      };
    } else {
      return {
        name: `Unknown Mission Type`,
        value: `${sortie.modifier}`
      };
    }
  });
  const titleName = `${sortieData[0].translate().bossName} Sortie (${
    sortieData[0].translate().timeLeft
  })`;
  const iconURL =
    "https://vignette.wikia.nocookie.net/warframe/images/1/15/Sortie_b.png";
  const output = createEmbedOutput(titleName, iconURL, embedData);

  return output;
}

function alertOutputFormat(alertData) {
  let embedData = alertData.map(function(codedMission) {
    const alert = codedMission.translate();
    if (alert.mission && alert.rewardName) {
      return {
        name: `${alert.rewardName} (${alert.timeLeft})`,
        value: `${alert.credits} - ${alert.mission} - ${alert.node}`
      };
    } else if (!alert.mission && !alert.rewardName) {
      return {
        name: `**Unknown Reward Type** (${alert.timeLeft})`,
        value: `${alert.credits} - **Unknown Mission Type** - ${alert.node}`
      };
    } else if (!alert.mission) {
      return {
        name: `${alert.rewardName} (${alert.timeLeft})`,
        value: `${alert.credits} - **Unknown Mission Type** - ${alert.node}`
      };
    } else if (!alert.rewardName) {
      return {
        name: `**Unknown Reward Type** (${alert.timeLeft})`,
        value: `${alert.credits} - ${alert.mission} - ${alert.node}`
      };
    }
  });
  if (!embedData.length) {
    embedData = [
      {
        name: "No alerts to display",
        value: "Likely means only credit rewards available right now"
      }
    ];
  }
  const titleName = "Alerts";
  const iconURL =
    "https://image.freepik.com/free-icon/triangle-warning_318-28807.jpg";
  const output = createEmbedOutput(titleName, iconURL, embedData);
  return output;
}

function fissureOutputFormat(fissureData) {
  let correctFissureOrder = sortFissureOrder(fissureData);
  const embedData = correctFissureOrder.map(function(codedFissure) {
    const fissure = codedFissure.translate();
    return {
      name: `${fissure.modifier} ${fissure.mission} (${fissure.timeLeft})`,
      value: `${fissure.enemy} - ${fissure.node}`
    };
  });
  const titleName = "Fissures";
  const iconURL =
    "https://vignette.wikia.nocookie.net/warframe/images/5/57/VoidTearIcon_b.png";
  const output = createEmbedOutput(titleName, iconURL, embedData);
  return output;
}

function sortFissureOrder(fissureData) {
  const order = ["VoidT1", "VoidT2", "VoidT3", "VoidT4"];
  let mapSorted = [];
  for (let i = 0; i < order.length; i++) {
    for (let j = 0; j < fissureData.length; j++) {
      if (fissureData[j].modifier == order[i]) {
        mapSorted.push(fissureData[j]);
      }
    }
  }
  return mapSorted;
}

function invasionOutputFormat(invasionData) {
  let embedObject = invasionData.map(function(codedInvasion) {
    let invasion = codedInvasion.translate();
    let reward = "";
    if (invasion.atkRewardName.length === 0) {
      reward = invasion.defRewardName.toString();
    } else if (invasion.defRewardName.length === 0) {
      reward = invasion.atkRewardName.toString();
    } else {
      reward = `${invasion.atkRewardName.toString()} vs. ${invasion.defRewardName.toString()}`;
    }
    return {
      name: `${reward}`,
      value: `${invasion.node} - ${invasion.completion}`
    };
  });
  let titleName = "Invasions";
  let iconURL = "https://d30y9cdsu7xlg0.cloudfront.net/png/38152-200.png";
  let output = createEmbedOutput(titleName, iconURL, embedObject);
  return output;
}

function baroOutputFormat(baroData) {
  /*id: this.id,
  startTime: this.startTime,
  expiration: this.getTimeLeft(this.expiration),
  timeTilStart: this.getTimeLeft(this.startTime - new Date()),
  node: nodeData[this.location].value,
  reward: rewardsData[this.reward].value,
  cost: `${ducats}${credits}`*/
  let embedObject = [];
  let titleName = "Baro Ki'Teer";
  let iconURL =
    "http://img1.wikia.nocookie.net/__cb20150123124915/warframe/images/0/03/Voidtraderplaceholder.png";
  if (!baroData[0].reward) {
    let noBaro = baroData[0].translate();
    embedObject.push({
      name: `Appearing at the ${noBaro.node}`,
      value: `${noBaro.startTime} until arrival.`
    });
  } else {
    let embedObject = baroData.map(function(codedBaro) {
      let baro = codedBaro.translate();
      titleName += ` - ${baro.node}`;

      if (baro.reward) {
        return {
          name: `${baro.reward}`,
          value: `${baro.cost}`
        };
      } else {
        return {
          name: `Unknown Item Type - Ask Sham`,
          value: `${ducats}${credits} Credits`
        };
      }
    });
  }

  let output = createEmbedOutput(titleName, iconURL, embedObject);
  return output;
}

function createEmbedOutput(titleName, iconURL, embedData) {
  return {
    embed: {
      color: 3447003,
      author: {
        name: titleName,
        icon_url: iconURL
      },
      fields: embedData,
      timestamp: new Date(),
      footer: {
        text: "© ZufusNews"
      }
    }
  };
}

module.exports = {
  sortieOutputFormat,
  alertOutputFormat,
  fissureOutputFormat,
  invasionOutputFormat,
  baroOutputFormat
};
