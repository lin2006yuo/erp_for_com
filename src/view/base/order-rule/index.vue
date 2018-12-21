<template>
    <page>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" :enable="startCompare">
            <div>
                <label-buttons label="平台："
                               class="inline"
                               ref="labelChannel"
                               @select="selectChannel"
                               :buttons="channelActions">
                </label-buttons>
                <label-buttons @select="auto_action_select"
                               label="自动处理动作："
                               :buttons="autoActions"
                               class="inline ml-xs">
                </label-buttons>
                <label-buttons class="inline ml-xs"
                               @select="status_action_select"
                               label-width="50"
                               label="状态："
                               :buttons="statusActions">
                </label-buttons>
            </div>
            <label-items label="筛选条件：" class="inline">
                <el-select v-model="searchData.cond" class="inline s-width-small" v-sf.cond>
                    <el-option
                            v-for="cond in conds"
                            :label="cond.label"
                            :value="cond.value"
                            :key="cond.value"
                    ></el-option>
                </el-select>
                <el-input v-model="searchData.condValue"
                          v-sf.condValue
                          :placeholder="`请输入${changeLabel}...`"
                          class="inline enter-result"></el-input>
            </label-items>
            <warehouse v-model="searchData.warehosue_id" class="ml-sm" @compare="compare"
                       v-sf.warehosue_id></warehouse>
            <label-items label="运输方式：" class="inline ml-sm" v-if="autoAction===2">
                <el-cascader
                        clearable
                        filterable
                        change-on-select
                        :disabled="shippingList.length<=0"
                        :placeholder="shippingPlaceholder"
                        class="inline s-width-large"
                        v-model="searchData.shipping"
                        expand-trigger="hover"
                        :options="shippingList"
                ></el-cascader>
            </label-items>
            <label-items v-if="[1,2].includes(platform)" label="站点：" class="inline ml-sm">
                <el-select v-model="searchData.platformSite" v-sf.platformSite>
                    <el-option v-for="site in sites"
                               :key="site.value"
                               :label="site.label"
                               :value="site.value"
                    ></el-option>
                </el-select>
            </label-items>
            <label-items v-if="platform" label="账号：" class="inline ml-sm">
                <select-filter v-model="searchData.platformAccount"
                               v-sf.platformAccount
                               :options="accounts"
                               placeholder="请输入账号">
                </select-filter>
            </label-items>
            <label-items label="有效期：" class="inline ml-sm">
                <el-date-picker
                        class="inline date"
                        v-model="searchData.btime"
                        v-sf.btime
                        type="date"
                        :picker-options="pickerstart"
                        placeholder="开始时间">
                </el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline date mr-sm"
                    v-model="searchData.etime"
                    v-sf.etime
                    type="date"
                    format="yyyy-MM-dd"
                    :picker-options="pickerend"
                    placeholder="结束时间">
            </el-date-picker>
            </label-items>
        </search-card>
        <div class="function">
            <permission tag="ElButton" type="primary" @click.native="add" size="mini" :route="apis.url_add">添加</permission>
            <permission tag="ElButton" v-if="isChange" type="primary" @click.native="save"  size="mini" :route="apis.url_sort">确定</permission>
            <permission tag="ElButton" type="primary" @click.native="sort_log" size="mini" :route="apis.url_get_sort_log">排序日志</permission>
            <el-button type="primary" size="mini"
                       v-if="autoAction===2"
                       @click.native="batch_change_shipping">批量修改运输方式</el-button>
            <request-button class="rule"
                            type="primary"
                            :disabled="disabledRule"
                            req-key="orderRuleDefault"
                            @click="default_rule">默认规则
            </request-button>
        </div>
        <rule-dialog :mdfid.sync="mdfid"
                     :title="addEditTitle"
                     @create="create"
                     @modify="modify"
                     v-model="show"
                     :isDefaultShow="isDefaultShow"
                     ref="ruleDialog"></rule-dialog>
        <data-table @refresh-data="init()"
                    :loading="loading"
                    @change="isChange=true"
                    @lookup="lookup"
                    @look-log="lookLog"
                    :tables="tables" ></data-table>
        <rule-log v-model="logVisible" :log-data="logData"></rule-log>
        <batch-change-shipping @close="close" v-model="batchShipping" :ids="ids"></batch-change-shipping>
    </page>
