<template>
    <div class="c-logistics-setting">
        <rainbow-header title="物流信息" background-color="#0CB2F8">
            <el-form :model="form" label-width="220px">
                <el-form-item label="商品重量(kg)：" required>
                    <el-row>
                        <el-col :span="4">
                              <el-input v-model="form.weight"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="物流方式：" required>
                    <div class="mb-xs">
                        <el-checkbox v-model="checkAll" v-if="form.logistics&&form.logistics.length>0">全选</el-checkbox>
                        <!--<span class="operate ml-sm" @click="async_logistics">同步物流方式</span>-->
                        <request-button reqKey="asyncLogistics" @click="async_logistics" :min-time="1000">同步物流方式</request-button>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <table class="template">
                        <tr v-for="item in form.logistics">
                            <td>
                                <el-checkbox v-model="item.is_checked"></el-checkbox>
                            </td>
                            <td class="t-left">{{item.logistic_name}}({{item.weight_limits}})</td>
                            <td>免运费：<el-select class='inline s-width-small' v-model="item.is_free" default-first-option filterable clearable>
                                    <el-option
                                        v-for="res in option"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                    ></el-option>
                                </el-select>
                            </td>
                        </tr>
                    </table>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="发货期："  required>
                    <el-radio-group v-model="form.days_to_ship" @change="change_radio">
                        <el-radio :label="5" style="display: block;margin-bottom:8px">5天内发货（不包括公众假期和快递服务的非工作日）</el-radio>
                        <el-radio :label="0" style="display: block;margin-left:0">自定义发货时间（>=7天）
                            <el-input class="inline" :disabled="form.days_to_ship!==0" v-model="form.deliver_goods_date"></el-input>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </rainbow-header>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_shopee_logistics,api_sync_logistics} from '@/api/shopee-publish'
    export default {
        data() {
            return {
                option:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ]
            }
        },
        methods:{
            async_logistics(){
                this.$http(api_sync_logistics,this.form.account_id).then(res => {
                    this.get_shopee_logistics().then(res=>{
                        this.form.logistics = res;
                        this.$reqKey('asyncLogistics',false);
                        this.$message({type:'success',message:'更新成功'})
                    }).catch(code=>{
                        this.$reqKey('asyncLogistics',false);
                    });
                }).catch(code => {
                    this.$reqKey('asyncLogistics',false);
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            get_shopee_logistics(){
                return this.$http(api_shopee_logistics,{account_id:this.form.account_id}).then(res => {

                    res = res.map(row=>{
                        let weight_limits = JSON.parse(row.weight_limits);
                        return {
                            is_checked:true,
                            enabled:row.enabled,
                            logistic_name:row.logistic_name,
                            weight_limits:this.trans_max_min_weight(weight_limits),
                            is_free:0,
                            logistic_id:Number(row.logistic_id)
                        }
                    });
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            /**转换物流方式中的最大公斤数和最小公斤数
             * */
            trans_max_min_weight(row){
                let spliceData = '';
                let max = `最大${row['item_max_weight']}公斤`;
                let min = `最小${row['item_min_weight']}公斤`;
                if(!!row['item_max_weight']&&!!row['item_min_weight']){
                    spliceData = max+min;
                }else if(!!row['item_min_weight']){
                    spliceData = min;
                }else if(!!row['item_max_weight']){
                    spliceData = max;
                }
                return spliceData;
            },
            change_radio(val){
                if(val===5){
                    this.form.deliver_goods_date = '';
                }
            },
        },
        computed:{
            checkAll:{
                get(){
                    let find = this.form.logistics.find(row=>!row.is_checked);
                    return !find;
                },
                set(val){
                    this.form.logistics = this.form.logistics.map(row=>{
                        this.$set(row,'is_checked',val);
                        return row
                    });
                },
            },
        },
        props:{
            form:{
                type:Object,
                required:true
            },
            defaultSpan:{
                type:Number,
                default(){
                    return 15
                }
            },
            minSpan:{
                type:Number,
                default(){
                    return 9
                }
            }
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>
