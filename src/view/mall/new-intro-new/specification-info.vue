<template>
    <page class="p-specification-info">
        <el-form :model="lookspecData" :rules="rules" label-width="180px">
            <!--规格参数-->
            <div  v-if="markId!==1">
                <card :must-fill="items.required"
                      v-for="(items,items_i) in specData"
                      v-if="specData.length>0"
                      :label="items.name" :key="items_i">
                    <template v-if="show_item(items)">
                        <el-col class="mb-xs" :span="4"
                                v-if="items.is_alias===0"
                                v-for="(item,index) in get_select(items)"
                                :key="index">
                                <el-checkbox-group v-model="item.selected"
                                                   @change.native="change_pro(items,index,lookspecData,comHeader,true,specData)"
                                                   style="height:27px;line-height:25px;overflow:hidden">
                                    <el-checkbox>
                                        <span class="color-box" v-if="!(item.icon==='')"></span>
                                        <span>{{item.value}}</span>
                                    </el-checkbox>
                                </el-checkbox-group>
                        </el-col>
                        <el-col :span="4" v-if="items.is_alias===0">
                            <el-select v-model="items.selectValue"
                                       filterable clearable
                                       @change="change_value(items,$event,lookspecData,comHeader,true,specData)"
                                       class="inline width-sm">
                                <el-option
                                        v-for="res in get_options(items)"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </template>
                    <template v-else>
                        <el-col class="mb-xs"
                                :span="4"
                                v-if="items.is_alias===0"
                                v-for="(item,index) in items.attribute_value"
                                :key="index">
                            <el-checkbox-group v-model="item.selected"
                                               @change.native="change_pro(items,index,lookspecData,comHeader,true,specData)"
                                               style="height:27px;line-height:25px;overflow:hidden">
                                <el-checkbox>
                                    <span class="color-box" v-if="!(item.icon==='')"></span>
                                    <span>{{item.value}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </template>
                    <el-col class="mb-xs" :span="4"
                            v-if="items.is_alias===1&&item.selected"
                            v-for="(item,index) in items.attribute_value"
                            :key="index">
                        <el-checkbox-group v-model="item.selected"
                                           @change.native="change_pro(items,index,lookspecData,comHeader,true,specData)"
                                           style="height:27px;line-height:25px;overflow:hidden">
                            <el-checkbox>
                                <span class="color-box" v-if="!(item.icon==='')"></span>
                                <el-input class="inline width-xs"  v-model="item.value"></el-input>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                    <input
                            class="inline el-input__inner width-xs"
                            v-if="items.is_alias===1"
                            @keyup.enter="add_user_defined(items,lookspecData,comHeader,true,specData)"
                            v-model="items.newValue"
                            placeholder="自定义输入框">
                </card>
            </div>
            <div v-if="specData.length>0">
                <table  class="mt-md  template "  border="1" cellpadding="0" cellspacing="0"  style="width:100%;line-height:26px;text-align: center;">
                    <tr  style="font-weight:600 ;" >
                        <th style="padding :2px 5px;width:35px" v-if="markId!==1">
                            <el-checkbox v-model="checkAll"  @change="changeAll"></el-checkbox>
                        </th>
                        <th>id</th>
                        <th>sku </th>
                        <!--<th>sku名称</th>-->
                        <!--<th width="200px">sku别名</th>-->
                        <th v-for="item in lookspecData.headers"
                            :key="item.name">{{item.name}}</th>
                        <th>成本价(RMB)</th>
                        <th>零售价(USD)</th>
                        <th>重量(g)</th>
                        <th>长/宽/高(cm)</th>
                    </tr>
                    <tbody>
                    <tr  v-for="(list,index) in  lookspecData.lists" :key="index">
                        <td v-if="markId!==1">
                            <el-checkbox v-model="list.enabled" @change="changeOne"></el-checkbox>
                        </td>
                        <th>{{list.id}}</th>
                        <td>{{list.sku}} </td>
                        <!--<td style="padding:2px">-->
                            <!--<ui-input v-model="list.name"-->
                                      <!--:edit="markId!==1"-->
                                      <!--:disabled="!list.enabled"-->
                                      <!--@change="changeInput(index)"></ui-input>-->
                        <!--</td>-->
                        <!--<td style="padding:2px">-->
                            <!--<div v-published-recordslist.alias_sku.length!==0"  v-for="(it,i) published-recordslist.alias_sku" :key="i">-->
                                <!--<template v-if="markId!==1">-->
                                    <!--<el-input  v-model="list.alias_sku[i]"-->
                                               <!--class="input-width  inline"-->
                                               <!--:disabled="!list.enabled"-->
                                               <!--@change="changeInput(index)"></el-input>-->
                                    <!--<span class="el-icon-minus inline"-->
                                          <!--style="z-index:1000"-->
                                          <!--@click="del_sku_name(i,index)"></span>-->
                                <!--</template>-->
                                <!--<span v-else>{{it}}</span>-->
                            <!--</div>-->
                            <!--<span class="el-icon-plus inline"-->
                                  <!--v-if="markId!==1"-->
                                  <!--@click="add_name(index)"></span>-->
                        <!--</td>-->
                        <td  v-for="(item,key) in lookspecData.headers "
                             :key="key" style="min-width:100px">
                            {{get_value(item,list)}}
                        </td>
                        <td style="padding:2px" >
                            <ui-input v-model="list.cost_price"
                                      :edit="markId!==1"
                                      :disabled="!list.enabled"
                                      @change="changeInput(index)"></ui-input>
                        </td>
                        <td style="padding:2px" >
                            <ui-input v-model="list.retail_price"
                                      :edit="markId!==1"
                                      :disabled="!list.enabled"
                                      @change="changeInput(index)"></ui-input>
                        </td>
                        <td style="padding:2px" >
                            <ui-input v-model="list.weight"
                                      :disabled="!list.enabled"
                                      :edit="markId!==1"
                                      @change="changeInput(index)"></ui-input>
                        </td>
                        <td>
                            <!--长-->
                            <ui-input v-model="list.length"
                                      :edit="markId!==1"
                                      @input="change(index)"
                                      :disabled="!list.enabled"></ui-input>
                            <!--宽-->
                            <ui-input v-model="list.width"
                                      :edit="markId!==1"
                                      @input="change(index)"
                                      :disabled="!list.enabled"></ui-input>
                            <!--高-->
                            <ui-input v-model="list.height"
                                      :edit="markId!==1"
                                      @input="change(index)"
                                      :disabled="!list.enabled"></ui-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </el-form>
    </page>
</template>
<style lang="stylus">
    .p-specification-info{
        .card-label{
            margin-top:10px
        }
        .el-icon-plus:hover{
            cursor: pointer;
            color: #008BCE;
        }
        .el-icon-minus:hover{
            cursor: pointer;
            color: red;
        }
        .color-box{
            width:24px;
            height:24px;
            display:inline-block;
            border:1px solid #ddd;
            vertical-align: middle;
        }
        .spec-hidden{
            vertical-align:middle;
            max-width:200px;
            display: inline-block;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
            overflow:hidden;
        }
    }
</style>
<script>
    import card from '../../../components/card.vue';
    import {api_sku_specification,api_sku_get,api_sku_list} from '../../../api/product_create';//------引入接口文件
    import {get_value,
        set_value,
        show_item,
        get_select,
        get_options,
        change_value,
        add_user_defined,
        change_pro,
        add_sku} from '../../product/manager/public-specification-info';
    export default{
        data(){
            return {
                modifySkuArr:[],//-----------修改sku列表临时存储下标数组,
                checkAll:false,
                selectedArr:[],
                rules:{}
            }
        },
        created(){
        },
        mounted(){
        },
        methods:{
            get_value(item,list,name){
                let find = list.attributes.find(row=>parseInt(item.attribute_id)===parseInt(row.attribute_id));
                if(!!find){
                    if(name==='options'){
                        return find.options;
                    }else{
                        return find.attribute_value||find.value;
                    }
                }
            },
            show_item(item){
                let nameList = ['电流','电压','色温','规格','尺码'];
                let list = nameList.filter(row=>item.name.includes(row));
                if(list.length>0)return false;
                return true
            },
            get_select(items){
                return items.attribute_value.filter(row=>row.selected);
            },
            get_options(items){
                let list = items.attribute_value.filter(row=>!row.selected).map(res=>{
                    return {
                        label:res.value,
                        value:res.value
                    }
                });
                return list
            },
            change_value(items,val){
                let find,findIndex = items.attribute_value.findIndex(row=>row.value===val);
                if(findIndex>-1) find = items.attribute_value.splice(findIndex,1)[0];
                if(!!find){
                    find.selected = true;
                    items.attribute_value.push(find);
                    items.selectValue = '';
                    this.get_combination();
                }
            },
            change_pro(item,index){
//                let val = item.attribute_value[index].value;
//                this.get_header_options(item,val);
                this.get_combination();
            },
            add_user_defined(items){
                if(!items.newValue)return this.$message({type:"warning",message:`请填写内容后再点击添加`});
                let find = items.attribute_value.find(row=>row.value===items.newValue);
                if(!!find){
                    find.selected = true;
                }else{
                    let obj = {id:0,icon:"",selected:true,value:items.newValue,attribute_id:items.attribute_id};
                    items.attribute_value.push(obj);
                }
                this.get_combination();
                items.newValue = '';
            },
            get_combination(){
                 this.lookspecData.headers = this.comHeader;
                 let list = this.specData.filter(row=>{
                     return this.comHeader.find(res=>row.attribute_id===res.attribute_id)
                 }).map(row=>{
                     return row.attribute_value.filter(res=>res.selected);
                 });
                 let allList = list.reduce((pre,cur,index,arr)=>{
                     let arrs=[];
                     cur.forEach(row=>{
                         if(pre.length){
                             pre.forEach(item=>{
                                 arrs.push([...item,row])
                             })
                         }else {
                             arrs.push([row])
                         }
                     });
                     return arrs
                 },[]);

                 let allLength = allList.length;
                 allList.forEach((row,index)=>{
                     if(!this.lookspecData.lists){
                         this.lookspecData.lists = [];
                         this.lookspecData.lists.push(this.set_lookspecData_list(row));
                     }else{
                         let listsLength = this.lookspecData.lists.length;
                         let diffLength = listsLength-allLength;
                         if(diffLength>=0){
                             this.lookspecData.lists.splice(listsLength-1,diffLength);
                             this.lookspecData.lists[index].attributes = row;
                         }else{
                             if(allLength-index-1>=-diffLength){
                                 this.lookspecData.lists[index].attributes = row;
                             }else{
                                 this.lookspecData.lists.push(this.set_lookspecData_list(row));
                             }
                         }
                     }
                 });
            },
            set_lookspecData_list(row){
                return {
                        id:0,
                        enabled:true,
                        sku:'',
                        name:'',
                        attributes:row,
//                        alias_sku:[],
                        cost_price:0,
                        retail_price:0,
                        weight:0,
                        length:0,
                        width:0,
                        height:0
                };
            },
            //--------------------------------全选反选(生成sku)
            changeAll(){
                this.lookspecData.lists.forEach(data=>{
                    data.enabled=this.checkAll
                })
            },
            changeOne(){
                if(this.lookspecData.lists.length>0){
                    this.checkAll=!this.lookspecData.lists.find(data=>!data.enabled)
                }
            },
            /*----end*/
            add_name(index){ //--------添加sku别名
                console.log('index',index);
                this.lookspecData.lists[index].alias_sku.push('');
                console.log(this.lookspecData.lists[index].alias_sku,'this.lookspecData.lists[index].alias_sku');
            },
            del_sku_name(i,index){ //--------删除sku别名
                this.lookspecData.lists[index].alias_sku.splice(i,1)
            },
            /*-----------------------------------sku增删改*/
            changeInput(index){
                this.$emit('changeInput',index)
            },
        },
        filters: {},
        watch: {
            'lookspecData.lists'(val){
                if(val&&val.length>0){
                    let tempArr=[];
                    val.forEach((data,index)=>{
                        if(data.enabled){
                            tempArr.push(data)
                        }
                    });
                    tempArr.length===val.length?this.checkAll=true:this.checkAll=false
                }
            }
        },
        computed: {
            comHeader:{
                get(){
                    return this.specData.filter(res=>{
                        return !!res.attribute_value.find(row=>row.selected)
                    }).map(res=>{
                        let options = res.attribute_value.filter(res=>res.selected)
                        return {
                            name:res.name,
                            attribute_id:res.attribute_id,
                            options:options
                        }
                    })
                },
            },
            empty(){
                let tempArr=[]
                this.lookspecData.lists.forEach(data=>{
                    if(data.enabled){
                        tempArr.push(data)
                    }
                });
                if(tempArr.length===0){
                    return true
                }else{
                    return false
                }
            }

        },
        props: {
            lookspecData:{
                required:true,
                type:Object
            },
            specData:{
                required:true,
                type:Array
            },
            markId:{//判断查看/编辑状态

            },
            categoryId:{}
        },
        components: {
            card,
            uiInput:require('../../../components/ui-input.vue').default,
        }
    }
</script>
