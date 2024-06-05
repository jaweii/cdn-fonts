# 商业可用字体 + jsdelivr CDN + 按字加载

可用字体列表建fonts文件夹

完整字体应用示例：

https://gcore.jsdelivr.net/gh/jaweii/cdn-fonts@v1.1.0/fonts/ch/像素体.ttf

----

按字加载示例：

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
<div style={{ fontFamily: getFontFamily(font: '像素体.ttf', lang: 'ch', text: '像素体'})}}>
  像素体
</div>

<div class="text-ellipsis line-clamp-1" style="font-family: &quot;像素体_U+975e&quot;, &quot;像素体_U+6b63&quot;, &quot;像素体_U+5e38&quot;, &quot;像素体_U+5c65&quot;, &quot;像素体_U+884c&quot;, &quot;像素体_U+50cf&quot;, &quot;像素体_U+7d20&quot;, &quot;像素体_U+4f53&quot;">像素体</div>
```
