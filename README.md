# 紫罗兰 - 血染钟楼管理平台

基于 Docker 的血染钟楼剧本管理平台，集成了说书人后台、玩家排行榜、门户口等模块。

---

## 🗂️ 项目结构

```
/app/code/
├── docker-compose.yml          # Docker 编排配置
├── portal/                     # 门户首页
│   └── index.html
├── traefik/                    # 反向代理
│   ├── traefik.yml
│   └── dynamic.yml
└── 血染钟楼/
    └── blood_nice/
        ├── Dockerfile           # 前端镜像
        ├── Dockerfile.api       # API 镜像（Node.js + nginx）
        ├── package.json
        ├── server.js            # Express API 服务
        ├── blood-nginx.conf     # nginx 配置
        └── src/
            ├── index.html        # 首页
            ├── room.html         # 房间页面
            ├── room_follower.html # 说书人后台（玩家管理）
            ├── leaderboard.html   # 排行榜
            └── board_generator.html # 身份板生成器
```

---

## 🚀 快速部署

```bash
cd /app/code
docker compose up -d --build
```

访问入口：
- 首页：`http://117.72.163.39/`
- 血染钟楼：`http://117.72.163.39/blood-crypt/`
- 玩家排行榜：`http://117.72.163.39/leaderboard`

---

## 📦 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| traefik | 80 / 8080 | 反向代理 + 仪表盘 |
| portal | - | 门户首页 |
| blood-web | - | 血染钟楼前端静态资源 |
| blood-api | - | Node.js API 服务（排行榜/VS比分/说书人数据） |

---

## 🎮 功能模块

### 说书人后台（room_follower.html）
- 玩家管理：添加、编辑、删除玩家
- 玩家状态：存活、死亡、中毒、疯狂、死亡+疯狂、死亡+中毒、死亡+已投票
- 昼夜阶段切换
- 定时器（1 / 3 / 10 分钟）
- 行动记录（夜间/白天）
- 复盘导出

### 玩家排行榜（leaderboard.html）
- 胜利积分系统：镇民获胜 +1分，恶魔获胜 +2分
- 镇民 VS 恶魔比分展示
- 头榜说书人统计（说书次数排行）
- 添加 / 删除玩家

### 身份板生成器（board_generator.html）
- 随机生成身份板配置

### 门户口（portal/index.html）
- 入口导航页面

---

## 🛠️ 技术栈

- **容器编排**：Docker Compose + Traefik v3
- **前端**：原生 HTML/CSS/JavaScript（无框架）
- **后端 API**：Node.js + Express
- **代理**：nginx
- **数据存储**：本地文件（`/data/*.json`）
