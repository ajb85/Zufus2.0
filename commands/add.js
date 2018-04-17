const Command = require("../classes/Command.js");

const WFWS = require("warframe-worldstate-data");
const rewardsData = WFWS.languages;

module.exports = new Command("add", function(message) {
  const name = message.author.username;
  const keywords = Command.findKeywords(message);
  let results = findMatchingReward(keywords);

  //Triggers if everything went to plan.
  if (results.length === 1) {
    //Should be one result, so index zero.  Object.keys returns an array, so index zero
    let key = Object.keys(results[0])[0];
    let dataToSave = updateUserWatchlist(message.author.id, results[0][key]);
    Command.updateWatchlist(dataToSave);
    message.author.send([`I added **${results[0][key]}** to your watchlist.`]);

    //Triggers if there's an issue and more than one item was found.
  } else if (results.length > 1) {
    message.author.send([
      "Oops, I found too many items.  Tell Sham what you did so I can be fixed!"
    ]);
    console.log(`${name} found too many items: ${JSON.stringify(results)}`);

    //Triggers when nothing is found, ie bad input
  } else {
    message.author.send(["Sorry, I couldn't find anything with that name."]);
    console.log(`It failed.`);
  }
});

function updateUserWatchlist(user, key) {
  const savedWatchlists = require("../serverData/userWishlists.json");
  let existingWatchlist = savedWatchlists[user].Rewards;
  if (!existingWatchlist) {
    savedWatchlists[user].Rewards = { [key.toLowerCase()]: true };
  } else if (!existingWatchlist[key]) {
    savedWatchlists[user].Rewards[key.toLowerCase()] = true;
  }
  return savedWatchlists;
}

function findMatchingReward(keywords) {
  let approvedItems = ["/lotus/storeitems/", "/lotus/types/items/"];
  let results = [];
  let rewardsList = [];
  for (let reward in rewardsData) {
    approvedItems.forEach(function(prefix) {
      if (reward.indexOf(prefix) > -1) {
        let item = rewardsData[reward].value;
        if (
          item.toLowerCase() === keywords &&
          rewardsList.indexOf(item) === -1
        ) {
          let dataToSave = { [reward]: item };
          results.push(dataToSave);
          rewardsList.push(item);
        }
      }
    });
  }
  return results;
}
