# 商业可用字体 + jsdelivr CDN + 按字加载

示例：

https://gcore.jsdelivr.net/gh/jaweii/cdn-fonts@v1.1.0/fonts/ch/像素体.ttf

```
/** 按需加载字体 **/
export async function loadFont({
  font,
  text,
  lang,
}: {
  /** Arial.ttf */
  font: string
  /** 你好 */
  text: string
  /** ch */
  lang: string
}) {
  text = font + text
  const [fontName, extName] = font.split('.')
  for (const char of uniq(text.split(''))) {
    const u = 'U+' + char.charCodeAt(0).toString(16)
    try {
      if (
        [...document.fonts].find(
          (f) => f.family === fontName && f.unicodeRange === u,
        )
      ) {
        console.log('skip', char, u, fontName)
        continue
      }
      const fc = new FontFace(
        `${fontName}_${u}`,
        `url('https://gcore.jsdelivr.net/gh/jaweii/cdn-fonts@v1.8.0/fonts/${lang}/${font.replace(
          /\./g,
          '_',
        )}/${u}.${extName}')`,
        {
          unicodeRange: u,
        },
      )
      await fc.load()
      document.fonts.add(fc)
    } catch (err) {
      console.error(`${u}, ${char}, ${fontName}, 加载失败: ${err}`)
    }
  }
}

/** 获取fontFamily **/
export function getFontFamily({
  font,
  text,
  lang,
}: {
  /** Arial.ttf */
  font: string
  /** 你好 */
  text: string
  /** ch */
  lang: string
}) {
  const [fontName, extName] = font.split('.')
  let val = ``
  uniq(text?.split('') || []).forEach((char) => {
    const u = 'U+' + char.charCodeAt(0).toString(16)
    val += `'${fontName}_${u}',`
  })
  val = val?.replace(/,$/, '')
  return val
}

<!-- 页面使用 -->
<div style={{ fontFamily: getFontFamily(font: 'Arial.ttf', lang: 'ch', text: '字体'})}}>
  字体
</div>
```
