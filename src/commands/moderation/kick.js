const { ModerationCommand } = require("../../../lib");

module.exports =
    class extends ModerationCommand {
        constructor(...args) {
            super(...args, {
                name: "kick",
                type: "moderation",
                aliases: ["boot"],
                description: "Kick people.",
                usage: "<mention|user ID>",
                cooldown: 2,
                saying: "Don't spam this command.",
                requiredPermissions: ["KICK_MEMBERS"]
            });
        }

        async main(msg) {
            if (!msg.params[0]) return msg.send("Who should I kick?");
            const target = msg.mentions.members.first() || await msg.guild.members.fetch(msg.params[0]);

            if (!target) return msg.send("That's not a valid user!");
            else if (msg.author.id === target.id) return msg.send("You can't kick yourself!");
            else if (this.client.user.id === target.id) return msg.send("bye") && await msg.guild.leave();
            else if (!target.kickable) return msg.send("That isn't a kickable user!");

            const reason = msg.params.slice(1).join(" ");

            target.kick(reason);

            msg.send(`:wave: ${target.user.username} has been kicked.\nReason: ${reason}`);

            target.send(`You were kicked from \`${msg.guild.name}\` for \`${reason}\``).catch(() => null);
        }
    };
