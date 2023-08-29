// @ts-check

import { Events } from "discord.js"
import { client } from "./client.js"

client.login(
  // @ts-ignore
  typeof Deno == "object"
    ? // @ts-ignore
      Deno.env.get("ITHKUIL_BOT_TOKEN")
    : process.env.ITHKUIL_BOT_TOKEN
)

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})
