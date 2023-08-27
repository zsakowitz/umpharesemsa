// @ts-check

import { wordToIthkuil } from "@zsnout/ithkuil/generate"
import { glossWord } from "@zsnout/ithkuil/gloss"
import { unglossWord } from "@zsnout/ithkuil/ungloss"
import {
  Collection,
  Events,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js"
import { client } from "./client.js"

export const commands = new Collection([
  [
    "ungloss",
    {
      data: new SlashCommandBuilder()
        .setName("ungloss")
        .setDescription("Unglosses a word.")
        .addStringOption(
          new SlashCommandStringOption()
            .setName("gloss")
            .setDescription("The gloss string to turn into a word.")
        ),

      async execute(
        /** @type {import("discord.js").ChatInputCommandInteraction} */ interaction
      ) {
        const gloss = interaction.options.getString("gloss")

        if (!gloss) {
          await interaction.reply({
            content: "No gloss was specified.",
            ephemeral: true,
          })

          return
        }

        const results = unglossWord(gloss)

        const successes = []
        const failures = []

        for (const result of results) {
          if (result.type == "success") {
            const word = wordToIthkuil(result.value)
            const reglossed = glossWord(result.value)
            successes.push(`${result.label}: ${word} (${reglossed.short})`)
          } else if (result.type == "error") {
            failures.push(`${result.label}: _${result.reason}_`)
          }
        }

        const output = successes.concat(failures).join("\n")

        if (output) {
          await interaction.reply(output)
        } else {
          await interaction.reply({
            content: "Invalid gloss.",
            ephemeral: true,
          })
        }
      },
    },
  ],
])

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction)

  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)

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
