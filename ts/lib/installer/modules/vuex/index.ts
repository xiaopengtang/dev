import * as common from '../../../common'

export default common.$register.create('vue:vuex', ['vue', 'vuex'], (Vue: any, Vuex: any) => {
    Vue.use(Vuex)
    let storeConfig: any = common.config('store')
    const $store = new Vuex.Store(storeConfig)
    const $win: any = typeof self !== 'undefined' && self.self === self && self  
    if(common.config('ssr.on') === true && $win){
        const key: string = common.config('ssr.key')
        $store.replaceState($win[key])
    }
    return $store
})