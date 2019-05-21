<template>
    <page class="p-index">
        <!--添加  查看-->
        <add-dummy v-model="addDialog"
                   @submit-approve="submit_approve"
                   :dummy-tittle="dummyTittle"
                   :current-handle="currentHandle"
                   @handle-do="handle_do"
                   :id="curId"></add-dummy>
        <!--批量分配-->
        <batch-allots v-model="batchDialog" :ids="ids"></batch-allots>
        <!--指定负责人-->
        <batch-appoint v-model="appointDialog" :ids="ids"></batch-appoint>
        <!--指定买家-->
        <assign-buyer :buyer-list="buyerList" v-model="buyerDialog" :req-data="reqData"></assign-buyer>
        <!--日志-->
        <log-table v-model="logDialog" :cur-id="curId"></log-table>
        <card-search
                :form="form"
                :clears="clears"
                @clearParams="clearParams"
                :options="channelList"
                :button-list="buttonList"
                :type-list="typeList"
                @change-status="change_status"
                @search="search"></card-search>
        <div class="mt-sm mb-sm ml-sm">
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        class="inline"
                        @click.native="appoint_principal"
                        :route="apis.url_virtual_order_mission_allocation">指定负责人</permission>
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
    import {
        api_get_virtual_order_mission_list,api_get_channel,
        api_virtual_order_mission_type,
        api_virtual_order_mission_allocation,
        api_virtual_order_buyer_list,
        api_virtual_order_mission_status,
        url_virtual_order_mission_allocation,
        url_batch_allot,
        url_look_over,
        url_audit_headman,
        url_audit_minister,
        url_open_detail,
        url_open_log
    } from '../../../api/scalp-task';
    export default {
        permission:{
            url_batch_allot,
            url_look_over,
            url_audit_headman,
            url_audit_minister,
            url_open_detail,
            url_open_log,
            url_virtual_order_mission_allocation
        },
        page:{},
        refresh(){
            this.get_virtual_order();
            this.init();
        },
        data() {
            return {
                dummyTittle:"",
                logDialog:false,
                batchDialog:false,
                addDialog:false,
                appointDialog:false,
                buyerDialog:false,
                currentHandle:"",
                ids:[],
                curId:"",
                form:{
                    type:'',
                    number:"",
                    status:"",
                    snType:"sku",
                    snText:"",
                    channel:'',
                    site:'',
                    account_id:"",
                    seller_id:"",
                    functionary_id:"",
                    date_type:1,
                    date_start:"",
                    date_end:"",
                },
                clears:{
                    type:'',
                    number:"",
                    status:"",
                    snType:"sku",
                    snText:"",
                    channel:'',
                    site:'',
                    account_id:"",
                    seller_id:"",
                    functionary_id:"",
                    date_type:1,
                    date_start:"",
                    date_end:"",
                },
                channelList:[],
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                    totalSize:0
                },
                buttonList:[],
                typeList:[],
                loading:false,
                reqData:{},
                selectList:[
                    {label:"查看",value:1,api:url_look_over,action:function(val){
                        this.addDialog = true;
                        this.curId = val.id;
                        this.currentHandle = "lookOver";
                        this.dummyTittle = `查看：${val.number}申请单`;

                    }},
                    {label:"指定买家",value:3,action:function (val) {//dispose
                        this.reqData = {taskId:val.id};
                        this.buyerDialog = true;
                    }},
                    {label:'日志',value:4,api:url_open_log,action:function (val) {
                        this.logDialog = true;
                        this.curId = val.id;
                    }}
                ],
                buyerList:[]
            }
        },
        mounted(){
            this.init();
            this.get_virtual_order();
            this.get_channel();
            this.get_virtual_type()
        },
        methods:{
            get_buyer_list(){
                this.$http(api_virtual_order_buyer_list,{})
            },
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
            init_params(){
                let params = {
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                    status:this.form.status,
                    date_type:this.form.date_type
                };
                this.form.type&&(params.type = this.form.type);
                this.form.snType&&(params.snType = this.form.snType);
                this.form.snText&&(params.snText = this.form.snText);
                this.form.channel&&(params.channel = this.form.channel);
                this.form.account_id&&(params.account_id = this.form.account_id);
                this.form.seller_id&&(params.seller_id = this.form.seller_id);
                this.form.functionary_id&&(params.functionary_id = this.form.functionary_id);
                this.form.number&&(params.number = this.form.number);
                this.form.site&&(params.site = this.form.site);
                if(!!this.form.date_start){
                    let s = new Date(this.form.date_start);
                    params.date_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }
                if(!!this.form.date_end){
                    let e = new Date(this.form.date_end);
                    params.date_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                return params
            },
            init(){
                let params = this.init_params();
                this.loading = true;
                this.$http(api_get_virtual_order_mission_list,params).then(res=>{
                    this.tableData.list = res.data;
                    this.tableData.totalSize = res.count;
                    this.loading = false;
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
            clearParams(){
                console.log("清空");
            },
            change_status(){
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
            get_channel(){
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = [{label:"全部",value:''},...res];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_virtual_order(){
                let params = this.init_params();
                this.$http(api_virtual_order_mission_status,params).then(res=>{
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
            get_virtual_type(){
                this.$http(api_virtual_order_mission_type).then(res=>{
                    this.typeList =[{label:'全部',value:''},...res.map(row=>{
                        return {
                            label:row.typeName,
                            value:row.type
                        }
                    })];
                }).catch(code=>{
                    console.log(code);
                })
            },
            appoint_principal(){
                if(this.ids.length===0)return this.$message({type:'warning',message:'请选择需要指定的数据！'});
                this.appointDialog = true;
            },
        },
        computed:{
            comSelect(){
                return this.selectList.filter(res=>{
                    return this.$hasPermission(res.api);
                })
            }
        },
        components: {
            cardSearch:require('./card-search.vue').default,
            addDummy:require('./add-dummy.vue').default,
            dataTable:require('./data-table.vue').default,
            batchAllots:require('./batch-allots.vue').default,
            logTable:require('./log-table.vue').default,
            batchAppoint:require('./batch-appoint').default,
            assignBuyer:require('./assign-buyer').default,
        }
    }
</script>
