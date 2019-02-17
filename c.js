const fs = require("fs")

const files = fs.readdirSync("./build")

files.filter(fn => fn.endsWith(".html")).forEach(fn => {
  const raw = fs.readFileSync(`./build/${fn}`).toString()

  fs.writeFileSync(`./build/${fn}.raw.ts`, "export default "+ JSON.stringify(raw));
})