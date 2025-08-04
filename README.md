# 贪吃蛇游戏 🐍

**中文** | [English](./README_EN.md)

这是一个使用 [Next.js](https://nextjs.org) 构建的经典贪吃蛇游戏项目。

## 游戏特性

- 🎮 经典贪吃蛇游戏玩法
- 🎯 实时分数显示
- ⌨️ 键盘控制（方向键或 WASD）
- 📱 响应式设计，支持移动端
- 🎨 现代化 UI 设计

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
# 或者
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看游戏。

## 游戏控制

- **方向键** 或 **WASD** - 控制蛇的移动方向
- **空格键** - 暂停/继续游戏
- **R键** - 重新开始游戏

## 技术栈

- [Next.js 15](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [React](https://reactjs.org/) - UI 库

## 项目结构

```
next-snake/
├── app/                  # Next.js App Router
├── components/           # React 组件
├── lib/                  # 工具函数
├── types/               # TypeScript 类型定义
└── public/              # 静态资源
```

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署，这是 Next.js 创作者提供的平台。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。
