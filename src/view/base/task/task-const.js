/**
 * Created by wuchuguang on 17-7-7.
 */

export const loop_types = [
    {label: '-无-', value: 0},
    {
        label: '间隔时长',
        values: [
            {label: '按周', value: 5},
            {label: '按天', value: 4},
            {label: '按时', value: 3},
            {label: '按分', value: 2},
            {label: '按秒', value: 1},
        ]
    },
    {
        label: '间隔时段',
        values: [
            {label: '每周', value: 11},
            {label: '每天', value: 12},
            {label: '每时', value: 13},
        ]
    }
];

export const loop_type_label = function(type){
    for(let i = 0 ; loop_types.length; i++){
        if(loop_types[i].value === type){
            return loop_types[i].label;
        }
        if(loop_types[i].values){
            const find =loop_types[i].values.find(row=>{
                return row.value === type
            });
            if(find){
                return find.label;
            }
        }
    }
    return "没有找到label";
};

export const loop_type_value = function(type, value){
    let hour = 0;
    let min = 0;
    switch (type){
        case 10:
            const day = Math.floor(value / 86400);
            value -= day * 86400;
            hour= Math.floor(value / 3600);
            value -= hour * 3600;
            min = Math.floor(value / 60);
            return `每周${day}-${hour}点-${min}分`;
        case 11:
            hour= Math.floor(value / 3600);
            value -= hour * 3600;
            min = Math.floor(value / 60);
            return `每天${hour}点-${min}分`;
        case 12:
            min = Math.floor(value / 60);
            return `每时${min}分`;
        default:
            return `间隔${value}`
    }
}