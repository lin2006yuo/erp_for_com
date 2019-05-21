<template>
    <div class="c-batch-mdf-attr">
        <page-dialog v-model="dialog"
                     title="批量修改平台分类属性"
                     @open="open"
                     size="full" :close-on-click-modal="false">
            <div class="table scroll-table">
                <table class="template" ref="tableData">
                <tr class="black">
                    <th>产品图片</th>
                    <th>范本ID / 本地SPU</th>
                    <th>平台分类属性/属性值</th>
                </tr>
                <tr v-for="row in table">
                    <td>
                        <img :src="row.img" width="60px" height="60px">
                    </td>
                    <td style="width: 150px">
                        <div style="width: 150px">
                            <div>{{row.id}}</div>
                            <div>{{row.spu}}</div>
                        </div>
                    </td>
                    <td>
                        <div class="t-left box">
                            <template v-for="(items,index) in row.ebay_specifics">
                                <div class="mt-xs mb-xs inline mr-sm width__attr relative" v-if="items.custom===0">
                                    <template>
                                        <div :title="items.category_specific_name" :class="[items.min_values?'required-sign':'','t-left','mb-sm','attr-width-name']">
                                            {{items.category_specific_name}}：</div>
                                        <span class="inline">
                                            <el-select v-model="items.attr_value"
                                                       placeholder="请搜索或选择商品属性"
                                                       filterable clearable
                                                       class="inline attr-width"
                                                       v-if="items.selection_mode==='SelectionOnly'&&items.max_values<=1">
                                                <el-option
                                                    v-for="item in items.detail"
                                                    :label="item.category_specific_value"
                                                    :value="item.category_specific_value"
                                                    :key="item.category_specific_value"
                                                ></el-option>
                                            </el-select>
                                            <el-select
                                                v-if="items.selection_mode==='FreeText'&&items.max_values<=1"
                                                v-model="items.attr_value"
                                                class="inline attr-width"
                                                filterable allow-create clearable
                                                placeholder="请添加或选择商品属性">
                                                <el-option
                                                    v-for="item in items.detail"
                                                    :label="item.category_specific_value"
                                                    :value="item.category_specific_value"
                                                    :key="item.category_specific_value"
                                                ></el-option>
                                            </el-select>
                                            <div class="relative"   @click.stop="changeCheck($event)" v-if="items.max_values>1">
                                                <span  v-for="it in items.detail"
                                                       v-if="items.attr_value.includes(it.category_specific_value)&&!items.show"
                                                       class="block ml-clear attr-width-name"
                                                       :title="it.category_specific_value"
                                                       :label="it.category_specific_value"
                                                       :key="it.category_specific_value">
                                                    {{it.category_specific_value}}
                                                </span>
                                                <div v-if="items.show" class="show-attr" @click.stop="changeCheck($event)">
                                                  <el-checkbox-group  v-model="items.attr_value" v-if="items.max_values>1">
                                                    <el-checkbox v-for="it in items.detail"
                                                                 class="block ml-clear attr-width-name"
                                                                 :title="it.category_specific_value"
                                                                 :label="it.category_specific_value"
                                                                 :key="it.category_specific_value">
                                                        {{it.category_specific_value}}
                                                    </el-checkbox>
                                                </el-checkbox-group>
                                                <el-button type="primary"
                                                           size="mini" @click="submit_attr(items)">确定</el-button>
                                                </div>
                                            </div>
                                            <el-input v-if="items.selection_mode==='FreeText'&&items.max_values>1&&!items.show"
                                                      placeholder="添加自定义多属性"
                                                      @blur="add_new_value(items)"
                                                      class="attr-width"
                                                      @keyup.enter.native="add_new_value(items)"
                                                      v-model="items.add_new"></el-input>
                                        </span>
                                        <span :class="items.max_values>1?'absolute':''">
                                            <i class="delete__icon" @click="delete_cur(index,row.ebay_specifics)"></i>
                                            <span  @click="show_attr(items)"
                                                   v-if="items.max_values>1&&!items.show" class="more-attr"></span>
                                            <span  @click="hidden_attr(items)"
                                                   v-if="items.max_values>1&&items.show" class="more-attr-down"></span>
                                        </span>
                                    </template>

                                </div>
                            </template>
                            <div  class="mt-xs mb-xs inline mr-sm mt-defined">
                                <div v-for="(items,index) in row.ebay_specifics" v-if="items.custom===1" >
                                    <div style="width: 300px;" class="mb-xs">
                                        <div class=" inline attr-width">
                                            <el-input class="attr-width inline"
                                                      v-model="items.category_specific_name"
                                                      @blur="verify_attr_name(row.ebay_specifics,items.category_specific_name,index)">
                                            </el-input>
                                        </div>
                                        <div class="attr-width inline">
                                            <el-input class="attr-width inline"
                                                      v-model="items.attr_value"></el-input>
                                        </div>
                                        <span>
                                            <i class="delete__icon" @click="delete_cur(index,row.ebay_specifics)"></i>
                                            </span>
                                    </div>
                                </div>
                                <div class="mt-sm">
                                    <el-button type="primary"
                                               size="mini"
                                               class="inline mb-mini" @click.native="add_custom(row.ebay_specifics)">
                                        添加自定义属性
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                </table>
            </div>
            <div slot="footer">
                <request-button class="inline" req-key="batchMdfAttr" :mintime="300" @click="submit">{{$t('common.confirm')}}</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

