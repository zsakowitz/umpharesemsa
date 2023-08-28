// @ts-check

import {
  Collection,
  Events,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "discord.js"
import { client } from "./client.js"
import { findCommand } from "./commands/find.js"
import { unglossCommand } from "./commands/ungloss.js"

function splitWords(/** @type {string} */ input) {
  return input
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x)
}

/**
 * @type {{
 *   data: { name: string; toJSON(): unknown }
 *   execute(interaction: import("discord.js").ChatInputCommandInteraction): Promise<void>
 * }[]}
 */
const commands = [
  // ungloss
  {
    data: new SlashCommandBuilder()
      .setName("ungloss")
      .setDescription("Unglosses a word.")
      .addStringOption(
        new SlashCommandStringOption()
          .setName("gloss")
          .setDescription("The gloss string to turn into a word.")
          .setRequired(true)
      )
      .addStringOption(
        new SlashCommandStringOption()
          .setName("mode")
          .setDescription("How to display glosses of generated words.")
          .setChoices(
            { value: "short", name: "short" },
            { value: "full", name: "full" },
            { value: "none", name: "none" }
          )
      )
      .addBooleanOption(
        new SlashCommandBooleanOption()
          .setName("all")
          .setDescription(
            "Whether to show all possible interpretations of generated words."
          )
      ),

    async execute(interaction) {
      const mode = interaction.options.getString("mode")
      const all = interaction.options.getBoolean("all")
      const gloss = interaction.options.getString("gloss", true)

      interaction.reply(
        unglossCommand(splitWords(gloss), {
          all: all || false,
          full: mode == "full",
          noGloss: mode == "none",
        })
      )
    },
  },

  // find
  {
    data: new SlashCommandBuilder()
      .setName("find")
      .setDescription("Finds an affix or root.")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("affix")
          .setDescription("Finds an affix.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("query")
              .setDescription("The query to search for.")
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("any")
          .setDescription("Finds an affix or root.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("query")
              .setDescription("The query to search for.")
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("root")
          .setDescription("Finds a root.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("query")
              .setDescription("The query to search for.")
              .setRequired(true)
          )
      ),

    async execute(interaction) {
      const query = interaction.options.getString("query", true)
      const type = interaction.options.getSubcommand(true)

      interaction.reply(
        findCommand(query, {
          root: type == "root",
          affix: type == "affix",
        })
      )
    },
  },

  // gloss
  {
    data: new SlashCommandBuilder()
      .setName("gloss")
      .setDescription("Glosses a word or sentence.")
      .addStringOption(
        new SlashCommandStringOption()
          .setName("text")
          .setDescription("The string to be glossed.")
          .setRequired(true)
      ),

    async execute(interaction) {
      const text = interaction.options.getString("text", true)
    },
  },
]

export const commandCollection = new Collection(
  commands.map((command) => [command.data.name, command])
)

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commandCollection.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    }
  }
})
