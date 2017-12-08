/**
* 自定义报错机制
*/
import * as utils from '../utils'
// 封装新的error
class DefineError{
	public errorCode: number = 0 ;
	public message: string = '' ;
	public stack: any = {} ;
	public callback: Function = () => {}
	constructor(e: number | Error){
		// 
	}
}

class Excepition {
	static catch: Function = (e: DefineError) => {}
	private $events: Array<Function> = []
	// 抛出异常
	throw(e: number | Error): void{
		let {$events} = this
		const $error = new DefineError(e)
		// 静态变量调用
		utils.isFunction(Excepition.catch) && Excepition.catch($error)
		$events.forEach((fn: Function) => utils.isFunction(fn) && fn.call($error))
		// 回调
		utils.isFunction($error.callback) && $error.callback()
	}
	catch(evt: Function){
		return this.$events.push(evt)
	}
	// 捕捉错误
	try(evt:Function|Promise<any>){
		return new Promise(resolve => {
			let result: any 
			let err: any 
			if(typeof evt === 'function'){
				try {
					result = (evt as Function)()
				} catch (e) {
					err = e
				}
			}else{
				result = evt
			}
			if(err){
				this.throw(err)
				return resolve()
			}
			if(result instanceof Promise){
				result = result as Promise<any>
				result
				.catch((e: Error) => {
					this.throw(e)
					resolve()
				})
				.then((res: any) => resolve(res))
			}
			return resolve(result)
		})
	}
}

export {Excepition}