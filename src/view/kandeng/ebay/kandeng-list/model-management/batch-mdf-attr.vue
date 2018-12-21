<template>
    <div class="c-batch-mdf-attr">
        <page-dialog v-model="dialog"
                     title="批量修改平台分类属性"
                     size="large" :close-on-click-modal="false">
            <el-table
                class="scroll-bar" 
                :data="tableData"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row
            >
                <el-table-column label="产品图片" inline-template width="100">
                    <img :src="row.img" width="60px" height="60px">
                </el-table-column>
                <el-table-column label="范本ID / 本地SPU" inline-template width="200">
                    <div>
                        <div>{{row.id}}</div>
                        <div>{{row.spu}}</div>
                    </div>
                </el-table-column>
                <el-table-column label="平台分类属性/属性值" inline-template>
                    <div class="t-left" >
                        <template v-for="(items,index) in row.ebay_specifics">
                            <el-row :gutter="8" class="mt-xs mb-xs">
                                <template v-if="items.custom===0">
                                    <el-col :span="10" :class="[items.min_values?'required-sign':'','t-right']">{{items.category_specific_name}}：</el-col>
                                    <el-col :span="10">
                                        <el-select v-model="items.attr_value"
                                                   placeholder="请搜索或选择商品属性"
                                                   filterable clearable
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
                                                filterable allow-create clearable
                                                placeholder="请添加或选择商品属性">
                                            <el-option
                                                    v-for="item in items.detail"
                                                    :label="item.category_specific_value"
                                                    :value="item.category_specific_value"
                                                    :key="item.category_specific_value"
                                            ></el-option>
                                        </el-select>
                                        <el-checkbox-group v-model="items.attr_value" v-if="items.max_values>1">
                                            <el-checkbox v-for="it in items.detail"
                                                         :label="it.category_specific_value"
                                                         :key="it.category_specific_value">{{it.category_specific_value}}</el-checkbox>
                                        </el-checkbox-group>
                                        <el-input v-if="items.selection_mode==='FreeText'&&items.max_values>1"
                                                  placeholder="添加自定义多属性"
                                                  @blur="add_new_value(items)"
                                                  @keyup.enter.native="add_new_value(items)"
                                                  v-model="items.add_new"></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <i class="delete-icon" @click="delete_cur(index,row.ebay_specifics)"></i>
                                    </el-col>
                                </template>
                                <template v-if="items.custom===1">
                                    <el-col :span="10">
                                        <el-input v-model="items.category_specific_name" @blur="verify_attr_name(row.ebay_specifics,items.category_specific_name,index)"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input v-model="items.attr_value"></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <i class="delete-icon" @click="delete_cur(index,row.ebay_specifics)"></i>
                                    </el-col>
                                </template>
                            </el-row>
                        </template>
                        <el-row>
                            <el-col :span="10">
                                <span style="visibility: hidden">占位</span>
                            </el-col>
                            <el-col :span="10">
                                <el-button type="primary"
                                           size="mini"
                                           class="inline mb-mini" @click.native="add_custom(row.ebay_specifics)">添加自定义属性</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <request-button class="inline" req-key="batchMdfAttr" :mintime="300" @click="submit">确定</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_up_specifics} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
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
        methods:{
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
                let data = clone(this.tableData);
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