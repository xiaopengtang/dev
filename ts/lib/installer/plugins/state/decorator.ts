import * as common from '../../../common'
export namespace actions {
    export const emit = async ({ actions, params, ctx }: { actions: Array<Function>, params: any[], ctx: any}) => {
        // 
    }
}
// 

export namespace check {
    export interface State {
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
    export const Middleware = (_class: any) => { }
    // 
    export const State = (setting: check.State) => {
        // 命名空间
        setting.namespace = common.utils.isString(setting.namespace) && [<string>setting.namespace] || Array.isArray(setting.namespace) && setting.namespace || []
        return (_class: any) => {
        }
    }
    // 
    export const Before = (fn: string | Function) => {
        return (_class: any, name: string, descriptor: any) => {
            const isString = common.utils.isString(fn)
            if (isString) {
                fn = _class[<string>fn]
            }
            if (!common.utils.isFunction(fn)) {
                return
            }
            const before = isString ? (fn as Function).bind(_class) : (fn as Function)
            const action: any = descriptor.value
            if (!common.utils.isFunction(action)) {
                return
            }
            !action._before &&  Object.defineProperties(action, {
                '_before': {
                    value: [],
                    writable: false,
                    enumerable: false,
                    configurable: true
                },
                'before': {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                    value: async(...arg: any[]) => {
                        return await actions.emit({
                            params: [...arg],
                            actions: action._before,
                            ctx: true
                        })
                    }
                }
            })
            return action._before.push(before)
        }
    }
    // 
    export const After = (fn: string | Function) => {
        return (_class: any, name: string, descriptor: any) => {
            const isString = common.utils.isString(fn)
            if (isString) {
                fn = _class[<string>fn]
            }
            if (!common.utils.isFunction(fn)) {
                return
            }
            const after = isString ? (fn as Function).bind(_class) : (fn as Function)
            const action: any = descriptor.value
            if (!common.utils.isFunction(action)) {
                return
            }
            !action._after && Object.defineProperties(action, {
                '_after': {
                    value: [],
                    writable: false,
                    enumerable: false,
                    configurable: true
                },
                'after': {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                    value: async (...arg: any[]) => {
                        return await actions.emit({
                            params: [...arg],
                            actions: action._after,
                            ctx: true
                        })
                    }
                }
            })
            return action._after.push(after)
        }
    }
    // 
    export const Index = (fn: string | Function) => {
        return (_class: any, name: string, descriptor: any) => {
            if(!common.utils.isString(name)){
                return 
            }
            return Object.defineProperty(_class, '$IndexActionName' , {
                writable: false,
                enumerable: false,
                configurable: false,
                value: name
            })
        }
    }
    // 
    export const Validator = (_class: any) => {
        // 
    }
}
