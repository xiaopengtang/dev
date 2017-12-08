/**
 * 注册器
 */
import {Container} from '../container'
import * as utils from '../utils'

const COMMON: any = {}

class Register {
    private $container = new Container()
    private $modules: any = {}
    private $config: any = {}
    constructor(setting: any){
        setting = utils.isObject(setting) ? setting : {}
        this.$config.protected = !!setting.protected
    }
    async create(name: string ,support: string|Array<string>|Function, creater: undefined | Function){
        creater = utils.isFunction(support) ? (<Function>support) : (<Function>creater)
        if (!creater || !name){
            return 
        }
        support = utils.isString(support) && [<string>support] || utils.isArray(support) && support as Array<string> || ''
        let isProtect: boolean = this.$config.protected
        let $modules: any = isProtect ? this.$modules : COMMON
        // 注意
        if(name in $modules){
            return await $modules[name]
        }
        // 访问器
        Object.defineProperties($modules, {
            [name]: {
                value: async () => {
                    let ret: any = support ? await this.$container.ensure(support as Array<string>, <Function>creater) : (<Function>creater)()
                    return ret
                },
                configurable: false,
                writable: false
            }
        })
        let plugin: any = await $modules[name]
        return plugin
    }
    async use(name: string){
        let isProtect: boolean = this.$config.protected
        let $modules: any = isProtect ? this.$modules : COMMON
        return await $modules[name]
    }
}

export {Register}