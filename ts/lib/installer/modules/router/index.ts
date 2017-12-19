import * as common from '../../../common'
export default common.$register.create('vue:router', ['vue', 'router'], (Vue: any, Router: any) => {
    Vue.use(Router)
    const routes: any = common.config('router')
    return new Router(routes)
})