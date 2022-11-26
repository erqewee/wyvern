import {
  ButtonStyle, ChannelType, PermissionsBitField,
  EmbedBuilder, SelectMenuBuilder, ButtonBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, AttachmentBuilder, SlashCommandBuilder
} from "discord.js";

import { Data, Emoji } from "../../config/export.js";

import {
  UserManager, GuildManager,
  MessageManager, EmojiManager,
  ChannelManager, InviteManager,
  VoiceManager, MemberManager,
  RoleManager, WebhookManager
} from "../../api/export.js";

import { LoaderCache } from "../classes/Loader/LoaderCache.js";


export class Manager {
  constructor() {
    this.client = global.client;

    this.Embed = EmbedBuilder;
    this.Button = ButtonBuilder;
    this.Row = ActionRowBuilder;
    this.TextInput = TextInputBuilder;
    this.Modal = ModalBuilder;
    this.Menu = SelectMenuBuilder;
    this.Attachment = AttachmentBuilder;

    this.SlashCommand = SlashCommandBuilder;

    this.TextInputStyle = TextInputStyle;
    this.ChannelType = ChannelType;
    this.ButtonStyle = ButtonStyle;
    this.Permissions = PermissionsBitField.Flags;

    this.config = {
      Data: Data,
      Emoji: Emoji
    };


    this.guilds = new GuildManager();
    this.emojis = new EmojiManager(this.client);
    this.messages = new MessageManager();
    this.connections = new VoiceManager(this.client);
    this.users = new UserManager();
    this.channels = new ChannelManager();
    this.invites = new InviteManager();
    this.members = new MemberManager();
    this.roles = new RoleManager(this.client);
    this.webhooks = new WebhookManager();

    this.commands = {
      cache: LoaderCache
    };

    this.pagination = async function (interaction, { embeds, buttons }) {
      if (!embeds && !Array.isArray(embeds)) embeds = [];
      if (!buttons && !Array.isArray(buttons)) buttons = [];
      
      const first = new this.Button({
        style: ButtonStyle.Secondary,
        emoji: { name: "Pagination_First", id: "1042498687533846528" },
        customId: "0",
      });

      const prev = new this.Button({
        style: ButtonStyle.Primary,
        emoji: { name: "Pagination_Previous", id: "1042498269013622844" },
        customId: "1",
      });

      const del = new this.Button({
        style: ButtonStyle.Danger,
        emoji: { name: "Pagination_Delete", id: "1042498264517312582" },
        customId: "2",
      });

      const next = new this.Button({
        style: ButtonStyle.Primary,
        emoji: { name: "Pagination_Next", id: "1042498266765471814" },
        customId: "3",
      });

      const last = new this.Button({
        style: ButtonStyle.Secondary,
        emoji: { name: "Pagination_Last", id: "1042498633532186695" },
        customId: "4",
      });

      const buttonsRow = new this.Row({
        components: [first, prev, del, next, last]
      });

      let currentPage = 0;

      const disableFirst = ButtonBuilder.from(first).setDisabled(true).setStyle(ButtonStyle.Danger);
      const disableLast = ButtonBuilder.from(last).setDisabled(true).setStyle(ButtonStyle.Danger);
      const disablePrev = ButtonBuilder.from(prev).setDisabled(true).setStyle(ButtonStyle.Danger);
      const disableNext = ButtonBuilder.from(next).setDisabled(true).setStyle(ButtonStyle.Danger);

      const styledDelete = ButtonBuilder.from(del).setStyle(ButtonStyle.Success);

      const components = [
        new ActionRowBuilder({
          components: [
            currentPage === 0 ? disableFirst : first,
            currentPage === 0 ? disablePrev : prev,
            currentPage === 0 || embeds.length - 1 ? styledDelete : del,
            currentPage === embeds.length - 1 ? disableNext : next,
            currentPage === embeds.length - 1 ? disableLast : last
          ]
        })
      ];
      components.concat(buttons);

      let sendMessage;

      if (embeds.length === 0) {
        if (interaction.deffered) {
          return interaction.followUp({ embeds: [embeds[0]], components });
        } else {
          sendMessage = interaction.replied ? await interaction.editReply({ embeds: [embeds[0]], components }) : await interaction.reply({ embeds: [embeds[0]], components });
        };
      };

      embeds = embeds.map((embed, _index) => {
        const INDEX = (_index + 1);

        return embed.setFooter({ text: `Toplam: ${embeds.length} | Görüntülenen: ${INDEX} | Kalan: ${embeds.length - INDEX}`, iconURL: interaction.guild?.iconURL() });
      });

      if (interaction.deffered) {
        sendMessage = await interaction.followUp({ embeds: [embeds[0]], components });
      } else {
        sendMessage = interaction.replied ? await interaction.editReply({ embeds: [embeds[0]], components }) : await interaction.reply({ embeds: [embeds[0]], components });
      };

      let filter = async (m) => {
        const components = [new ActionRowBuilder({ components: [del] })];

        let msg;

        if (m.member.id !== interaction.member.id) msg = await interaction.followUp({ content: `${this.config.Emoji.State.ERROR} ${m.member}, Bu işlemleri gerçekleştiremezsin.`, components });

        await msg?.createMessageComponentCollector().on("collect", async (i) => {
          if (!i.isButton()) return;

          await i.deferUpdate().catch(() => { });

          if (i.customId === "2") msg.delete();
        });

        return m.member.id === interaction.member.id;
      };

      const collector = await sendMessage.createMessageComponentCollector({ filter });

      collector.on("collect", async (i) => {
        if (!i.isButton()) return;

        await i.deferUpdate().catch(() => { });

        switch (i.customId) {
          case "0": {
            currentPage = 0;

            const components = [
              new ActionRowBuilder({
                components: [
                  currentPage === 0 ? disableFirst : first,
                  currentPage === 0 ? disablePrev : prev,
                  currentPage === 0 ? styledDelete : del,
                  currentPage === embeds.length - 1 ? disableNext : next,
                  currentPage === embeds.length - 1 ? disableLast : last
                ]
              })
            ];
            components.concat(buttons);

            await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });

            break;
          };
          case "1": {
            if (currentPage !== 0) {
              currentPage--;

              const components = [
                new ActionRowBuilder({
                  components: [
                    currentPage === 0 ? disableFirst : first,
                    currentPage === 0 ? disablePrev : prev,
                    currentPage === 0 ? styledDelete : del,
                    currentPage === embeds.length - 1 ? disableNext : next,
                    currentPage === embeds.length - 1 ? disableLast : last
                  ]
                })
              ];
              components.concat(buttons);

              await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
            } else {
              currentPage = (embeds.length - 1);

              const components = [
                new ActionRowBuilder({
                  components: [
                    currentPage === 0 ? disableFirst : first,
                    currentPage === 0 ? disablePrev : prev,
                    currentPage === 0 ? styledDelete : del,
                    currentPage === embeds.length - 1 ? disableNext : next,
                    currentPage === embeds.length - 1 ? disableLast : last
                  ]
                })
              ];
              components.concat(buttons);

              await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
            };

            break;
          };
          case "2": {
            components[0].components.map((btn) => {
              btn.setDisabled(true);
              btn.setStyle(this.ButtonStyle.Secondary)
            });

            await sendMessage.edit({
              embeds: [embeds[currentPage]],
              components
            }).catch(() => { });

            break;
          };
          case "3": {
            if (currentPage < (embeds.length - 1)) {
              currentPage++;

              const components = [
                new ActionRowBuilder({
                  components: [
                    currentPage === 0 ? disableFirst : first,
                    currentPage === 0 ? disablePrev : prev,
                    currentPage === embeds.length - 1 ? styledDelete : del,
                    currentPage === embeds.length - 1 ? disableNext : next,
                    currentPage === embeds.length - 1 ? disableLast : last
                  ]
                })
              ];
              components.concat(buttons);

              await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
            } else {
              currentPage = 0;

              const components = [
                new ActionRowBuilder({
                  components: [
                    currentPage === 0 ? disableFirst : first,
                    currentPage === 0 ? disablePrev : prev,
                    currentPage === 0 || embeds.length - 1 ? styledDelete : del,
                    currentPage === embeds.length - 1 ? disableNext : next,
                    currentPage === embeds.length - 1 ? disableLast : last
                  ]
                })
              ];
              components.concat(buttons);

              await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
            };

            break;
          };
          case "4": {
            currentPage = (embeds.length - 1);

            const components = [
              new ActionRowBuilder({
                components: [
                  currentPage === 0 ? disableFirst : first,
                  currentPage === 0 ? disablePrev : prev,
                  currentPage === embeds.length - 1 ? styledDelete : del,
                  currentPage === embeds.length - 1 ? disableNext : next,
                  currentPage === embeds.length - 1 ? disableLast : last
                ]
              })
            ];
            components.concat(buttons);

            await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });

            break;
          };

          default: null;
        };
      });

      collector.on("end", async () => {
        components[0].components.map((btn) => {
          btn.setDisabled(true);
          btn.setStyle(this.ButtonStyle.Secondary);
        });

        await sendMessage.edit({
          embeds: [embeds[0]],
          components
        }).catch(() => { });
      });
    };
  };

  static version = "v1.0.0";
};