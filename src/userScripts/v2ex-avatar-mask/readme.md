# V2EX Avatar Mask 油猴脚本

把 V2EX 页面上所有用户头像替换成 [ugly-avatar-server](https://github.com/Wxh16144/ugly-avatar-server) 生成的丑头像。

**只改页面显示，不上传头像、不触碰账号数据**，刷新或禁用脚本即恢复原样。

## ✨ 功能特性

- 全站头像替换：首页（含「最近查看过的主题」）、主题列表、主题详情、回复区、顶栏
- 按用户名（`alt`）生成，同一个人永远是同一个丑头像；`data-uid` 与成员链接兜底
- 全局只用一个尺寸（默认 `s=128`）：每个用户只对应一个 URL，服务端只渲染一次、浏览器只缓存一份
- 尺寸动态测量：替换前读取原头像的布局尺寸并记忆，用 inline style 锁定，版面不会变
- 预加载队列（并发 6）+ 浏览器强缓存，不冲击服务端限流
- 加载成功才替换；失败保留原头像，绝不显示破图
- 原头像粒子消散过渡，进入视口才播放，全局并发 3
- 尊重 `prefers-reduced-motion`
- 站点适配器结构，后续可扩展其它站点

## 🚀 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. [点击安装脚本](https://unpkg.com/@wuxh/daily-avatar/userscripts/v2ex-avatar-mask.user.js)
3. 打开 V2EX，滚动页面即可看到头像变化

## ⚙️ 配置

脚本顶部保留了可直接编辑的 `CONFIG` 常量（油猴编辑器中修改后保存即可生效）：

```js
const CONFIG = {
  host: 'https://avatar.wxhboy.cn',      // 头像服务地址，必须是 HTTPS
  urlTemplate: '{host}/{id}.{format}?s={size}',
  format: 'webp',
  size: 128,                              // 全局唯一边长，每个用户只有一个 URL
  concurrency: 6,                         // 同时进行的图片请求数
  effect: 'particles',                    // particles | fade | none
  effectConcurrency: 3,
  effectStaggerMs: 60,
  effectDurationMs: 450,
  maxParticles: 25,
  preloadTimeoutMs: 10000,
  rootMargin: '200px',
  referrerPolicy: 'no-referrer',
  errorImageSize: 256,
};
```

- `host` 会拼成 `https://your-host/<username>.webp?s=128`，可以用 `/{id}.{format}?s={size}` 路径风格，也可改成 `?id={id}&f={format}&s={size}`。
- V2EX 是 HTTPS 页面，`host` 必须是 HTTPS，否则会被浏览器按混合内容拦截。
- `size` 全局只有一个值，不要按位置区分：同一用户用不同 `s` 会产生多个 URL，服务端每个都要重新渲染。
  需要的显示差异由脚本写入 inline style 完成，不需要多请求几张图。
- `errorImageSize` 必须与 `size` 不同，否则服务端错误图无法被识别。

### 显示尺寸：动态测量，不写死

请求尺寸恒定为 `CONFIG.size`（默认 128），所以每个用户只有一个 URL。
但页面上不同位置的头像显示大小不同（顶栏 48、主题作者 73、回复区 48、首页小头像 24）。

脚本不写死这些数值，而是在**替换前**读取原头像的布局尺寸并记到 `data-ua-box`：

- 测量时机是「原图还显示着」的时候，因此拿到的是站点真实排版尺寸；
  回复区这类没有 `width` 属性的头像也能得到正确的 48px。
- 已经是我们插入的图时不会拿它去测量，直接复用记忆下来的尺寸。
- 换图后把该尺寸写进 `style.width / style.height`，版面不跳动。
- 「临时还原」会把原始 `style` 一并还原，不留下痕迹。

规则表只负责「认出哪些元素是头像」：

```js
const ADAPTERS = [{
  id: 'v2ex',
  rules: [
    { name: '主题作者大图', selectors: ['.header img.avatar'] },
    { name: '回复区', selectors: ['[data-reply-id] img.avatar'] },
    { name: '首页最近查看过的主题', selectors: ['.cell.from_ a[href*="/member/"] img'] },
    { name: '列表 / 顶栏头像', selectors: ['img.avatar', 'a[href*="/member/"] img'] },
  ],
}];
```

- 规则按顺序匹配，先命中者生效，越具体的放越前。
- 新增位置时加一条选择器即可，不需要声明尺寸，也不需要改核心逻辑。
- `referrerPolicy` 决定是否携带 `Referer`：
  - `no-referrer`（默认）：不发 Referer，适配「配置了 `ALLOWED_ORIGINS` 且 `ALLOW_EMPTY_REFERER=true`」的服务端
  - `no-referrer-when-downgrade`：浏览器默认行为，适配「白名单已包含 `v2ex.com` 且禁止空 Referer」的服务端

> ⚠️ 如果服务端开启了 `ALLOWED_ORIGINS` 防盗链，请把 `https://www.v2ex.com` 与 `https://v2ex.com`
> 加入白名单。否则浏览器带 Referer 的请求会收到 `403`，脚本会保留原头像（表现为「头像没变化」）。

## 🧭 菜单命令

- `📊 查看替换统计`：查看已替换 / 失败 / 排队数量
- `😇 临时还原头像`：立即恢复原头像（仅当前页面，刷新即恢复）
- `🎭 重新伪装头像`：重新扫描并替换

菜单不写入任何持久化数据，脚本也不依赖 `GM_setValue`。

## ⚠️ 说明

- 服务端默认限流 `200 req / 60s / IP`，脚本用并发 6 + 浏览器强缓存（`immutable`，1 年）避免触发。
- 节点侧栏头像是 closed shadow DOM，外部脚本无法访问，不在替换范围内。
- 错误图固定 256×256，只要 `size` 不等于 256，脚本就能识别错误图并保留原头像。
- 匹配规则是 `img.avatar` 与 `a[href*="/member/"] img` 的并集：V2EX 首页「最近查看过的主题」
  的头像没有 `avatar` 类也没有 `data-uid`，只能通过成员链接定位。

## 📄 License

MIT