</template>
<style lang="stylus">
    .function{
        padding: 5px 10px 5px 10px;
        .rule{
            float :right ;
        }
        &::after{
            content :'';
            clear :both;
            display :block;
        }
    }
    .el-message-box{
        .el-message-box__input{
            .el-input{
                width: 380px;
            }
        }
    }
</style>
<script>
    import {api_get,api_getaction, api_sort,api_list_shiping,api_getchannel,api_get_sort_log,
        url_sort,url_add,url_get_sort_log,url_acquire_default_rule,api_acquire_default_rule} from '../../../api/order-rules';
    import {api_account_list} from '../../../api/order-local';
    export default{
        permission: {
            url_sort,
            url_add,
            url_get_sort_log,
            url_acquire_default_rule
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.etime){
                            return  time.getTime() > this.searchData.etime.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.btime){
                            return time.getTime() < this.searchData.btime.getTime()
                        }else {
                            return false
                        }
                    }
                },
                addEditTitle:"",
                autoAction:0,
                autoActions:[],
                statusAction:0,
                statusActions:[
                    {name:'启用',value:0},
                    {name:'停用',value:1},
                    {name:'全部',value:''},
                ],
                show:false,
                mdfid:0,
                tables:{
                    lists:[]
                },
                loading:true,
                isChange:false,
                conds:[
                    {label:"规则名称",value:'title'},
                    {label:"操作者",value:'operator'},
                ],
                searchData:{
                    cond:'title',
                    condValue:'',
                    warehosue_id:'',
                    platformSite:'',
                    platformAccount:'',
                    btime:'',
                    etime:'',
                    shipping:[]
                },
                clears:{
                    cond:'title',
                    condValue:'',
                    warehosue_id:'',
                    platformSite:'',
                    platformAccount:'',
                    btime:'',
                    etime:'',
                    shipping:'',
                },
                startCompare:false,
                platform:0,
                channels:{},
                fixSiteResult(res){
                    return res;
                },
                shippingList:[],
                logVisible:false,
                logData:[],
                channelActions:[],
                cloneData:[],
                isDefaultShow:true,
                batchShipping:false,
            }
        },
        mounted(){
            this.shipping_remote();
            this.get_channel();
            this.$http(api_getaction).then(res=>{
                this.autoActions = res.map(row=>{
                    return {
                        name:row.name,
                        value:row.id
                    }
                });
                this.autoAction = this.autoActions[0].value;
                this.init();
            });
        },
        methods:{
            batch_change_shipping(){
                if(this.ids.length<=0)return this.$message({type:'warning',message:'请勾选要批量操作的数据'});
                this.batchShipping = true;
            },
            default_rule(){
                this.$http(api_acquire_default_rule,{channel_id :1}).then(res=>{
                    console.log(res,12213);
                    this.addEditTitle = '邮寄方式默认规则';
                    this.mdfid=res.id;
                    this.isDefaultShow=false;
                    this.show = true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`orderRuleDefault`, false);
                    },200);
                });
            },
            create(data,params){
                if(this.statusAction===''||params.status===this.statusAction) this.tables.lists.push(data);
            },
            modify(data, params){
                if(this.statusAction===''||params.status===this.statusAction){
                    let find = this.tables.lists.find(row => row.id === data.id);
                    if(find){
                        Object.assign(find,data);
                    }
                }
            },
            shipping_remote(){
                this.$http(api_list_shiping).then(res=>{
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
                    console.log(code);
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
            search(){
                this.page = 1;
                this.pageSize = 50;
                this.init();
            },
            search_clear(){
                this.searchData.cond="title";
                this.searchData.condValue="";
                this.platform="";
                this.searchData.btime="";
                this.searchData.etime="";
                this.searchData.shipping='';
                this.init()
            },
            compare(){
                this.startCompare = true;
            },
            get_channel(){
                this.$http(api_getchannel).then(res=>{
                    let buttons = res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    });
                    this.channelActions = [{label:'通用',value:0},...buttons];
                });
            },
            selectChannel(index, item){
                this.platform = item.value;
                this.init();
            },
            platformAccountFetch(keyword, callback){
                if(keyword){
                    callback(this.accounts.filter(row => row.label.indexOf(keyword)>=0));
                }else{
                    callback(this.accounts.split(1, 20));
                }
            },
            platformAccountSelect(item){
                console.log(item);
            },
            add(){
                this.addEditTitle = '添加订单规则';
                this.show = true;
                this.isDefaultShow=true;
                this.mdfid = 0;
            },
            reload(){
                this.init();
            },
            sort_log(){
                this.$http(api_get_sort_log).then(res => {
                    this.logData = res;
                    this.logVisible = true;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            save(){
                let sort = this.tables.lists.map((row,index)=>{
                    return {id:row.id,sort:index}
                });
                let old_sort = this.cloneData.map((row,index)=>{
                    return {id:row.id,sort:index}
                });
                this.$http(api_sort,{sort,old_sort}).then(res=>{
                    this.$message({
                        type:'success',
                        message:'保存成功'
                    });
                    this.isChange = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    });
                })
            },
            auto_action_select(index){
                this.autoAction = this.autoActions[index].value;
                console.log(this.autoAction,'this.autoAction');
                this.$nextTick(()=>{
                    this.$refs.ruleDialog.autoAction=this.autoActions[index].value
                });
                this.init();
            },
            status_action_select(index){
                this.statusAction = this.statusActions[index].value;
                this.init();
            },
            init(){
                let params = {
                    status:this.statusAction,
                    type:this.autoAction,
                };
                if (this.autoAction === 2 && this.searchData.shipping.length===2) {
                    params.shipping_id = this.searchData.shipping[1];
                }
                if(this.searchData.cond && this.searchData.condValue){
                    params.snType = this.searchData.cond;
                    params.snText = this.searchData.condValue.trim();
                }
                if(this.platform){
                    params.channel_id = this.platform;
                }
                if(this.searchData.platformAccount){
                    params.account_id = this.searchData.platformAccount;
                }
                if(this.searchData.platformSite){
                    params.site = this.searchData.platformSite;
                }
                if(this.searchData.warehosue_id){
                    params.warehosue_id = this.searchData.warehosue_id;
                }
                if(this.searchData.btime){
                    params.start_time = fdatetime(this.searchData.btime, "YYYY-MM-dd");
                }
                if(this.searchData.etime){
                    params.end_time =fdatetime(this.searchData.etime, "YYYY-MM-dd");
                }
                this.loading=true;
                this.$http(api_get, params).then(res=>{
                    res.data = res.data.map(row=>{
                        this.$set(row,'isCheck',false);
                        return row
                    });
                    this.tables.lists = res.data;
                    this.cloneData = clone(res.data);
                    this.loading=false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code,
                    })
                })
            },
            lookup(itemid,itemName){
                this.mdfid = itemid;
                this.show = true;
                this.isDefaultShow=true;
                this.addEditTitle = `查看编辑订单规则：${itemName} 信息`
            },
            lookLog(data){
                this.logData = data;
                this.logVisible = true;
            },
            close(){
                this.tables.lists.forEach(el=>{
                    el.isCheck=false;
                })
            }
        },
        computed:{
            ids(){
                return this.tables.lists.filter(row=>row.isCheck).map(row=>row.id)
            },
            disabledRule(){
                if(this.platform===1&&this.autoAction===2){
                    return false;
                }else {
                    return true;
                }
            },
            shippingPlaceholder() {
                if (this.warehouse_id <= 0) {
                    return "请先选择发货仓库";
                } else if (this.warehouse_id > 0 && this.shippingList.length <= 1) {
                    return "该发货仓库下暂无运输方式";
                } else {
                    return "请选择运输方式";
                }
            },
            accounts(){
                if(this.platform){
                    let channel = null;
                    if(channel = this.channels[this.platform]){
                        return channel.account;
                    }else{
                        this.$http(api_account_list, {channel_id:this.platform}).then(res =>{
                            this.$set(this.channels, this.platform, res);
                        });
                        return [];
                    }
                }else{
                    return []
                }
            },
            sites(){
                let channel = this.channels[this.platform];
                if(channel){
                    return channel.site;
                }else{
                    return []
                }
            },
            changeLabel(){
                if(this.searchData.cond === 'title'){
                    return `规则名称`;
                }else{
                    return `操作者`;
                }
            }
        },
        components:{
            dataTable:require('./data-table.vue').default,
            ruleDialog:require('./rule-dialog.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            warehouse:require('../../../api-components/warehouse.vue').default,
            selectFilter:require('../../../components/select-filter.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
            labelItems:require('../../../components/label-items.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            ruleLog:require('./rule-log').default,
            batchChangeShipping:require('./batch-change-shipping.vue').default,
        }
    }
</script>
