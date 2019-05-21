<template>
    <page class="p-index">
        <search :searchData="searchData"
                :clears="clears"
                :site-list="siteList"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button type="primary" size="mini" class="inline" @click.native="add">
                {{$t('ymx-heel-sale-list.addBtn')}}
            </el-button>
            <el-button type="primary" size="mini" @click="batch_edit_sell" class="inline" >
                {{$t('ymx-list.batchEditor')}}
            </el-button>
            <el-button type="primary" size="mini"  @click="batch_delete_sell" class="inline"  >
                {{$t('ymx-list.batchDelete')}}
            </el-button>
        </div>
        <table-data :table-data="tableData"
                    @select-msg="select_msg"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @current-change="current_change"
                    @size-change="size_change"></table-data>
        <batch-heel-sale v-model="dialogShow" @close="close"></batch-heel-sale>
        <edit-dialog
            :value="batchEditSellVisible"
            :selectMsg="selectMsg"
            :defaultValue="defaultValue"
            @clear-select="clear_select"
            @change-show="change_batchEditSellVisible"
            @init-msg="init"
                    >
        </edit-dialog>
    </page>
</template>
<style lang="stylus">
    .input-border{
        input,select{
            border: 1px solid #C0CCDA;
            border-radius:3px;
        }
    }
</style>
<script>
    import {api_heel_sale_list} from '@/api/heel-sale-list';
    import {api_get_amazon_site} from '../../../../api/product-category-api';
    import {api_get_heel_sale_info,api_change_heel_sale_info,api_delete_heel_sale_info} from  '../../../../api/amazon-publish-info';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '郝龙飞',
                createdTime: '2018-10-12',
                updateTime: '2018-10-12'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    search_type: 1,
                    search_content: '',
                    site: '',
                    saler_id:'',
                    rule_name:'',
                    account_id: '',
                    status: '',
                    star_time: '',
                    end_time: '',
                    page: 1,
                    pageSize: 50
                },
                clears: {},
                siteList: [{label: this.$t('ymx-heel-sale-list.all'), value: ''}],
                loading: false,
                firstLoading: true,
                tableData: {
                    lists: [],
                    total: 0,
                    page: 1,
                    pageSize: 50
                },
                dialogShow: false,
                selectProduct:[],
                batchEditSellVisible:false,
                selectMsg:[],
                defaultValue:[],
                ruleList:[],
            }
        },
        mounted() {
            this.init();
            this.get_site();
        },
        methods: {
            search() {
                this.init();
            },
            add() {
                this.dialogShow = true
            },
            close() {
                this.init()
            },
            init() {
                this.selectMsg=[];
                this.selectProduct=[];
                let data = clone(this.searchData);
                let splitText = this.split_search(data.search_content);
                data.search_content = splitText && splitText.length ? splitText.map(row => row.trim()) : '';
                data.page = this.tableData.page;
                data.pageSize = this.tableData.pageSize;
                console.log(data);
                this.$http(api_heel_sale_list, data).then(res => {
                    this.tableData.lists=res.data;
                    console.log(res.data);
                    this.tableData.total = res.count;
                    this.tableData.page = Number(res.page);
                    this.tableData.pageSize = Number(res.pageSize);
                    this.firstLoading = false
                }).catch(code => {
                    console.log(code);
                })
            },
            split_search(data) {
                let curString = data.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                return cur
            },
            //获取站点数据
            get_site() {
                this.$http(api_get_amazon_site).then(res => {
                    // this.siteList = [{label: this.$t('ymx-heel-sale-list.all'), value: ""}, ...res.site];
                    this.siteList = [...res.site];
                }).catch(code => {
                    console.log(code);
                })
            },
            current_change(page) {
                this.tableData.page = page;
                this.init()
            },
            size_change(size) {
                this.tableData.pageSize = size;
                this.init()
            },
            batch_edit_sell(){ //-----批量操作数据
                this.test();
                if(this.selectProduct.length === 0){
                    return this.$message({
                        type:"error",
                        message:this.$t('ymx-list.pleaseSelectOperationData')
                    });
                }
                this.batchEditSellVisible=true;
                let arr=[];
                let data='';
                this.selectProduct.forEach(item=>{
                    arr.push(item.id);
                })
                data=arr.join(',');
                this.$http(api_get_heel_sale_info,{ids:data})
                    .then(res=>{
                        res.forEach(item=>{
                            this.defaultValue.push(this.clone(item));
                        })
                        this.selectMsg=res;
                        console.log(res);
                        this.selectMsg.forEach(item=>{
                            if(item.rule_id===0){
                                item.rule_id=null;
                            }
                        })
                    })
                    .catch(err=>{
                        console.log(err.message+'出错了');
                    })
            },
            select_msg(val){
                this.selectProduct=val;
            },
            batch_delete_sell(){
                if(this.selectProduct.length!==0) {
                    this.$confirm('是否删除选择的数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let arr = [];
                        this.selectProduct.forEach(item => {
                            item.ids = item.id;
                            arr.push(item.ids);
                        })
                        let data = arr.join(',');
                        console.log(data);
                        this.$http(api_delete_heel_sale_info,{ids:data})
                            .then(res => {
                                this.init();
                                return this.$message({
                                    type: "success",
                                    message: res.message
                                });
                            })
                            .catch(err => {
                                console.log(err.message + '出错了');
                            })
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                    return this.$message({
                        type: "error",
                        message:'请选择要批量删除的数据'
                    });
                }
            },
            clone(obj){
                let result={};
                for(let key in obj){
                    result[key]=obj[key];
                }
                return result;
            },
            test(val){
                console.log(111);
                console.log(val);
            },
            change_batchEditSellVisible(val){
                this.batchEditSellVisible=val;
            },
            clear_select(){
                this.selectMsg=[];
            }
        },
        watch:{

        },
        components: {
            search: require('./search.vue').default,
            tableData: require('./table-data').default,
            batchHeelSale: require('./batch-heel-sale').default,
            paramAccount:require('@/api-components/param-account').default,
            requestButton:require('../../../../global-components/request-button').default,
            editDialog:require('./edit-dialog.vue').default,
        }
    }
</script>
