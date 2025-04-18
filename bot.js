const { Client, GatewayIntentBits } = require('discord.js');
const https = require('https');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  const data = JSON.stringify({
    content: message.content,
    author: message.author.username,
    channel: message.channel.name,
    timestamp: message.createdAt
  });

  const url = new URL(webhookUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (err) => {
    console.error('Error sending to webhook:', err);
  });

  req.write(data);
  req.end();
});

client.login(process.env.DISCORD_BOT_TOKEN);
