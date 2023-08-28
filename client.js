// @ts-check

import {
  Client,
  GatewayIntentBits,
  Partials,
  PresenceUpdateStatus,
} from "discord.js"

export const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
  presence: { status: PresenceUpdateStatus.Online },
})
