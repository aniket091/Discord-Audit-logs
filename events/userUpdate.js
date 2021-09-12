const { MessageEmbed, MessageAttachment } = require('discord.js')
const { sendMessage } = require('../util/sendMessage') 
const config = require('../config.json')
const client = require('../index')


client.on('guildMemberUpdate', function(oldMember, newMember) {
  if (oldMember.bot || newMember.bot || oldMember.equals(newMember)) return;

  let embeds = [];
  let oldAvatar = oldMember.user.displayAvatarURL({ dynamic: true })
  let newAvatar = newMember.user.displayAvatarURL({ dynamic: true })

  let name = `avatar${oldMember.user.avatar.startsWith('a_') ? '.gif' : '.png'}`
  let attachment = new MessageAttachment(oldAvatar, name) 

  let embed = new MessageEmbed()
  .setColor(config.orange || 'ORANGE')
  .setTimestamp()
  .setAuthor(oldMember.user.tag, oldAvatar)
  .setDescription(`**📝 <@!${newMember.user.id}> updated their profile!**`)
  .setThumbnail(`attachment://${name}`)

  if (oldAvatar !== newAvatar) {
    embed.addField('Avatar',
    `[**\[Before\]**](${oldAvatar})\u2000➡️\u2000[**\[After\]**](${newAvatar})`
    )
  }

  if (oldMember.user.username !== newMember.user.username) {
    embed.addField('Name',
    `**\`${oldMember.user.username}\`\u2000➡️\u2000\`${newMember.user.username}\`**`
    )
  }

  if (oldMember.user.discriminator !== newMember.user.discriminator) {
    embed.addField('Discriminator',
    `**#${oldMember.user.discriminator}\u2000➡️\u2000#${newMember.user.discriminator}**`
    )
  }
  if (embed.fields.length) embeds.push(embed)


  if (oldMember.nickname !== newMember.nickname) {
   
    embed.fields = [];
    embed.setDescription(`**📝 <@!${newMember.user.id}> Nickname changed**`)
    embed.addField('Old nickname', `\`${oldMember.nickname || 'None'}\``)
    embed.addField('New nickname', `\`${newMember.nickname || 'None'}\``)
    embeds.push(embed)
  }

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    let embed = new MessageEmbed()
    .setColor(config.red || 'RED')
    .setAuthor(oldMember.user.tag, oldAvatar)
    .setDescription(`**📝 <@!${newMember.user.id}> roles have changed!**`)
    .setThumbnail(oldAvatar)
    .setTimestamp()

    let roles = [];
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        roles.push('`' + role.name + '`')
      }
    })
    embed.addField('❌ Removed Roles', `**${roles.join(', ')}**`)
    embeds.push(embed)
  }

  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    let embed = new MessageEmbed()
    .setColor(config.green || 'GREEN')
    .setAuthor(oldMember.user.tag, oldAvatar)
    .setDescription(`**📝 <@!${newMember.user.id}> roles have changed!**`)
    .setThumbnail(oldAvatar)
    .setTimestamp()

    let roles = [];
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        roles.push('`' + role.name + '`')
      }
    })
    embed.addField('✅ Added Roles', `**${roles.join(', ')}**`)
    embeds.push(embed)
  }

  if (!embeds.length) return;
  return sendMessage(newMember.guild, { embeds: embeds, files: [attachment] })
});
