# 软件工程项目：智慧休息/休息助手

GitHub 仓库：[https://github.com/okkjoo/wisely_relax](https://github.com/okkjoo/wisely_relax)

# git commit 简单约束

● 『feat』: 新增功能
● 『fix』: 修复 bug
● 『docs』: 仅仅修改了文档，比如 README, CHANGELOG 等等
● 『test』: 增加/修改测试用例，包括单元测试、集成测试等
● 『style』: 修改了空行、缩进格式、引用包排序等等（不改变代码逻辑）
● 『perf』: 优化相关内容，比如提升性能、体验、算法等
● 『refactor』: 代码重构，「没有新功能或者 bug 修复」
● 『chore』: 改变构建流程、或者增加依赖库、工具等
● 『revert』: 回滚到上一个版本
● 『merge』: 代码合并

# 目录

├── electron Electron 源码文件夹
│ ├── main Main-process 源码
│ ├── preload Preload-scripts 源码
│ └── resources 应用打包的资源文件夹
│ ├── icon.icns 应用图标(macOS)
│ ├── icon.ico 应用图标
│ ├── installerIcon.ico 安装图标
│ └── uninstallerIcon.ico 卸载图标
│
├── release 构建后生成程序目录
│ └── {version}
│ ├── {os}-unpacked 未打包的程序(绿色运行版)
│ └── Setup.{ext} 应用安装文件
│
├── public 同 Vite 模板的 public
└── src 渲染进程源码、React 代码
