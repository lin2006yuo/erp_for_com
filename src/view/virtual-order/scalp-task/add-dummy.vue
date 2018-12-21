<template>
    <page-dialog :title="dummyTittle" v-model="dialog"
                 @open="open"
                 size="full" :close-on-click-modal="false">
        <div>
            <dummy-header :form="form" :current-handle="currentHandle"></dummy-header>
        </div>
        <!--添加申请时显示的按钮-->
        <div class="mt-sm" v-if="currentHandle==='add'">
            <el-button type="primary" size="mini" class="inline" @click.native="add_sku">添加SKU</el-button>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        class="inline"
                        @click.native="import_order"
                        :route="apis.url_virtual_order_import">导入添加</permission>
            <el-button type="primary" size="mini" class="inline" @click.native="batch_delete">批量删除</el-button>
        </div>
        <!--普通查看时显示的按钮-->
        <div class="mt-sm" v-if="currentHandle==='lookOver'&&form.seller_id === this.currentUser.user_id">
            <permission tag="ElButton"
                        :route="apis.url_batch_cancel"
                        type="primary"
                        size="mini"
                        class="inline"
                        @click.native="batch_cancel">批量作废</permission>
        </div>
        <!--审批查看时出现的按钮-->
        <div class="mt-sm" v-if="currentHandle==='examineApprove'">
            <permission tag="trendsSelect"
                        class="inline"
                        type="primary"
                        v-if="form.status_txt === '待组长审核'"
                        :route="apis.url_audit_headman"
                        @trigger="trigger_group_leader"
                        :selects="groupHandle"></permission>
            <permission tag="trendsSelect"
                        class="inline"
                        type="primary"
                        v-else-if="form.status_txt === '待部长审核'"
                        :route="apis.url_audit_minister"
                        @trigger="trigger_group_minister"
                        :selects="ministerHandle"></permission>
        </div>
        <dummy-table :form="form"
                     class="mt-sm"
                     ref="dummyTable"
                     :current-handle="currentHandle"></dummy-table>
        <add-goods v-model="addDialog"
                   @add-goods="add_goods"></add-goods>
        <remark-dialog v-model="remarkDialog"
                       @submit="submit_remark"
                       :tips-title="tipsTitle"
                       :handle-id="handleId"
                       :current-handle="currentHandle"></remark-dialog>
        <export-dialog v-model="exportDialog"
                       @export-excel="export_excel"
                       :channel-id="form.channel_id"></export-dialog>
        <div slot="footer">
            <request-button class="inline" @click="submit_approve" req-key="submitApprove" :mintime="300"
                            v-if="currentHandle==='add'">提交审批</request-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
