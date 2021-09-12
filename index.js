const { Client } = require('discord.js')
const config = require('./config.json')
const { readdirSync } = require('fs');

const client = new Client({
  restTimeOffset: 0,
  intents: 32767,
})

module.exports = client;
client.config = config;


client.on('ready', async () => {
  console.log(`: ${client.user.tag} is up and ready to go!`);
  console.log(': Audit Logger module loaded!')
  client.user.setActivity('with Logs! 📝', { type: 'PLAYING' });
})

client.on('warn', (info) => console.log(info))
client.on('error', console.error);

const events = readdirSync('./events').filter(file => file.endsWith('.js'));
for (let file of events) {
  require(`./events/${file}`)
}
require('./audit_logger')


client.login(config.token);
