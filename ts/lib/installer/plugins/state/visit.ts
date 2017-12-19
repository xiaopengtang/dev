import * as common from '../../../common'

// 访问
const _commit = async ({params, actions}:{params: any[], actions: Array<Function>}) => {
    if(actions.length === 0){
        return 
    }
    const [action, ...rest] = actions
    const otherActions: Array<Function> = [...rest]
    const result = await action.apply(true, params)
    if (otherActions.length === 0){
        return result
    }
    const otherResult: any = await _commit({ params, actions: otherActions})
    return result === void 0 ? otherResult : result
}
// 单函数访问
const _visit = (action: any, params: any[]) => {
    return common.$error.try(async () => {
        const validateState = common.utils.isFunction(action.validator) ? await action.validator.apply(true, params) : void 0
        if (validateState instanceof Error) {
            return validateState
        }
        if (common.utils.isFunction(action.before)) {
            await action.before.apply(true, params)
        }
        const Vue = await common.$container.getSupportExtensions('vue')
        Vue.nextTick(async () => common.utils.isFunction(action.after) ? await action.after.apply(true, params) : void 0)
        const result = common.utils.isFunction(action) ? await action.apply(true, params) : void 0
        return result
    })
}
// 访问控制器
export default class {
    protected $actions: Array<Function> = []
    setAction($action: Function){
        return this.$actions.push($action)
    }
    async commit(...arg: any[]) {
        const params = [...arg]
        const {$actions} = this
        if($actions.length === 0){
            return 
        }
        return _commit({actions: $actions, params})
    }
}