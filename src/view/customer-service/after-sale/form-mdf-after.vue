<template>
    <div class="after-sale-look">
        <tabs>
            <tab-head class="tab-heads"
                    :navs="[{label:'收件人信息',action:'buyinfo'},{label:'产品信息',action:'productList'},{label:'仓储物流',action:'logistics'},{label:'售后',action:'aftermarket'},{label:'付款',action:'pay'},{label:'利润',action:'profit'},{label:'日志',action:'logs'}]">
                <div>
                    <div>
                        <div class="inline">
                            <span class="marker">订单号：</span><span class="marker">{{order_number}}</span>
                            <span class="ml-lg is-wish-express" v-if="isWishExpress&&channel_name==='wish'">&nbspWish Express&nbsp</span>
                            <span class="ml-lg is-epc-order" v-if="isEpcOrder&&channel_name==='wish'">&nbspEPC-合并交易&nbsp</span>
                            <span class="ml-lg red" v-if="salesRemark">{{salesRemark}}</span>
                            <span class="ml-lg">{{channel_name}}</span>
                        </div>
                        <div class="fr">
                            <span class="mr-lg">{{seller}}</span>
                            <!--常用备注   一直存在页面-->
                            <div class="remark-sale-look" v-if="showRemark">
                                <label class="remark-sale-header">备注信息</label>
                                <el-form class="remark-sale-body">
                                    <el-form-item >
                                        <el-input type="textarea" v-model="notes" :maxlength="225"  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div class="remark-sale-footer">
                                    <div class="fr">
                                        <button class="small-button submit" type="button" @click="submit">提交</button>
                                        <button class="small-button cancel" type="button" @click="cancel">取消</button>
                                    </div>
                                </div>
                            </div>
                            <el-button class="inline" size="mini" type="primary" @click.native="show_remark">备注</el-button>
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    <!--作废订单备注显示-->
                    <div v-if="invalid.status&&invalid.status===4294967295" class="mes-box invalid-color">
                        <!--title-->
                        <span style="color:#FAEB21" class="bold-font inline">订单已作废：</span>
                        <!--作废订单的备注信息-->
                        <ui-tips style="color:#fff" :content="invalid.reason_for_invalid" :width="70"></ui-tips>
                        <span class="fr inline" style="color:#fff">{{filterTime(invalid.time_for_invalid)}}</span>
                    </div>
                    <!--客户留言信息显示-->
                    <div :class="[check?'green-color':'red-color','mes-box']" v-if="message">
                        <span class="bold-font">留言信息：</span><br>
                        <span v-html="message"></span>
                        <el-checkbox class="fr" v-model="check" @change="already(check)" :disabled="check">已读
                        </el-checkbox>
                    </div>
                    <!--员工备注信息显示-->
                    <div class="mes-box blue-color" v-for="(item,index) in comNotes"
                         :key="index"
                    >
                                <span class="fr">
                                     <span>{{filterTime(item.create_time)}}</span>
                                     <span class="ml-xs">{{item.creator_id}}</span>
                                </span>
                        <div class="inline bold-font" style="vertical-align: top;word-break: break-all;width: 75%;">备注信息：<span>{{item.note}}</span></div>
                        <i class="close-icon" @click="delete_note(item)"></i>
                    </div>
                    <el-steps ref="step" :space="85" :active="active" finish-status="success" class="ml-lg">
                        <el-step v-for="(item,index) in steps" :key="index" :title="item.name"
                                 :description="filterTime(item.time)"></el-step>
                    </el-steps>
                    <div class="mt-sm error-border" v-if="errorList.length>0">
                        <span class="marker">订单异常情况：</span>
                        <div class="ml-sm mt-mini" v-for="item in errorList" :key="item.message">
                            <span>{{item.remark}}</span>：<span>{{item.message}}</span>
                        </div>
                    </div>
                </div>
            </tab-head>
            <tab-item id="buyinfo" label="收件人信息">
                <form-item-buyinfo ref="buyinfo" :id="mdfid" :form="buyinfo" @submit="buyinfo_edit"
                                   :show-btn="false"></form-item-buyinfo>
            </tab-item>
            <tab-item id="productList" label="产品信息">
                <form-item-product :id="mdfid" :form="productList" @submit="product_edit" :cur-status="curStatus"
                                   :show-btn="false"></form-item-product>
            </tab-item>
            <tab-item id="logistics" label="仓储物流">
                <form-item-logistics :id="mdfid" :form="logistics"
                                     :formData="forms"
                                     @submit="logistics_edit"
                                     @set-valuation="set_valuation"
                                     :show-btn="false"
                                     :deadline="deadline"
                                     :btn-show="btnShow"></form-item-logistics>
            </tab-item>
            <tab-item id="aftermarket" label="售后">
                <form-item-aftermarket :form="customer" :show-btn="false"
                                       @create-click="create_click"
                                       :formData="customerSource"
                                       :channel_name="channel_name"
                                       @refund-status-change="refund_status_change"
                                       :order_id="orderId"
                                       :mdfid="orderId"
                                       @review="review"
                ></form-item-aftermarket>
            </tab-item>
            <tab-item id="pay" label="付款">
                <form-item-payment :form="payment"></form-item-payment>
            </tab-item>
            <tab-item id="profit" label="利润">
                <form-item-profit :form="profit" :order="order_number"></form-item-profit>
            </tab-item>
            <tab-item id="logs" label="日志">
                <form-item-logs :form="logs"></form-item-logs>
            </tab-item>
        </tabs>
    </div>
