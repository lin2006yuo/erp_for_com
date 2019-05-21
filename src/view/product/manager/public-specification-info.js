/*商品管理&产品开发--》规格属性使用
* */
export const get_value = function(item,list,name){
    // let find = list.attributes.find(row=>parseInt(item.attribute_id)===parseInt(row.attribute_id));
    // if(!!find){
    //     if(name==='options'){
    //         return find.options;
    //     }else{
    //         return find.attribute_value||find.value;
    //     }
    // }
};
export const get_header = function(specData){
    // return this.specData.filter(res=>{
    //     return !!res.attribute_value.find(row=>row.selected)
    // }).map(res=>{
    //     let options = res.attribute_value.filter(res=>res.selected);
    //     return {
    //         name:res.name,
    //         attribute_id:res.attribute_id,
    //         options:options
    //     }
    // })
};
export const set_value = function(item,list,val){
    // let find = list.attributes.find(row=>parseInt(row.attribute_id)===parseInt(item.attribute_id));
    // find.attribute_value = val;
};
export const show_item = function(item){
    // let nameList = ['电流','电压','色温','规格','尺码'];
    // let list = nameList.filter(row=>item.name.includes(row));
    // if(list.length>0)return false;
    // return true
};
export const get_select = function(items){
    // return items.attribute_value.filter(row=>row.selected);
};
export const get_options = function(items){
    // let list = items.attribute_value.filter(row=>!row.selected).map(res=>{
    //     return {
    //         label:res.value,
    //         value:res.value
    //     }
    // });
    // return list
};
/*
*isCombination 为true时，是添加产品时，需要直接组合生成sku；
* 为false/undefined时为编辑状态，需要生成下拉框的值
* lookspecData sku列表数据list & header
* comHeader 计算属性 最新的header数据
* spec 属性
*/
export const change_value = function(items,val,lookspecData,comHeader,isCombination,spec,specData){
    console.log('change_value') ;
    // let find,findIndex = items.attribute_value.findIndex(row=>row.value===val);
    // if(findIndex>-1) find = items.attribute_value.splice(findIndex,1)[0];
    // if(!!find){
    //     find.selected = true;
    //     items.attribute_value.push(find);
    //     items.selectValue = '';
    //     isCombination?get_combination(lookspecData,comHeader,spec):get_header_options(items,val,lookspecData,comHeader,specData);
    // }

};
export const change_pro = function(item,index,lookspecData,comHeader,isCombination,spec){
    // let val = item.attribute_value[index].value;
    // isCombination?get_combination(lookspecData,comHeader,spec):get_header_options(item,val,lookspecData,comHeader);
};
export const add_user_defined = function(items,lookspecData,comHeader,isCombination,spec){
    // if(!items.newValue)return this.$message({type:"warning",message:`请填写内容后再点击添加`});
    // let find = items.attribute_value.find(row=>row.value===items.newValue);
    // if(!!find){
    //     find.selected = true;
    // }else{
    //     let obj = {id:0,icon:"",selected:true,value:items.newValue,attribute_id:items.attribute_id};
    //     items.attribute_value.push(obj);
    // }
    // isCombination?get_combination(lookspecData,comHeader,spec):get_header_options(items,items.newValue,lookspecData,comHeader);
    // items.newValue = '';
};
export const get_combination = function(lookspecData,comHeader,spec){
    // lookspecData.headers = comHeader;
    // let list = spec.filter(row=>{
    //     return comHeader.find(res=>row.attribute_id===res.attribute_id)
    // }).map(row=>{
    //     return row.attribute_value.filter(res=>res.selected);
    // });
    // let allList = list.reduce((pre,cur,index,arr)=>{
    //     let arrs=[];
    //     cur.forEach(row=>{
    //         if(pre.length){
    //             pre.forEach(item=>{
    //                 arrs.push([...item,row])
    //             })
    //         }else {
    //             arrs.push([row])
    //         }
    //     });
    //     return arrs
    // },[]);
    //
    // let allLength = allList.length;
    // allList.forEach((row,index)=>{
    //     if(!lookspecData.lists){
    //         lookspecData.lists = [];
    //         let obj1 = {
    //             id:0,
    //             enabled:true,
    //             sku:'',
    //             name:'',
    //             attributes:row,
    //             alias_sku:[],
    //             cost_price:0,
    //             retail_price:0,
    //             weight:0,
    //         };
    //         lookspecData.lists.push(obj1);
    //     }else{
    //         let listsLength = lookspecData.lists.length;
    //         let diffLength = listsLength-allLength;
    //         if(diffLength>=0){
    //             lookspecData.lists.splice(listsLength-1,diffLength);
    //             lookspecData.lists[index].attributes = row;
    //         }else{
    //             if(allLength-index-1>=-diffLength){
    //                 lookspecData.lists[index].attributes = row;
    //             }else{
    //                 let obj2 = {
    //                     id:0,
    //                     enabled:true,
    //                     sku:'',
    //                     name:'',
    //                     attributes:row,
    //                     alias_sku:[],
    //                     cost_price:0,
    //                     retail_price:0,
    //                     weight:0,
    //                 };
    //                 lookspecData.lists.push(obj2);
    //             }
    //         }
    //     }
    // });
};
export const get_header_options = function(item,val,lookspecData,comHeader,specData){
    // lookspecData.headers = get_header(specData);//获取列表头部
    // console.log(lookspecData.headers,'lookspecData.headers');
    // let findOption = lookspecData.headers.find(row=>parseInt(row.attribute_id)===parseInt(item.attribute_id));//找到对应属性类的下拉框数据
    // console.log(findOption,'findOption');
    // if(!!findOption){//若存在下拉框数据，则存在这个属性类
    //     lookspecData.lists.forEach(row=>{
    //         let find = row.attributes.find(res=>parseInt(res.attribute_id)===parseInt(item.attribute_id));
    //         if(find){//如果属性类的对应值已存在，更新下拉框的值
    //             find.options = findOption.options;
    //             console.log(findOption,'findOption');
    //         }else{//不存在则添加一个属性类的对应值
    //             let obj = {
    //                 attribute_value:val,
    //                 attribute_id:item.attribute_id,
    //                 options:findOption.options,
    //             };
    //             row.attributes.push(obj);
    //         }
    //     });
    // }else{//若不存在属性类，则要清除对应值的内容
    //     lookspecData.lists.forEach(row=>{
    //         let index = row.attributes.findIndex(res=>parseInt(res.attribute_id)===parseInt(item.attribute_id));
    //         row.attributes.splice(index,1);
    //     });
    // }
};

export const add_sku = function(lookspecData){
    // let length = lookspecData.lists.length;
    // let lastLine = clone(lookspecData.lists[length-1]);
    // lastLine.attributes.forEach(row=>{
    //     row.attribute_value ='';
    // });
    // let obj = {
    //     enabled:true,
    //     id:0,
    //     sku:'',
    //     name:'',
    //     alias_sku:[],
    //     attributes:lastLine.attributes,
    //     cost_price:'',
    //     retail_price:'',
    //     weight:'',
    //     length:'',
    //     width:'',
    //     height:''
    // };
    // lookspecData.lists.push(obj);
};
