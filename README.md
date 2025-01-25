# frame-window

将网页包装成桌面应用. bun, vite, vue, tauri

## Preset

- <https://bun.sh/>
- <https://tauri.app/>

## Develop

```bash
$ bun install

$ bun run tauri dev

```

### 添加权限

> /src-tauri/capabilities/default.json

## 配置

> /src-tauri/tauri.conf.json

- 安装包名: `productName`
- 版本号: `version`
- 窗口标题: `app.windows[0].title`

## 生成图标

```bash
$ bun run tauri icon <icon_path> # 提供一张1024分辨率的png即可

# e.g.
$ bun run tauri icon ./public/logo2.png
```

## Deploy

```bash
$ pnpm tauri build
```

打包文件在 `/src-tauri/target/release/bundle` 中
