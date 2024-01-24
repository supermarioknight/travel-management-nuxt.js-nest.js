import path from "node:path"
import { execSync } from "node:child_process"

import { dir, file } from "./fs"
import { convertSrc } from "./lib"

const webRootPath = path.resolve("..", "web")

const componentFolderPath = path.join(webRootPath, "components")
const pageFolderPath = path.join(webRootPath, "pages")

const componentFilePaths = await dir.read.files(componentFolderPath, {
  absolute: true,
})
const pageFilePaths = await dir.read.files(pageFolderPath, {
  absolute: true,
  recursive: true,
})
const vueFilePaths = [...componentFilePaths, ...pageFilePaths]

for await (const vueFilePath of vueFilePaths) {
  const code = await file.read.plain(vueFilePath)
  const changed = convertSrc(code)
  await file.write.file(vueFilePath, changed)
}

try {
  execSync("cd ../web && yarn lintfix")
} catch {
} finally {
  console.log("FILES CHANGED:", vueFilePaths)
}
