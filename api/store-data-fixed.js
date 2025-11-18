// 使用Vercel KV或其他持久化存储的替代方案
// 暂时使用内存存储 + 客户端同步的方式

// 模拟数据库
let submissions = [];

// 从localStorage或API获取现有数据
async function loadExistingData() {
    try {
        // 这里可以连接真实数据库，暂时返回空数组
        return [];
    } catch (error) {
        return [];
    }
}

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

            // 返回成功响应，包含所有数据（用于客户端同步）
            res.json({ 
                success: true, 
                message: '数据提交成功',
                data: submissions, // 返回所有数据供客户端存储
                count: submissions.length
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