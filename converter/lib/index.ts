// https://github.com/miyaoka/vue-composition-converter

import ts from "typescript"
import { parseComponent } from "vue-template-compiler"
import { getNodeByKind } from "./helper"
import { convertOptionsApi } from "./converters/optionsApiConverter"

export const convertSrc = (input: string): string => {
  const parsed = parseComponent(input)
  const templateContent = parsed.template?.content || ""
  let scriptContent = parsed.script?.content || ""

  const sourceFile = ts.createSourceFile(
    "src.tsx",
    scriptContent,
    ts.ScriptTarget.Latest,
  )

  const exportAssignNode = getNodeByKind(
    sourceFile,
    ts.SyntaxKind.ExportAssignment,
  )
  if (exportAssignNode) {
    scriptContent = convertOptionsApi(sourceFile)

    scriptContent = scriptContent
      .split("\n")
      .filter((line) => !line.includes("@vue/composition-api"))
      .join("\n")

    scriptContent = scriptContent.replaceAll(
      "defineComponent",
      "defineNuxtComponent",
    )

    // vue2 CAPI -----> vue3 CAPI
    if (scriptContent.includes("ctx.root.$")) {
      const setupDeclarationCode = scriptContent.match(/setup\((.+)\) {/)?.[0]

      if (setupDeclarationCode) {
        const openBlockPosition =
          scriptContent.indexOf(setupDeclarationCode) +
          setupDeclarationCode.length

        const propertiesMatch = scriptContent.match(
          /ctx\.root\.\$(?<props>[a-zA-Z]+)(\.|\[| )/g,
        )
        const properties = propertiesMatch
          ? Array.from(new Set(propertiesMatch))
          : []

        scriptContent = [
          scriptContent.slice(0, openBlockPosition),
          "const __instance = getCurrentInstance();",
          `const __getCtx = (__gp) => __instance.ctx[__gp] ?? __instance.appContext.config.globalProperties[__gp];`,
          scriptContent.slice(openBlockPosition),
        ].join("")

        properties.forEach((property) => {
          const propName = property.split(".").at(-2)
          scriptContent = scriptContent.replaceAll(
            `ctx.root.${propName}.`,
            `__getCtx("${propName}").`,
          )
        })
      }
    }

    // watch('$some.nested') -----> () => watch(() => __rootCtx.$some.nested)
    if ([`"`, `'`].some((quote) => scriptContent.includes(`watch(${quote}$`))) {
      const watchMatch = scriptContent.match(
        /watch\((?<quote>'|")\$(?<name>.+)('|")/,
      )
      const watchName = watchMatch?.groups?.name
      const watchQuote = watchMatch?.groups?.quote

      if (watchName) {
        const watchDeclaration = `watch(${watchQuote}$`

        while (true) {
          const watchPosition = scriptContent.indexOf(
            watchDeclaration + watchName,
          )
          if (watchPosition === -1) break

          const [rootProp, ...nestedProps] = watchName.split(".")
          const nestedProp =
            nestedProps.length > 0 ? "." + nestedProps.join(".") : ""

          scriptContent = [
            scriptContent.slice(
              0,
              watchPosition + watchDeclaration.length - `'$`.length,
            ),
            `() => __getCtx("$${rootProp}")${nestedProp}`,
            scriptContent.slice(
              watchPosition +
                watchDeclaration.length +
                watchName.length +
                "'".length,
            ),
          ].join("")
        }
      }
    }
  }

  return [
    `
      <template>
        ${templateContent}
      </template>
    `,
    scriptContent
      ? `
        <script ${parsed.script.lang ? `lang="${parsed.script.lang}"` : ""}>
          ${scriptContent}
        </script>
      `
      : "",
  ].join("\n\n")
}
