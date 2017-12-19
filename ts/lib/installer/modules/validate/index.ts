import * as common from '../../../common'

export class Rule {
    constructor(props: RuleParam){
        // 
    }
    // 验证
    async validate(){}
}

class validator {
    // 
}

export interface RuleParam {
    rules: any | string
}

// 验证
const validate = async() => {
    const create = (props: RuleParam): Rule => new Rule(props)
    // 
    return {create}
}

common.$register.create('validate', validate)