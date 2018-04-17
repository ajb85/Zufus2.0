const Command = require("../classes/Command.js");
const savedWatchlists = require("../serverData/userWishlists.json");

module.exports = new Command("remove", function(message) {
  const keywords = Command.findKeywords(message);
  const name = message.author.username;
  const user = message.author.id;
  let ssKeywords = findSuperStrings(keywords, user);

  if (!savedWatchlists[user].Rewards) {
    Command.noWatchlist(message.author);
    console.log(`But they have no watchlist`);
  } else if (!ssKeywords.length) {
    message.author.send(`I did not find **${keywords}** on your watchlist.`);
    console.log(`But I didn't find it.`);
  } else {
    let removed = [];
    ssKeywords.forEach(function(word) {
      removed.push(word);
      delete savedWatchlists[user].Rewards[word];
    });
    Command.updateWatchlist(savedWatchlists);
    let capitalRemoved = Command.capitalizeArrayOfStrings(removed);
    capitalRemoved.unshift("I removed the following from your watchlist:");
    message.author.send(capitalRemoved);
  }
});

function findSuperStrings(keywords, user) {
  let ssKeywords = [];
  for (let reward in savedWatchlists[user].Rewards) {
    if (reward.indexOf(keywords) > -1) {
      ssKeywords.push(reward);
    }
  }
  return ssKeywords;
}
