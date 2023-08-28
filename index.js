// @ts-check

// TODO: Update file in cloud server

import { affixes, roots } from "@zsnout/ithkuil/data"
import { Events, MessagePayload, bold, italic } from "discord.js"
import fuzzy from "fuzzysort"
import { client } from "./client.js"
import "./commands.js"

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`)

  const guilds = await client.guilds.fetch()

  guilds.forEach(async (guild) => {
    const g = await guild.fetch()
    await g.channels.fetch()
  })
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) {
    return
  }

  if (!message.content.startsWith("?")) {
    return
  }

  const segments = message.content.split(" ")

  for (const [name, execute] of Object.entries(commands)) {
    if (segments[0] == "?" + name) {
      const user =
        message.author.username +
        (message.author.discriminator && message.author.discriminator != "0"
          ? "#" + message.author.discriminator
          : "")

      console.group(user + ": " + message.content)

      /** @type {Record<string, true | undefined>} */
      const options = {}

      const args = segments
        .slice(1)
        .filter((segment) => {
          if (segment.startsWith("--")) {
            options[segment.slice(2).toLowerCase()] = true
            return false
          }

          return segment.trim()
        })
        .map((segment) => segment.trim())

      const result = execute(args, options)

      if (result != null) {
        console.log(String(result))
        console.groupEnd()
        await message.reply(result)
      }

      return
    }
  }
})

client.login(
  // @ts-ignore
  typeof Deno == "object"
    ? // @ts-ignore
      Deno.env.get("ITHKUIL_BOT_TOKEN")
    : process.env.ITHKUIL_BOT_TOKEN
)
