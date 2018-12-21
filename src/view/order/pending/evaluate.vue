<template>
    <div>
        <table class="template" v-for="(item, index) in formData">
            <tr>
                <td style="width:300px;text-align: right">
                    <span v-if="item.record_number !== 0">{{item.record_number}}: </span>
                    <span><a class="link" :href="item.channel_item_link" target="_blank">{{item.channel_item_id}}</a></span>
                </td>
                <td>
                    <div class="inline fl t-left" v-if="channel_name==='ebay'">
                        <p class="inline t-left ml-sm">
                            <img src="../../../assets/good.png" v-if="item.comment_type===1" title="好评">
                            <img src="../../../assets/centre.png" v-else-if="item.comment_type===2" title="中评">
                            <img src="../../../assets/bad.png" v-else-if="item.comment_type===3" title="差评">
                            <img src="../../../assets/stay.png" v-else-if="item.comment_type===0" title="等待买家评价">
                        </p>
                        <p class="inline t-left ml-sm">
                            <img src="../../../assets/wait.png" v-if="item.comment_type===0" title="未评价">
                            <img src="../../../assets/yet.png" v-else title="已评价">
                        </p>
                    </div>
                    <p class="inline fl ml-sm" v-if="item.dispute_type === 1">
                         <a class="link"
                             style="color:red !important"
                             title="点击可查看纠纷详情"
                             @click="look_(item)">有纠纷
                         </a>
                    </p>
                    <p class="inline fr" v-if="showBtn">
                        <span class="operate mr-sm" v-if="channel_name==='ebay'" @click="contact_buyer(1,index)">联系买家</span>
                        <span class="operate mr-sm" v-if="channel_name==='ebay'" @click="message_buyer(1,index)">回评</span>
                        <span class="operate mr-sm" v-if="channel_name==='aliExpress'" @click="contact_buyer(4,index,item)">联系买家</span>
                        <span class="operate mr-sm" v-if="channel_name==='amazon'" @click="contact_buyer(2,index,item)">联系买家</span>
                        <el-button
                            class="mr-sm"
                            type="text"
                            size="mini"
                            :disabled="hasShippingTime||form.refund_status!==0"
                            @click="cancelOrder">取消订单</el-button>
                        <el-button
                            class="mr-sm"
                            type="text"
                            size="mini"
                            v-if="form.refund_status===2"
                            @click="toRefund">退款失败，重新退款</el-button>
                        <el-button
                            class="mr-sm"
                            type="text"
                            size="mini"
                            v-if="form.refund_status===2"
                            @click="markRefund">手动标记退款</el-button>
                    </p>
                </td>
            </tr>
        </table>
        <form-tmdf v-model="orderDialog" ref='formMdf' :mdfid="mdfid" :is-edit="isEdit"
                  :isShow="isLook"  :dispute-data="dispute_data" :dispute-is-look="disputeIsLook">
        </form-tmdf>
        <contact-buyer v-model="contactVisible" :order_id="order_id" :channel_id="channel_id"
                       :mdfid="mdfid">
        </contact-buyer>
        <message v-model="messageVisible" :order_id="order_id" @review="review" :index="index" :mdfid="mdfid"
                 :channel_id="channel_id">
        </message>
    </div>
</template>

<style lang="stylus">

