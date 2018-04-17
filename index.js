process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.log("Zufus starting");
const path = require("path");
const Discord = require("discord.js");
const zufus = new Discord.Client();
const CommandList = require("./classes/CommandList.js");
const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufusLoops = require("./fetchData.js");
let repeatFrequency = 60000;

zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
  zufusLoops(zufus);
  setInterval(loopDaZufus, repeatFrequency);
});

zufus.on("message", message => {
  if (!message.author.equals(zufus.user)) {
    const commands = new CommandList("../commands");
    commands.createUserCommandList(message);
  }
});

function loopDaZufus() {
  //console.log("Looping da Zufus");
  zufusLoops(zufus);
}

zufus.login(API_TOKEN.trim());
