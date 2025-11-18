const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 数据存储文件
const dataFile = path.join(dataDir, 'submissions.json');

// 读取现有数据
function readData() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('读取数据文件失败:', error);
        return [];
    }
}

// 保存数据
function saveData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('保存数据文件失败:', error);
        return false;
    }
}

// 提交数据API
app.post('/submit', (req, res) => {
    try {
        const submissionData = {
            ...req.body,
            timestamp: new Date().toISOString(),
            ip: req.ip || req.headers['x-forwarded-for'] || 'unknown'
        };
        
        console.log('收到提交数据:', submissionData);
        
        // 读取现有数据
        const existingData = readData();
        
        // 添加新数据
        existingData.push(submissionData);
        
        // 保存到文件
        const saved = saveData(existingData);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: '数据提交成功',
                id: existingData.length
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: '数据保存失败' 
            });
        }
        
    } catch (error) {
        console.error('处理提交数据时出错:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器内部错误' 
        });
    }
});

// 获取所有提交数据的API（用于管理）
app.get('/api/submissions', (req, res) => {
    try {
        const data = readData();
        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({
            success: false,
            error: '获取数据失败'
        });
    }
});

// 健康检查API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`数据保存在: ${dataFile}`);
});

module.exports = app;