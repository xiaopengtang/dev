/**
 * 配置函数
 */

import * as utils from '../utils'
const CONFIG: any = {}

namespace Modules {
    export const setter = async(key: string, value: any, limit: undefined | Array<string>) => {
        let setting: any = utils.isObject(key) ? key : {
            [key]: value
        }
        limit = limit || Object.keys(setting)
        if (limit.length === 0) {
            return
        }
        let [name, ...other] = limit
        const val: any = setting[name]
        const oldValue: any = getter(name)
        const result: any = utils.isFunction(val) ? await new Promise(resolve => val.call(true, resolve, oldValue)) : val
        const arr: Array<string> = name.split('.')
        const FN: Function = new Function('setting', 'result', [
            ...arr.map((r, i) => {
                const index = arr.slice(0, i + 1).join('.')
                return [
                    `;(function(){`,
                    `    var old = setting.${index}`,
                    `    var is_set = ${i === arr.length - 1}`,
                    `    var val = Object.prototype.toString.apply(old) === '[object Object]' ? old : {}`,
                    `    setting.${index} = is_set ? result : val`,
                    `})()`
                ].join('\n')
            })
        ].join('\n'))
        FN(setting, result) // 设值
        const hasLimit = [...other]
        let ret: any = hasLimit.length ? await setter(setting, void 0, hasLimit) : CONFIG.setting = setting
        return ret
    }
    // 取值
    export const getter = (name: string) => {
        const r: RegExp = /^([^@]+)(@(.+))?$/
        // console.log({name})
        if (!r.test(name)) {
            return
        }
        const key:string = RegExp.$1
        const module:string = RegExp.$3 || 'setting'
        const FN = new Function('setting', [
            `var ret`,
            `try{`,
            `    ret = setting.${key}`,
            `}catch(e){`,
            // `    ret = null`,
            `}`,
            `return ret`
        ].join('\n'))
        return FN(CONFIG[module])
    }
}
const config = async(key: any, value?: any) => {
    let reader
    if (utils.isString(key) && utils.isFunction(value)) {
        reader = (resolve: Function, oldValue: any) => {
            const res = value(oldValue)
            return resolve(res === void 0 ? oldValue : res)
        }
    } else {
        reader = value
    }
    const isSetter = utils.isObject(key) || utils.isString(key) && value !== void 0
    return Modules[isSetter ? 'setter' : 'getter'].apply(true, [key, reader])
}
export {config}