// 返回特定类型
export const type = (data: any): string => {
	const _type = Object.prototype.toString.apply(data)
	const r = /\[object\s(.+)\]/
	const arr: any = r.exec(_type)
	return arr && arr[1].toLowerCase() || '' 
}
// 是否是函数
export const isFunction = (fn: any): boolean => type(fn) === 'function'

export const isObject = (fn: any): boolean => type(fn) === 'object'

export const isString = (fn: any): boolean => type(fn) === 'string'

export const isNumber = (fn: any): boolean => type(fn) === 'number'
export const isArray = (fn: any): boolean => type(fn) === 'array'