export const parseCookie = str => {
    if (str.length === 0) { return str }
    return str
        .split('; ')
        .reduce((acc, v) => {
            const [name, ...value] = v.split('=')
            let jsonStr = isJSON(value[0])
            if (jsonStr) {
                acc[name] = jsonStr
            } else {
                acc[name] = value[0]
            }
            return acc
        }, {})
}

export const isJSON = str => {
    try {
        var o = JSON.parse(str)
        if (o && typeof o === 'object') { return o }
    }
    catch (e) { console.log('not JSON')}
    return false
}

export const getExpiration = (offset) => {
    let date = new Date()
    date.setDate(date.getDate()+offset)
    return date.toUTCString()
}

export const saveCookie = ({name, value}) => {
    document.cookie = `${name}=${JSON.stringify(value)}; expires=${value.Expires}; SameSite=None; Secure`
}

export const serializeCookie = (name, val) =>
    `${encodeURIComponent(name)}=${encodeURIComponent(val)}`

