<template>
    <page class="p-index">
        <search-data @search='search'
                     :channel-list="channelList"
                     @select-button='select_button'
                     :search-data="searchData"
                     :clears="clear"></search-data>
        <div class="mt-sm mb-sm ml-sm">
            <el-button type="primary" size="mini" class="inline" @click.native="add_rule">添加</el-button>
        </div>
        <table-data :tables="tables"
                    :loading="loading"
                    @look-log="look_log"
                    @change-status="change_status"
                    @lookup='lookup'></table-data>
        <add-dialog-copy v-model="addDialog"
                         :title="title"
                         @create="create"
                         @modify="modify"
                         :mdfid="mdfid"></add-dialog-copy>
        <rule-log v-model="showLog" :log-data="logData"></rule-log>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_rules_channel,api_virtual_rules_list} from '@/api/api-virtual-rules';
    export default {
        data() {
            return {
                searchData:{
                    type:'',
                    status:'',
                    snType:'title',
                    snText:'',
                    channel_id:2,
                    start_time:'',
                    end_time:'',
                    creator_id:'',
                },
                clear:{
                    channel_id:2,
                    snType:'title',
                },
                channelList:[{label:'通用',value:''}],
                addDialog:false,
                title:'',
                mdfid:0,
                tables:{
                    lists:[],
                },
                loading:false,
                showLog:false,
                logData:[],
            }
        },
        mounted(){
            this.get_channel();
        },
        methods:{
            create(params,data){
                if(this.is_true(params)){
                    this.tables.lists.push(data);
                }
            },
            modify(params,data){
                if(this.is_true(params)){
                    let find = this.tables.lists.find(row=>row.id===data.id);
                    if(find){
                        Object.assign(find,data)
                    }else{
                        this.tables.lists.push(data);
                    }
                }else{
                    let index = this.tables.lists.findIndex(row=>row.id===data.id);
                    if(index>-1)this.tables.lists.splice(index,1);
                }
            },
            is_true(params){
                if(this.searchData.channel_id === params.channel_id&&(this.searchData.status===''||this.searchData.status===params.status)){
                    return true;
                }else{
                    return false;
                }
            },
            look_log(data){
                this.showLog = true;
                this.logData = data;
            },
            change_status(id,status){
                if(this.searchData.status==='')return; //当筛选状态为全部的时候，不需要做出数据的改变
                let index = this.tables.lists.findIndex(res=>{
                    return res.id === id;
                });
                this.tables.lists.splice(index,1);
            },
            lookup(itemid,itemName){
                this.mdfid = itemid;
                this.addDialog = true;
                this.title = `查看编辑订单规则：${itemName} 信息`
            },
            add_rule(){
                this.title = '添加规则';
                this.addDialog = true;
                this.mdfid = 0;
            },
            init(){
                this.loading = true;
                let params = clone(this.searchData);
                if(params.start_time) params.start_time = this.get_time(params.start_time);
                if(params.end_time) params.end_time = this.get_time(params.end_time);
                this.$http(api_virtual_rules_list,params).then(res => {
                    this.loading = false;
                    this.tables.lists = res.data;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    this.loading = false;
                })
            },
            get_time(time){
                let timeStamp = time.getTime()/1000;
                return datef('YYYY-MM-dd',timeStamp)
            },
            search(){
                this.init();
            },
            select_button(val){
                this.searchData.channel_id = this.channelList[val].value;
                this.init();
            },
            get_channel(){
                this.$http(api_rules_channel).then(res => {
                    let list = res.map(row=>{
                        return {
                            value:row.id,
                            label:row.name
                        }
                    })
                    this.channelList.push(...list);
                }).catch(code => {
                    console.log(code);
                });

            }
        },
        components: {
            searchData:require('./search-data.vue').default,
            addDialog:require('./add-dialog').default,
            addDialogCopy:require('./add-dialog-copy.vue').default,
            tableData:require('./table-data.vue').default,
            ruleLog:require('./rule-log-virtual.vue').default
        }
    }
</script>