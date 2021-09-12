const { MessageEmbed, MessageAttachment } = require('discord.js')
const { sendMessage } = require('./util/sendMessage') 
const { channelType } = require('./util/util')
const config = require('./config.json')
const client = require('./index')
const dayjs = require('dayjs')


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  //  COMMAND  STUFF !!
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);
  if (!prefixRegex.test(message.content.toLowerCase())) return;

  const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    return message.reply(`🏓 Pong! \`${Math.round(client.ws.ping)}\` ms.`)
  } 
  else if (command === 'clean') {
    message.channel.bulkDelete(5);
  }
})


client.on('channelCreate', function(channel) {
  if (!channel.guild) return;
  if (channel.type.includes('THREAD')) return;

  let embed = new MessageEmbed()
  .setDescription(`**🆕 Channel Created!**`)
  .addField('Name', '**#' + channel.name + '**')
  .addField('Type', `**${channelType(channel.type)}**`)
  .setColor(config.green || 'GREEN')
  .setFooter('Channel ID: ' + channel.id)
  .setTimestamp()

  return sendMessage(channel.guild, { embeds: [embed] })
});


client.on('channelDelete', function(channel) {
  if (!channel.guild) return;
  if (channel.type.includes('THREAD')) return;

  let embed = new MessageEmbed()
  .setDescription('**🗑️ Channel Deleted!**')
  .addField('Name', '**#' + channel.name + '**')
  .addField('Type', `**${channelType(channel.type)}**`)
  .setColor(config.red || 'RED')
  .setFooter('Channel ID: ' + channel.id)
  .setTimestamp()

  return sendMessage(channel.guild, { embeds: [embed] })
});


client.on('channelPinsUpdate', function(channel, time) {
  if (!channel.guild) return;

  let embed = new MessageEmbed()
  .setColor(config.blue || 'BLUE')
  .setFooter('Channel ID: ' + channel.id)
  .setTimestamp()
  .setDescription(
    `**📌 Pins Updated\n\nPins of the \`#${channel.name}\` got updated at** <t:${dayjs(time).unix()}:R>**.**`
  )

  return sendMessage(channel.guild, { embeds: [embed] })
});


client.on('emojiCreate', function(emoji) {

  let embed = new MessageEmbed()
  .setColor(config.green || 'GREEN')
  .setDescription(
    `**😄 Server Emoji Added!\n\nWe have new emoji in the server (${emoji})\u2000\`:${emoji.name}:\`**`
  )
  .setFooter(emoji.guild.name)
  .setTimestamp()

  return sendMessage(emoji.guild, { embeds: [embed] })
});


client.on('emojiDelete', function(emoji) {
  let name = `emoji${emoji.animated ? '.gif' : '.png'}`
  let attachment = new MessageAttachment(emoji.url, name)

  let embed = new MessageEmbed()
  .setColor(config.red || 'RED')
  .setDescription(
    `**✏️ Server Emoji Removed!\n\nEmoji \`${emoji.name}\` got removed from the server.**`
  )
  .setFooter(emoji.guild.name)
  .setThumbnail(`attachment://${name}`)
  .setTimestamp()

  return sendMessage(emoji.guild, { embeds: [embed], files: [attachment] })
});


client.on('emojiUpdate', function(oldEmoji, newEmoji) {

  let embed = new MessageEmbed()
  .setColor(config.orange || 'ORANGE')
  .setDescription(`**😋 Server Emoji Name Updated!**`)
  .addField('Before', `**\`${oldEmoji.name}\`**`, true)
  .addField('After', `**\`${newEmoji.name}\`**`, true)
  .setTimestamp()

  return sendMessage(newEmoji.guild, { embeds: [embed] })
});


