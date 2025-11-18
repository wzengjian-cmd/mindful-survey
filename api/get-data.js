// 获取数据的专用API端点
export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // 这里我们模拟从共享存储获取数据
            // 在实际应用中，这里会连接数据库
            const mockData = [
                {
                    name: "测试用户1",
                    phone: "13800138001", 
                    stateAnxietyScores: [3, 2, 3, 2, 3],
                    traitAnxietyScores: [3, 3, 3, 3, 3],
                    timestamp: new Date().toISOString(),
                    ip: "127.0.0.1"
                }
            ];

            console.log('返回模拟数据，总数:', mockData.length);

            res.json({ 
                success: true, 
                message: '数据获取成功',
                count: mockData.length,
                data: mockData,
                note: '这是模拟数据，请使用store-data API提交真实数据'
            });

        } else {
            res.status(405).json({ 
                success: false, 
                error: 'Only GET method allowed' 
            });
        }

    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器内部错误: ' + error.message 
        });
    }
}