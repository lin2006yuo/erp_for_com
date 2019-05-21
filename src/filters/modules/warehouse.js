/**
 * Created by wuchuguang on 17-7-4.
 */

export default function(Vue){
    Vue.filter('warehouse_type', function(val){
        switch (val){
            case 1:
                return '本地';
            case 2:
                return '海外';
            default:
                return '所有';

        }
    });
};