import {mapGetters} from 'vuex';
import {api_virtual_order,api_post_virtual_order,api_look_over,api_audit_minister,api_audit_headman,api_batch_cancel,api_virtual_order_import} from '../../../api/scalp-task';
import {url_audit_minister,url_audit_headman,url_batch_cancel,url_virtual_order_import} from '../../../api/scalp-task';
    export default {
        permission:{
            url_audit_minister,
            url_audit_headman,
            url_batch_cancel,
            url_virtual_order_import
        },
        data() {
            return {
                exportDialog:false,
                tipsTitle:"",
                curHandle:"",
                handleId:"",
                remarkDialog:false,
                dialog:this.value,
                addDialog:false,
                form:{
                    seller_id:"",
                    channel_id:4,
                    reason:1,
                    estimate_total_cost:"",
                    created_time:"",
                    status_txt:"未处理",
                    detail:[],
                },
                groupHandle:[
                    {label:"审批通过",value:1,action:function (val) {
                        if(!this.return_methods())return;
                        this.curHandle = "group";
                        this.handleId = 1;
                        this.remarkDialog = true;
                        this.tipsTitle = "您将通过已勾选SKU的虚拟订单申请，而未被勾选的SKU则自动视为“审批不通过”，确认此操作吗？";
                    }},
                    {label:"审批不通过",value:2,action:function (val) {
                        if(!this.return_methods())return;
                        this.curHandle = "group";
                        this.handleId = 2;
                        this.remarkDialog = true;
                        this.tipsTitle = "您将拒绝已勾选SKU的虚拟订单申请，确认此操作吗？";
                    }},
                ],
                ministerHandle:[
                    {label:"审批通过",value:1,action:function () {
                        if(!this.return_methods())return;
                        this.curHandle = "minister";
                        this.handleId = 1;
                        this.remarkDialog = true;
                        this.tipsTitle = "您将通过已勾选SKU的虚拟订单申请，而未被勾选的SKU则自动视为“审批不通过”，确认此操作吗？";
                    }},
                    {label:"审批不通过",value:2,action:function () {
                        if(!this.return_methods())return;
                        this.curHandle = "minister";
                        this.handleId = 2;
                        this.remarkDialog = true;
                        this.tipsTitle = "您将拒绝已勾选SKU的虚拟订单申请，确认此操作吗？";
                    }},
                ]

            }
        },
        computed:{
            ...mapGetters({currentUser:'user/info'}),
            comTotalCost(){
                let cur = 0;
                if(this.form.detail&&this.form.detail.length>0){
                    this.form.detail.forEach(row=>{
                        cur += Number(row.estimate_cost);
                    })
                }
                return cur;
            },
            cancelIdList(){
                if(this.form.detail&&this.form.detail.length>0){
                    return this.form.detail.filter(row=>row.isCheck).map(row=>row.id);
                }else{
                    return [];
                }

            },
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            open(){
                if(this.currentHandle==='add'){
                    this.form = {
                        seller_id:"",
                        channel_id:4,
                        estimate_total_cost:"",
                        created_time:"",
                        status_txt:"未处理",
                        reason:1,
                        detail:[],
                    }
                }else{
                    this.get_look_over();
                }
            },
            import_order(){
                this.exportDialog = true;
            },
            batch_cancel(){
                if(!this.return_methods())return;
                this.tipsTitle = "您将作废已勾选SKU的虚拟订单申请，确认此操作吗？";
                this.remarkDialog = true;
                this.curHandle="batch-cancel";
            },
            api_batch_cancel(val){
                let params = {
                    id:this.id,
                    remark:val,
                    cancelId:this.cancelIdList
                };
                this.$http(api_batch_cancel,params).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.form.detail.filter(row => row.isCheck).forEach(row => {
                        row.status = 2;
                        row.status_txt = "已作废";
                        row.isCheck=false;
                    });
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                }).finally(()=>{
                    this.$reqKey('remarkDialogKey',false)
                })
            },
            return_methods(){
                if(this.cancelIdList.length<=0){
                    this.$message({type:"warning",message:"请先选择需要操作的数据"});
                    return false;
                }else{
                    return true;
                }
            },
            submit_remark(val){
                if(this.curHandle==="minister"){
                    this.handle_do(api_audit_minister,this.handleId,val);
                }else if(this.curHandle==='group'){
                    this.handle_do(api_audit_headman,this.handleId,val);
                }else if(this.curHandle==='batch-cancel'){
                    this.api_batch_cancel(val);
                }
            },
            trigger_group_leader(val){
                val.action.call(this);
            },
            trigger_group_minister(val){
                val.action.call(this);
            },
            handle_do(url,handleId,remark){
                let params = {
                    id:this.id,
                    agree:handleId,
                    ids:this.cancelIdList,
                    remark:remark,
                };
                this.$http(url,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.form.status_txt = res.data.status_txt;
                    this.do_detail(this.curHandle,handleId);
                    this.$emit("handle-do",res,this.id);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('remarkDialogKey',false)
                })
            },
            do_detail(curHandle,handleId) {
                if (handleId === 1) {
                    this.form.detail.filter(row => !row.isCheck).forEach(row => {
                        row.status = 2;
                        row.status_txt = "已作废";
                    });
                } else {
                    this.form.detail.filter(row => row.isCheck).forEach(row => {
                        row.status = 2;
                        row.status_txt = "已作废";
                        row.isCheck = false;
                    });
                }

            },
            batch_delete(){
                if(!!this.form.detail.find(row=>!!row.isCheck)){
                    this.form.detail = this.form.detail.filter(row=>!row.isCheck);
                }else{
                    return this.$message({type:"warning",message:"请先选择需要删除的数据"});
                }
            },
            add_sku(){
                this.addDialog = true;
            },
            export_excel(val){
                val.forEach(row=>{
                    let cur = clone(row);
                    delete cur.account_shorter;
                    cur.is_collection_product = !!cur.is_collection_product?true:false;
                    cur.is_collection_shop = !!cur.is_collection_shop?true:false;
                    cur.is_stars = !!cur.is_stars?true:false;
                    cur.time_quantity = cur.time_quantity.split(';').map(row=>{
                        let c = row.split("|");
                        return {
                            date:c[0],
                            total:c[1]
                        }
                    });
                    this.$set(cur,'isSaveBtn',false);
                    this.$set(cur,'isCheck',false);
                    this.form.detail.push(cur);
                });

            },
            add_goods(val){
                val.forEach(row=>{
                    let date = new Date().getTime();
                    let obj = {
                        sku_id:row.sku_id,
                        sku:row.sku,
                        thumb:row.thumb,
                        account_id:"",
                        account_name:"",
                        keyword:"",
                        product_location:"",
                        product_link:"",
                        time_quantity:[{date:date,total:""}],
                        is_collection_product:false,
                        is_stars:false,
                        is_collection_shop:false,
                        estimate_cost:"",
                        remark:"",
                        status:0,
                        status_txt:"未处理",
                        isSaveBtn:true,
                        isCheck:false,
                    };
                    this.form.detail.push(obj);
                })
            },
            submit_approve(){
                this.form.created_time = Math.floor(new Date().getTime()/1000);
                this.form.estimate_total_cost = this.comTotalCost;
                let cloneData = clone(this.form);
                let canSubmit = true;
                if(!cloneData.seller_id){
                    this.$reqKey('submitApprove',false);
                    return this.$message({type:"warning",message:"请选择销售员"});
                }
                cloneData.detail.forEach((row,index)=>{
                    row.is_collection_product =row.is_collection_product?1:0;
                    row.is_collection_shop =row.is_collection_shop?1:0;
                    row.is_stars =row.is_stars?1:0;
                    if(row.isSaveBtn){
                        canSubmit = false;
                        return this.$message({type:"warning",message:`第${index+1}行，请点击保存。`});
                    }
                    let cur = this.form.detail[index];
                    row.time_quantity.forEach((res,i)=>{
                        let date = Math.floor(new Date(cur.time_quantity[i].date).getTime()/1000);
                        res.date = date;
                    });
                    if(row.product_link.indexOf('http://') === -1 && row.product_link.indexOf('https://') === -1){
                        row.product_link = 'http://' + row.product_link;
                    }
                    delete row.isCheck;
                    delete row.isSaveBtn;
                });
                if(!canSubmit){
                    return this.$reqKey('submitApprove',false);
                }
                this.$http(api_post_virtual_order,cloneData).then(res=>{
                    this.dialog = false;
                    this.$message({type:"success",message:res.message||res});
                    this.$emit("submit-approve",res.data);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('submitApprove',false);
                });
            },
            get_look_over(){
                this.$http(api_look_over,this.id).then(res=>{
                    res.detail.forEach(row=>{
                        this.$set(row,'isCheck',false);
                        this.$set(row,'isSaveBtn',false);
                    });
                    this.form.channel_id = res.channel_id;
                    this.form.seller_id = res.seller_id;
                    this.form.estimate_total_cost = res.estimate_total_cost;
                    this.form.created_time = res.created_time;
                    this.form.status_txt = res.status_txt;
                    this.form.reason = res.reason;
                    this.$nextTick(()=>{
                        res.detail.forEach(row=>{
                            row.is_collection_product = row.is_collection_product?true:false;
                            row.is_collection_shop = row.is_collection_shop?true:false;
                            row.is_stars = row.is_stars?true:false;
                        });
                        this.form.detail = res.detail;
                    });
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
        },
        props:{
            value:{},
            id:{
                required:true,
            },
            currentHandle:{
                required:true,
                type:String
            },
            dummyTittle:{
                required:true,
                type:String
            },

        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            dummyHeader:require('./dummy-header.vue').default,
            dummyTable:require('./dummy-table.vue').default,
            addGoods:require('../../../api-components/add-goods.vue').default,
            trendsSelect:require('../../../components/trends-select.vue').default,
            remarkDialog:require('./remark-dialog.vue').default,
            exportDialog:require('./export-dialog.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        }
    }
</script>
