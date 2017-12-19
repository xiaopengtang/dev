/**
 * STATE模块
*/
import * as common from '../../../common'

export class Base {
    destory(fn: Function){
        return common.$event.on('state:destory', fn)
    }
}
export namespace check {
    export interface State{
        middleware?: any,
        store?: any,
        mixin?: string | string[],
        validator?: any,
        namespace?: string | string[],
        use?: string | string[]
        // extends?: string | any
    }
}
export namespace State {
    // 中间件
    export const Middleware = (_class: any) => {}
    // 
    export const State = (setting: check.State) => {
        // 命名空间
        setting.namespace = common.utils.isString(setting.namespace) && [<string>setting.namespace] || Array.isArray(setting.namespace) && setting.namespace || []
        return (_class: any) => {
            // namespace && (_class.namespace = namespace)
        }
    }
    // 
    export const Before = (_class: any, name: string) => {}
    // 
    export const After = (_class: any, name: string) => {}
    // 
    export const Index = (_class: any, name: string) => { }
    // 
    export const Validator = (_class: any) => {}
}

export class Visit {
    $action: Function
    constructor(action: Function){
        this.$action = action
    }
}

export class Register {
    constructor(props: any){
        // 
    }
}

export class StateCore {
    protected $register: Base
    // 
    async createRegister(param: any){
        // 
    }
}

// 安装
export default async(common: any) => {
    const router: any = await common.$register.use('vue:router')
    const store:any = await common.$register.use('vue:vuex')
    const $state = new StateCore()
    // 卸载相关数据
    router.beforeResolve(async (to: any, fm: any, next: Function) => {
        if (!fm) {
            return
        }
        // 销毁store
        next()
    })

    return {
        async listen(params: any){
            if (params.from){
                await common.$event.emit('state:destory')
            }
            $state.createRegister(params)
        }
    }
}