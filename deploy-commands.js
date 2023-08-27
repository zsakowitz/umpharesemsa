// @ts-check

import { REST, Routes } from "discord.js"
import { commands } from "./commands.js"

const rest = new REST().setToken(process.env.ITHKUIL_BOT_TOKEN || "")

try {
  console.log(`Started refreshing ${commands.size} application (/) commands.`)

  const data = await rest.put(
    Routes.applicationCommands(process.env.ITHKUIL_BOT_CLIENT_ID || ""),
    { body: [...commands.values()].map((x) => x.data.toJSON()) }
  )

  console.log(`Successfully reloaded ${data.length} application (/) commands.`)
} catch (error) {
  console.error(error)
}
