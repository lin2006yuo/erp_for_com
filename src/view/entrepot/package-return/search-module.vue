<template>
    <div class="p-returned-manage">
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <!--<div class="mb-sm">-->
            <!--<tab-item id="code" label="扫描录入包裹" :def="false">-->
                <!--<label-item label="扫描面单号：">-->
                    <!--<el-input v-model="searchData.shipping_number" @keyup.enter.native="deal_package"></el-input>-->
                <!--</label-item>-->
            <!--</tab-item>-->
        <!--</div>-->
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears" @init-params="init_status_btn">
            <el-row class="mb-mini">
                <div>
                    <label-buttons
                            label="退回类型："
                            class="inline"
                            @select="change_reason"
                            :buttons="reasonList">
                    </label-buttons>
                    <label-buttons
                            label="状态："
                            class="inline"
                            @select="change_status"
                            :buttons="statusList">
                    </label-buttons>
                </div>
                <label-item label="平台：">
                    <select-remote class="width-sm"
                                   v-sf.channel_id
                                   v-model="searchData.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <el-select :disabled="siteOptions.length<=1"
                               class="width-sm"
                               v-sf.site_code
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-model="searchData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select :disabled="accoutOptions.length<=1"
                               filterable clearable
                               :placeholder="accountPlaceholder"
                               v-sf.account_id
                               class="s-width-small"
                               v-model="searchData.account_id">
                        <el-option v-for="item in accoutOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item>
                    <el-select v-model="searchData.snType" class="width-xs ml-sm">
                        <el-option v-for="(item, index) in typeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="searchData.snText" :placeholder="`请输入${changeLabel}...`" class="ml-xs enter-result"></el-input>
                </label-item>
                <label-item label="运输方式：" class="ml-sm">
                    <el-cascader
                        change-on-select
                        @change="shipping_change"
                        v-sf.shipping_id
                        expand-trigger="hover"
                        :placeholder="shippingPlaceholder"
                        clearable
                        :options="shippingList"
                        filterable
                        :disabled="shippingList.length<=0"
                        class="inline s-width-large"
                    ></el-cascader>
                </label-item>
            </el-row>
            <el-select v-model="searchData.snUser" class="inline ml-sm width-xs">
                <el-option v-for="(item, index) in peopleList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <param-account
                class="width-sm"
                v-model="searchData.snTextUser"
                :param="{data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="warehouseUser"
                placeholder="请选择/输入..."
                url="get|user/warehouse/staffs">
            </param-account>

            <el-select v-model="searchData.snDate" class="ml-sm width-xs inline" v-sf.id>
                <el-option v-for="(item, index) in timeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.date_b
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"
                    v-sf.date_e
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-returned-manage{
        .head{
            height:32px !important;
            line-height:32px !important;
            color: white !important;
            background-color:#6495ed !important;
        }
    }

