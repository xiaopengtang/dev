/**
 * 中间件处理
 */
import * as common from '../../../common'

common.$register.create('middleware', async() => {
    let router = await common.$register.use('vue:router')
})