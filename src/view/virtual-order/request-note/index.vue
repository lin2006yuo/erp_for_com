<template>
    <page class="p-index">
        <!--添加  查看-->
        <add-dummy v-model="addDialog"
                   @submit-approve="submit_approve"
                   :dummy-tittle="dummyTittle"
                   :current-handle="currentHandle"
                   @handle-do="handle_do"
                   :channel-list="channelList"
                   :type-options="typeOptions"
                   :id="curId"></add-dummy>
        <!--批量分配-->
        <batch-allots v-model="batchDialog" :ids="ids"></batch-allots>
        <!--日志-->
        <log-table v-model="logDialog" :cur-id="curId"></log-table>
        <card-search
                :form="form"
                :clears="clears"
                @clearParams="clearParams"
                :options="channelList"
                :button-list="buttonList"
                @change-status="change_status"
                @search="search"></card-search>
        <div class="mt-xs mb-xs ml-sm">
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        class="inline"
                        @click.native="apply_for_order"
                        :route="apis.post_virtual_order">申请虚拟订单</permission>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        class="inline"
                        v-if="form.status===3"
                        @click.native="batch_allot"
                        :route="apis.url_batch_allot">批量分配</permission>
        </div>
        <data-table :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @selection-change="selection_change"
                    @size-change="size_change"
                    :select-list="comSelect"
                    @trigger-select="trigger_select"
                    @current-change="current_change"></data-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_list,api_get_sales,api_get_channel,api_virtual_order,api_batch_allot,api_get_mission_type} from '../../../api/request-note';
    import {url_batch_allot,post_virtual_order,url_look_over,url_audit_headman,url_audit_minister,url_open_detail,url_open_log} from '../../../api/request-note';
    export default {
        permission:{
            url_batch_allot,
            post_virtual_order,
            url_look_over,
            url_audit_headman,
            url_audit_minister,
            url_open_detail,
            url_open_log
        },
        page:{},
        refresh(){
            this.get_virtual_order();
            this.init();
        },
        data() {
            return {
                firstLoading: true,
                dummyTittle:"",
                logDialog:false,
                batchDialog:false,
                addDialog:false,
                currentHandle:"",
                ids:[],
                curId:"",
                form:{
                    number:"",
                    status:"",
                    snType:"sku",
                    snText:"",
                    channel:0,
                    site:"",
                    account_id:"",
                    seller_id:"",
                    operator_id:"",
                    date_start:"",
                    date_end:"",
                },
                clears:{
                    channel:0,
                    snType:"sku",
                },
                channelList:[],
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                    totalSize:0
                },
                buttonList:[],
                loading:false,
                selectList:[
                    {label:"查看",value:1,api:url_look_over,action:function(val){
                        this.addDialog = true;
                        this.curId = val.id;
                        this.currentHandle = "lookOver";
                        this.dummyTittle = `查看：${val.number}申请单`;

                    }},
                    {label:"审批",value:2,api:url_audit_headman||url_audit_minister,action:function (val) {
                        this.addDialog = true;
                        this.curId = val.id;
                        this.currentHandle = "examineApprove";
                        this.dummyTittle = `审批：${val.number}申请单`;
                    }},
                    // {label:"处理",value:3,api:url_open_detail,action:function (val) {//dispose
                    //     this.addDialog = true;
                    //     this.curId = val.id;
                    //     this.currentHandle = "dispose";
                    //     this.dummyTittle = `处理：${val.number}申请单`;
                    // }},
                    {label:'日志',value:4,api:url_open_log,action:function (val) {
                        this.logDialog = true;
                        this.curId = val.id;
                    }}
                ],
                typeOptions:[]//刷单类型
            }
        },
        computed:{
            comSelect(){
                return this.selectList.filter(res=>{
                    return this.$hasPermission(res.api);
                })
            }
        },
        created(){
            this.init();
            this.get_virtual_order();
            this.get_channel();
        },

        methods:{
            handle_do(res,id){
                this.tableData.list.filter(row=>{return row.id===id}).forEach(row=>{row.status_txt = res.data.status_txt});
            },
            submit_approve(val){
            	val.id = parseInt(val.id);
            	val.purview = [1, 2, 4];
                this.tableData.list.unshift(val);
                this.tableData.totalSize += 1;
                this.get_virtual_order();
            },
            init(){
                this.loading = true;
                let params = {
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                    status:this.form.status,
                };
                this.form.snType&&(params.snType = this.form.snType);
                this.form.snText&&(params.snText = this.form.snText);
                this.form.channel&&(params.channel = this.form.channel);
                this.form.site&&(params.site = this.form.site);
                this.form.account_id&&(params.account_id = this.form.account_id);
                this.form.seller_id&&(params.seller_id = this.form.seller_id);
                this.form.operator_id&&(params.operator_id = this.form.operator_id);
                this.form.number&&(params.number = this.form.number);
                if(!!this.form.date_start){
                    let s = new Date(this.form.date_start);
                    params.date_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }
                if(!!this.form.date_end){
                    let e = new Date(this.form.date_end);
                    params.date_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                this.$http(api_get_list,params).then(res=>{
                    this.tableData.list = res.data;
                    this.tableData.totalSize = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    console.log(code);
                    this.loading = false;
                })
            },
            selection_change(val){
                this.ids = val.map(row=>row.id);
            },
            batch_allot(){
                if(this.ids.length<=0)return this.$message({type:"warning",message:"请先选择需要进行批量分配的数据"});
                this.batchDialog = true;
            },
            trigger_select(val,action){
                action.action.call(this,val);
            },
            apply_for_order(){
                this.addDialog = true;
                this.currentHandle = "add";
                this.dummyTittle = "申请虚拟订单";
                this.get_order_type();
            },
            batch_allocation(){
                console.log("批量分配");
            },
            clearParams(){
                console.log("清空");
            },
            change_status(val){
                this.init();
            },
            search(){
                this.get_virtual_order();
                this.init();
            },
            size_change(val){
                this.tableData.pageSize = val;
                this.get_virtual_order();
                this.init();
            },
            current_change(val){
                this.tableData.page = val;
                this.get_virtual_order();
                this.init();
            },
/*
* 接口数据
* */
            get_channel(){
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = [{label:"全部",value:0},...res];
                }).catch(code=>{
                    console.log(code);
                })
            },

            get_virtual_order(){
                let params = {};
                this.form.snType&&(params.snType = this.form.snType);
                this.form.snText&&(params.snText = this.form.snText);
                this.form.channel&&(params.channel = this.form.channel);
                this.form.site&&(params.site = this.form.site);
                this.form.account_id&&(params.account_id = this.form.account_id);
                this.form.seller_id&&(params.seller_id = this.form.seller_id);
                this.form.operator_id&&(params.operator_id = this.form.operator_id);
                this.form.number&&(params.number = this.form.number);

                if(!!this.form.date_start){
                    let s = new Date(this.form.date_start);
                    params.date_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }

                if(!!this.form.date_end){
                    let e = new Date(this.form.date_end);
                    params.date_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                this.$http(api_virtual_order,params).then(res=>{
                    this.buttonList = res.map(row=>{
                        return {
                            label:row.txt,
                            value:row.val,
                            count:row.total
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_order_type(){//获取订单类型
                this.$http(api_get_mission_type,{}).then(res => {
                    this.typeOptions = res.map(row => {
                        return {
                            label: row.typeName,
                            value: row.type
                        }
                    })
                })
            }
        },
        components: {
            cardSearch:require('./card-search.vue').default,
            addDummy:require('./add-dummy.vue').default,
            dataTable:require('./data-table.vue').default,
            batchAllots:require('./batch-allots.vue').default,
            logTable:require('./log-table.vue').default,
        }
    }
</script>
