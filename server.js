import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import validateSite from './api/validate-site.js'
import ipinfoHandler from './api/ipinfo.js'
import ipapicomHandler from './api/ipapicom.js'
import keycdnHandler from './api/keycdn.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 11966

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 设置静态文件服务
app.use(express.static(path.join(__dirname, './dist')))

// 使用查询参数处理所有 IP 地址请求
app.get('/api/ipinfo', ipinfoHandler)
app.get('/api/ipapicom', ipapicomHandler)
app.get('/api/keycdn', keycdnHandler)

// 一些判断
app.all('/api/validate-site', validateSite)

// SPA fallback: 所有其他请求返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'))
})

// 启动服务器
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
