### ⚙️ 部署环境

项目基于Docker部署，部署前请确保你的环境中包含以下工具：

> ⚠️ 以下版本仅供参考，过低版本可能导致构建失败

- **Docker**： v27.0.2
- **npm**： v10.5.2
- **Node.js**： v20.13.1

#### 1. 添加 .env

参考[.env.example](.env.example)，创建一份属于你的 `.env` 文件，示例配置如下：

| 名称 | 介绍 |
| --- | --- |
| VITE_SITE_TITLE | 网页标题 |
| VITE_WEB_PORT | Dev阶段绑定的端口 |
| IMAGE_NAME | 打包的镜像名 |
| IMAGE_VERSION | 打包的镜像版本 |
| CONTAINER_PORT | 容器开放的端口 |
| CONTAINER_MOUNT | 容器挂载的目录 |

#### 2. 一键构建与启动

使用如下命令构建镜像并运行容器：

```bash
bach script/clean.sh   # 清除缓存与镜像/容器
bash scripts/build.sh  # 打包并构建镜像
bash scripts/run.sh    # 启动容器
```
