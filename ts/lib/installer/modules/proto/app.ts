import * as common from '../../../common'
export default async(app: any) => {
    // 抛出异常
    // 远程接口
    app.clientCall = async(params: any) => await common.$container.ensure(['axios'], (axios: any) => {
        // 
    })
}