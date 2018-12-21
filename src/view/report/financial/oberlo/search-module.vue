<template>
    <div>
        <search-card @search="search" :params="searchData" :clears="clears">
            <label-item label="账号简称：">
                <el-select :disabled="accoutOptions.length<=1"
                           class="s-width-default"
                           v-sf.account_id
                           filterable clearable
                           :placeholder="accountPlaceholder"
                           v-model="searchData.account_id">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="发货仓库：" class="ml-sm mr-sm">
                <el-select class="s-width-default"
                           v-sf.warehouse_id
                           v-model="searchData.warehouse_id"
                           filterable clearable>
                    <el-option v-for="item in warehouseList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item class="mr-sm">
                <el-select v-model="searchData.time_field"
                           class="s-width-small mr-xs"
                           v-sf.time_field>
                    <el-option v-for="type in time_type_list"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-sf.time_start
                        v-model="searchData.time_start"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-sf.time_end
                        v-model="searchData.time_end"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_account_list, api_get_warehouse} from  '@/api/report-channel'
    export default {
        data(){
            return {
                siteOptions:[{label:"",value:""}],
                accoutOptions:[{label:"",value:""}],
                warehouseList:[],
                time_type_list:[
                    {label:'发货日期',value:'shipping_time'},
                    {label:'付款日期',value:'pay_time'}
                ],
                searchData:{
                    channel_id:16,
                    site_code:'',
                    account_id:"",
                    warehouse_id:"",
                    time_field:'shipping_time',
                    time_start:new Date(Date.now()).setDate(1),
                    time_end:Date.now(),
                    page:1,
                    pageSize:20
                },
                clears:{
                    channel_id:16,
                    site_code:'',
                    account_id:"",
                    warehouse_id:"",
                    time_field:'shipping_time',
                    time_start:new Date(Date.now()).setDate(1),
                    time_end:Date.now(),
                    page:1,
                    pageSize:20
                },
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.time_end){
                            return time.getTime() > this.searchData.time_end;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.time_start){
                            return time.getTime() < this.searchData.time_start || time.getTime() > Date.now();
                        }else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted(){
            this.warehouse_remote();
            this.get_site(this.searchData.channel_id);
        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            site_remote(){
                return this.$http(api_get_channel_categories,{}).then(res=>{
                    return Promise.resolve(res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    }));
                }).catch(code=>{
                    console.log(code);
                });
            },
            warehouse_remote(){
                this.$http(api_get_warehouse).then(res=>{
                    res.forEach(row => {
                        this.warehouseList.push({label: row.name, value: row.id});
                    });
                    this.warehouseList.unshift({label: '全部', value: ''})
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        if(res.account.length>0){
                            res = res.account;
                            this.accoutOptions = [{label:"全部",value:""},...res];
                        }else{
                            this.accoutOptions = [{label:"",value:""}];
                        }
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            search(){
                this.init();
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.channel_id = 16;
                this.searchData.time_field = 'shipping_time';
                this.searchData.time_start = (new Date(Date.now()).setDate(1));
                this.searchData.time_end=Date.now();
                this.init();
            },
        },
        computed: {
            accountPlaceholder(){
                if((this.searchData.site_code<=0&&this.accoutOptions.length>1) || this.searchData.site_code>0){
                    return "请选择账号";
                }else if(this.searchData.site_code<=0){
                    return "请先选择站点";
                }else if(this.accoutOptions.length<=1){
                    return "该站点下暂无账号";
                }
            }
        },
        watch: {
            'searchData.channel_id'(val){
                this.searchData.site_code ='';
                this.searchData.account_id = "";
                this.siteOptions = [{label:"",value:""}];
                this.accoutOptions = [{label:"",value:""}];
                this.get_site(val);
            },
            'searchData.site_code'(val){
                this.searchData.account_id = "";
                this.get_account(this.searchData.channel_id,val);
            },
        },
        props: {},
        components: {
            labelItem:require('@/components/label-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
            searchCard:require('@/components/search-card.vue').default
        },
    }
</script>
