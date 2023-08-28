Hi! I'm @umpharesemsa, a complement to the Ithkuil IV glossing bot
@irburučpaizya. I can help you generate all kinds of words in Ithkuil, and I can
also help you look up roots and affixes.

<!-- prettier-ignore -->
__**Searching Roots and Affixes**__

- **?find word**: searches roots and affixes for "word"
- **?find --root word**: searches roots for "word"
- **?find --affix word**: searches affixes for "word"
- **?find ABR**: finds an affix based on abbreviation and outputs its values
- **?find ABR/2**: finds an affix based on abbreviation and degree

Example 1:

> Command: **?find warm**
>
> Output:  
> S3-fph: warm front  
> tf/6: (too) warm  
> S3-fšr: warm climate  
> S1-ḑh: feeling warm  
> S1-žxw: warm to the touch  
> S0-ḑh: sensation of warmth  
> S0-žxw: warm/hot to the touch  
> S1-ňçml: swarmandal  
> tf/5: mild, comfortably cool or warm  
> S1-rtr: kindness/warm-heartedness/decency  
> 52 more...

Example 2:

> Command: **?find EFE/7**
>
> Output: **m/7**: detrimental to 3rd party

<!-- prettier-ignore -->
__**Generating Words**__

- **?ungloss string**: converts the gloss "string" to a word
- **?ungloss --full string**: converts the gloss "string" to a word and shows
  the full gloss

> When typing glosses, don't use the meanings of roots and affixes; type how
> they're spelled. Write `rr-CSV-G-tf/7-ERG`, not `cat-CSV-G-warm-ERG`.

To be parsed properly, follow the guide below for typing glosses.

Glosses are represented as a series of segments separated with dashes, such as
`rr-CSV-G-tf/7-ERG`. Segments primarily fall into two categories: uncategorized
segments, and tail segments.

Tail segments include:

- Affixes, such as **tf/7**, **zj/2**, and **nk/2₃**.
- Ca segments, such as **A**, **COA.DPX.RPV**, and **PRX**.
- Vn segments, such as **PRL**, **3:DET**, and **RSM**.
- Mood/case-scope segments, such as **HYP**, **CCV**, and **SUB**.
- Case segments, such as **ERG**, **ACT**, and **LOC**.
- Illocution/validation segments, such as **DEC**, **PUP**, and **HOR**.
- Case-stacking segments, such as **(case:ERG)**, **(case:ACT)**, and
  **(case:LOC)**.
- Case-accessors, such as **(acc:ERG)**, **(acc:ACT)**, and **(acc:LOC)**.
- Inverse-accessors, such as **(ia:ERG)**, **(ia:ACT)**, and **(ia:LOC)**.
- Referential affixes, such as **(1m-THM)** and **([2m+ma]+N-ABL)**.

Tail segments are unique in that they can all be represented as affixes.

**Writing Formatives**

To write a formative, start by writing the concatenation type (T1, T2, or none),
stem, version, root, function, specification, and context. Then, add as many
tail segments as you like.

The root may be a standard root (e.g. **rr**, **mph**, or **l**), an affix (e.g.
**c/1** or **rns/9**), or a referent (e.g. **1m**, **2m.DET**, or
**[1m+ma.BEN]**).

To express a Ca shortcut, write the Ca form before the root. To express an affix
shortcut, write **(NEG/4)**, **(DCD/4)**, or **(DCD/5)** before the root.

Examples:

- **T1-ççt-STM**
- **G-l-CTE-c/3-ERG**
- **rr-COA.MSS.PRX.RPV-2:DET-HYP**

Formatives are assumed to be nominal by default. To mark a framed verbal
formative, end its gloss with **-FRM**, as in `l-c/7-FRM`. To mark a plain
verbal formative, end its gloss with a mood or illocution, as in `l-OBS`.

**Writing Referentials**

