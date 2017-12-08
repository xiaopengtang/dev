import * as common from './common'

Object.defineProperties(common.Excepition, {
	'catch': {
		value: (e: Error) => common.$event.emit('error', e),
		configurable: false,
		writable: false
	}
})
// 监控错误
export const error = (fn: Function) => common.$event.on('error', fn)
// 用于扩展
export const use = (fn: Function) => common.$event.on('use', fn)
// 配置
export const config = common.config
// 中间件
export const middleware = (fn: Function) => common.$event.on('middleware', fn)
// 开启服务
export const start = async(fn: Function) => common.$event.once('start', fn)
// 安装
export const install = async(setting: any) => {
	// 初始化配置
	await common.config(setting)
	// 触发安装
	return await common.$event.emit('install', common)
}