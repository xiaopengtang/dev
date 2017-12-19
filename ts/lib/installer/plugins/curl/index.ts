/**
 * 新建Curl模块
 * errorCode
 *    20001 -- 不支持jsonp
 */
import * as common from '../../../common'
// 用于记录
let num: number = 0



export interface Setting {
    timeout?: number,
    dataType?: string
}

let CONFIG: Setting = {
    timeout: 20 * 60 * 1000,
    dataType: 'json'
}

const IS_WIN: boolean = typeof self !== 'undefined' && self.self === self

export const jsonp = (params: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!IS_WIN) {
            return
        }
        const $win: any = typeof self !== 'undefined' && self.self === self && self
        let { data, url, timeout } = params
        url = url || $win.location.href
        const joinTag = /\?/.test(url) ? '&' : '?'
        const script: any = document.createElement('script')
        const $header = document.getElementsByTagName('head')[0]
        num++
        let callback = 'callback' + num
        let param = [url]
        let arr: Array<any> = []
        common.utils.isObject(data) && Object.keys(data).forEach(name => arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(typeof data[name] == 'object' ? JSON.stringify(data[name]) : data[name])))
        arr.push(`callback=${callback}`)
        param.push(arr.join('&'))
        script.src = param.join(joinTag)
        $header.appendChild(script)
        $win[callback] = (json: any) => {
            $header.removeChild(script)
            clearTimeout(script.timer)
            delete $win[callback]
            resolve(json) // reason: you can
        }
        if (timeout) {
            script.timer = setTimeout(() => {
                delete $win[callback]
                $header.removeChild(script)
                reject(new Error('请求超时'))
            }, timeout)
        }
    })
}

// 设置
export const send = async() => {
    const axios = await common.$container.getSupportExtensions('axios')
}


// 修改配置
export default (setting: Setting) => {
    CONFIG = {...CONFIG, ...setting}
    return 
}