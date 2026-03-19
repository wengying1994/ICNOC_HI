const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = '/data/leaderboard.json';

app.use(cors());
app.use(express.json());

// 读取数据
function readData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('读取数据失败:', e);
    }
    return [];
}

// 保存数据
function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('保存数据失败:', e);
        return false;
    }
}

// 获取所有玩家
app.get('/api/players', (req, res) => {
    const players = readData();
    // 按胜利次数降序排列
    players.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.losses - b.losses;
    });
    res.json(players);
});

// 添加玩家
app.post('/api/players', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: '需要玩家名称' });
    }
    
    const players = readData();
    if (players.some(p => p.name === name)) {
        return res.status(400).json({ error: '玩家已存在' });
    }
    
    players.push({
        name,
        wins: 0,
        losses: 0,
        storyteller: 0,
        createdAt: new Date().toISOString()
    });
    
    saveData(players);
    res.json({ success: true });
});

// 更新玩家分数 / 说书次数
app.put('/api/players/:name', (req, res) => {
    const { name } = req.params;
    const { wins, losses, storyteller } = req.body;

    const players = readData();
    const player = players.find(p => p.name === name);

    if (!player) {
        return res.status(404).json({ error: '玩家不存在' });
    }

    if (wins !== undefined) player.wins = wins;
    if (losses !== undefined) player.losses = losses;
    if (storyteller !== undefined) player.storyteller = storyteller;

    saveData(players);
    res.json({ success: true });
});

// 更新说书次数
app.post('/api/players/:name/storyteller', (req, res) => {
    const { name } = req.params;
    const { delta } = req.body;

    const players = readData();
    const player = players.find(p => p.name === name);

    if (!player) {
        return res.status(404).json({ error: '玩家不存在' });
    }

    player.storyteller = Math.max(0, (player.storyteller || 0) + delta);
    saveData(players);
    res.json({ success: true, storyteller: player.storyteller });
});

// 删除玩家
app.delete('/api/players/:name', (req, res) => {
    const { name } = req.params;
    let players = readData();
    players = players.filter(p => p.name !== name);
    saveData(players);
    res.json({ success: true });
});

// 清空所有数据
app.delete('/api/players', (req, res) => {
    saveData([]);
    res.json({ success: true });
});

// ===== 镇民VS恶魔比分 =====

const VS_DATA_FILE = '/data/vs_score.json';

function readVsData() {
    try {
        if (fs.existsSync(VS_DATA_FILE)) {
            return JSON.parse(fs.readFileSync(VS_DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('读取VS数据失败:', e);
    }
    return { villagers: 0, demons: 0 };
}

function saveVsData(data) {
    try {
        fs.writeFileSync(VS_DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('保存VS数据失败:', e);
        return false;
    }
}

// 获取比分
app.get('/api/vs-score', (req, res) => {
    res.json(readVsData());
});

// 更新比分
app.post('/api/vs-score', (req, res) => {
    const { side, delta } = req.body;
    if (!side || delta === undefined) {
        return res.status(400).json({ error: '缺少参数' });
    }
    if (side !== 'villagers' && side !== 'demons') {
        return res.status(400).json({ error: '无效的阵营' });
    }
    const data = readVsData();
    data[side] = Math.max(0, data[side] + delta);
    saveVsData(data);
    res.json({ success: true, score: data });
});

// 重置比分
app.delete('/api/vs-score', (req, res) => {
    saveVsData({ villagers: 0, demons: 0 });
    res.json({ success: true });
});

// ===== 赛季开始日期 =====

const SEASON_FILE = '/data/season.json';

function readSeasonData() {
    try {
        if (fs.existsSync(SEASON_FILE)) {
            return JSON.parse(fs.readFileSync(SEASON_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('读取赛季数据失败:', e);
    }
    return { startDate: '' };
}

function saveSeasonData(data) {
    try {
        fs.writeFileSync(SEASON_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('保存赛季数据失败:', e);
        return false;
    }
}

// 获取赛季开始日期
app.get('/api/season', (req, res) => {
    res.json(readSeasonData());
});

// 更新赛季开始日期
app.post('/api/season', (req, res) => {
    const { startDate } = req.body;
    saveSeasonData({ startDate: startDate || '' });
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`API 服务运行在端口 ${PORT}`);
});