</style>
<script>
    import {entrepot_picking, api_get_reason, api_get_status, api_get_channel, api_account_list} from '@/api/package-return'
    import {api_get_shipping} from '@/api/common';
    export default {
        refresh(){
            this.shippingList= [];
            this.siteOptions=[{label:"",value:""}];
            this.accoutOptions=[{label:"",value:""}];
        },
        data(){
            return {
                warehouses:[],
                typeList:[
                    {label:'退回单号', value:'return_order_number'},
                    {label:'面单号', value:'shipping_number'},
                    {label:'包裹号', value:'package_number'}
                ],
                siteOptions:[{label:"",value:""}],
                warehouse_id:2,
                searchData: {
                    account_id:'',
                    status:'',
                    reason:'',
                    snText:'',
                    shipping_number:'',
                    package_number:'',
                    snType:'return_order_number',
                    channel_id:0,
                    site_code:'',
                    snDate:'create_time',
                    date_b:'',
                    date_e:'',
                    snUser:'creator_id',
                    snTextUser:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    snType:'return_order_number',
                    channel_id:0,
                    snDate:'create_time',
                    snUser:'creator_id',
                    page:1,
                    pageSize:20
                },
                reasonList:[],
                statusList:[],
                shippingList:[],
                accoutOptions:[{label:"",value:""}],
                peopleList:[
                    {label:'创建人', value:'creator_id'},
                    {label:'更新人', value:'updater_id'}
                ],
                timeList:[
                    {label:'创建时间',value:'create_time'},
                    {label:'更新时间',value:'update_time'}
                ],
                urlcreater:'get|user',
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_reasonList();
            this.init_statusList();
            this.shipping_remote();
        },
        methods: {
            init_status_btn(){
                let cur = this.reasonList;
                let cur2 = this.statusList;
                this.reasonList = [];
                this.statusList = [];
                this.$nextTick(()=>{
                    this.statusList = cur2;
                    this.reasonList = cur;
                })
            },
            init(){
                typeof this.searchData.snText === 'string' && (this.searchData.snText = this.searchData.snText.trim());
                let searchData = window.clone(this.searchData);
                Object.assign(searchData, {warehouse_id: this.warehouse_id});
                this.$emit('init-data', searchData);
            },
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = [...res.map(item => {
                        return {label: item.name, value: item.id};
                    })];
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_reasonList(){
                this.$http(api_get_reason).then(res=>{
                    this.reasonList = [{label:'全部', value:''}, ...res];
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_statusList(){
                this.$http(api_get_status).then(res=>{
                    this.statusList = [{label:'全部', value:''}, ...res];
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'});
                });
            },
            get_children(row,res) {
                let child = [];
                res.forEach(item=>{
                    if(row.value===item.carrier_id){
                        child.push({
                            label:item.shortname,
                            value:item.shipping_method_id
                        })
                    }
                });
                return child
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
                    this.$message({type: 'error', message: code.message || code});
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
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            shipping_remote(){
                if(this.warehouse_id==="") return this.shippingList = [];
                this.$http(api_get_shipping,{warehouse_id:this.warehouse_id}).then(res=>{
                    if(res.length<=0){
                        this.shippingList = [];
                        return
                    }
                    let list = res.map(row=>{
                        return row.carrier_id
                    });
                    list = this.carrier_unique(list).map(carrier_id=>{
                        let label = res.find(row=>row.carrier_id===carrier_id);
                        return {
                            label:label.carrier_name,
                            value:carrier_id
                        }
                    });
                    this.shippingList = list.map(row=>{
                        row.children = this.get_children(row,res);
                        return row
                    });
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            carrier_unique(arr){
                let res = [];
                let json = {};
                for(let i = 0; i < arr.length; i++){
                    if(!json[arr[i]]){
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            change_depot(){
                this.init();
            },
            change_reason(select, item){
                this.searchData.reason = item.value;
                this.init();
            },
            change_status(select, item){
                this.searchData.status = item.value;
                this.init();
            },
            search(){
                this.init();
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            shipping_change(val){
                this.searchData.shipping = val;
            }
        },
        computed: {
            sitePlaceholder(){
                if(this.searchData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if((this.searchData.site_code<=0&&this.accoutOptions.length>1) || this.searchData.site_code>0){
                    return "请选择账号";
                }else if(this.searchData.site_code<=0){
                    return "请先选择站点";
                }else if(this.accoutOptions.length<=1){
                    return "该站点下暂无账号";
                }
            },
            shippingPlaceholder(){
                if(this.warehouse_id==='') {
                    return "请先选择发货仓库";
                }else if(this.warehouse_id>0&&this.shippingList.length<=0){
                    return "该发货仓下暂无运输方式";
                }else{
                    return '请选择/输入运输方式';
                }
            },
            changeLabel(){
                let find = this.typeList.find(res=>{
                    return res.value === this.searchData.snType;
                });
                if(!!find){
                    return find.label;
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
            warehouse_id(val){
                this.shippingList = [];
                this.searchData.shipping = [];
                this.shipping_remote();
            }
        },
        props: {},
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            paramAccount:require('@/api-components/param-account').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            tabItem:require('@/components/tab-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
        },
    }
</script>
