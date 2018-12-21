/**
 * Created by wuchuguang on 17-6-24.
 */

export const Name = function(target){
    console.log(...arguments);
    return (gg, ggg) =>{
        console.log(gg, ggg);
    }
};

export const Permission = function(targer){
    console.log(...arguments);
    return function(target, name){
    }
};

export const Button = function(targer){
    console.log(...arguments);
    return function(target, name){
    }
};