</style>
<script>
    import {api_amazon_list,api_cancel_order} from "../../../api/letter-amazon";
    import {api_smt_list} from '../../../api/smt-mail';
    import {api_dispute_look} from '@/api/dispute';
    import {api_orders_order_renew_refund,api_mark_refund_failed} from '@/api/order-local'
    export default {
        data() {
            return {
                disputeIsLook:true,
                dispute_data: {},
                isLook:true,
                orderDialog: false,
                isEdit: {edit: false},
                channel_id: '',
                contactVisible: false,
                messageVisible: false,
                index: 0,
            }
        },
        created() {

        },
        filters: {},
        mounted() {
        },
        updated() {
        },
        destroy() {

        },
        methods: {
            look_(item){
                this.dispute_data = {};
                this.isLoading = true;
                this.$http(api_dispute_look, item.dispute[item.dispute.length-1].id, {dispute_type:item.dispute[item.dispute.length-1].dispute_type}).then(res => {
                    this.dispute_data = res;
                    this.$refs.formMdf.require_server(this.mdfid);
                    this.isLoading = false;
                    this.orderDialog = true;//----弹框打开
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                    this.isLoading = false;
                });
            },
            cancelOrder(){
                this.$confirm(`您将取消订单?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_cancel_order,{order_id:this.mdfid}).then(res=>{
                        if(res.cancel_status === 1){
                            this.$message({type:'success',message:res.message})
                        }else {
                            this.$message({type:'error',message:res.message})
                        }
                    }).catch((err)=>{
                        this.$message({type:'error',message:err.message})
                    })
                }).catch(()=>{
                        this.$message({
                            type:'info',
                            message:'取消'
                        })
                });
            },
            toRefund(){
                this.$confirm(`您将重新退款?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_orders_order_renew_refund,{order_id:this.mdfid}).then(res=>{
                        this.$emit('refund-status-change',res.refund_status);
                        this.$message({type:'success',message:res.message||res});
                    }).catch((err)=>{
                        this.$message({type:'error',message:err.message})
                    })
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消'
                    })
                });
            },
            markRefund(){
                this.$confirm(`您将标记为已退款?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_mark_refund_failed,{order_id:this.mdfid}).then(res=>{
                        this.$emit('refund-status-change',res.refund_status);
                        this.$message({type:'success',message:res.message||res});
                    }).catch((err)=>{
                        this.$message({type:'error',message:err.message})
                    })
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消'
                    })
                });
            },
            contact_buyer(id, index,item) {
                if(id===2){
                    let params = {
                        pageSize: 50,
                        page: 1,
                        customer_id: '',
                        account_code: '',
                        box_id: '',
                        is_replied: '',
                        is_read: '',
                        time_field: 'sync_time',
                        time_start: '',
                        time_end: '',
                        option_field: "system_order_number",
                        option_value: this.ordersNumber,
                        order_status: '',
                    };
                    this.$http(api_amazon_list, params).then(res => {
                        if(res&&res.data&&res.data.length>0){
                            this.$open('/amazon-emails',{ordersNumber:this.ordersNumber,channel_item_id:item.channel_item_id,resData:res});
                        }else{
                            this.$open('/amazon-emails/sent-emails/send',{ordersNumber:this.ordersNumber,channel_item_id:item.channel_item_id});
                        }
                    }).catch(code=>{
                        console.log(code,'code');
                    });
                }else if(id===4){
                    let data = {
                        page: 1,
                        pageSize: 50,
                        filter_type: 'order_id',
                        filter_text: this.ordersNumber,
                        customer_id: '',
                        status: '',
                        rank: -1,
                        msg_type: '',
                        read: '',
                        sort: 1,
                        account_id: ''
                    };
                    this.$http(api_smt_list,data).then(res=>{
                        if(res.data&&res.data.length>0){
                            this.$open('/aliexpress-msg',{ordersNumber:this.ordersNumber,channel_item_id:item.channel_item_id,resData:res});
                        }else{
                            this.channel_id = id;
                            this.contactVisible = true;
                        }
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                }else{
                    this.channel_id = id;
                    this.contactVisible = true;
                }
            },
            review(index) {
                this.formData[index].comment_type = 1;
                this.$emit('review')
            },
            message_buyer(id, index) {
                this.channel_id = id;
                if (this.formData[index].comment_type !== 0) {
                    this.$message({
                        type: "error",
                        message: "已有评价"
                    });
                    return
                }
                this.index = index;
                this.messageVisible = true;
            },
        },
        computed: {},
        watch: {
        },
        props: {
            cancelId:{},
            showBtn: {
                default() {
                    return true
                }
            },
            formData: {//评价状态
                required: true
            },
            channel_name: {},//平台名称
            ordersNumber:{},
            order_id: {//商品id
                required: true
            },
            mdfid: {},
            hasShippingTime:{
                type:Boolean,
                default(){
                    return false
                }
            },
            form:{
                type:Object,
                required:true
            }
        },
        components: {
            contactBuyer: require('../local/contact-buyer.vue').default,
            message: require('../local/message.vue').default,
            formTmdf: require('../local/form-tmdf.vue').default,
        }
    }
</script>

