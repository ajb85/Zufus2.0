const Command = require("../classes/Command.js");
const watchlists = require("../serverData/userWishlists.json");

module.exports = new Command("watchlist", function(message) {
  let user = message.author.id;
  let wishlistCategories = watchlists[user];
  //If user has a watchlist, format: {"userID": {"Rewards": {reward1: true}, "Fissures": {type1:true}}
  if (wishlistCategories) {
    let embedData = createEmbedData(wishlistCategories);
    let embed = createEmbed(message.author, embedData);
    message.author.send(embed);
  } else {
    //Or they don't have one and they're taught how to make one
    console.log("But they don't have one");
    Command.noWatchlist(message.author);
  }
});

function createEmbedData(wishlist) {
  let embedData = [];
  for (let trackingCategory in wishlist) {
    let rewardsArray = capitalizeRewards(wishlist[trackingCategory]);
    //Shouldn't occur, but in case a user deletes the last item of a Category
    //But the category isn't correctly deleted
    if (!rewardsArray.length) {
      rewardsArray = ["Nothing to show :("];
    }

    embedData.push({
      name: trackingCategory,
      value: rewardsArray.join("\n")
    });
  }
  return embedData;
}

function capitalizeRewards(capitalizeList) {
  let capitalizedString = [];
  //userWatchlist {reward: true, reward2: true};
  for (let reward in capitalizeList) {
    let words = reward.split(" ");
    //words ["orokin", "reactor", "blueprint"]
    words.forEach(function(word, i) {
      words[i] = word.charAt(0).toUpperCase() + word.substr(1);
    });
    capitalizedString.push(words.join(" "));
  }
  return capitalizedString.sort();
}

function createEmbed(user, embedData) {
  var embed = {
    embed: {
      color: 6502371,
      timestamp: new Date(),
      footer: {
        text: "Watchlist commands: !zufus add, !zufus remove, !zufus find"
      },
      author: {
        name: `${user.username}'s Watchlist`,
        icon_url: user.avatarURL
      },
      fields: embedData
    }
  };
  return embed;
}
