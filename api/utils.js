import { get } from 'https'

export function httpGet(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url)
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            timeout: 10000
        }

        get(options, (res) => {
            let data = ''
            res.on('data', (chunk) => (data += chunk))
            res.on('end', () => resolve(data))
            res.on('error', (e) => reject(e))
        })
            .on('error', (e) => reject(e))
            .setTimeout(10000, () => {
                reject(new Error('Request timeout'))
            })
    })
}
