// @ts-check

// TODO: Update file in cloud server

import { affixes, roots } from "@zsnout/ithkuil/data"
import { wordToIthkuil } from "@zsnout/ithkuil/generate"
import { glossWord } from "@zsnout/ithkuil/gloss"
import { unglossWord } from "@zsnout/ithkuil/ungloss"
import {
  Client,
  Events,
  GatewayIntentBits,
  MessagePayload,
  Partials,
  PresenceUpdateStatus,
  bold,
  italic,
} from "discord.js"
import fuzzy from "fuzzysort"

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

      const result = await execute(args, options)

      if (result != null) {
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

const allRoots = roots.flatMap((root) => [
  { stem: 0, label: root.stems[0], cr: root.cr, abbr: "" },
  { stem: 1, label: root.stems[1], cr: root.cr, abbr: "" },
  { stem: 2, label: root.stems[2], cr: root.cr, abbr: "" },
  { stem: 3, label: root.stems[3], cr: root.cr, abbr: "" },
])

const allAffixesByDegree = affixes
  .flatMap((affix) =>
    affix.degrees.map((degree, index) => ({
      cs: affix.cs,
      abbr: affix.abbreviation,
      label: degree,
      index,
    }))
  )
  .filter((x) => x.label)

const allAffixesByAbbreviation = affixes.map((affix) => ({
  cs: affix.cs,
  abbr: affix.abbreviation,
  label: affix.description || "",
}))

const allAffixes = [...allAffixesByDegree, ...allAffixesByAbbreviation]

const everything = [...allRoots, ...allAffixes]

/**
 * @type {Record<
 *   string,
 *   (args: string[], options: Record<string, true | undefined>) =>
 *     import("discord.js").Awaitable<
 *       | string
 *       | MessagePayload
 *       | import("discord.js").MessageReplyOptions
 *       | undefined
 *     >
 * >}
 */
const commands = {
  find(words, { root, affix }) {
    const query = words.join(" ")

    if ((affix || (!root && !affix)) && query.length == 3) {
      const affix = affixes.find((affix) => affix.abbreviation == query)

      if (affix) {
        const head = affix.description
          ? bold(affix.cs + " (" + affix.abbreviation + ")") +
            ": " +
            affix.description
          : bold(affix.cs) + ": " + affix.abbreviation

        const tail = affix.degrees
          .slice(1)
          .map(
            (label, index) => bold(affix.cs + "/" + (index + 1)) + ": " + label
          )

        return head + "\n" + tail.join("\n")
      }
    }

    if (
      (affix || (!root && !affix)) &&
      query.length == 5 &&
      query[3] == "/" &&
      "123456789".includes(query[4])
    ) {
      const abbr = query.slice(0, 3)

      const affix = affixes.find((affix) => affix.abbreviation == abbr)

      if (affix) {
        return bold(affix.cs + "/" + query[4]) + ": " + affix.degrees[query[4]]
      }
    }

    const inputSpace =
      root && !affix ? allRoots : !root && affix ? allAffixes : everything

    const filtered = fuzzy
      .go(query, inputSpace, { keys: ["label", "abbr"], threshold: -500 })
      .map((x) => x)

    let ellipsis = ""

    if (filtered.length > 10) {
      ellipsis = "\n" + italic(filtered.length - 10 + " more...")
      filtered.splice(10, filtered.length - 10)
    }

    const output =
      filtered
        .map(({ obj: item }) => {
          if ("cr" in item) {
            return bold("S" + item.stem + "-" + item.cr) + ": " + item.label
          } else if ("index" in item) {
            return bold(item.cs + "/" + item.index) + ": " + item.label
          } else if (item.label) {
            return bold(item.cs + " (" + item.abbr + ")") + ": " + item.label
          } else {
            return bold(item.cs) + ": " + item.abbr
          }
        })
        .join("\n") + ellipsis

    return output || "Nothing found."
  },

  ungloss(words, { all, full, "no-gloss": noGloss, nogloss }) {
    if (!words.length) {
      return
    }

    if (nogloss) {
      noGloss = true
    }

    const output = words.map((wordGloss) => {
      const results = unglossWord(wordGloss)

      if (all) {
        const successes = []
        const failures = []

        for (const result of results) {
          if (result.type == "success") {
            const word = wordToIthkuil(result.value)
            const reglossed = glossWord(result.value)

            if (noGloss) {
              successes.push(`${result.label}: ${bold(word)}`)
            } else {
              successes.push(
                `${result.label}: ${bold(word)}: ${
                  reglossed[full ? "full" : "short"]
                }`
              )
            }
          } else if (result.type == "error") {
            failures.push(`${result.label}: _${result.reason}_`)
          } else {
            failures.push(`${result.label}: N/A`)
          }
        }

        return successes.concat(failures).join("\n")
      } else {
        const [formative, referential, adjunct, affixual, modular] = results

        const word =
          adjunct.type == "success"
            ? adjunct.value
            : modular.type == "success"
            ? modular.value
            : affixual.type == "success"
            ? affixual.value
            : referential.type == "success"
            ? referential.value
            : formative.type == "success"
            ? formative.value
            : undefined

        if (!word) {
          if (noGloss) {
            return italic("error")
          } else {
            return italic("Invalid gloss: '" + wordGloss + "'.")
          }
        }

        const ithkuil = wordToIthkuil(word)
        const reglossed = glossWord(word)

        if (noGloss) {
          return bold(ithkuil)
        } else {
          return `${bold(ithkuil)}: ${reglossed[full ? "full" : "short"]}`
        }
      }
    })

    if (all) {
      return output.join("\n\n")
    } else if (noGloss) {
      return output.join(" ")
    }
    {
      return output.join("\n")
    }
  },
}
