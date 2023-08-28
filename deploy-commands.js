// @ts-check

import { REST, Routes } from "discord.js"
import { commandCollection } from "./commands.js"

const rest = new REST().setToken(process.env.ITHKUIL_BOT_TOKEN || "")

try {
  console.log(
    `Started refreshing ${commandCollection.size} application (/) commands.`
  )

  const data = await rest.put(
    Routes.applicationCommands(process.env.ITHKUIL_BOT_CLIENT_ID || ""),
    { body: [...commandCollection.values()].map((x) => x.data.toJSON()) }
  )

  // @ts-ignore
  console.log(`Successfully reloaded ${data.length} application (/) commands.`)
} catch (error) {
  console.error(error)
}
