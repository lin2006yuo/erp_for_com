<template>
    <page-dialog v-model="show" @open="open" size="large" :title="title" class="look-intercept">
        <div>
            <div class="look-header">拦截信息</div>
            <ul class="look-info">
                <li>
                    <span class="text-right">包裹号：</span>
                    <ui-tip :is-operate="true" :content="detailData.number" :width="98"
                            @cur-click="parcel_information(detailData.number)"></ui-tip>
                </li>
                <li>
                    <span class="text-right">订单号：</span>
                    <ui-tip :is-operate="true" :content="detailData.order_number" :width="98"
                            @cur-click="show_order(detailData)"></ui-tip>
                </li>
                <li>
                    <span class="text-right">平台/站点：</span>
                    {{detailData.channel_name}} / {{detailData.site_code}}
                </li>
                <li>
                    <span class="text-right">账号简称：</span>
                    {{detailData.account_name}}
                </li>
                <li>
                    <span class="text-right">发货仓库：</span>
                    {{detailData.warehouse_name}}
                </li>
                <li>
                    <span class="text-right">销售员：</span>
                    {{detailData.seller}}
                </li>
                <li>
                    <span class="text-right">运输方式：</span>
                    {{detailData.shipping_name}}
                </li>
                <li>
                    <span class="text-right">跟踪单号：</span>
                    {{detailData.shipping_number}}
                </li>
            </ul>
        </div>
        <div>
            <div class="look-header">拦截原因与结果</div>
            <ul class="look-info">
                <li>
                    <span class="text-right">拦截原因：</span>
                    <span v-if="detailData.reason">
                        {{detailData.reason.remark}}
                    </span>
                </li>
                <li>
                    <span class="text-right">拦截备注：</span>
                    {{detailData.remark}}
                </li>
                <li>
                    <span class="text-right">拦截状态：</span>
                    {{detailData.status}}
                </li>
                <li>
                    <span class="text-right">拦截失败原因：</span>
                    {{detailData.comment}}
                </li>
                <li>
                    <span class="text-right">拦截创建人：</span>
                    {{detailData.creator}}
                </li>
                <li>
                    <span class="text-right">创建时间：</span>
                    {{detailData.created_time | filterTime}}
                </li>
                <li>
                    <span class="text-right">拦截处理人：</span>
                    {{detailData.updater}}
                </li>
                <li>
                    <span class="text-right">处理时间：</span>
                    {{detailData.updated_time | filterTime}}
                </li>
            </ul>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="close">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .look-intercept{
        .look-header{
            background-color: #a9cdeb;
            line-height: 30px;
            padding: 0 10px;
        }
        .look-info{
            border:1px solid #dcdcdc;
            padding: 5px 5%;
            margin-bottom: 10px;
            li{
                width:49.5%;
                display: inline-block;
                line-height: 20px;
                .text-right{
                    display:inline-block;
                    width: 90px;
                    text-align:right;
                    font-weight: bolder;
                }
            }
        }
    }
</style>
<script>
    import {api_order_hold_look} from "../../../api/order-intercept"
    export default{
        data(){
            return{
                show:this.value,
                title:"",
                detailData:{},
            }
        },
        methods:{
            open(){
                this.init();
            },
        	init(){
                this.$http(api_order_hold_look,this.id).then(res=> {
                    this.title = `查看包裹号：${res.number}的拦截信息`;
                    this.detailData = res;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                });
            },
            parcel_information(order){
        		this.$emit('information',order)
            },
            show_order(row){
                this.orderNumber.forEach(inner =>{
                    this.$set(row,'order_id',inner.order_id);
                });
                this.$emit('order-number',row);
            },
            close(){
                this.show=false;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        filters: {
            filterTime(val){
                return val ? datef('YYYY-MM-dd HH:mm:ss', val) : "-- --";
            },
        },
        props:{
            value:{
                required:true,
            },
            id:{
                required:true,
            },
            orderNumber:{
            	required:true,
            }
        },
        components:{
            uiTip: require('../../../components/ui-tip.vue').default,
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
