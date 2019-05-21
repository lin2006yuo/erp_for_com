<template>
    <div>
        <page-dialog :title="title" v-model="addFormVisible" width="95%" class="shopee_look">
            <el-col style="padding-left: 4px; padding-right: 4px;">
                <tabs class="shopee_tabs">
                    <tab-head class="tab-heads" style="margin-bottom: 34px"
                              :navs="[{label:'收件人信息',action:'buyinfo'},{label:'产品信息',action:'productList'},{label:'付款',action:'pay'},{label:'利润',action:'profit'}]">
                    </tab-head>
                    <tab-item id="buyinfo" label="收件人信息">
                        <el-form :model="lookList" ref="form" label-position="right" label-width="120px">
                            <el-form-item label="买家ID：">
                               <span>{{lookList.buyer}}</span>
                            </el-form-item>
                            <el-form-item label="收货人：">
                               <span>{{lookList.receiver}}</span>
                            </el-form-item>
                            <el-form-item label="地址1：">
                               <span>{{lookList.address}}</span>
                            </el-form-item>
                            <el-form-item label="地址2：">
                               <span>--</span>
                            </el-form-item>
                            <el-form-item  label="城市：">
                               <span>{{lookList.city}}</span>
                            </el-form-item>
                            <el-form-item label="省/州：">
                               <span>{{lookList.state}}</span>
                            </el-form-item>
                            <el-form-item label="国家：">
                               <span>{{lookList.country}}</span>
                            </el-form-item>
                            <el-form-item label="邮编：">
                               <span>{{lookList.zipcode}}</span>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                               <span>{{lookList.phone}}</span>
                            </el-form-item>
                            <el-form-item label="手机号：">
                               <span>--</span>
                            </el-form-item>
                            <el-form-item label="买家邮件：">
                               <span>{{lookList.email}}</span>
                            </el-form-item>
                        </el-form>
                    </tab-item>
                    <tab-item id="productList" label="产品信息">
                        <form-item-product :form="lookProduct"></form-item-product>
                    </tab-item>
                    <tab-item id="pay" label="付款">
                        <form-item-payment :form="payment"></form-item-payment>
                    </tab-item>
                    <tab-item id="profit" label="利润">
                        <form-item-profit :form="profit"></form-item-profit>
                    </tab-item>
                </tabs>
            </el-col>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .shopee_look{
        position: relative;
        .shopee_tabs{
            padding: 1px 3px 2px 3px;
            .tab-head >.head{
                margin-top: -1px;
            }
    }
    }
</style>
<script>
    export default{
        data(){
            return{
                addFormVisible:false,
            }
        },
        watch: {
            addFormVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.addFormVisible = val;
            }
        },
        methods: {
        },
        computed: {},
        props: {
            value:{
                type:Boolean,
                required:true
            },
            title: {
                type: String,
                required: true
            },
            lookList:{
                required:true,
                type:Object
            },
            lookProduct: {
                required: true,
                type: Array
            },
            payment: {
                required: true,
                type: Object
            },
            profit: {
                required: true,
                type: Object
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            tabItem: require('../../../../components/tab-item.vue').default,
            formItemProduct: require('./form-item-product.vue').default,
            tabs: require('../../../../components/tabs.vue').default,
            tabHead: require('../../../../components/tab-head.vue').default,
            formItemPayment: require('./form-item-payment.vue').default,
            formItemProfit: require('./form-item-profit.vue').default,
        }
    }
</script>
