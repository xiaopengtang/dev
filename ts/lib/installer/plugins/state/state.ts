import {register} from './register'
import * as common from '../../../common'
export default class {
    $register: any = {}
    constructor(props:any){
        const {$router} = props.$app
        const {name} = $router.to
    }
}