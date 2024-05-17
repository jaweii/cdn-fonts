const FontMin = require("fontmin");
const fs = require("fs");
const rename = require("gulp-rename");
const { get } = require("lodash");
const tree = require("../tree.json");

async function main() {
  const txt = fs.readFileSync("./txt/words.txt", "utf8");
  const words = txt.split("");
  const names = get(tree, "[0].contents[0].contents").map(
    (item) => item.name
  );
  const queue = []
  for (const name of names) {
    for (const w of words) {
      if (["", "\n"].includes(w)) continue;
      const i = words.indexOf(w);
      const unicode = "U+" + w.charCodeAt(0).toString(16);
      const dest = `fonts/ch/${name.replaceAll(".", "_")}/`;
      const newName = `${unicode}.${name.split(".").reverse()[0]}`;
      const exist = fs.existsSync(dest + newName);
      if (exist) continue;
      console.log(name, `${i}/${words.length - 1}`);
      queue.push(dest)
      const fontmin = new FontMin()
        .src(`fonts/ch/${name}`)
        .use(
          FontMin.glyph({
            text: w,
            hinting: false, // keep ttf hint info (fpgm, prep, cvt). default = true
          })
        )
        .use(rename(newName))
        .dest(dest);
      fontmin.run(function (err, files) {
        queue.splice(queue.indexOf(dest), 1)
        if (err) {
          console.error(err);
        }
      });
      while (queue.length > 20) {
        await new Promise((resolve, reject) => setTimeout(resolve, 20))
      }
    }
  }
}

main().catch(console.error);
