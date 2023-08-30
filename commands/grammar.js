// @ts-check

import {
  AFFILIATION_TO_NAME_MAP,
  ALL_AFFILIATIONS,
  ALL_ASPECTS,
  ALL_CASES,
  ALL_CASE_SCOPES,
  ALL_CONFIGURATIONS,
  ALL_CONTEXTS,
  ALL_EFFECTS,
  ALL_ESSENCES,
  ALL_EXTENSIONS,
  ALL_FUNCTIONS,
  ALL_ILLOCUTIONS,
  ALL_LEVELS,
  ALL_MOODS,
  ALL_PERSPECTIVES,
  ALL_PHASES,
  ALL_REFERENT_TARGETS,
  ALL_SPECIFICATIONS,
  ALL_VALENCES,
  ALL_VALIDATIONS,
  ALL_VERSIONS,
  ASPECT_TO_NAME_MAP,
  CASE_SCOPE_TO_NAME_MAP,
  CASE_TO_NAME_MAP,
  CONFIGURATION_TO_NAME_MAP,
  CONTEXT_TO_NAME_MAP,
  EFFECT_TO_NAME_MAP,
  ESSENCE_TO_NAME_MAP,
  EXTENSION_TO_NAME_MAP,
  FUNCTION_TO_NAME_MAP,
  ILLOCUTION_TO_NAME_MAP,
  LEVEL_TO_NAME_MAP,
  MOOD_TO_NAME_MAP,
  PERSPECTIVE_TO_NAME_MAP,
  PHASE_TO_NAME_MAP,
  REFERENT_TARGET_TO_NAME_MAP,
  SPECIFICATION_TO_NAME_MAP,
  VALENCE_TO_NAME_MAP,
  VALIDATION_TO_NAME_MAP,
  VERSION_TO_NAME_MAP,
} from "@zsnout/ithkuil/generate"

/**
 * @template {string} T
 * @param {string} categoryName
 * @param {readonly T[]} values
 * @param {Readonly<Record<T, string>>} valueToNameMap
 */
function makeGrammar(categoryName, values, valueToNameMap) {
  return [
    {
      isCategoryName: true,
      category: categoryName,
      label: categoryName,
      usage: "",
    },
    ...values.map((name) => ({
      isCategoryName: false,
      category: categoryName,
      label: valueToNameMap[name],
      usage: name,
    })),
  ]
}

export const allGrammaticalCategories = [
  makeGrammar("Concatenation", ["T1", "T2"], {
    T1: "Type-1",
    T2: "Type-2",
  }),

  makeGrammar("Version", ALL_VERSIONS, VERSION_TO_NAME_MAP),
  makeGrammar("Stem", ["S1", "S2", "S3", "S0"], {
    S1: "Stem 1",
    S2: "Stem 2",
    S3: "Stem 3",
    S0: "Stem Zero",
  }),
  makeGrammar("Affix Shortcut", ["(NEG/4)", "(DCD/4)", "(DCD/5)"], {
    "(NEG/4)": "‘relative negation’",
    "(DCD/4)": "‘previously mentioned’",
    "(DCD/5)": "‘[+head]’",
  }),

  makeGrammar("Function", ALL_FUNCTIONS, FUNCTION_TO_NAME_MAP),
  makeGrammar("Specification", ALL_SPECIFICATIONS, SPECIFICATION_TO_NAME_MAP),
  makeGrammar("Context", ALL_CONTEXTS, CONTEXT_TO_NAME_MAP),

  makeGrammar("Affiliation", ALL_AFFILIATIONS, AFFILIATION_TO_NAME_MAP),
  makeGrammar("Configuration", ALL_CONFIGURATIONS, CONFIGURATION_TO_NAME_MAP),
  makeGrammar("Extension", ALL_EXTENSIONS, EXTENSION_TO_NAME_MAP),
  makeGrammar("Perspective", ALL_PERSPECTIVES, PERSPECTIVE_TO_NAME_MAP),
  makeGrammar("Essence", ALL_ESSENCES, ESSENCE_TO_NAME_MAP),

  makeGrammar("Valence", ALL_VALENCES, VALENCE_TO_NAME_MAP),
  makeGrammar("Phase", ALL_PHASES, PHASE_TO_NAME_MAP),
  makeGrammar("Effect", ALL_EFFECTS, EFFECT_TO_NAME_MAP),
  makeGrammar("Level", ALL_LEVELS, LEVEL_TO_NAME_MAP),
  makeGrammar("Aspect", ALL_ASPECTS, ASPECT_TO_NAME_MAP),

  makeGrammar("Mood", ALL_MOODS, MOOD_TO_NAME_MAP),
  makeGrammar("Case-Scope", ALL_CASE_SCOPES, CASE_SCOPE_TO_NAME_MAP),

  makeGrammar("Illocution", ALL_ILLOCUTIONS, ILLOCUTION_TO_NAME_MAP),
  makeGrammar("Validation", ALL_VALIDATIONS, VALIDATION_TO_NAME_MAP),
  makeGrammar("Case", ALL_CASES, CASE_TO_NAME_MAP),

  makeGrammar("Referent", ALL_REFERENT_TARGETS, REFERENT_TARGET_TO_NAME_MAP),
].flat()
