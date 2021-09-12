const { sendMessage } = require('../util/sendMessage') 
const { MessageEmbed } = require('discord.js')
const { format } = require('../util/util')
const config = require('../config.json')
const client = require('../index')


client.on('messageUpdate', async function(oldMessage, newMessage) {
  if (oldMessage.author.bot || !oldMessage.guild) return;
  if (config.ignoredChannelsIds.includes(newMessage.channel.id)) return;

  let oldMsg = oldMessage.content?.length > 500 ? format(oldMessage.content, 500) : oldMessage.content;
  let newMsg = newMessage.content?.length > 500 ? format(newMessage.content, 490) : newMessage.content;

  let embed = new MessageEmbed()
  .setColor(config.orange || 'ORANGE')
  .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL({ dynamic: true }))
  .setDescription(`**📝 Message edit in <#${oldMessage.channel.id}> - [Jump to Message](${newMessage.url})**`)
  .setFooter(`User ID: ${newMessage.author.id}`)
  .addField('Old Message', oldMsg || 'Message has no content.')
  .addField('New Message', newMsg || 'Message has no content.')
  .setTimestamp()


  if (oldMessage.mentions.everyone !== newMessage.mentions.everyone) {
    embed.addField('Mentions Everyone', `**${oldMessage.mentions.everyone ? 'Yes' : 'No'}\u2000➡️\u2000${newMessage.mentions.everyone ? 'Yes' : 'No'}**`)
  }

  let files = '';
  if (oldMessage.attachments.size > newMessage.attachments.size) {
    oldMessage.attachments.forEach(image => {
      files += `[${image.name}](${image.url}) [**Alt Link**](${image.proxyURL})\n`
    })
    embed.setImage(oldMessage.attachments.first().url)
    embed.addField('❌ Removed Attachments', files)
  }

  if (oldMessage.attachments.size < newMessage.attachments.size) {
    newMessage.attachments.forEach(image => {
      files += `[${image.name}](${image.url}) [**Alt Link**](${image.proxyURL})\n`
    })
    embed.setImage(newMessage.attachments.first().url)
    embed.addField('✅ Added Attachments', files)
  }


  if (oldMessage.content === newMessage.content && embed.fields.length === 2) return;
  return sendMessage(newMessage.guild, { embeds: [embed] })
});