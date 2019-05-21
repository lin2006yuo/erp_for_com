/**
 * Created by wuchuguang on 17-3-3.
 */

function validate(rules){
    if(rules instanceof Array){
        return rules;
    }
    if(rules instanceof Object){
        let rulesObj = {};
        for(let i in rules){
            if(rules.hasOwnProperty(i)){
                let ruleTitle = i.split("|");
                let rule = rules[i];
                rulesObj[ruleTitle[0]] = {name:ruleTitle[1]};
                switch (typeof rule){
                    case 'string':
                        rule.split("|").forEach(valid=>{
                            switch (valid){
                                case 'require':
                                    rulesObj[ruleTitle[0]].require = true;
                                    break;
                                default:
                                    if(valid.indexOf('select:') >= 0){
                                        rulesObj[ruleTitle[0]].type = 'select';
                                        rulesObj[ruleTitle[0]].options = valid.substr("select:".length).split(',').map(lv=>{
                                            lv = lv.split(':');
                                            return {label:lv[0],value:lv[1] === undefined ? lv[0] : lv[1]}
                                        });
                                        return;
                                    }
                                    if(valid.indexOf('min:') >= 0){
                                        rulesObj[ruleTitle[0]].type = 'input';
                                        rulesObj[ruleTitle[0]].options = rulesObj[ruleTitle[0]].options || {};
                                        rulesObj[ruleTitle[0]].options.min = parseInt(valid.substr("min:".length));
                                        return;
                                    }
                                    if(valid.indexOf('max:') >= 0){
                                        rulesObj[ruleTitle[0]].type = 'input';
                                        rulesObj[ruleTitle[0]].options = rulesObj[ruleTitle[0]].options || {};
                                        rulesObj[ruleTitle[0]].options.max = parseInt(valid.substr("max:".length));
                                        return;
                                    }
                                    if(valid.indexOf('in:') >= 0){
                                        rulesObj[ruleTitle[0]].type = 'input';
                                        rulesObj[ruleTitle[0]].options = rulesObj[ruleTitle[0]].options || {};
                                        rulesObj[ruleTitle[0]].options.max = parseInt(valid.substr("in:".length));
                                        return;
                                    }
                            }
                        });
                        break;
                    case 'array':
                        break;
                    case 'object':
                        break;
                }
            }
        }
        return rulesObj;
    }

}
window.validate = validate;
export default validate;