client.on('guildBanAdd', function(guild, user) {

  let embed = new MessageEmbed()
  .setAuthor('Member Banned', user.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
  .setDescription(
    `**🔒 ${user.username} (\`${user.id}\`) is now banned from the server.**`
  )
  .setFooter('User ID: ' + user.id)
  .setColor(config.red || 'RED')
  .setTimestamp()

  return sendMessage(guild, { embeds: [embed] })
});


client.on('guildBanRemove', function(guild, user) {

  let embed = new MessageEmbed()
  .setAuthor('Member Unbanned', user.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
  .setDescription(
    `**🔓 ${user.username}(\`${user.id}\`) is now unbanned from the server.**`
  )
  .setFooter('User ID: ' + user.id)
  .setColor(config.green || 'GREEN')
  .setTimestamp()

  return sendMessage(guild, { embeds: [embed] })
});


client.on('guildMemberAdd', function(member) {
  let time = dayjs(member.user.createdAt).unix();
  
  let embed = new MessageEmbed()
  .setAuthor('Member Joined', member.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
  .setColor(config.green || 'GREEN')
  .setDescription(`📥 <@!${member.user.id}> **${member.user.tag}** (\`${member.id}\`)`)
  .addField('Created At', `<t:${time}:D>\u2000(<t:${time}:R>)`)
  .setFooter('Member Joined')
  .setTimestamp()


  return sendMessage(member.guild, { embeds: [embed] })
});


client.on('guildMemberRemove', function(member) {
  let time = dayjs(member.user.createdAt).unix();

  let embed = new MessageEmbed()
  .setAuthor('Member Left', member.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
  .setColor(config.red || 'RED')
  .setDescription(`📤 <@!${member.user.id}> **${member.user.tag}** (\`${member.id}\`)`)
  .addField('Created At', `<t:${time}:D>\u2000(<t:${time}:R>)`)
  .addField('Roles', member.roles.cache.filter(f => f.name !== '@everyone').map(r => `<@&${r.id}>`).join(' '))
  .setFooter('Member Left')
  .setTimestamp()

  return sendMessage(member.guild, { embeds: [embed] })
});


client.on('guildMembersChunk', function(members, guild) {
  
  let embed = new MessageEmbed()
  .setAuthor('Alert: Member Chunk Received!')
  .setColor('YELLOW')
  .setDescription(
    `**⚠️ A large number of members just joined the server from \`${guild.name}\` Guild**`
  )

  return sendMessage(members.guild, { embeds: [embed] })
});


client.on('messageDelete', async function(message) {
  if (message.author.bot || !message.guild) return;
  if (config.ignoredChannelsIds.includes(message.channel.id)) return;

  let embed = new MessageEmbed()
  .setColor(config.red || 'RED')
  .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
  .setFooter(`Message ID: ${message.id}`)
  .setTimestamp()

  if (message.partial) {
    return sendMessage(message.guild, { embeds: [embed] })
  }

  if (message.content && message.content.length > 700) message.content = message.content.slice(0, 700) + '...';
  embed.setDescription(`**✂️ Message deleted in <#${message.channel.id}>**\n\n${message.content || '**Message has no content.**'}`)

  let files = '';
  if (message.attachments.size) {
    message.attachments.forEach(image => {
      files += `[${image.name}](${image.url}) [**Alt Link**](${image.proxyURL})\n`
    })
    embed.setImage(message.attachments.first().url)
    embed.addField('Attachments', files, true)
  }
  if (message.pinned) embed.addField('Pinned', `\`true\``, true)

  if (message.mentions.everyone) {
    embed.addField('Mentions Everyone', `**Yes**`)
  }

  return sendMessage(message.guild, { embeds: [embed] })
});


client.on('messageDeleteBulk', function(messages) {
  if (config.ignoredChannelsIds.includes(messages.first().channel.id)) return;

  let embed = new MessageEmbed()
  .setColor(config.red || 'RED')
  .setAuthor(messages.first().guild.name, messages.first().guild.iconURL())
  .setDescription(`**✂️ Bulk Delete in <#${messages.first().channel.id}>, ${messages.size} messages deleted.**`)
  .setTimestamp()

  return sendMessage(messages.first().guild, { embeds: [embed] })
});


client.on('roleCreate', function(role) {

  let embed = new MessageEmbed()
  .setColor(config.green || 'GREEN')
  .setAuthor(role.guild.name, role.guild.iconURL())
  .setDescription(`**⚔️ Role Created: ${role.name}**`)
  .addField('Role Color', `**${role.hexColor}**`)
  .setFooter(`Role ID: ${role.id}`)
  .setTimestamp()

  return sendMessage(role.guild, { embeds: [embed] })
});


client.on('roleDelete', function(role) {
  
  let embed = new MessageEmbed()
  .setColor(config.red || 'RED')
  .setAuthor(role.guild.name, role.guild.iconURL())
  .setDescription(`**🗑️ Role Deleted: ${role.name}**`)
  .addField('Role Color', `**${role.hexColor}**`, true)
  .addField('Hoisted', role.hoist ? '`Yes`' : '`No`', true)
  .addField('Mentionable', role.mentionable ? '`Yes`' : '`No`', true)
  .setFooter(`Role ID: ${role.id}`)
  .setTimestamp()

  return sendMessage(role.guild, { embeds: [embed] })
});