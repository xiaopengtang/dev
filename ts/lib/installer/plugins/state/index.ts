/**
 * STATE模块
*/
import * as common from '../../../common'
import {Base} from './base'


export { State } from './decorator'

/* export class Base {
    destory(fn: Function){
        return common.$event.on('state:destory', fn)
    }
} */

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