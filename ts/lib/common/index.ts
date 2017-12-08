import * as utils from './utils'
import { Register } from './register'

import {events} from './events'
import { Container } from './container'
import { Excepition } from './excepition'

const $register = new Register({'protected': true})
const $event = new events()
const $container = new Container()
const $error = new Excepition()

export {proto} from './proto'
export { $register, $event, $container, $error}
export {config} from './config'
export { utils, Excepition } 
