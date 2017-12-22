/*
* 事件监控机制
*
*
*/
import {Excepition} from '../excepition'
import * as utils from '../utils'


const $error = new Excepition()


export namespace Interface {

	export interface ListenersParam {
		name: string,
		$events: any,
		IS_READ?: boolean
	}

	export interface ListenersEmitParam {
		$events?: Array<Function>,
		params: Array<any>
	}

	export interface ListenerNextParam {
		$events?: Array<Function>,
		ctx: any
	}

	export interface ListenerValidateParam{
		$events?: Array<Function>,
		ctx?: any,
		params?: any[]
	}
}

export namespace Modules {
	// 获取listeners
	export const listeners = (arg: Interface.ListenersParam): Array<any> => {
		let { name, $events, IS_READ} = arg
		const on: Array<Function> = $events.on[name] || []
		const once: Function = $events.once[name] 
		once && on.push(once)
		IS_READ === true && delete $events.once[name]
		return on
	}
	// emit 运行
	export const emit = async(arg: Interface.ListenersEmitParam) => {
		const {$events, params} = arg
		if (!$events || $events && $events.length === 0){
			return
		}
		const evt = $events.shift()
		let result: any 
		try{
			result = utils.isFunction(evt) ? await (<Function>evt).apply(true, params) : void 0
		}catch(e){
			$error.throw(e)
		}
		if($events.length === 0){
			return result
		}
		result = await emit({params, $events})
		return result
	}
	// next 运行
	export const next = async (arg: Interface.ListenerValidateParam) => {
		const { $events, ctx , params} = arg
		if (!$events || $events && $events.length === 0) {
			return
		}
		const evt = $events.shift()
		
		let fn = () => new Promise((resolve, reject) => {
			const next = async (status: boolean | undefined | Error) => {
				if(status === true){
					return resolve()
				}
				if(status instanceof Boolean){
					status = new Error('NOT FOUND')
				}
				resolve(status)
			}
			let core: Promise<any> = (<Function>evt).apply(ctx, next)
			return core.catch(e => $error.throw(e))
		})
		let result: any  = await fn() 
		if (result instanceof Error || $events.length === 0){
			return result
		}
		result = await next({ ctx, $events })
		return result
	}
	// 
	/* export const validate = (arg: Interface.ListenerNextParam) => {
		return new Promise((resolve, reject) => {
			const { $events, ctx } = arg
			if (!$events || Array.isArray($events) && $events.length === 0) {
				return resolve()
			}
			const [validator, ...rest] = $events
		})
	} */
}
 
class events {
	private $events: any = {
		'on': {},
		'once': {}
	}
	// 
	on(name: string, evt: Function){
		this.$events.on[name] = this.$events.on[name] || []
		return this.$events.on[name].push(evt)
	}
	// 
	listeners(name: string){
		return Modules.listeners({name, $events: this.$events})
	}
	// 
	once(name: string, evt: Function){
		this.$events.once[name] = this.$events.once[name] || []
		return this.$events.once[name].push(evt)
	}
	//
	async next(name: string, ctx: any){
		const $events: Array<Function> = Modules.listeners({ name, $events: this.$events, IS_READ: true })
		const result: any = await Modules.next({$events, ctx})
		return result
	}
	/* validate(name: string, ...rest: any[]){
		// 
	} */
	//
	removeListener(name: string){
		return delete this.$events.once[name]
	}
	//
	removeAllListeners(name: string){
		return delete this.$events.on[name] && delete this.$events.once[name]
	}
	//
	async emit(...arg: Array<any>){
		const [name, ...rest] = [...arg]
		const $events: Array<Function> = Modules.listeners({name, $events: this.$events, IS_READ: true})
		const result: any = await Modules.emit({$events, params: [...rest]})
		return result
	}
}
export {events}