export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: 'Only GET method allowed' 
        });
    }

    try {
        // 由于Vercel是serverless，我们无法持久化存储
        // 这里返回一个模拟数据结构
        // 实际使用时，建议集成数据库或Google Sheets
        
        res.json({
            success: true,
            message: '请使用管理后台查看本地存储的数据',
            count: 0,
            data: []
        });

    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器内部错误: ' + error.message 
        });
    }
};