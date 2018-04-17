const fs = require("fs");
const savedWatchlists = require("../serverData/userWishlists.json");

class Command {
  constructor(commandWord, action) {
    this.commandWord = commandWord;
    this.action = action;
  }
  static findKeywords(message) {
    let keywordsArr = message.cleanContent.toLowerCase().split(" ");
    keywordsArr.shift();
    const keywords = keywordsArr.join(" ");
    return keywords;
  }

  static updateUsage(command, user) {}

  static updateWatchlist(dataToSave) {
    fs.writeFile(
      "./serverData/userWishlists.json",
      JSON.stringify(dataToSave),
      "utf8",
      err => {
        if (err) throw err;
      }
    );
  }

  static capitalizeArrayOfStrings(lowerCaseList) {
    let capitalizedString = [];
    //userWatchlist {reward: true, reward2: true};
    lowerCaseList.forEach(function(string) {
      let words = string.split(" ");
      //words ["orokin", "reactor", "blueprint"]
      words.forEach(function(word, i) {
        words[i] = word.charAt(0).toUpperCase() + word.substr(1);
      });
      capitalizedString.push(words.join(" "));
    });
    return capitalizedString.sort();
  }

  static noWatchlist(author) {
    author.send([
      "You don't have a watchlist yet!\nHere's how you can create and update yours:\n\n**!zufus find NAME** I'll let you know what I can track under this name.  Try '__!zufus add orokin reactor__', for example\n**!zufus add NAME** - I'll let you know when there's an active missions for this reward.  Tip: Try using 'find' first and copying the name to be sure it's correct!\n**!zufus remove NAME** - I'll stop notifying you when missions for this item pop up.  Tip: Copy the name from your watchlist to make sure it's correct\n\nYou can always type __!zufus help__ for more info!"
    ]);
  }
}
module.exports = Command;
