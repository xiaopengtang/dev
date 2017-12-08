/**
 * 原型：用于检测关于路由导致的生命周期处理
 */
class proto{
    private $router:any = {}
    constructor($router: any){
        this.$router = $router
    }
}
export {proto}