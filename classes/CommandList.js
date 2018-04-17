const requireDir = require("requiredir");

class CommandList {
  constructor(dir) {
    this.commands = requireDir(dir);
  }

  createUserCommandList(message) {
    let command = this.parseMessage(message);
    if (command) {
      let handler = this.commands[command];
      if (handler) {
        handler.action(message);
      }
    }
  }

  parseMessage(message) {
    const botKeyword = "!zufus";
    let content = message.cleanContent.toLowerCase().split(" ");
    let command;
    if (message.channel.type !== "dm" && content[0] !== botKeyword) {
      return;
    }
    if (content[0] === botKeyword) {
      content.shift();
    }
    if (this.commands[content[0]]) {
      command = content[0];
    }
    CommandList.consoleLog(message.author.username, content);
    return command;
  }

  static consoleLog(name, messageContent) {
    let command = messageContent.splice(0, 1)[0];
    let keywords = messageContent.join(" ");
    switch (command) {
      case "add":
        console.log(
          `${name} is trying to add "${keywords}" to their watchlist.`
        );
        break;
      case "remove":
        console.log(
          `${name} is trying to remove "${keywords}" from their watchlist.`
        );
        break;
      case "watchlist":
        console.log(`${name} is checking their watchlist.`);
        break;
      case "help":
        console.log(`${name} needs help.`);
        break;
      case "find":
        console.log(`${name} is trying to find ${keywords}.`);
    }
  }
}
module.exports = CommandList;
