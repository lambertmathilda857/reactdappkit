// 引入依赖
const express = require('express');
const dotenv = require('dotenv').config();
const Web3 = require('web3');
const morgan = require('morgan');
const axios = require('axios');

// Web3配置和初始化
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// Express应用初始化
const app = express();

// 使用Morgan进行请求日志记录
app.use(morgan('dev'));

// 解析JSON请求体
app.use(express.json());

// 简单的GET路由，返回欢迎信息
app.get('/', (req, res) => {
  res.send('Welcome to the Blockchain Express Server!');
});

// GET路由，调用智能合约
app.get('/contract-data', async (req, res) => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contractABI = JSON.parse(process.env.CONTRACT_ABI);

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const data = await contract.methods.someMethod().call(); // 假设合约中有一个someMethod方法

    res.json({ success: true, data: data });
  } catch (error) {
    console.error('Error fetching contract data:', error);
    res.status(500).json({ success: false, message: 'Error fetching contract data' });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 服务器启动
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
