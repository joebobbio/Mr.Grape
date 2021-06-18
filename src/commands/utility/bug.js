const { Command, Embed } = require("../../../lib");

module.exports =
    class extends Command {
        constructor(...args) {
            super(...args, {
                name: "bugreport",
                type: "utility",
                description: "Report a bug.",
                usage: "<bug>",
                aliases: ["bug"],
                saying: "Surely we aren't that buggy.",
                cooldown: 20
            });
        }

        async main(msg) {
            const bug = msg.params.join(" ");

            if (bug.length < 15) return msg.send("Your bug is too short. It has to be at least 15 characters long.");
            else if (bug.length > 1800) return msg.send("Your bug report is too long. It must be shorter than 1800 characters.");

            const channel = await this.client.channels.fetch(this.client.config.defaultChannels.bugs);

            const bugEmbed = new Embed()
                .setTitle("Bug Report")
                .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: "Author", value: `Username: ${msg.author.username}\nID: ${msg.author.id}`, inline: true },
                    { name: "Guild", value: msg.guild.name, inline: true },
                    { name: "Bug", value: bug }
                );
            channel.send(bugEmbed);

            const bugSentEmbed = new Embed()
                .setTitle("Bug Report Sent!")
                .addField("\u200b", `View your bug report [here](${this.client.config.serverInvite})`);
            msg.send(bugSentEmbed);
        }
    };
