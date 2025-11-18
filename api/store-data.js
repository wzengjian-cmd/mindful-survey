// 使用全局变量模拟数据存储（适合Vercel Serverless）
let submissions = [];

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'POST') {
            // 保存新数据
            const submissionData = {
                ...req.body,
                timestamp: new Date().toISOString(),
                ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
            };

            submissions.push(submissionData);

            console.log('新数据已保存:', submissionData.name, '- 总数:', submissions.length);

            // 返回成功响应
            res.json({ 
                success: true, 
                message: '数据保存成功',
                count: submissions.length,
                id: submissions.length
            });

        } else if (req.method === 'GET') {
            // 返回所有数据
            console.log('获取数据请求，当前总数:', submissions.length);

            res.json({ 
                success: true, 
                message: '数据获取成功',
                count: submissions.length,
                data: submissions
            });

        } else {
            res.status(405).json({ 
                success: false, 
                error: 'Method not allowed' 
            });
        }

    } catch (error) {
        console.error('API错误:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器内部错误: ' + error.message 
        });
    }
}