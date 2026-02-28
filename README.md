<div align="center">
  <img src=".github/assets/logo.png" style="vertical-align:middle;height:4em;">
  <h2 style="margin: 0.3rem">A lightweight, markdown-driven personal blog</h2>
</div>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/Language-English-blue.svg"></a>
  <a href="README_CN.md"><img src="https://img.shields.io/badge/Language-简体中文-red.svg"></a>
  <a href="https://tablog.reeflats.com"><img src="https://img.shields.io/badge/DEMO-487231?logo=github"></a>
</p>

![](.github/assets/preview.png)

**Live Demo**: [Demo](https://tablog.reeflats.com)


## Features:
- A lightweight, responsive static blog with smooth animations
- Markdown-driven, easy to use, with LaTeX support
- Easy deployment with built-in one-click startup scripts
- A reinvented wheel built by someone who doesn’t know much about frontend


## Getting Started

### 1. Source Code Deployment

Refer to the [local build guide](./.github/assets/local_build_en.md).


### 2. Docker Deployment (Recommended)

Define environment variables:

```shell
export TABLOG_PORT=10000
export TABLOG_MOUNT=./
```

Copy default configuration files for persistent mounting (Initial Setup):

```shell
docker create --name tablog_tmp tropicalalgae/tablog:latest

docker cp tablog_tmp:/app/config ${TABLOG_MOUNT:-$(pwd)}
docker cp tablog_tmp:/app/images ${TABLOG_MOUNT:-$(pwd)}
docker cp tablog_tmp:/app/markdowns ${TABLOG_MOUNT:-$(pwd)}

docker rm tablog_tmp
```

Start the container:

```shell
docker run -itd --name tablog \
--restart=unless-stopped \
-p ${TABLOG_PORT:-10000}:80 \
-v ${TABLOG_MOUNT:-$(pwd)}/config:/app/config \
-v ${TABLOG_MOUNT:-$(pwd)}/images:/app/images \
-v ${TABLOG_MOUNT:-$(pwd)}/markdowns:/app/markdowns \
tropicalalgae/tablog:latest
```

---

## How to Use

### 1. Customize Your Configuration
Edit the mounted configuration file [config/app.json](./public/config/app.json):

| Key          | Description            | Notes |
|--------------|-------------------------|----------------|
| title        | Main title on homepage  | The name of your blog or project |
| sub_title    | Subtitle on homepage    | A short description or slogan |
| introduction | Sidebar introduction    | Supports plain text or brief bio |
| copyright  	 | Copyright Info	         | Located in the blog footer |
| label_map    | Label metadata mapping  | When a mapped label appears at the start of a post, it will be rendered as a tag |
| page_size    | Pagination size         | Number of posts per page in the archive |
| links        | Social/Friend links     | Supports four types of links |
| colors       | Theme color pool        | Randomly selected during route transitions |

### 2. Add Homepage Content

The homepage is rendered from a Markdown file.

- Edit the mounted homepage file [config/home.md](./public/config/home.md)
- Replace the assets in the mounted  [images/](./public/images) directory: `avatar.png` (Avatar) and `favicon.ico` (Site Icon).

> There are no strict rules for the content of `home.md`, but we recommend keeping it concise and avoiding complex structures.

### 3. Update Your Blog

Updating your blog involves two simple steps:

1. Add or update your Markdown files in the [markdowns/](./public/images) directory.
2. Restart your Docker container to apply changes.

You can organize your blog posts in nested folders under [markdowns/](./public/images), but make sure all local file references in your Markdown files use **relative paths**.

At the beginning of each Markdown file, you can define the tags for that post using a list, separated from the main content by a horizontal line. Here's an example based on default `app.json`:

```markdown
- created_time: 2025-6-9
- tags: markdown
- tags: css
- tags: vue

---

<content>
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
```

## License

This project is licensed under the [MIT License](https://github.com/tropical-algae/TABlog/blob/main/LICENSE).