const FontMin = require("fontmin");
const fs = require("fs");
const rename = require("gulp-rename");
const { get } = require("lodash");
const tree = require("../tree.json");

async function main() {
  const txt = fs.readFileSync("./txt/words.txt", "utf8");
  const words = txt.split("");
  const names = get(tree, "[0].contents[0].contents")
    .map((item) => item.name)
    .filter((name) => name.endsWith("otf"));
  const queue = [];
  for (const name of names) {
    const extName = name.split(".").reverse()[0].toLowerCase();
    console.log(name);
    if (extName === "otf") {
      const exist = fs.existsSync(`fonts/ch/${name.replace('otf', 'ttf')}`);
      console.log('exist', exist)
      if (exist) continue
      await new Promise((resolve) => {
        new FontMin()
          .src(`fonts/ch/${name}`)
          .use(FontMin.otf2ttf())
          .use(rename(name.replace('otf', 'ttf')))
          .dest('fonts/ch/')
          .run(err => {
            if (err) {
              throw err
            }
            resolve()
          })
      })
      console.log('converted')
    }
    // if (extName === "otf") continue;

    const dest = `fonts/ch/${name.replaceAll(".", "_").replace('otf', 'ttf')}/`;
    for (const w of words) {
      if (["", "\n"].includes(w)) continue;
      const i = words.indexOf(w);
      console.log(name, `${i}/${words.length - 1}`);
      const unicode = "U+" + w.charCodeAt(0).toString(16);
      const newName = `${unicode}.ttf`;
      const exist = fs.existsSync(dest + newName);
      if (exist) continue;
      queue.push(dest);
      const fontmin = new FontMin()
        .src(`fonts/ch/${name.replace('.otf', '.ttf')}`)
        .use(
          FontMin.glyph({
            text: w,
            hinting: false, // keep ttf hint info (fpgm, prep, cvt). default = true
          })
        )
        .dest(dest);
      fontmin.use(rename(newName)).run(function (err, files) {
        queue.splice(queue.indexOf(dest), 1);
        if (err) {
          console.error(err);
        }
      });
      while (queue.length > 20) {
        await new Promise((resolve, reject) => setTimeout(resolve, 20));
      }
    }
  }
}

main().catch(console.error);
