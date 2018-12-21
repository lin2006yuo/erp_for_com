<template>
    <page>
        <search-card style="overflow: visible" @search="search" @enter="search" :params="searchData" :clears="clears">
            <div>
                <label-buttons class="inline" label="销售渠道："
                               :buttons="channelList"
                               ref="labelButtons"
                               @select="select_button">
                </label-buttons>
            </div>
            <label-items label="规则名称：" class="inline">
                <el-input class="width-super" v-model="searchData.title" v-sf.title></el-input>
            </label-items>
            <label-items label="操作人：" class="inline  ml-sm">
                <scroll v-model="searchData.creator_id"
                        class="s-width-default"
                        v-sf.creator_id
                        textAlign="left" :remote="user_url"
                        :fix-params="fix_params">
                </scroll>
            </label-items>
            <label-items label="站点：" class="inline ml-sm">
                <el-select :disabled="siteOptions.length<=1"
                           class="s-width-default"
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
            </label-items>
            <label-items label="状态：" class="inline ml-sm">
                <el-select v-model="searchData.status" class="s-width-small" v-sf.status>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" value="0"></el-option>
                    <el-option label="停用" value="1"></el-option>
                </el-select>
            </label-items>
            <label-items label="有效期：" class="inline ml-sm">
                <el-date-picker
                        class="inline date"
                        v-sf.date_b
                        v-model="searchData.date_b"
                        type="date"
                        :picker-options="pickerstart"
                        placeholder="开始时间">
                </el-date-picker>&nbsp;--&nbsp;
                <el-date-picker
                    class="inline date mr-sm"
                    v-sf.date_e
                    v-model="searchData.date_e"
                    type="date"
                    format="yyyy-MM-dd"
                    :picker-options="pickerend"
                    placeholder="结束时间">
                </el-date-picker>
            </label-items>
        </search-card>
        <div class="ml-sm mt-xs mb-xs">
            <el-button type="primary" size="mini" @click.native="add">添加</el-button>
            <request-button v-if="isChange" :request="save">确定</request-button>
        </div>
        <rule-data :tables="tables" @lookup="lookup" @change="isChange=true" @change-total="change_total"></rule-data>
        <rule-dialog v-model="ruleVisable" @reload="init" :mdfid="mdfid" :page-title="pageTitle"></rule-dialog>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_pricing_list, api_getchannel, api_account_list, api_pricing_sort, api_get_user} from '../../../api/publish-rules'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮,吴楚光',
                backEnd:'张文宇,吴楚光',
                createTime:'2017-7-20',
                updateTime:'2017-8-29'
            },
            beforeClose(){
                if (!this.pageChange) {
                    return true;
                } else {
                    return this.$confirm(`您将关闭该页面，确认此操作吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        refresh(){
           this.search();
        },
        data(){
            return {
                searchData:{
                    page: 1,
                    pageSize: 20,
                    title:'',
                    creator_id:'',
                    channel_id:'',
                    site_code:'',
                    status:'',
                    date_b:'',
                    date_e:'',
                },
                clears:{
                    page: 1,
                    pageSize: 20,
                    title:'',
                    creator_id:'',
                    channel_id:'',
                    site_code:'',
                    status:'',
                    date_b:'',
                    date_e:'',
                },
                user_url:config.apiHost+'user',
                userList:[],
                channel_id:'',
                channelList:[
                    {label:'全部',value:''},
                    {label:'ebay',value:1},
                    {label:'wish',value:3},
                    {label:'aliExpress',value:4},
                    {label:'Amazon',value:2},
                ],
                siteOptions:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b
                        }else {
                            return false
                        }
                    }
                },
                isChange:false,
                ruleVisable:false,
                loading:true,
                tables:{
                    lists:[]
                },
                total:0,
                mdfid:0,
                copyLoading:true,
                pageChange:false,
                pageTitle:''
            }
        },
        mounted(){
            this.init();
            this.api_get_channel();
        },
        methods: {
            init_status_btn(){
                let curBtn = this.channelList;
                this.channelList = [];
                this.$nextTick(()=>{
                    this.channelList = curBtn;
                })
            },
            //过滤供应商
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'realname',
                    snText:keyword
                };
            },
            init(){
                this.loading = true;
                let data=clone(this.searchData);
                //处理年月日 YYYY-MM-dd
                if(this.searchData.date_b){
                    data.date_b=datef('YYYY-MM-dd', this.searchData.date_b/1000);
                }else {
                    data.date_b='';
                }
                if(this.searchData.date_e){
                    data.date_e=datef('YYYY-MM-dd', this.searchData.date_e/1000);
                }else {
                    data.date_e='';
                }
                data.channel_id = this.channel_id;
                this.$http(api_get_pricing_list, data).then(res=>{
                    this.isChange = false;
                    this.total = res.count;
                    let sorts = res.data.sort((a,b)=>{
                        return a.sort - b.sort;
                    });
                    sorts.forEach(row=>{
                        row.isTurn=false;
                        row.number=1;
                        row.status=!row.status;
                    });
                    this.loading=false;
                    this.tables.lists = sorts;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            change_total(){
                this.total -= 1;
            },
            //获取平台信息
            plat_remote(){
                return this.$http(api_getchannel).then(res=>{
                    return Promise.resolve(res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    }));
                });
            },
            //获取渠道
            api_get_channel(){
                this.$http(api_getchannel).then(res=>{
                    this.buttonList = [{label: "全部", value: 0},...res]
                }).
                catch(code=>{
                    console.log(code);
                })
            },
            select_button(val, item){
                console.log(item)
                this.channel_id = item.value;
                this.init();
            },
            //获取站点信息
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
                    this.$message({type:"error",message:code.message || code});
                })
            },
            search(){
                this.init();
            },
            search_clear(data){
                this.channel_id = '';
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.channel_id = this.channel_id;
                this.init();
            },
            add(){
                this.mdfid = 0;
                this.pageTitle = "添加规则";
                this.ruleVisable = true;
            },
            lookup(itemid,item){
                this.mdfid = itemid;
                this.pageTitle = `查看编辑规则：${item.title} 信息`;
                this.ruleVisable = true;
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            //保存排序信息
            save(){
                let sort = this.tables.lists.map((row,index)=>{
                    return {id:row.id,sort:index}
                });
                return this.$http(api_pricing_sort, {sort}).then(res=>{
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
        },
        computed: {
            sitePlaceholder(){
                if(this.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            scrollObj:{
                get(){
                    return {
                        label: this.checkForm.supplier.company_name,
                        value: this.checkForm.supplier.supplier_id
                    }
                },
                set(val){
                    this.checkForm.supplier.company_name=val.label;
                    this.checkForm.supplier.supplier_id=val.value
                }
            }
        },
        watch: {
            channel_id(val){
                this.site ='';
                this.account_id = "";
                this.siteOptions = [{label:"",value:""}];
                this.accoutOptions = [{label:"",value:""}];
                this.get_site(val);
            },
        },
        props: {},
        components: {
            labelItems:require('../../../components/label-items.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            ruleData:require('./rule-data.vue').default,
            ruleDialog:require('./rule-dialog.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
            scroll:require('../../../components/scroll.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            requestButton:require('../../../global-components/request-button').default
        },
    }
</script>
