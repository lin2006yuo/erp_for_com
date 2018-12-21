

export default function(Vue){
    Vue.filter('decima', function(vals, count=2){
        vals = parseFloat(vals);
        return vals.toFixed(count);
    });
};