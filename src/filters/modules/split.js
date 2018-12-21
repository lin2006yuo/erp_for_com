

export default function(Vue){
    Vue.filter('split', function(vals, count){
        return vals.split(1, count);
    });
};