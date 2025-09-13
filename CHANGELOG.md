## [1.1.1](https://github.com/tropical-algae/TABlog/compare/v1.1.0...v1.1.1) (2025-09-13)


### Bug Fixes

* resolve style inconsistencies and date parsing issues ([2ef61f6](https://github.com/tropical-algae/TABlog/commit/2ef61f683d7157d93d5efa06f6f4bb36ca501f13))

# [1.1.0](https://github.com/tropical-algae/TABlog/compare/v1.0.0...v1.1.0) (2025-09-13)


### Features

* Add timeline for posts ([58c6f6a](https://github.com/tropical-algae/TABlog/commit/58c6f6ac8585afe527ee0d39b50a48320a01110f))

# 1.0.0 (2025-09-13)


### Bug Fixes

* change default value of relaetd post limit ([252b36a](https://github.com/tropical-algae/TABlog/commit/252b36afeae6da63b58a78061f7e906a9d90a772))
* change favicon file type ([217fd9c](https://github.com/tropical-algae/TABlog/commit/217fd9cad12265abe1d51389443ef06824d87776))
* fix bug ([91b509f](https://github.com/tropical-algae/TABlog/commit/91b509f4bb87da59cac763f2b0ddcf4e20c4af25))
* fix bugs ([c61e362](https://github.com/tropical-algae/TABlog/commit/c61e362d329f109a50891c419c136133e293aeed))
* Fix bugs ([9f52b96](https://github.com/tropical-algae/TABlog/commit/9f52b966d12306a01f1442d2198d2adb6249fa6b))
* Fix bugs, resolve compatibility issues ([cf6cc95](https://github.com/tropical-algae/TABlog/commit/cf6cc9527a99adb6fbc8aa970eeac8edbb593afc))
* fix init script module path issue ([db5ed7c](https://github.com/tropical-algae/TABlog/commit/db5ed7cc38c13bad5239ce61b8b4ba4dc6ce11fb))
* fix release config ([9bb5a7a](https://github.com/tropical-algae/TABlog/commit/9bb5a7a67fedf66219e9c56e2d2a05c60c2ffbd4))
* fix spelling errors ([c302e80](https://github.com/tropical-algae/TABlog/commit/c302e801a8823d03b3a525990db009d55e7bb08d))
* fix the latex math display issue ([48234cb](https://github.com/tropical-algae/TABlog/commit/48234cbe1fdb87cec277d50cfa870588e19f38e3))
* prevent background flicker caused by delayed loading ([df535ca](https://github.com/tropical-algae/TABlog/commit/df535ca372d81ed6cf4ccd32f8bee24f9b24e1da))


### Features

* Add config for fixed footer ([3df5d27](https://github.com/tropical-algae/TABlog/commit/3df5d270cb2086eb2693d17a6253ab96f2e15752))
* Add Dockerfile and Docker Image building scripts ([97d5122](https://github.com/tropical-algae/TABlog/commit/97d5122dce349f559a42295dcd7f250017bebb2e))
* add dynamic document title ([f148c4d](https://github.com/tropical-algae/TABlog/commit/f148c4db8f20edb8ed6b38eb5bd9a7dc3118916f))
* Add github workflow cicd ([69da88b](https://github.com/tropical-algae/TABlog/commit/69da88bbad3822019456cd60396c9c4725ad6044))
* add new style for index page and introduction bar ([08cb570](https://github.com/tropical-algae/TABlog/commit/08cb570a4ca2018a44afd7f9756403cde0ce9a92))
* add new styles ([a625daf](https://github.com/tropical-algae/TABlog/commit/a625daf88ae89ebf80ffadb16d2a4b8acaf236df))
* add support for LaTeX equations ([85bb55d](https://github.com/tropical-algae/TABlog/commit/85bb55d53efd553569e9befb383239ce4135a1a3))
* Add tags filter in introduction bar ([d1519bf](https://github.com/tropical-algae/TABlog/commit/d1519bf96eb267d4dbfba8e0e90cc322a754219b))
* And paging function for index page ([6ad0d51](https://github.com/tropical-algae/TABlog/commit/6ad0d51128b758ed59e78200c6e790ba01aa2562))
* calculate hash of files for nginx cache rule ([16077ac](https://github.com/tropical-algae/TABlog/commit/16077ac2faef728041daa0905d54636512f5c764))
* change css, add img link ([94f4fa5](https://github.com/tropical-algae/TABlog/commit/94f4fa5fb6234d6627ba55d5fa9a3e2fcb3cabe6))
* improve asset caching strategy and Markdown filename parsing ([85d4755](https://github.com/tropical-algae/TABlog/commit/85d4755cbbdf3c3ce9314f4226fcde3e62d524b5))
* init repository ([64686ee](https://github.com/tropical-algae/TABlog/commit/64686eec2e86a70e8ae27badfda3c9bc269689a6))
* limit related posts to 8 per tag ([c5e52a8](https://github.com/tropical-algae/TABlog/commit/c5e52a8a569656339e01f0589d1e0121a505a58c))
* optimize css of index bar and home bar ([73d4430](https://github.com/tropical-algae/TABlog/commit/73d4430cedfdce4db4503a840d3a583d496811c5))
* optimize css style ([e470f41](https://github.com/tropical-algae/TABlog/commit/e470f4135884ae4608e110c01424c77e368916d1))
* optimized code ([7efea5b](https://github.com/tropical-algae/TABlog/commit/7efea5bb65b2fee14499e916b4f9ed8eba80125d))
* Update cache policy ([d82be1f](https://github.com/tropical-algae/TABlog/commit/d82be1f96dfbbf45b071eaf9eee2682996807c32))
* v2.0 improve display and fix minor UI issues ([66b849a](https://github.com/tropical-algae/TABlog/commit/66b849a00792bb9c17ae34b3dd0c7335d6b0828b))

---

# History

## 2025/6/5 Thu

**Feat**:

- 三个基本页面（主页、索引、Post页）
- 一堆乱七八糟的样式
- 可自定义的主题色切换动画、页面切换/加载动画
- markdown动态加载与渲染、post属性的配置与解析
- 可配置项：个人信息链接、主页信息、简介、配色方案等

**Fixed**:

- 解决markdown渲染后本地路径资源不存在的问题


## 2025/6/6 Fri

**Feat**:

- 修改Introduction栏样式，添加Home键
- 修改索引页、索引栏样式、添加超长截断
- 修改打包时的script脚本路径

**Fixed**:

- 解决索引页链接动画与截断的冲突问题


## 2025/6/8 Sun

**Feat**:

- 添加Dockerfile与镜像构建脚本
- 调整部分格式、字号等
- 添加Latex公式渲染的支持

**Fixed**:

- 修复打包后初始化脚本中的模块导入路径问题


## 2025/6/9 Mon

**Feat**:

- 添加CSS代码风格审查工具、修改部分样式
- 修改nginx的静态资源缓存策略
- 调整md文件名抽取脚本、增强系统鲁棒性

**chore**:

- 整理部分代码
- 更新README

## 2025/6/11 Wed

**Feat**:

- 设计了新的页面布局、为固定的页脚添加配置项
- 动态调整索引页展示的的标签数量
- 优化博客页的标签展示，以及一些细节

**Fix**:

- 修复一些意料外的布局错误
- 修复部分样式问题

## 2025/6/21 Sat

**chore**:

- 新添加了一些预设样式

**Fix**:

- 解决了部分浏览器的兼容性问题
- 调整部分样式
- 调整了一些不合理的代码和定义

## 2025/9/4 Thu

**Feat**:

- 调整缓存策略，解决添加md后网页无法同步更新的问题
- css防ios页面回弹

## 2025/9/6 Sat

**Refactor**:

- 优化router guard初次注册时页面的样式表现
- 优化在移动端的表现
- 优化部分css，规范部分命名
- 优化App中嵌套的结构

**Fix**:

- 修复config的getter默认值赋值错误问题
- 解决页面跳转后定位不符预期的问题

**Docs**:

- 更新README中的logo

## 2025/9/7 Sun

**Feat**:

- 为文件计算了hash，修改nginx的cache策略
- 新增config的后处理文件夹
- 解决延迟加载造成的背景色闪烁问题
- 添加动态文档标题

**Refactor**:

- 优化部分文件结构与函数
- 解决重复的资源请求问题，优化生命周期内的资源调度

**Fix**:

- 修复build脚本中env加载存在解析错误的问题

## 2025/9/8 Mon

**Feat**:

- 新增按标签过滤post的组件

**Refactor**:

- 优化部分css，调整页面在不同分辨率下的表现与已知的动画问题
- 优化pinia与部分js脚本
- 标准化部分参数命名

## 2025/9/11 Thu

**Fix**:

- 修复不同格式的latex数学公式渲染错误的问题

## 2025/9/13 Sat

**Feat**:

- 添加档案页的分页功能
- 为页面尺寸（单页最大post显示数量）添加配置 "page_size"，默认取12
- 为构建脚本添加缓存文件清除步骤

**Refactor**:

- 优化部分样式
