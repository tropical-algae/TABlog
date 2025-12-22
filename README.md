<div align="center">
  <img src="assets/logo.png" style="vertical-align:middle;height:4em;">
  <h2 style="margin: 0.5rem">A lightweight, markdown-driven personal blog</h2>
</div>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/Language-English-blue.svg"></a>
  <a href="README_CN.md"><img src="https://img.shields.io/badge/Language-简体中文-red.svg"></a>
</p>

## 🌟 Features:
- A lightweight, responsive static blog with smooth animations
- Markdown-driven, easy to use, with LaTeX support
- Easy deployment with built-in one-click startup scripts
- A reinvented wheel built by someone who doesn’t know much about frontend

## 📷 Preview:

![](assets/blog.png)

---

## 🚀 Getting Started

1. Source Code Deployment

Refer to the [local build guide](./assets/local_build_en.md).

2. Docker Deployment (Recommended)

Run the following command to start the container:

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

> **Note**
> It is recommended to complete the configuration described in the next section before starting the container, or update the configuration after startup and then restart the container.

---

## 🛠️ How to Use

### 1. Add Your Configuration

Create an `app.json` file in the `$CONTAINER_MOUNT/config` directory. It is recommended to create it based on the [default configuration file](./public/config/app.json).

| Key          | Description            | Notes |
|--------------|-------------------------|----------------|
| title        | Main title on homepage  | The name of your blog or project |
| sub_title    | Subtitle on homepage    | A short description or slogan |
| introduction | Sidebar introduction    | Supports plain text or brief bio |
| label_map    | Label metadata mapping  | When a mapped label appears at the start of a post, it will be rendered as a tag |
| page_size    | Pagination size         | Number of posts per page in the archive |
| links        | Social/Friend links     | Supports four types of links |
| colors       | Theme color pool        | Randomly selected during route transitions |

### 2. Add Homepage Content

The homepage is rendered from a Markdown file.

- Place the [home.md](./public/config/home.md) file in the `$CONTAINER_MOUNT/config` folder.
- Place `avatar.png` and `favicon.ico` in the `$CONTAINER_MOUNT/images` folder to define your avatar and site icon.

> 📌 There are no strict rules for the content of `home.md`, but we recommend keeping it concise and avoiding complex structures.

### 3. Update Your Blog

The update process includes 2 steps:

1. Add or update your blog posts in the `$CONTAINER_MOUNT/markdowns` directory.
2. Restart your Docker container.

You can organize your blog posts in nested folders under `$CONTAINER_MOUNT/markdowns`, but make sure all local file references in your Markdown files use **relative paths**.

At the beginning of each Markdown file, you can define the tags for that post using a list, separated from the main content by a horizontal line. Here's an example based on default `app.json`:

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

The keywords that are recognized as tags need to be defined in `app.json`. For example, when you configure:

```json
"label_map": {
    "created_time": "ct",
    "tags": "tg"
}
```

then your post should be modified to:

```markdown
- ct: 2025-6-9
- tg: markdown
- tg: css
- tg: vue

---

<content>
... ...
```
