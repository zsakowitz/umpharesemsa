// @ts-check

import { wordToIthkuil } from "@zsnout/ithkuil/generate"
import { glossWord } from "@zsnout/ithkuil/gloss"
import { unglossWord } from "@zsnout/ithkuil/ungloss"
import { bold, italic } from "discord.js"

/**
 * @param {readonly string[]} words
 * @param {{ all: boolean, full: boolean, noGloss: boolean }} param1
 */
export function unglossCommand(words, { all, full, noGloss }) {
  if (!words.length) {
    return italic("No gloss was specified.")
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
}
