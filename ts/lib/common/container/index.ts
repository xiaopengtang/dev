/**
 * 容器
 */

import * as utils from '../utils'

const MODULE: any = {}

class Container {
    private $events: any = {}
    async ensure(support: Array<string> | string, callback: Function){
        const supportList: any[] = await this.getSupportExtensions(support)
        return utils.isFunction(callback) ? await callback.apply(true, supportList) : void 0
    }
    extension(extensions: any){
        if(!utils.isObject(extensions)){
            return
        }
        Object.keys(extensions).forEach(name => {
            let extension = extensions[name]
            MODULE[name] = extension
            let callback: Array<Function> = this.$events[name] || []
            if(callback.length === 0){
                return 
            }
            callback.forEach(cb => utils.isFunction(cb) && cb.call(true, extension))
            delete this.$events[name]
        })
    }
    private watch(name: string, callback: Function){
        this.$events[name] = this.$events[name] || []
        return this.$events[name].push(callback)
    }
    async getSupportExtensions(support: Array<string> | string){
        const supportList: Array<string> = utils.isString(support) ? [<string>support] : (support as Array<string>)
        const supportName: string = supportList.shift() as string
        let list: Array<any> = []
        let extension: any = MODULE[supportName]
        if(extension === void 0){
            // 构建一个访问器
            extension = await new Promise(resolve => this.watch(supportName, (extension: any) => resolve(extension)))
        }
        list.push(extension)
        if(supportList.length === 0){
            return list
        }
        const rest: Array<any> = await this.getSupportExtensions(supportList) || []
        let ret = [...list, ...rest]
        return utils.isString(support) ? ret[0] : ret 
    }
}

export { Container }