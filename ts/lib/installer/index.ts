import * as common from '../common'
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
        const $router = await common.$register.use('vue:router')
        const $store = await common.$register.use('vue:vuex')
        // 开启扩展
        await common.$event.emit('use', common.proto.prototype)
        $router.beforeEach(async(to: any, fm: any, next: Function) => {
            // 初始化
            const $routerParams: any = {
                'to': to,
                'from': fm
            }
            const $app: common.proto = new common.proto($routerParams)
            // 开启中间件
            const nextState: any = await common.$event.next({ $app })
            
            if (nextState) {
                const { redirect }: { redirect?: string } = nextState
                return next(redirect ? redirect : nextState)
            }
            return next(nextState)
        })
    }
))