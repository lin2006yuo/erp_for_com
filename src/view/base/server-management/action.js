import virtualMachine from './virtual-machine';
import superBrowser from './super-browser';
import cloud from './cloud';
import agent from './agent';
export const actions=[
    {label:'虚拟机',value:0,component:virtualMachine,show:false},
    {label:'云服务',value:1,component:cloud,show:false},
    {label:'超级浏览器',value:2,component:superBrowser,show:false},
    {label:'代理',value:3,component:agent,show:false},
];


export const ip=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export const mac=/[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/;
export const checkIp = (rule,val,cb)=>{
    if(!val){
        cb(new Error('请填写IP地址'));
    }else if (!ip.test(val)){
        cb(new Error('请填写正确的IP地址'));
    }else{
        cb();
    }
};
export const checkMac=(rule,val,cb)=>{
    if(!val){
        cb(new Error('请填写MAC地址'));
    }else if (!mac.test(val)){
        cb(new Error('请填写正确的MAC地址'));
    }else{
        cb();
    }
};