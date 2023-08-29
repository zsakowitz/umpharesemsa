// @ts-check

import { glossWord } from "@zsnout/ithkuil/gloss"
import { parseSentences } from "@zsnout/ithkuil/parse"
import { bold, italic } from "discord.js"

export function glossCommand(
  /** @type {string} */ text,
  /** @type {string} */ type
) {
  const words = parseSentences(text)

  if (words.ok === false) {
    return italic(words.reason)
  }

  const mapped = words.value.map((item) => {
    if (item.type == "sentenceBreak") {
      return "\n"
    }

    let output

    if (item.type == "word") {
      output =
        bold(item.source) +
        ": " +
        glossWord(item.word)[type == "full" ? "full" : "short"]
    } else {
      output = item.words
        .map((x) => {
          console.log(x)
          const [source, word] = x

          return (
            bold(source) +
            ": " +
            glossWord(word)[type == "full" ? "full" : "short"]
          )
        })
        .join("\n")
    }

    if ("properNoun" in item && item.properNoun) {
      output += "\n" + bold(item.properNoun)
    }

    return output
  })

  return mapped.join("\n")
}
