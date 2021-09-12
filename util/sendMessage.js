const { logChannelID, guildID } = require('../config.json')
const client = require('../index')

module.exports = {
  async sendMessage(guild, content) {
    if (guild.id !== guildID) return;

    const channel = client.channels.cache.get(logChannelID)
    if (!channel) throw new SyntaxError('LOG Channel not found!')

    const perms = channel.permissionsFor(client.user);
    if (!perms.has('MANAGE_WEBHOOKS')) throw new SyntaxError(`Audit_Logger: Missing Permission to Manage Webhooks in ${channel.name}`)

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(w => w?.owner?.id === client.user.id)

    if (!webhook) {
      webhook = await channel.createWebhook(client.user.username || 'Audit Logger', {
        avatar: client.user.displayAvatarURL({ dynamic: true }) || guild.iconURL({ format: 'png' })
      }).catch(r => {})
    }

    if (!webhook) throw new SyntaxError(`Audit_Logger: Unable to create Webhook in Log Channel.`)

    webhook.send(content)
  }
}