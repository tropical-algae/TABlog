<div align="center">
  <img src="assets/logo.png" style="vertical-align:middle;height:4em;">
  <h2 style="margin: 0.5rem">一个轻量级的、Markdown 驱动的个人博客</h2>
</div>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/Language-English-blue.svg"></a>
  <a href="README_CN.md"><img src="https://img.shields.io/badge/Language-简体中文-red.svg"></a>
</p>

## 🌟 特点：
- 轻量化、响应式的静态博客，动画流畅自然
- Markdown 驱动，简单易用，支持 LaTeX
- 部署便捷，内置一键启动脚本
- 是一个不懂前端的人重复造的轮子

## 📷 预览：

![](assets/blog.png)

---

## 🚀 如何启动？

### 1. 源码部署

参考 [本地构建方法](./assets/local_build_cn.md)。

### 2. Docker部署（推荐）

运行以下命令以启动容器：

```shell
PORT=10000
CONTAINER_MOUNT=/data/tablog

docker run -itd --name tablog \
--restart=unless-stopped \
-p $PORT:80 \
-v $CONTAINER_MOUNT/config:/app/config \
-v $CONTAINER_MOUNT/images:/app/images \
-v $CONTAINER_MOUNT/markdowns:/app/markdowns \
tropicalalgae/tablog:latest
```

> **提示** 
> 建议先完成下一节的配置后再启动容器；或者先运行容器，再补充配置并重启

---

## 🛠️  如何使用？

### 1. 添加你的配置

在 `$CONTAINER_MOUNT/config` 目录下创建 `app.json` 文件。建议参考 [默认配置文件](./public/config/app.json) 进行修改。

| Key          | 说明           | 备注 |
|--------------|----------------|-----------|
| title        | 首页大标题     | 你的博客或项目名称 |
| sub_title    | 首页副标题     | 一句简短的描述或口号 |
| introduction | 侧边栏简介     | 支持纯文本或简短介绍 |
| label_map    | 标签元数据映射 | 被映射的label名出现在post开头时，将被渲染为tag |
| page_size    | 分页条数       | 归档页每页展示的文章数量 |
| links        | 社交/友链配置   | 支持四种类型的link |
| colors       | 主题颜色池     | 路由跳转时随机配色 |

### 2. 添加主页信息

主页将由一个markdown文件渲染。

1. 在 `$CONTAINER_MOUNT/config` 文件夹中，添加[home.md](./public/config/home.md)
2. 在 `$CONTAINER_MOUNT/images` 文件夹中，添加 `avatar.png` 和 `favicon.ico` 以声明你的头像和图标。

> 📌 home中的内容没有显式的限制，但是我们建议您保持内容简洁，不要包含复杂结构。

### 3. 更新博客

更新过程包括两个步骤:

1. 添加/更新 您的博客到 `$CONTAINER_MOUNT/markdowns` 中
2. 重启你的docker容器

可以使用嵌套的文件夹管理你在 `$CONTAINER_MOUNT/markdowns` 下的博客，但请确保markdown中的本地文件引用使用**相对路径**。

在每个markdown的开头，您可以使用一个列表定义本篇博客的tag，并以分割线将其与正文区分。以下是基于默认配置实现一个例子:

```markdown
- created_time: 2025-6-9
- tags: markdown
- tags: css
- tags: vue

---

<content>
... ...
```

---

被识别为标签的关键字需要在 `app.json` 中定义。例如，当你配置了：

```json
"label_map": {
    "created_time": "ct",
    "tags": "tg"
}
```

则你的post应该修改为：

```markdown
- ct: 2025-6-9
- tg: markdown
- tg: css
- tg: vue

---

<content>
... ...
```
