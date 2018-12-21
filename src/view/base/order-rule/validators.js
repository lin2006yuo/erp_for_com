/**
 * Created by RondaFul on 2017/9/19.
 */

export const validators=function (selected) {
    let valid=[];
    selected.forEach(row=>{
        let code=  row.code;
        let name=row.name;
        let validator=[];
        let select=Object.keys(row.data.child);
        select&&select.length>1&&this.configs[code].data&&this.configs[code].data.forEach(item=>{
            if(item.type===5){
                let find=select.find(sel=>{
                    return sel===item.key;
                });
                if(!!find){
                    validator.push(row.data.child[item.key])
                }
            }
        });
        if(validator.length>1){
            valid.push({flag:compare(validator),name})
        }else {
            valid.push({flag:true,name})
        };
    });
    return  valid.filter(row=>!row.flag);
    function  compare(validator) {
        let temp=parseFloat(validator[0].value);
        let flag=true;
        validator.forEach((row,i)=>{
            if(i!==0&&row.value&&temp){
                switch (row.operator.sel){
                    case '>=':
                        if(!(temp>=parseFloat(row.value))){
                            flag=false
                        };
                        break;
                    case '>':
                        if(!(temp>parseFloat(row.value))){
                            flag=false
                        };
                        break;
                    case '=':
                        if(temp!==parseFloat(row.value)){
                            flag=false
                        };
                        break;
                    case '<':
                        if(!(temp<parseFloat(row.value))){
                            flag=false
                        };
                        break;
                    case '<=':
                        if(!(temp<=parseFloat(row.value))){
                            flag=false
                        };
                        break;
                }}})
        return flag
    }
}

