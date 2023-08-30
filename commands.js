// @ts-check

import {
  Collection,
  Events,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  italic,
} from "discord.js"
import fuzzysort from "fuzzysort"
import { client } from "./client.js"
import { allAffixesByDegree, allRoots, findCommand } from "./commands/find.js"
import { glossCommand } from "./commands/glossCommand.js"
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

      try {
        var gloss = interaction.options
          .getString("gloss", true)
          .split(/-/g)
          .map((segment) => {
            if (
              (segment.startsWith('"') ||
                segment.startsWith("“") ||
                segment.startsWith("”")) &&
              (segment.endsWith('"') ||
                segment.endsWith("“") ||
                segment.endsWith("”")) &&
              segment.length >= 3
            ) {
              const items = fuzzysort.go(segment.slice(1, -1), allRoots, {
                keys: ["label"],
                limit: 1,
                threshold: -500,
              })

              if (items[0]) {
                return "S" + items[0].obj.stem + "-" + items[0].obj.cr
              }

              throw new Error("No root found for " + segment + ".")
            }

            if (
              (segment.startsWith("'") ||
                segment.startsWith("‘") ||
                segment.startsWith("’")) &&
              (segment.endsWith("'") ||
                segment.endsWith("‘") ||
                segment.endsWith("’")) &&
              segment.length >= 3
            ) {
              const items = fuzzysort.go(
                segment.slice(1, -1),
                allAffixesByDegree,
                {
                  keys: ["label"],
                  limit: 1,
                  threshold: -500,
                }
              )

              if (items[0]) {
                return items[0].obj.cs + "/" + items[0].obj.index
              }

              throw new Error("No affix found for " + segment + ".")
            }

            return segment
          })
          .join("-")
      } catch (error) {
        interaction.reply(
          italic(String(error instanceof Error ? error.message : error))
        )

        return
      }

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
      .setDescription("Finds an affix, root, or grammatical category.")
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
          .setDescription("Finds an affix, root, or grammatical category.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("query")
              .setDescription("The query to search for.")
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("grammar")
          .setDescription("Finds a grammatical category.")
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
          affix: type == "affix",
          grammar: type == "grammar",
          root: type == "root",
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
      )
      .addStringOption(
        new SlashCommandStringOption()
          .setName("type")
          .setDescription("Whether to show short or full glosses.")
          .setChoices(
            { name: "full", value: "full" },
            { name: "short", value: "short" }
          )
      ),

    async execute(interaction) {
      const text = interaction.options.getString("text", true)
      const type = interaction.options.getString("type")

      interaction.reply(glossCommand(text, type))
    },
  },

  // help
  {
    data: new SlashCommandBuilder()
      .setName("help")
      .setDescription("Shows a guide to using this bot."),

    async execute(interaction) {
      interaction.reply({
        content:
          "Check out https://github.com/zsakowitz/umpharesemsa/blob/main/README.md for a guide on using this bot.",
        ephemeral: true,
      })
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
