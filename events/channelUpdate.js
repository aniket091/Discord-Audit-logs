const { channelType, format } = require('../util/util')
const { sendMessage } = require('../util/sendMessage') 
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
const client = require('../index')


client.on('channelUpdate', function(oldChannel, newChannel) {
  if (!newChannel.guild) return;

  let embed = new MessageEmbed()
  .setColor(config.blue || 'BLUE')
  .setTimestamp()
  .setDescription(`**📝 ${channelType(newChannel.type).replace('Unknown', '')} Updated!**`)

  if (oldChannel.name !== newChannel.name) {
    embed.addField('Renamed', `**${oldChannel.name}\u2000➡️\u2000${newChannel.name}**`)
  } 
  
  if (oldChannel.type !== newChannel.type) {
    embed.addField('Type', `**${channelType(oldChannel.type)}\u2000➡️\u2000${channelType(newChannel.type)}**`)
  } 
  
  if (oldChannel.topic !== newChannel.topic) {
    let oldTopic = oldChannel.topic?.length > 500 ? format(oldChannel.topic, 490) : oldChannel.topic;
    let newTopic = newChannel.topic?.length > 500 ? format(newChannel.topic, 490) : newChannel.topic;

    embed.addField('Topic',
    `\`${oldTopic === null ? 'None' : oldTopic}\`\u2000➡️\u2000\`${newTopic === null ? 'None' : newTopic}\``
    )
  }

  if (oldChannel.parent !== newChannel.parent) {
    embed.addField('Category',
    `**${oldChannel.parent.name}\u2000➡️\u2000${newChannel.parent.name}**`
    )
  }

  if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
    let oldsm = oldChannel.rateLimitPerUser === 0 ? 'Off' : oldChannel.rateLimitPerUser + 'seconds';
    let newsm = newChannel.rateLimitPerUser === 0 ? 'Off' : newChannel.rateLimitPerUser + 'seconds';

    embed.addField('Slowmode', `**${oldsm}\u2000➡️\u2000${newsm}**`)
  }

  if (oldChannel.bitrate !== newChannel.bitrate) {
    embed.addField('Bitrate',
    `**${oldChannel.bitrate/1000}kbps\u2000➡️\u2000${newChannel.bitrate/1000}kbps**`
    )
  }

  if (oldChannel.userLimit !== newChannel.userLimit) {
    embed.addField('User Limit',
    `**${oldChannel.userLimit || 'Unlimited'} Users\u2000➡️\u2000${newChannel.userLimit || 'Unlimited'} Users**`
    )
  }

  if (embed.fields.length === 0) return;
  return sendMessage(newChannel.guild, { embeds: [embed] })
});
