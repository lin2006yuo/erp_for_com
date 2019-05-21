<template>
    <page class="p-index">
        <card-search :params="params"
                     :clears="clears"
                     :site-list="siteList"
                     @change-select="change_select"
                     @search="init">
        </card-search>
        <el-row class="mt-xs mb-xs">
            <el-button size="mini"
                       :disabled="selectData.length <= 0"
                       @click.native="batchSetup"
                       type="primary"
                       class="ml-sm">批量设置</el-button>
            <el-button type="primary" size="mini"
                       :disabled="!amazonSelected.length"
                       @click.native="update_amazon">
                批量更新亚马逊状态
            </el-button>
        </el-row>
        <data-table
                :seatch-data="seatchData"
                :add-edit-site-list="addEditSiteList"
                :loading="loading"
                :first-loading="firstLoading"
                @notice-info="notice_info"
                @sort-change="sort_change"
                @save-member="init"
                @cur-delete="cur_delete"
                @selection-change="selectionChange">
        </data-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=seatchData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=seatchData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </div>
        <edit-batch v-model="settingUp"
                    :title="title"
                    :batch-data="batchData"
                    @set-clich="setClich">
        </edit-batch>
        <!--通知弹框-->
        <notice-info v-model="noticeDialog"
                     :notice-data="noticeData"
                     @sync-notice="sync_notice"
                     @set-notice="set_notice">
        </notice-info>
    </page>
</template>
<style lang="stylus">
    .mt{margin: 10px 0 10px 20px}
    .star-red{
        color: red;
    }
    .star-green{
        color: green;
    }
</style>
<script>
    import dataTable from './data-table.vue'
    import {ymx_list,ymx_site,ymx_post_batch_set,api_get_notice_info,api_post_set_amazon_notice,api_update_amazon_status} from '@/api/ymx';

    export default{
        page:{},
        refresh(){
            this.init();
        },
        created(){
            this.init();//-------list列表
        },
        data(){
            return{
                firstLoading: true,
                sort_type:'',
                sort_val:'',
                siteList:[],
                seatchData:{
                    ymxList:[],
                    page:1,
                    pageSize:50,
                },

                params:{
                    authorization:-1,
                    snType:'account_name',
                    snText:'',
                    site:'',
                    taskName:'download_listing',
                    taskCondition:'eq',
                    taskTime:'',
                    is_invalid:'',
                    site_status:'',
                    seller_id:'',
                    customer_id:'',
                    time_type:'register',
                    start_time:'',
                    end_time:''
                },
                clears:{
                    authorization:-1,
                    snType:'account_name',
                    taskName:'download_listing',
                    taskCondition:'eq',
                    time_type:'register'
                },
                total:0,
                site:'',
                loading:true,
                addEditSiteList:[],
                selectData: [],
                settingUp:false,
                title: '',
                batchData:{},
                noticeDialog:false,
                noticeData:{},
                amazonSelected:[]
            }
        },
        mounted(){
            this.get_site();
        },
        methods:{
            change_select(){
                this.init();
            },
            update_amazon(){
                this.$http(api_update_amazon_status,{ids:this.amazonSelected}).then(res=>{
                    this.$message({type:'error', message:res.message||res});
                    this.init();
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
                this.amazonSelected=val.filter(row=>!row.is_invalid).map(item=>item.id);
            },
            batchSetup(){
                this.settingUp = true;
                this.title = "批量设置";
                this.batchData = {
                    status:'',
                    site_status:'',
                    download_listing:'',
                    download_order:'',
                    sync_delivery:'',
                    sync_feedback:'',
                    download_health:'',
                    assessment_of_usage:'',
                }
            },
            setClich(val){
                let params = val;
                this.$set(params,'ids',this.selectData.join(','));
                this.$http(ymx_post_batch_set,params).then(res=>{
                    this.init();
                    this.$message({type:'success',message: res.message});
                    this.settingUp = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    console.log(params)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            sort_change(val){
                if(!val.column||!val.column.label)return;
                switch(val.column.label){
                    case '简称':
                        this.sort_type = 'code';
                        break;
                    case '亚马逊账户':
                        this.sort_type = 'account_name';
                        break;
                    case '站点':
                        this.sort_type = 'site';
                        break;
                    default:
                        this.sort_type = '';
                }
                this.sort_val = val.order==='descending'?2:1;
                this.init();
            },

            //站点
            get_site(){
                this.$http(ymx_site).then(res=>{
                    res = res.map(row=>{
                        return {
                            label:row.site,
                            value:row.site,
                        }
                    });
                    this.addEditSiteList = clone(res);
                    this.siteList = res;
                    this.siteList.unshift({label:'全部',value:''});
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
            init(){//-------------list列表函数
                this.loading = true;
                let params = window.clone(this.params);
                if(params.site === ''){
                    delete params.site;
                }
                if(params.is_invalid===''){
                    delete params.is_invalid;
                }
                this.$set(params,'page',this.seatchData.page);
                this.$set(params,'pageSize',this.seatchData.pageSize);
                params.start_time=this.params.start_time?datef('YYYY-MM-dd', this.params.start_time/1000):'';
                params.end_time=this.params.end_time?datef('YYYY-MM-dd', this.params.end_time/1000):'';
                this.sort_val&&this.$set(params,'sort_val',this.sort_val);
                this.sort_type&&this.$set(params,'sort_type',this.sort_type);
                this.$http(ymx_list,params).then(res => {
                    this.seatchData.ymxList = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            clear(){
                this.params.authorization = -1;
                this.params.snType = 'account_name';
                this.params.snText = '';
                this.params.site = '';
                this.search();
            },
            notice_info(row){//-----通知
                this.$http(api_get_notice_info,{id:row.id}).then(res => {
                    this.noticeData = res;
                    this.noticeDialog = true
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            sync_notice(){//-----同步

            },
            set_notice(id,account_id,arr){//----设置
                let params = {
                    id: id,
                    account_id: account_id,
                    notice_type: []
                };
                params.notice_type = arr.map(row => {
                    return {
                        name: row.name,
                        checked: row.checked?1:0
                    }
                });
                this.$http(api_post_set_amazon_notice, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.noticeDialog = false
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            cur_delete(){
                this.init();
            },
            handleSizeChange(val) {//------------分页
                this.seatchData.page = 1;
                this.seatchData.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.seatchData.page = val;
                this.init();
            },
        },
        components:{
            dataTable,
            editBatch:require('./edit-batch').default,
            noticeInfo:require('./notice-info').default,
            cardSearch:require('./card-search').default
        }
    }
</script>