.c-batch-mdf-attr{
    .page-dialog .dialog__body{
        overflow-x scroll!important;
    }
    .delete__icon{
        width: 20px;
        height: 15px;
        display: inline-block;
        vertical-align: middle;
        background-color: #fff;
        border-radius: 8px;
        background: url('../../../../../assets/delete-grey.png') no-repeat center;
        background-size 80%;
    }
    .absolute{
        position absolute;
    }
    .delete__icon:hover{
        border-radius: 8px;
        background: url('../../../../../assets/delete-red.png') no-repeat center;
        background-size 80%;
    }
    .black{
        color: #000;
    }
    .width__attr{
        width:180px;
    }
    .scroll-table{
        overflow-x: visible;
    }
    .mt-defined{
        margin-top: 34px;
    }
    .attr-width{
        width:120px
    }
    .more-attr{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        background-color: #fff;
        border-radius: 8px;
        background: url('../../../../../assets/up-content.png') no-repeat center;
        background-size: 64%;
        cursor pointer;
    }
    .more-attr-down{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        background-color: #fff;
        border-radius: 8px;
        background: url('../../../../../assets/down-content.png') no-repeat center;
        background-size: 64%;
        cursor pointer;
    }
    .ml__md{
        margin-left 15px!important;
    }
    .box{
        display flex;
        overflow-x scroll;
        padding-left 10px;
    }
    .attr-width-name{
        width:120px
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
    }
    .ml-clear{
        margin-left 0!important;
        margin-top 0!important;
    }
    .show-attr{
        /*position: absolute;*/
        /*z-index 10;*/
        background-color #ffffff;
        left 0;
        top:0;
    }
}

</style>
<script>
    import {api_up_specifics} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                table:[],
                show:false,
                loading:false,
                dialog:this.value,
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        computed:{

        },
        methods:{
            handleScroll(el){
                el.stopPropagation();
                event.stopImmediatePropagation();
                console.log(el,'el5',el.target)
            },
            changeCheck(el){
                el.stopPropagation();
                event.stopImmediatePropagation();
            },
            submit_attr(row){
                row.show=false;
            },
            open(){
                this.tableData.forEach(res=>{
                    res.ebay_specifics.forEach(val=>{
                        if(!val.attr_value){
                            val.attr_value=val.max_values>1?[]:''
                        }
                        val.show=false;
                    })
                });
                this.table=window.clone(this.tableData);

            },
            show_attr(row){
                row.show=true;
            },
            hidden_attr(row){
                row.show=false;
            },
            add_new_value(items){
                if(items.add_new==='')return;
                let find = items.detail.find(row=>row.category_specific_value===items.add_new);
                if(!!find)return this.$message({type:"warning",message:"已存在，请不要重复添加！"});
                items.detail.push({category_specific_value:items.add_new});
                items.attr_value.push(items.add_new);
                items.add_new = '';
            },
            verify_attr_name(Array,val,index){
                if(!val)return;
                let curList = window.clone(Array);
                curList.splice(index,1);
                let cur = curList.find(row=>{
                    return row.category_specific_name.toLowerCase()===val.toLowerCase();
                });
                if(!!cur){
                    this.$message({type:"warning",message:"属性不能重复，请修改"});
                    Array[index].category_specific_name = '';
                }
            },
            submit(){
                let trun=true;
                this.table.forEach(res=>{
                    res.ebay_specifics.forEach(val=>{
                        if(!!val.custom&&!val.category_specific_name){
                            console.log(val,'val')
                            trun=false;
                            this.$reqKey('batchMdfAttr',false);
                            return;
                        }
                    })
                });
                if(!trun) return this.$message({type:"warning",message:"发现有未填写的属性名，请补充完整！"})
                let data = clone(this.table);
                data.forEach(row=>{
                    delete row.img;
                    delete row.spu;
                    this.$set(row,'specifics',[]);
                    row.specifics = row.ebay_specifics.map(res=>{
                        return {
                            attr_name:res.category_specific_name,
                            attr_value:res.attr_value,
                            custom:res.custom
                        }
                    });
                    delete row.ebay_specifics;
                });
                this.$http(api_up_specifics,{data:data}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('batchMdfAttr',false)
                })
            },
            delete_cur(index,val){
                val.splice(index,1);
            },
            add_custom(val){
                if(val.length>0){
                    let find = val.find(row=>row.custom===1&&(!row.category_specific_name));
                    if(find) return this.$message({type:"warning",message:"发现有未填写的属性名，请补充完整！"});
                }
                let obj = {
                    category_specific_name:"",
                    attr_value:"",
                    custom:1,
                };
                val.push(obj);
            },
        },
        props:{
            value:{},
            tableData:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,

        }
    }
</script>
