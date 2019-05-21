/**
 * Created by wuchuguang on 17-4-19.
 */
export const types = [
    {label:'文本',value:1},
    {label:'单选列表',value:2},
    {label:'多选列表',value:3},
    {label:'单选',value:4},
    {label:'多选',value:5},
];
export const typeLabel = function(){
    console.error(`not define typeLabel`);
};
export default {
    types:types,
    typeLabel(type){
        let opt = types.find(opt=>opt.value === type);
        if(opt){
            return opt.label;
        }else{
            return `undefined`;
        }
    }
};