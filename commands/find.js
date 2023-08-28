// @ts-nocheck

import { affixes, roots } from "@zsnout/ithkuil/data"
import { bold, italic } from "discord.js"
import fuzzysort from "fuzzysort"

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

export function findCommand(
  /** @type {string} */ query,
  /** @type {{ root: boolean, affix: boolean }} */ { root, affix }
) {
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

  const filtered = fuzzysort
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
}
