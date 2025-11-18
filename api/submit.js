// Vercel Serverless Function for data submission
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Only POST method allowed' 
    });
  }

  try {
    const submissionData = {
      ...req.body,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    };

    console.log('收到提交数据:', submissionData);

    // 简单返回成功，不依赖文件系统
    res.json({ 
      success: true, 
      message: '数据提交成功',
      data: submissionData
    });

  } catch (error) {
    console.error('处理提交数据时出错:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误: ' + error.message 
    });
  }
};