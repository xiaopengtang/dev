import * as common from '../../../common'
class Base {
    destory(fn: Function) {
        return common.$event.on('state:destory', fn)
    }
}

export {Base}