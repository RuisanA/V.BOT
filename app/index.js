const http = require("http");
const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
} = require("discord.js");
const moment = require("moment");
const express = require("express");
const app = express();
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const path = require("path");
const cron = require("node-cron");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767),
});
const {
  Modal,
  TextInputComponent,
  SelectMenuComponent,
  showModal,
} = require("discord-modals");
const discordModals = require("discord-modals");
discordModals(client);
const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};
process.env.TZ = "Asia/Tokyo";
("use strict");
let guildId;

http
  .createServer(function (request, response) {
    try {
      response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
      response.end(
        `ログイン`
      );
    } catch (e) {
      console.log(e);
    }
  })
  .listen(8080);

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error("tokenが設定されていません！");
  process.exit(0);
}

client.on("ready", (client) => {
  console.log(`ログイン: ${client.user.tag}`);
  client.user.setActivity({
    type: "PLAYING",
    name: `Develop by @rui06060`,
  });
  client.guilds.cache.size;
  client.user.setStatus("online");
});

client.once("ready", async () => {
  try {
    await client.application.commands.create({
      name: "実績",
      description: "実績送信機能",
      options: [
        {
          type: "CHANNEL",
          name: "チャンネル",
          description: "実績を送信するチャンネル",
          required: true,
          channel_types: [0],
        },
        {
          type: "USER",
          name: "記入者",
          description: "実績の記入者",
          required: true,
        },
        {
          type: "STRING",
          name: "商品名",
          description: "商品名",
          required: true,
        },
        {
          type: "INTEGER",
          name: "評価",
          description: "評価",
          required: true,
        },
        {
          type: "STRING",
          name: "コメント",
          description: "コメント",
          required: true,
        },
        {
          type: "INTEGER",
          name: "個数",
          description: "個数",
          required: true,
        },
      ],
    });
    console.log("コマンドを登録しました");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "実績") {

    if (!interaction.member.permissions.has("ADMINISTRATOR"))
        return interaction.reply({
          content: "サーバー管理者のみ使用可能です",
          ephemeral: true,
        });

    const targetChannel = interaction.options.getChannel("チャンネル");
    const author = interaction.options.getUser("記入者");
    const itemName = interaction.options.getString("商品名");
    const rating = interaction.options.getInteger("評価");
    const comment = interaction.options.getString("コメント");
    const quantity = interaction.options.getInteger("個数");

    const embed = {
      title: "✨実績報告",
      color: 0x00c4ff,
      thumbnail: {
      url: author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })
    },
      fields: [
        { name: "👤 記入者", value: `${author}`, inline: true },
        { name: "🛍️ 商品名", value: itemName, inline: true },
        { name: "📦 個数", value: `${quantity}個`, inline: true },
        { name: "⭐ 評価", value: "★".repeat(Math.min(Math.max(rating, 0), 10)) + ` (${rating})`, inline: false },
        { name: "📄 コメント", value: comment },
      ],
      timestamp: new Date(),
      footer: { text: `V.BOT｜Develop by @rui06060` },
    };

    try {
      await targetChannel.send({ embeds: [embed] });

      await interaction.reply({
        content: `${targetChannel} に実績の送信が完了しました`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "メッセージの送信中にエラーが発生しました。権限を確認してください。",
        ephemeral: true,
      });
    }
  }
});

process.on('uncaughtException', (error) => {
    console.error('未処理の例外:', error);
    fs.appendFileSync('error.log', `未処理の例外: ${error.stack}\n`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未処理の拒否:', reason);
    fs.appendFileSync('error.log', `未処理の拒否: ${reason}\n`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
