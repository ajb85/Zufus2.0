const fs = require("fs");
const fetch = require("node-fetch");
const outputFormat = require("./outputFormat.js");
const alreadyMessaged = require("./serverData/alreadyMessaged.json");
const postIDs = require("./serverData/postIDs.json");

//Discord/output data
const Discord = require("discord.js");
const zufusSpamID = "325944060135342090";

module.exports = function(zufus) {
  const url = "http://content.warframe.com/dynamic/worldState.php";
  const fetchData = {
    method: "GET",
    cache: "no-cache"
  };
  let checkFunctions = [
    checkSorties,
    checkAlerts,
    checkFissures,
    checkInvasions,
    checkBaro
  ];

  fetch(url, fetchData)
    .then(res => res.json())
    .then(function(data) {
      checkFunctions.forEach(f => f(zufus, data));
    });
};

//Check World State data, call function to post the data, repeat for next type.
function checkSorties(zufus, data) {
  const sortieData = require("./processing/sortieProcessing.js");
  let codedSortie = sortieData(data.Sorties[0]);
  let embedData = outputFormat.sortieOutputFormat(codedSortie);
  postData(zufus, embedData, "sortie");
}

function checkAlerts(zufus, data) {
  const alertData = require("./processing/alertProcessing.js");
  let codedAlert = alertData(data.Alerts);
  let embedData = outputFormat.alertOutputFormat(codedAlert);
  postData(zufus, embedData, "alerts");
  //messageList format:
  // {
  //   user:[AlertMission {location: SolNode, missionType: "MT_missionType"}]
  // }
  let messageList = createMessageList(codedAlert);
  sendDMs(zufus, messageList);
}

function checkFissures(zufus, data) {
  const fissureData = require("./processing/fissureProcessing.js");
  let codedFissure = fissureData(data.ActiveMissions);
  let embedData = outputFormat.fissureOutputFormat(codedFissure);
  postData(zufus, embedData, "fissures");
}

function checkInvasions(zufus, data) {
  const invasionData = require("./processing/invasionProcessing.js");
  let codedInvasion = invasionData(data.Invasions);
  let embedData = outputFormat.invasionOutputFormat(codedInvasion);
  postData(zufus, embedData, "invasions");
}

function checkBaro(zufus, data) {
  const baroData = require("./processing/baroProcessing.js");
  let codedBaro = baroData(data.VoidTraders[0]);
  let embedData = outputFormat.baroOutputFormat(codedBaro);
  postData(zufus, embedData, "baro");
}

function sendDMs(zufus, messageList) {
  //Verify messageList isn't empty
  if (Object.getOwnPropertyNames(messageList).length) {
    for (let user in messageList) {
      let embedData = outputFormat.alertOutputFormat(messageList[user]);
      let server = zufus.fetchUser(user).then(
        user => {
          user.send(embedData);
          console.log(`Messaging ${user.username} about an alert.`);
        },
        reject => {
          log("reject:", reject);
        }
      );
    }
  }
}
//Uses message IDs in Discord.js to edit existing messages or create new
//messages if they doesn't exist.
function postData(zufus, currentData, missionType) {
  const channel = zufus.channels.find("id", zufusSpamID);
  if (
    //Checks for existing ID, skips if not found.
    //Currently this will run if it finds an old ID of a deleted message.
    //However, the promise will be rejected and the function will run again,
    //except the ID will be changed to "N/A"
    postIDs[missionType] &&
    postIDs[missionType] !== "N/A"
  ) {
    channel.fetchMessage(postIDs[missionType]).then(
      lastMessage => {
        lastMessage.edit(currentData);
      },
      reject => {
        writeData({ [missionType]: "N/A" }, "./serverData/postIDs.json");
        postData(zufus, currentData, missionType);
      }
    );
  } else {
    //If the ID didn't exist or the message was deleted, a new one is sent.
    channel.send(currentData).then(function(prevAlert) {
      writeData(
        { [missionType]: prevAlert.channel.lastMessageID },
        "./serverData/postIDs.json"
      );
    });
  }
}

function createMessageList(codedMissions) {
  let messageList = {};
  codedMissions.forEach(function(mission) {
    //watchlist is the list for each user of items they are interested in.
    //watchlist format is:
    // {
    //   userDiscordID: {reward: true, reward2: true}
    // }
    const watchlists = require("./serverData/userWishlists.json");
    //Translate the coded name since there are sometimes multiple coded names
    //per item
    const reward = mission.translateRewardName();

    for (var user in watchlists) {
      //If the reward is found in a user watchlist, begin creating the message
      //they'll receive
      if (watchlists[user][reward.toLowerCase()]) {
        //Create the array for messages they'll receive if this is the first
        //reward found for them.  messageList prevents users from receiving
        //multiple messages if there are multiple rewards they want.
        if (!alreadyMessaged[user] || !alreadyMessaged[user][mission.mishID]) {
          if (!messageList[user]) {
            messageList[user] = [];
          }
          messageList[user].push(mission);
        }
        addMissionToAlreadyMessaged(user, mission.mishID);
      }
    }
  });
  return messageList;
}

function addMissionToAlreadyMessaged(user, mishID) {
  let dataToAdd = { [mishID]: true };
  let updatedData = {};
  if (!alreadyMessaged[user]) {
    let data = { [user]: dataToAdd };
    updatedData = Object.assign(alreadyMessaged, data);
  } else if (!alreadyMessaged[user][mishID]) {
    updatedData = Object.assign(alreadyMessaged[user], dataToAdd);
  }
  if (Object.keys(updatedData).length) {
    fs.writeFile(
      "./serverData/alreadyMessaged.json",
      JSON.stringify(alreadyMessaged),
      "utf8",
      err => {
        if (err) throw err;
      }
    );
  }
}

//Saving postIDs to be used when the program stops and is restarted.
function writeData(newDataToSave, fileName) {
  if (newDataToSave) {
    newDataToSave = Object.assign(postIDs, newDataToSave);
    fs.writeFile(fileName, JSON.stringify(newDataToSave), "utf8", err => {
      if (err) throw err;
    });
  }
}
