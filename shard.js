require('dotenv').config()
const { ShardingManager } = require('discord.js');

const { DISCORD_TOKEN } = process.env;

const manager = new ShardingManager('./index.js', { token: DISCORD_TOKEN, autoSpawn: true, respawn: true });

manager.spawn();
