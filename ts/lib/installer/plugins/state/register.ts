import visit from './visit'
import { State } from './decorator'
export namespace Actions{
    // 创建一个访问器
    export const createCommit = ($events: Function[]) => async(...arg: any[]) => {}
    export const mixinCreateInstance = (_class: any) => {
        const mixin = _class.mixin
    }
}
class register{
    protected $register: any = {}
    // protected $orginal: any 
    constructor(orginal: any, props: any){
        // let store = orginal.store
        // let after = orginal.after
        // let modules = orginal.modules
        // let namespace = orginal.namespace
    }
    commit(name: string, ...rest: any[]){
        // 
    }
}

export {register} 