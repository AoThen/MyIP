import { get } from 'http'

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

    // 构建请求 ip-api.com 的 URL
    const url = `http://ip-api.com/json/${ipAddress}`

    get(url, (apiRes) => {
        let data = ''
        apiRes.on('data', (chunk) => (data += chunk))
        apiRes.on('end', () => {
            try {
                const originalJson = JSON.parse(data)
                const modifiedJson = modifyJsonForIPAPI(originalJson)
                res.json(modifiedJson)
            } catch (e) {
                res.status(500).json({ error: 'Error parsing JSON' })
            }
        })
    }).on('error', (e) => {
        res.status(500).json({ error: e.message })
    })
}

function modifyJsonForIPAPI(json) {
    const { query, country, countryCode, regionName, city, lat, lon, isp, as } = json
    const asn = as ? as.split(' ')[0] : ''

    return {
        ip: query,
        city,
        region: regionName,
        country: countryCode,
        country_name: country,
        country_code: countryCode,
        latitude: lat,
        longitude: lon,
        asn,
        org: isp
    }
}
