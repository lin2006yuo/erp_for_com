<template>
    <page class="p-index">
        <card-search @search="search" :searchData="searchData" :clears="clears" :tip.sync="async_tips" :channelList="channelList"></card-search>
        <request-button class="mt-xs mb-xs ml-sm"
                        :disabled="table.list.length === 0"
                        :request="exports">批量导出</request-button>
        <table-list :loading="loading" :firstTime="firstTime" :table="table" @sort_c="sort_change"
        @get-detail="get_detail" :c_id.sync="id"
        >

        </table-list>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="table.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
        </el-pagination>
        <export-dialog v-model="visible"></export-dialog>
        <detail-dialog :title="title" :infoList="detail_list" v-model="detail_show"></detail-dialog>
    </page>
</template>

<style scoped>

</style>

<script>
    import {api_spu_publish_list,api_spu_publish_list_export,api_spu_account_detail} from '@/api/published-statistics-spu'
    export default {
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'王留伟',
                createTime:'2018-12-8',
                updateTime:''
            }
        },
        data() {
            return {
                searchData:{
                    date_type:'shelf',
                    start_date:new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    end_date:new Date().setDate(new Date().getDate()-1),
                    channel_num:'total',
                    min_num:'',
                    max_num:'',
                    channel_id:0,
                    select_type:'spu',
                    developer_id:'',
                    snText:'',
                    order_shelf_time:'',
                    order_total_cnt:''
                },
                table:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0
                },
                clears:{
                    date_type:'shelf',
                    start_date:new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    end_date:new Date().setDate(new Date().getDate()-1),
                    channel_num:'total',
                    min_num:'',
                    max_num:'',
                    channel_id:0,
                    select_type:'spu',
                    developer_id:'',
                    snText:'',
                    order_shelf_time:'',
                    order_total_cnt:''
                },
                loading:false,
                firstTime:true,
                async_tips:'',
                visible:false,
                title:'',
                detail_show:false,
                detail_list:[],
                id:'',
                channelList:[
                    {name:'全部',channel:0}
                ]
            }
        },
        mounted(){
            this.init()
        },
        computed:{
            getType(){
                let curString = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                let handelText = cur.map(row => row.trim());
                if(this.searchData.select_type==='spu'&&!!this.searchData.snText){
                    this.$set(this.searchData,'spu',handelText);
                    this.$delete(this.searchData,'local_category');
                    return this.searchData
                }else if(this.searchData.select_type==='local_category'&&!!this.searchData.snText){
                    this.$set(this.searchData,'local_category',handelText);
                    this.$delete(this.searchData,'spu');
                    return this.searchData
                }else if(this.searchData.select_type==='spu'&&!this.searchData.snText){
                    this.$delete(this.searchData,'spu');
                    this.$delete(this.searchData,'local_category');
                    return this.searchData
                }else if(this.searchData.select_type==='local_category'&&!this.searchData.snText){
                    this.$delete(this.searchData,'spu');
                    this.$delete(this.searchData,'local_category');
                    return this.searchData
                }
            }
        },
        methods: {
            get_detail(val,row){
                this.title = `开发员：${val.developer_name}刊登SPU：${val.spu}的具体账号`;
                this.$nextTick(()=>{
                    let data = {
                        start_date:this.init_params().start_date,
                        end_date:this.init_params().end_date,
                        date_type:this.init_params().date_type,
                        channel_id:row.channel,
                        goods_id:val.goods_id,
                    };
                    this.$http(api_spu_account_detail,data).then(res=>{
                        this.detail_list = [];
                        if(res.data instanceof Array){
                            this.detail_list = [];
                        }else {
                             Object.keys(res.data).map(k=>{
                                this.detail_list =[...this.detail_list,{accountName:k,num:res.data[k]}]
                            })
                        };
                        this.detail_show = true
                    }).catch(err=>{
                        console.log(err)
                    })
                })
            },
            init() {
                let data = this.init_params();
                if(!!this.async_tips){
                    this.$message({
                        message:'最大值输入有误',
                        type:'warning'
                    })
                }else {
                    this.loading =true;
                    this.table.list = [];
                    this.$http(api_spu_publish_list,data).then(res=>{
                        this.loading = false;
                        this.firstTime = false;
                        if(res.data instanceof Array){
                            if(!res.data.length){
                                this.table.list = res.data
                            }
                        }else {
                            this.table.total = res.data.count;
                            this.table.list = res.data.lists;
                            this.channelList =[...this.channelList,...res.data.lists[0].statistics]
                        }
                    }).catch(err=>{
                        console.log(err);
                        this.loading = false;
                    })
                }
            },
            search(){
                this.init()
            },
            init_params(){
                let data;
               if(!!this.getType){
                   data = window.clone(this.getType)
               }else {
                   data = window.clone(this.searchData)
               };
               if(!!this.searchData.start_date) {
                   data.start_date = datef('YYYY-MM-dd', new Date(this.searchData.start_date).getTime()/1000)
               }else {
                   data.start_date = ''
               };
               if(!!this.searchData.end_date) {
                   data.end_date = datef('YYYY-MM-dd', new Date(this.searchData.end_date).getTime()/1000)
               }else {
                   data.end_date = ''
               };
               if(!this.searchData.order_total_cnt){
                   this.$delete(data,'order_total_cnt')
               }else if(!this.searchData.order_shelf_time){
                   this.$delete(data,'order_shelf_time')
               }
                this.$set(data,'page',this.table.page);
                this.$set(data,'pageSize',this.table.pageSize);
                this.$delete(data,'select_type');
                this.$delete(data,'snText');
                return data
            },
            sort_change(val){
                let type = '';
                type = val.order;
                if(val.label==='上架时间'){
                    this.searchData.order_shelf_time = type;
                    this.$delete(this.searchData,'order_total_cnt')
                }else if(val.label==='刊登总数'){
                    this.searchData.order_total_cnt = type;
                    this.$delete(this.searchData,'order_shelf_time')
                };
                this.init()
            },
            handle_size_change(val){
                this.table.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.table.page = val;
                this.init()
            },
            exports(){
                let data = this.init_params();
                return this.$http(api_spu_publish_list_export, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            requestButton:require('../../../../global-components/request-button').default,
            exportDialog:require('../../export-dialog.vue').default,
            detailDialog:require('./detail-dialog').default
        }
    }
</script>

