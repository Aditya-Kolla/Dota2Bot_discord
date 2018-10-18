var help = {};

help.show = (message) => {
    const outputs = [];
    outputs.push("\n");
    outputs.push("!me     - This command is used to setup your name and opendota ID with our database. It takes two arguments- name and the opendota ID.");
    outputs.push("!remove - This command removes your profile from our database. It takes no argument.");
    outputs.push("!ping   - Try this command for fun.");
    outputs.push("!medal  - This command prints your medal rating.");
    outputs.push("!MEDAL  - This is a global command. It is used to fetch the medal ratings of all players in DB.");
    outputs.push("!kda    - This command fetches your last game's Kill Death Assists.");
    outputs.push("!KDA    - This is a global command. It is used to fetch the last game's KDA of all registered players.");
    outputs.push("!wl     - This command fetches your overall win and loss percentage.");
    outputs.push("!WL     - This is a global command. It is used to fetch the win rate of all registered users.");
    outputs.push("!1v1    - This command takes two arguments- names of two registered users and puts them against each other. Calculating lifetime and recent games stats to declare one player as the winner. ");

    message.channel.send(outputs).catch(console.error);
};

module.exports = help;