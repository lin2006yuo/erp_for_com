<template>
    <div class="c-look-detail">
        <page-dialog  :title="title" v-model="dialog" @open="open"
                      size="large" :close-on-click-modal="false">
            <el-row :gutter="8">
                <el-col :span="10">
                    <table class="template template-custom">
                        <template>
                            <tr>
                                <td>SKU图片</td>
                                <td>
                                    <img :src="detailData.thumb" height="100px" width="100px">
                                </td>
                            </tr>
                            <tr>
                                <td>平台</td>
                                <td>{{detailData.channel}}</td>
                            </tr>
                            <tr>
                                <td>SKU</td>
                                <td class="bold-font">{{detailData.sku}}</td>
                            </tr>
                            <tr>
                                <td>ASIN</td>
                                <td class="bold-font">{{detailData.asin}}</td>
                            </tr>
                            <tr>
                                <td>店铺名称</td>
                                <td>{{detailData.account_name}}</td>
                            </tr>
                            <tr>
                                <td>店铺账号简称</td>
                                <td>{{comAccount}}</td>
                            </tr>
                            <tr>
                                <td>关键词&位置</td>
                                <td>{{detailData.keyword}}&nbsp;&&nbsp;{{detailData.product_location}}</td>
                            </tr>
                            <tr>
                                <td>特殊要求</td>
                                <td>
                                    <el-checkbox v-model="detailData.is_collection_product" disabled>收藏产品</el-checkbox>
                                    <el-checkbox v-model="detailData.is_collection_shop" disabled>收藏店铺</el-checkbox>
                                    <el-checkbox v-model="detailData.is_stars" disabled>打五星</el-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td>订单操作类型</td>
                                <td class="red">{{detailData.type}}</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td>{{detailData.remark}}</td>
                            </tr>
                            <tr>
                                <td>当前状态</td>
                                <td class="red">{{detailData.status_txt}}</td>
                            </tr>
                            <tr>
                                <td>产品链接</td>
                                <td v-copy>{{detailData.goods_source_url}}</td>
                            </tr>
                        </template>
                    </table>
                </el-col>
                <el-col :span="14">
                    <table class="template">
                        <tr class="light-blue">
                            <td>执行日期</td>
                            <td><label class="red mr-mini">*</label>交易订单号</td>
                            <td><label class="red mr-mini">*</label>物流单号</td>
                            <td>手工费（￥）</td>
                            <td>操作</td>
                        </tr>
                        <template v-for="(item,index) in detailData.execute">
                            <tr>
                                <td colspan="5" class="t-left red">数量及要求：{{item.date | filterdate}}，{{item.total}}单</td>
                            </tr>
                            <template v-for="it in item.detail">
                                <tr>
                                    <td>
                                        {{item.date | filterdate}}
                                    </td>
                                    <td>
                                        <el-input v-if="it.status===0&&detailOper==='dispose'"
                                                  v-model="it.transaction_order_number"></el-input>
                                        <label v-else>{{it.transaction_order_number}}</label>
                                    </td>
                                    <td>
                                        <el-input v-model="it.shipping_number" v-if="detailData.type==='外部订单'&&detailOper==='dispose'"></el-input>
                                        <label v-else>{{it.shipping_number}}</label>
                                    </td>
                                    <td>
                                        <el-input v-model="it.manual_fee" class="width-xs" v-if="detailData.type==='外部订单'&&detailOper==='dispose'"></el-input>
                                        <label v-else>{{it.manual_fee |filterPrice}}</label>
                                    </td>
                                    <td>
                                        <div v-if="it.status===0&&detailOper==='dispose'">
                                            <trends-select type="primary" :selects="comTrendsList" @trigger="trends_select(it,item.date,$event)"></trends-select>
                                        </div>
                                        <label v-else :class="[it.status===2?'red':'']">{{it.status_txt}}</label>
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </table>
                </el-col>
            </el-row>
            <div slot="footer">
                <el-button size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-look-detail{
        .template-custom{
            tr{
                td:nth-child(odd) {
                    background-color: #EBF8FF;
                    width:30%;
                }
                td:nth-child(even){
                    width:70%;
                }
            }
        }
        .light-blue{
            background-color: #EBF8FF;
        }
    }
</style>
<script>
    import {api_open_detail,api_execute_save,api_execute_submit} from '../../../api/request-note';
    import {url_execute_save,url_execute_submit} from '../../../api/request-note';
    export default {
        permission:{
            url_execute_save,
            url_execute_submit
        },
        data() {
            return {
                dialog:this.value,
                detailData:{},
                trendsList:[
                    {label:"保存",value:1,api:url_execute_save,action:function (val,date) {
                        this.execute_save(val,date);
                    }},
                    {label:"提交",value:2,api:url_execute_submit,action:function (val,date) {
                        this.execute_submit(val,date);
                    }}
                ]
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
            comAccount(){
                if(this.accountList.length>0&&!!this.detailData.account_id){
                    let cur = this.accountList.find(row=>row.value===this.detailData.account_id);
                    if(!!cur) return cur.label;
                }
                return "暂无数据";
            },
            comTrendsList(){
                return this.trendsList.filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },

        },
        filters:{
            filterdate(val){
                return val?datef('YYYY-MM-dd',val):'-- --';
            },
            filterPrice(val){
                return val?val:"";
            },
        },
        methods:{
            open(){
                this.get_detail();
            },
            execute_save(val,date){
                if(!val.transaction_order_number)return this.$message({type:"warning",message:"交易订单号必填，请补充完整"});
                if(this.detailData.type==='外部订单'&&val.shipping_number==='')return this.$message({type:"warning",message:"外部订单，物流单号为必填项，请补充完整"});
                let params = {
                    execute_time:date,
                    virtual_order_detail_apply_id:this.curId,
                    transaction_order_number:val.transaction_order_number,
                    shipping_number:val.shipping_number,
                };
                val.id&&(params.id=val.id);
                val.manual_fee&&(params.manual_fee = val.manual_fee);
                this.$http(api_execute_save,params).then(res=>{
                    if(!val.id){
                        this.get_detail();
                    }
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            execute_submit(val,date){
                if(!val.transaction_order_number)return this.$message({type:"warning",message:"交易订单号必填，请补充完整"});
                if(this.detailData.type==='外部订单'&&val.transaction_order_number==='')return this.$message({type:"warning",message:"外部订单，物流单号为必填项，请补充完整"});
                let params = {
                    execute_time:date,
                    virtual_order_detail_apply_id:this.curId,
                    transaction_order_number:val.transaction_order_number,
                    shipping_number:val.shipping_number,
                };
                val.id&&(params.id=val.id);
                val.manual_fee&&(params.manual_fee = val.manual_fee);
                this.$http(api_execute_submit,params).then(res=>{
                    this.get_detail();
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            get_detail(){
                this.$http(api_open_detail,this.curId).then(res=>{
                    res.is_stars = res.is_stars?true:false;
                    res.is_collection_product = res.is_collection_product?true:false;
                    res.is_collection_shop = res.is_collection_shop?true:false;
                    res.execute = Object.values(res.execute);
                    this.detailData = res;
                    console.log(this.detailData);
                }).catch(code=>{
                    console.log(code);
                })
            },
            trends_select(val,date,action){
                action.action.call(this,val,date);
            },
        },
        props:{
            value:{},
            title:{
                required:true,
                type:String
            },
            curId:{
                required:true
            },
            accountList:{
                required:true,
                type:Array
            },
            detailOper:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            trendsSelect:require('../../../components/trends-select.vue').default,
        }
    }
</script>
