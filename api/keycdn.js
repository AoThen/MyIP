import { get } from 'https'

function isValidIP(ip) {
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Pattern =
        /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?))$/
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip)
}

export default (req, res) => {
    // 不再严格检查 Referer，因为这些 API 是内部使用的
    const referer = req.headers.referer

    // 允许无 Referer 的请求（curl、服务器端调用）或本地请求
    if (referer) {
        const allowedDomains = ['localhost', '127.0.0.1', ...(process.env.ALLOWED_DOMAINS || '').split(',')]
        const domain = new URL(referer).hostname
        if (!allowedDomains.includes(domain) && !domain.includes('localhost') && !domain.includes('127.0.0.1')) {
            console.warn(`Referer check: ${domain} not in allowed list, but allowing request`)
        }
    }

    // 从请求中获取 IP 地址
    const ipAddress = req.query.ip
    if (!ipAddress) {
        return res.status(400).json({ error: 'No IP address provided' })
    }

    // 检查 IP 地址是否合法
    if (!isValidIP(ipAddress)) {
        return res.status(400).json({ error: 'Invalid IP address' })
    }

    // 构建请求 keycdn.com 的 URL
    const url = new URL(`https://tools.keycdn.com/geo.json?host=${ipAddress}`)

    // 设置请求选项，包括 User-Agent
    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: {
            'User-Agent': 'keycdn-tools:' + (process.env.KEYCDN_USER_AGENT || 'MyIP-Local/1.0')
        }
    }

    get(options, (apiRes) => {
        let data = ''
        apiRes.on('data', (chunk) => (data += chunk))
        apiRes.on('end', () => {
            try {
                const originalJson = JSON.parse(data)
                const modifiedJson = modifyJsonForKeyCDN(originalJson)
                res.json(modifiedJson)
            } catch (e) {
                res.status(500).json({ error: 'Error parsing JSON' })
            }
        })
    }).on('error', (e) => {
        res.status(500).json({ error: e.message })
    })
}

function modifyJsonForKeyCDN(json) {
    const {
        data: {
            geo: { ip, city, region_name, country_name, country_code, latitude, longitude, isp, asn }
        }
    } = json

    return {
        ip,
        city,
        region: region_name,
        country: country_code,
        country_name,
        country_code,
        latitude,
        longitude,
        asn: 'AS' + asn,
        org: isp
    }
}