</template>
<style lang="stylus">
    .after-sale-look {
        margin-top:-7px;
        position:relative;
        .tab-heads{
            .head{
                width :42.78%;
                position :fixed;
                z-index :555;
            }
            .body{
                border-top-right-radius :3px;
                border-top-left-radius :3px;
                position: relative;
                padding-top: 40px;
            }

        }
        .mes-box {
            position: relative;
            margin: 5px 10px 5px;
            padding: 5px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            >.close-icon {
                position: absolute;
                top: -2px;
                right: 2px;
                width: 12px;
                height: 12px;
                display: inline-block;
                background: url(../../../../images/close.png) no-repeat;
                transition: all .2s;
                &:hover {
                    background: url(../../../../images/close-hover.png) no-repeat;
                }
            }
        }
        .invalid-color{
            background-color: #DF5255;
        }
        .red-color {
            background-color: #FBD2C9;
        }

        .green-color {
            background-color: #E0F7E6;
        }

        .blue-color {
            background-color: #C6DDF4;
        }

        .marker {
            font-size: 1.3rem;
            font-weight: bold
        }

        .remark-sale-look {
            overflow-y: hidden;
            width: 190px;
            height: 140px;
            position: absolute;
            top: 65px;
            right: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: #fff;
            padding: 0 5px;
            z-index: 999;
            .remark-sale-header{
                position: absolute;
                top:0;
                left:0;
                right:0;
                height:25px;
                padding-left:10px;
                padding-top:5px;
                background-color: #fff;
            }
            .remark-sale-body{
                overflow-y: auto;
                position: absolute;
                top: 30px;
                left:0;
                right:0;
                bottom:30px;
                padding: 0 5px;
            }
            .remark-sale-footer{
                position: absolute;
                height:25px;
                left:0;
                right:0;
                bottom:0;
                padding-bottom:5px;
                padding-right:5px;
                background-color: #fff;
            }
        }
        .error-border {
            padding-top: 10px;
            border-top: 1px dotted #c0ccda;
        }
        .small-button {
            font-size: 1.1rem;
            border-radius: 2px;
            padding: 2px 4px;
        }

        .submit {
            color: #fff;
            background: #008BCE;
            border: 1px solid #008BCE;
            &:hover {
                background: #008BCE;
            }
        }
        .cancel {
            background: #fff;
            border: 1px solid #ddd;
            &:hover {
                color: #008BCE;
                border-color: #008BCE;
            }
        }
        .label {
            display: inline-block;
            width: 140px;
            text-align: right;
            padding: 3px 5px;
        }

        .detail {
            padding: 3px 5px;
            width: 200px;
        }

        .point {
            cursor: pointer;
        }
        .is-wish-express{
            background-color #f60;
            color #fff;
        }
        .is-epc-order{
            border 1px solid #797979;
            background-color #FFCC00;
            color #FF0000;
        }
    }
