import * as common from '../common'
import modules from './modules'
import plugins from './plugins'
import proto from './modules/proto'

// 率先安装依赖
common.$event.on('install', async (common: any) => {
    // 安装$app扩展
    // 安装extension
    return await common.$container.extension(common.config('extension')) 
})

// 在依赖的基础上进一步处理安装 -- state 功能
common.$event.on('install', (common: any) => common.$error.try(
    async () => {
        const router = await common.$register.use('vue:router')
        const store = await common.$register.use('vue:vuex')
        // 开启扩展
        await common.$event.emit('use', common.proto.prototype)
        const state: any = await plugins.state(common)
        router.beforeEach(async(to: any, fm: any, next: Function) => {
            // 初始化
            const $routerParams: any = {
                'to': to,
                'from': fm
            }
            const $app: common.proto = new common.proto($routerParams)
            // 开启中间件
            let nextState: any = await common.$event.next({ $app })
            if (nextState === void 0) {
                nextState = await state.listen({$app, to, 'from': fm})
            }
            if (nextState) {
                const { redirect }: { redirect?: string } = nextState
                return next(redirect ? redirect : nextState)
            }
            return next(nextState)
        })
        const Vue = await common.$container.getSupportExtensions('vue')
        const create = (App: any) => {
            return new Vue({ router, store, render(h: Function){ return h(App) }})
        }
        return await common.$event.emit('start', {create})
    }
))