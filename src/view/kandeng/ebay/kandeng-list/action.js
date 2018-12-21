/**
 * Created by RondaFul on 2016/11/2.
 */
export const operateList = [
    {label:"编辑",value:"2",action:function(row){
        let param={id:row.id,isAdd:false,isCopy:false};
        this.$open('/kandeng/aliexpress/info',param)
    }},
    {label:"复制",value:"3",action:function(row){
        let param={id:row.id,isAdd:false,isCopy:true};
        this.$open('/kandeng/aliexpress/info',param)
    }},
];
