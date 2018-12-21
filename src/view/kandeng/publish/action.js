/**
 * Created by RondaFul on 2016/11/2.
 */
export const operateList = [
    {label:"查看",value:"1",action:function(row){
        console.log(`查看 ${row.id}`);
    }},
    {label:"编辑",value:"2",action:function(row){
        console.log(`编辑 ${row.id}`);
    }},
    {label:"复制",value:"3",action:function(row){
        console.log(`复制 ${row.id}`);
    }},
    {label:"下架",value:"4",action:function(row){
        console.log(`下架 ${row.id}`);
    }},
    {label:"删除",value:"5",action:function(row){
        console.log(`删除 ${row.id}`);
    }},
    {label:"补货",value:"6",action:function(row){
        console.log(`补货 ${row.id}`);
    }},
];
