// 备注:给传入的数据赋一个默认值
//
const EMPTY = ['', undefined, null, 0];

export default function(Vue){
    Vue.filter('emptyByDefault', function(val, def = '--'){
        return EMPTY.includes(val) ? def : val;
    });
};