To write a referential, start either with a referent or a suppletive adjunct,
which we'll call the referential head. **1m**, **[1m+2m]+G**, and **[QUO]** are
all valid referential heads.

For a single referential, follow the head with a case, or write it standalone.
**1m-ERG**, **[2m+ma]**, and **ma+A-LOC** are all valid single referentials.

For a dual referential, follow the head with a case for the head, then another
case, then a referent. **1m-ERG-ABS-2m** and **[2m+ma]-LOC-THM-pi** are both
valid dual referentials.

For combination referentials, follow the head with an optional case, an optional
specification, and zero or more tail segments. If the final tail segment is a
case, it will be used as the second case of the combination referential.
**1m-CTE**, **PVS-LOC-(IRG)**, and **[Mx+Obv]+N-CSV** are all valid combination
referentials.

Note that many referentials are also perfectly valid formative glosses. To see
both the formative and referential interpretation of your gloss, use
`?gloss --all ...` instead of `?gloss ...`.

**Writing Adjuncts**

To write a bias adjunct, just write its abbreviation, such as **SOL**, **SKP**,
or **ANP**.

To write a register adjunct, write its abbreviation, such as **DSV**, **EXM**,
or **PNT**. To write a final register adjunct, write its abbreviation followed
by `_END`, such as **DSV_END**, **EXM_END**, or **PNT_END**.

To write a parsing adjunct, write `mono:`, `ulti:`, `penu:`, or `ante:`,
depending on the stress required.

To write a suppletive adjunct, write `[CAR]`, `[QUO]`, `[NAM]`, or `[PHR]`,
optionally followed by a case. **\[QUO\]**, **\[NAM\]-ERG**, and **\[PHR\]-LOC**
are all valid suppletive adjuncts.

The syntaxes of affixual adjuncts and modular adjuncts are somewhat more
nuanced, and are discussed below.

**Writing Affixual Adjuncts**

An affixual adjunct consists of one or more tail segments joined with hyphens.

If `{concat.}` appears in the adjunct, it will only apply to the concatenated
stem of the following word, rather than to the formative as a whole.

To indicate the scope of the first affix of the adjunct, write **{form.}**,
**{adj.}**, **{V:DOM}**, **{V:SUB}**, **{VII:DOM}**, or **{VII:SUB}** after the
first segment. If none is specified, it defaults to **{V:DOM}**.

To indicate the scope of all affixes other than the first, write **{form.}**,
**{adj.}**, **{V:DOM}**, **{V:SUB}**, **{VII:DOM}**, or **{VII:SUB}** at the end
of the adjunct. If none is specified, the scoping defaults to the same as the
first affix.

**tf/7**, **DPX-2:BEN**, and **(1m-ERG)-{VII:SUB}** are all valid affixual
adjuncts.

**Writing Modular Adjuncts**

A modular adjunct has a `Vn-Cn-Vn-Vn` structure. The final Vn segment may be
replaced by scoping information, which is detailed below. The adjunct may also
have a `{parent}` or `{concat}` segment, limiting the adjunct's scope to only
the following parent or concatenated formative. Any of the Vn or Cn segments may
be omitted, as long as at least one is present. Note that the third Vn segment
of a modular adjunct may not be an aspect.

- **{adj.over}** scope indicates the adjunct has scope over the formative and
  adjacent adjuncts.

- **{adj.under}** scope indicates the adjunct has scope over the formative but
  not adjacent adjuncts.

- **{form}** scope indicates the adjunct has scope over the formative as a
  whole.

- **{mcs}** scope indicates the adjunct has scope over mood and case-scope.

**PRL**, **2:BEN-HYP-{adj.under}**, and **RTR-PRL** are all valid modular
adjuncts.

Note that many modular adjuncts are also perfectly valid affixual adjunct
glosses. To see both the affixual adjunct and modular adjunct interpretations of
your gloss, use `?gloss --all ...` instead of `?gloss ...`.
