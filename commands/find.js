const Command = require("../classes/Command.js");
const WFWS = require("warframe-worldstate-data");
const rewardsData = WFWS.languages;

module.exports = new Command("find", function(message) {
  const keywords = Command.findKeywords(message);
  const name = message.author.username;

  if (keywords.length) {
    let results = findMatchingRewards(keywords);
    if (results.length) {
      results.unshift("**I can track the following items:**");
      sendMessage(results, message);
    } else {
      message.author.send("Sorry, I didn't find anything with that name.");
      console.log(`But I couldn't find it.`);
    }
  } else {
    message.author.send(["You have to tell me what to find!"]);
    console.log(`But they didn't search for anything.`);
  }
});

function findMatchingRewards(keywords) {
  let results = [];
  for (let reward in rewardsData) {
    let approvedItems = ["/lotus/storeitems/", "/lotus/types/items/"];
    approvedItems.forEach(function(prefix) {
      if (reward.indexOf(prefix) > -1) {
        let item = rewardsData[reward].value;
        if (
          item.toLowerCase().indexOf(keywords) > -1 &&
          results.indexOf(item) === -1
        ) {
          results.push(item);
        }
      }
    });
  }
  return results;
}

function sendMessage(results, message) {
  if (results.length > 60) {
    let truncatedMessage = results.splice(0, 60);
    message.author.send(truncatedMessage);
    sendMessage(results, message);
  } else if (results.length) {
    message.author.send(results);
  }
}
