import {setItem,getItem} from './sessionStorage';
const NAV_RECORD = 'nav_record';
export const add = function(route){
    let items = getItem(NAV_RECORD, []);
    items.push({t:new Date().format(),n:route})
    setItem(NAV_RECORD, items);
};

export const clearRecord = function(){
    setItem(NAV_RECORD, []);
};

window.printnavRecord = function(){
    const navs = getItem(NAV_RECORD, []);
    navs.forEach(nav =>{
        console.log(nav);
    })
};