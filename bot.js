const fetch = require('node-fetch');  // For CommonJS (if using require)
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  try {
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message.content,
        author: message.author.username,
        channel: message.channel.name,
        timestamp: message.createdAt,
      }),
    });
  } catch (err) {
    console.error('Error sending to webhook:', err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
