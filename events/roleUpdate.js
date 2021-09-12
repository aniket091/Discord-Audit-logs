const { sendMessage } = require('../util/sendMessage') 
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
const client = require('../index')


client.on('roleUpdate', function(oldRole, newRole) {

  let embed = new MessageEmbed()
  .setColor(config.orange || 'ORANGE')
  .setAuthor(oldRole.guild.name, oldRole.guild.iconURL())
  .setDescription(`**📝 Role updated: <@&${oldRole.id}>**`)
  .setFooter(`Role ID: ${oldRole.id}`)
  .setTimestamp()

  if (oldRole.name !== newRole.name) {
    embed.addField('Name', `**${oldRole.name}\u2000➡️\u2000${newRole.name}**`)
  }

  if (oldRole.hexColor !== newRole.hexColor) {
    embed.setColor(newRole.hexColor)
    embed.addField('Color', `**${oldRole.hexColor}\u2000➡️\u2000${newRole.hexColor}**`)
  }

  if (oldRole.hoist !== newRole.hoist) {
    embed.addField('Hoisted', `${oldRole.hoist ? '`Yes`' : '`No`'}\u2000➡️\u2000${newRole.hoist ? '`Yes`' : '`No`'}`)
  }

  if (oldRole.mentionable !== newRole.mentionable) {
    embed.addField('Hoisted', `${oldRole.mentionable ? '`Yes`' : '`No`'}\u2000➡️\u2000${newRole.mentionable ? '`Yes`' : '`No`'}`)
  }

  let added_perms = [];
  let removed_perms = [];
  oldRole.permissions.toArray().forEach(perm => {
    if (!newRole.permissions.has(perm)) {
      removed_perms.push(perm)
    }
  })
  newRole.permissions.toArray().forEach(perm => {
    if (!oldRole.permissions.has(perm)) {
      added_perms.push(perm)
    }
  })

  if (added_perms.length) {
    embed.addField('✅ Allowed Permissions', added_perms.map(p => p.replace(/_/g, ' ').toLowerCase()).join(', '))
  }

  if (removed_perms.length) {
    embed.addField('❌ Denied Permissions', removed_perms.map(p => p.replace(/_/g, ' ').toLowerCase()).join(', '))
  }

  if (!embed.fields.length) return;
  return sendMessage(oldRole.guild, { embeds: [embed] })
});