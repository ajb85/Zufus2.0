const Command = require("../classes/Command.js");

module.exports = new Command("help", function(message) {
  let name = message.author.username;
  let embedData = createEmbedData();
  let embed = createEmbed(embedData);
  message.author.send(embed);
});

function createEmbedData() {
  return [
    {
      name: "_Watchlist_",
      value:
        "I will send you a list of what you're currently tracking.  When an item is on your watchlist and I spot a mission with what you're looking for, I'll automatically send you a private message about it.  I can see missions a couple minutes before they appear so if I just told you about a mission but you don't see it active, just give it time.\nExample: _!zufus watchlist_"
    },
    {
      name: "_Find_",
      value:
        "I will tell you what items I can track that match your keywords.  I can track all sorts of stuff, admittedly some of it is worthless.  However, if there's something you want, add the keywords after find and I'll let you know anything I can track under that name.  Be as specific as you can or you might get a lot of results.\nExample: _!zufus find orokin reactor_"
    },
    {
      name: "_Add_",
      value:
        "Adds an item to your watchlist.  The name needs to be exact so if you're unsure, I'd try using _find_ first and then copying the result you want.\nExample: _!zufus add orokin reactor blueprint_"
    },
    {
      name: "_Remove_",
      value:
        "Removes any items containing the keywords.  If you remove _orokin reactor_, both the item and the blueprint will be removed.\nExample: _!zufus remove nitain_"
    }
  ];
}

function createEmbed(embedData) {
  return {
    embed: {
      description:
        "I will always private message you to communicate.\n\nWhen using commands in a public channel,  you must start a command with !zufus or I will ignore you.  However, when messaging directly, you can drop !zufus and just use the commands directly (though either will work).\n\nCommands are not case sensitive.\n",
      url: "https://discordapp.com",
      color: 7463839,
      timestamp: "2018-04-16T01:05:41.221Z",
      footer: {
        text: "@Zufus News"
      },
      author: {
        name: "Zufus Commands",
        icon_url: ""
      },
      fields: embedData
    }
  };
}