</style>
<script>
    import selectRemote from '@/components/select-remote.vue';
    import {
        api_delete_note,
        api_get_speed,
        api_get_already,
        api_change_status,
        api_update
    } from '@/api/order-local';
    import  pageDialog   from    "@/components/page-dialog.vue";
    import  cardControl   from   "@/components/card-control.vue";
    import  cardHidden  from    "@/components/card-hidden.vue";
    export default{
        name:'form-mdf-after',
        data(){
            return {
                show: this.value,
                notes: "",
                dialogSize: "full",
                showRemark: false,
                title: "",
                steps: [],
                handleTitle: "请选择",
                check: false,
                active: 1,
                formData:{},
            }
        },
        watch: {
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
            forms(val){
                if (this.mdfid) {
                    if (val[this.mdfid]) {
                        this.check = val[this.mdfid].is_already ? true : false;
                        let id = val[this.mdfid].id;
                        this.get_speed(id);
                    }
                }
            },
        },
        methods: {
            refund_status_change(status){
                this.$set(this.forms[this.mdfid], 'refund_status', status);
            },
            review(){
              this.$emit('review')
            },
            already(val){
                this.get_already()
            },
//            删除备注
            delete_note(item){
                this.$confirm('您将删除此条备注信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_note, this.orderId, item.id).then(res => {
                        this.$message({type: "success", message: res.message || res})
                        this.$emit("delete-note");
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(code => {
                    this.$message({type: "info", message: "已取消删除"})
                })
            },
            filterTime(val){
                if (val)return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            show_remark(){
                this.showRemark = !this.showRemark;
            },
            cancel(){
                this.showRemark = false;
            },
            submit(){
                if (!this.notes) return this.$message({type: "warning", message: "请填写备注内容后，再点击提交"})
                this.$http(api_update, this.orderId, {note: this.notes}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    })
                    /*添加备注后，需要映射操作时间和操作人，所以要请求一次接口*/
                    this.$emit("submit-note");
                    this.notes = '';
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                });
                this.showRemark = false;
            },
            logistics_edit(form){
                this.forms[this.mdfid].package_list = form;
            },
            set_valuation(item){
                let profit = this.forms[this.mdfid].profit;
                if(profit&&profit.expend){
                    profit.expend.shipping_fee = item.estimated_fee;
                }
            },
            add_aftermarker(){
                console.log("新建售后处理订单暂无接口");
            },
            create_click(res){
                this.$set(this.forms[this.mdfid].customer, 'is_generate', 1);
                this.$set(this.forms[this.mdfid].customer, 'open_link', res.open_link);
                this.$set(this.forms[this.mdfid].customer, 'filePath', res.filePath);
            },
            buyinfo_edit(form){
                this.$set(this.forms[this.mdfid], 'consignee', form.consignee);
                this.$set(this.forms[this.mdfid], 'address', form.address);
                this.$set(this.forms[this.mdfid], 'mobile', form.mobile);
                this.$set(this.forms[this.mdfid], 'tel', form.tel);
                this.$set(this.forms[this.mdfid], 'zipcode', form.zipcode);
                this.$set(this.forms[this.mdfid], 'email', form.email);
                this.$set(this.forms[this.mdfid], 'province', form.province);
                this.$set(this.forms[this.mdfid], 'city', form.city);
                this.$set(this.forms[this.mdfid], 'country_code', form.country_code);
            },
            product_edit(form){
                this.$set(this.forms[this.mdfid], 'product_list', form);
            },
            change_status(data){
                this.$http(api_change_status, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message | res
                    })
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            get_already(){
                let cur = [];
                cur.push(this.mdfid);
                this.$http(api_get_already, {order_id: cur}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message | res
                    });
                    this.$set(this.forms[this.mdfid], "message", "");
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                });
            },
            get_speed(id){
                this.$http(api_get_speed, id).then(res => {
                    this.steps = res;
                    let active = 0;
                    res.forEach(row => {
                        if (row.time) {
                            active = active + 1;
                        }
                    });
                    this.active = active;
                }).catch(code => {
                    console.log(code);
                })
            },
        },
        refresh(){
            for (let old in this.forms) {
                if (htis.form.hasOwnProperty(old)) {
                    console.log(old);
                }
            }
            this.mdfid && this.require_server(this.mdfid);
        },
        computed: {
            isAliExpress(){
                return this.forms[this.mdfid]?this.forms[this.mdfid].channel_id===4:false
            },
            deadline(){
                if(this.isAliExpress&&this.forms[this.mdfid]){
                    return this.forms[this.mdfid].uploaded_deadline?this.forms[this.mdfid].uploaded_deadline:''
                }else{
                    return ''
                }
            },
            logs: {
                get(){
                    let def = [];
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].log;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            buyinfo: {
                get(){
                    let def = {
                        consignee: "",
                        address: "",
                        tel: "",
                        mobile: "",
                        email: "",
                        zipcode: "",
                        province: "",
                        city: "",
                        country_code: "",
                        buyer: "",
                        source_address: {},
                        channel_name:"",
                        isMerge:false,
                    };
                    let isMerge = false;
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            if(this.forms[this.mdfid].package_list&&this.forms[this.mdfid].package_list.length>0){
                                if(this.forms[this.mdfid].package_list[0].merge_order_number){
                                    isMerge = true;//判断是否为合并订单
                                }
                            }
                            this.$set(this.forms[this.mdfid].order_address,"channel_name",this.forms[this.mdfid].channel_name);
                            if(isMerge) this.$set(this.forms[this.mdfid].order_address, "is_apply",false);
                            return this.forms[this.mdfid].order_address;
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                }
            },
            /*作废*/
            invalid:{
                get(){
                    let curObj  = {};
                    if(this.mdfid){
                        if(this.forms[this.mdfid]){
                            this.$set(curObj,'status',this.forms[this.mdfid].status);
                            this.$set(curObj,'reason_for_invalid',this.forms[this.mdfid].reason_for_invalid);
                            this.$set(curObj,'time_for_invalid',this.forms[this.mdfid].time_for_invalid);
                        }
                    }
                    return curObj;
                }
            },
            message(){
                let def = "";
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.message.replace(/(\r|\n)+/gm,`<br>`);
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            productList: {
                get(){
                    let def = [];
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].product_list;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            curStatus(){
              let def = 0;
              if(this.mdfid > 0){
                if (this.forms[this.mdfid]) {
                  return this.forms[this.mdfid].status;
                } else {
                  return def;
                }
              }else{
                return def;
              }
            },
            salesRemark(){
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        def = this.forms[this.mdfid].sales_remark;
                    }
                }
                return def;
            },
            customerSource(){
                let cur = [];
                if(this.forms[this.mdfid]){
                    cur = this.forms[this.mdfid].customer.source;
                }
                return cur;
            },
            orderId(){
                let id = "";
                if(this.forms[this.mdfid]){
                    id = this.forms[this.mdfid].id;
                }
                return id;
            },
            customer: {
                get(){
                    let def = {};
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            def = {
                                customer: this.forms[this.mdfid].customer,
                                order_number: this.forms[this.mdfid].order_number,
                                id: this.forms[this.mdfid].id,
                                refund_status:this.forms[this.mdfid].refund_status
                            };
                            return def;
                        } else {
                            return def;
                        }
                    }
                    return def
                },
                set(val){
                    console.log(val);
                }
            },
            comNotes(){
                let def = [];
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.note;
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            message(){
                let def = "";
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.message.replace(/(\r|\n)+/gm,`<br>`);
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            errorList: {
                get(){
                    let def = [];
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].error;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            logistics: {
                get(){
                    let def = [];
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            def = this.forms[this.mdfid].package_list;
                            def.forEach(res => {
                                res.estimated_weight = parseFloat(res.estimated_weight).toFixed(2);
                                res.estimated_fee = parseFloat(res.estimated_fee).toFixed(2);
                                res.package_weight = parseFloat(res.package_weight).toFixed(2);
                                res.shipping_fee = parseFloat(res.shipping_fee).toFixed(2);
                                res.providers_fee = parseFloat(res.providers_fee).toFixed(2);
                                res.providers_weight = parseFloat(res.providers_weight).toFixed(2);
                                this.$set(res, 'buyer_selected_logistics', this.forms[this.mdfid].buyer_selected_logistics);
                                this.$set(res, 'product_list', this.forms[this.mdfid].product_list);//获取运输方式需要
                                this.$set(res, 'country_code', this.forms[this.mdfid].order_address.country_code);//获取运输方式需要
                            })
                            return def
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                },
                set(value){
                    console.log(value)
                }
            },
            payment: {
                get(){
                    let def = [];
                    if (this.mdfid) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].payment;
                        } else {
                            return def;
                        }
                    } else {
                        return def;
                    }
                }
            },
            profit(){
                let def = {};
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return {
                            id:this.mdfid,
                            shipping_time:cur.shipping_time,
                            income: cur.profit.income,
                            expend: cur.profit.expend,
                            rate: cur.rate,
                            rate_remark: cur.rate_remark
                        };
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            order_number(){
                let def = 0;
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        this.title = `查看 ${cur.order_number} 订单`;
                        return cur.order_number;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            channel_name(){
                let def = "";
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.channel_name;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            seller(){
                let defName = "";
                if (this.mdfid) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.seller;
                    } else {
                        return defName;
                    }
                } else {
                    return defName;
                }
            },
            isWishExpress(){
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        def = this.forms[this.mdfid].is_wish_express;
                    }
                }
                return def;
            },
            isEpcOrder(){
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        def = this.forms[this.mdfid].is_epc_order;
                    }
                }
                return def;
            },
        },
        props: {
            value: {},
            mdfid: {
                required: true,
            },
            forms:{
                required: true,
                type: Object
            },
            btnShow:{}
        },
        components: {
            formItemBuyinfo: require('./form-item-buyinfo.vue').default,
            formItemProduct: require('./form-item-product.vue').default,
            formItemLogistics: require('./form-item-logistics.vue').default,
            formItemAftermarket: require('./form-item-aftermarket.vue').default,
            formItemProfit: require('./form-item-profit.vue').default,
            formItemLogs: require('./form-item-logs.vue').default,
            formItemPayment: require('./form-item-payment.vue').default,
            selectRemote,
            pageDialog,
            cardControl,
            cardHidden,
            tabs: require('@/components/tabs.vue').default,
            tabHead: require('@/components/tab-head.vue').default,
            tabItem: require('@/components/tab-item.vue').default,
            uiTips: require('@/components/ui-tips.vue').default
        }
    }
</script>
