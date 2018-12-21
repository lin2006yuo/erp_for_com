/**
 * Created by RondaFul on 2016/10/18.
 */

import datef from 'datef';
export default function(Vue){
    Vue.filter('fdatetime', function (val, format) {
        return datef(format || 'YYYY-MM-dd HH:mm:ss', parseInt(val));
    });
    Vue.filter('fymd', function (val, format) {
        if(!val){
            return '--'
        }
        return datef(format || 'YYYY-MM-dd', parseInt(val));
    });

    Vue.filter('fdatetimes', function(val){
        return datef("YYYY-MM-dd HH:mm:ss:f", parseInt(val));
    });

    Vue.filter('fmsdatetime',function (val, format) {
        if(val){
            return datef(format || 'YYYY-MM-dd HH:mm:ss', parseInt(val) * 1000);
        }else{
            return '--'
        }
    });
    Vue.filter('timeCountDown',function (val,day=3, format) {
        let sec =Math.ceil(new Date().getTime()/1000)-val;
        sec = Math.max(sec,0);
        let d = Math.floor(sec/86400);
        let h = Math.floor((sec-(d*86400))/3600);
        let m = Math.floor((sec-(h*3600+d*86400))/60);
        if(d>=day){
            return   datef(format || 'YYYY-MM-dd HH:mm:ss', parseInt(val) * 1000);
        }
        else if(d>=1&&d<=(day-1)){
            if(h){
                return  `${d}天${h}小时前`
            }else {
                return  `${d}天前`
            }
        }else {
            return `${h}小时${m}分钟前`
        }
    });

};




