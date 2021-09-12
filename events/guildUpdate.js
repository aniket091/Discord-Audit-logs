const { sendMessage } = require('../util/sendMessage') 
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
const client = require('../index')

client.on('guildUpdate', function(oldGuild, newGuild) {

  let embed = new MessageEmbed()
  .setDescription('**📝 Server Information Updated!**')
  .setColor(config.orange || 'ORANGE')
  .setTimestamp()
  .setThumbnail(newGuild.iconURL())

  if (oldGuild.iconURL() !== newGuild.iconURL()) {
    embed.addField('Icon', `[**\[Before\]**](${oldGuild.iconURL()})\u2000➡️\u2000[**\[After\]**](${newGuild.iconURL()})`)
  }

  if (oldGuild.name !== newGuild.name) {
    embed.addField('Name', `**\`${oldGuild.name}\`\u2000➡️\u2000\`${newGuild.name}\`**`)
  }

  if (oldGuild.afkTimeout !== newChannel.afkTimeout) {
    embed.addField('Afk Timeout', `**${oldGuild.afkTimeout/60} minutes\u2000➡️\u2000${newGuild.afkTimeout/60} minutes**`)
  }

  if (oldGuild.afkChannel !== newChannel.afkChannel) {
    embed.addField('Afk Channel', `**<#${oldGuild.afkChannel.id}>\u2000➡️\u2000<#${newGuild.afkChannel.id}>**`)
  }

  if (!embed.fields.length) return;
  return sendMessage(newMember.guild, { embeds: embeds })
});