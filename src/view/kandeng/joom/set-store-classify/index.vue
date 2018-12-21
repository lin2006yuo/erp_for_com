<template>
    <page>
        <search-card :category-tree="category_tree" @search="search"
                     :total="total" :joom_account="joom_account"></search-card>

        <div  class="mt-xs mb-xs ml-sm">
            <!--<el-button type="primary" size="mini" @click="add_store_classify">新增店铺分类</el-button>-->
            <permission tag="ElButton" :route="apis.url_joom_save_category" type="primary" size="mini"
                        @click="add_store_classify">新增店铺分类
            </permission>
            <!--<el-button type="primary" size="mini" @click="delete_store_classify" :disabled="isDelete">批量删除</el-button>-->
            <permission tag="ElButton" :route="apis.url_joom_delete" type="primary" size="mini"
                        @click="delete_store_classify" :disabled="isDelete">批量删除
            </permission>
        </div>

        <el-table :data="tableData" border v-loading="loading" element-loading-text="玩命加载中..." @select="select_category"
                  @select-all="select_all"
                  v-resize="{height:41}" highlight-current-row class="scroll-bar">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="50px"></el-table-column>
            <el-table-column label="平台账号">
                <template slot-scope="scope">
                    {{scope.row.account_name}}
                </template>
            </el-table-column>
            <el-table-column label="平台店铺">
                <template slot-scope="scope">
                    {{scope.row.shop_name}}
                </template>
            </el-table-column>
            <el-table-column label="本地产品分类">
                <template slot-scope="scope">
                    {{scope.row.category_name}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!--<el-button type="text" size="mini" @click="edit_store_classify(scope.row)">编辑</el-button>-->
                    <permission tag="ElButton" :route="apis.url_joom_edit_category"
                                type="text" size="mini" @click="edit_store_classify(scope.row)">编辑
                    </permission>
                    <span>|</span>
                    <!--<el-button type="text" size="mini" @click="edit_delete_one(scope.row)">删除</el-button>-->
                    <permission tag="ElButton" :route="apis.url_joom_delete"
                                type="text" size="mini" @click="edit_delete_one(scope.row)">删除
                    </permission>
                </template>
            </el-table-column>
        </el-table>
        <edit-store-classify v-model="visible" :joom_account="joom_account" :category_tree="category_tree" :update="update"
                             :edit-obj="editObj" @init="init"></edit-store-classify>
    </page>
</template>

<style lang="stylus">

</style>
<script>
    import {
        api_joom_category_tree,
        api_get_joom_list,
        api_get_joom_account,
        api_joom_edit_category,
        api_joom_delete,

        url_joom_save_category,
        url_joom_delete,
        url_joom_edit_category
    } from '../../../../api/joom-set-classify'

    export default{
        permission: {
            url_joom_save_category,
            url_joom_delete,
            url_joom_edit_category,

        },
        page: {},
        refresh(){
            this.searchData = {
                page: 1,
                pageSize: 50,
                joom_account_id: '',
                joom_shop_id: '',
                category_id: ''
            };
            this.init();
        },
        data(){
            return {
                searchData: {
                    page: 1,
                    pageSize: 50,
                    joom_account_id: '',
                    joom_shop_id: '',
                    category_id: ''
                },
                joom_account: [],
                tableData: [],
                category_tree: [],
                native_tree: [],
                total: 0,
                loading: false,
                firstLoading: true,
                visible: false,
                editObj: '',
                selectCategory: [],
                update:''
            }
        },
        created(){

        },
        filters: {},
        mounted(){
            this.init();
            this.get_category_tree();
            this.get_joom_account();
        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_get_joom_list, this.searchData).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                })
            },
            search(val){
                this.searchData = val;
                this.init();
            },
            select_category(selection){
                this.selectCategory = selection.map(item => {
                    return item.id
                });
            },
            select_all(selection){
                this.selectCategory = selection.map(item => {
                    return item.id
                });
            },

            delete_classify(val){

                this.$confirm('此操作将删除该选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_joom_delete, {ids: val}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let arr = val.split(',');
                        this.total -= arr.length;
                        arr.forEach(item => {
                            let index = this.tableData.findIndex(row => {
                                return (row.id + '') === item
                            });
                            if (index !== -1) {
                                this.tableData.splice(index, 1);
                            }
                        })
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            edit_delete_one(val){
                let str = val.id;
                str = str + '';
                this.delete_classify(str);
            },

            delete_store_classify(){
                let str = this.selectCategory.join(',');
                this.delete_classify(str);
            },
            add_store_classify(){
                this.visible = true;
                this.update = 0;
                this.editObj = {
                    label: '添加',
                    joom_account_id: '',
                    joom_shop_id: '',
                    category_id: []
                }
            },
            edit_store_classify(row){
                let obj = {
                    joom_account_id: row.joom_account_id,
                    joom_shop_id: row.joom_shop_id
                };
                this.$http(api_joom_edit_category, obj).then(res => {
                    console.log(res);
                    this.editObj = {
                        label: '编辑',
                        joom_account_id: row.joom_account_id,
                        joom_shop_id: row.joom_shop_id,
                        category_id: res.data
                    };
                    this.update = 1;
                    this.visible = true;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            get_category_tree(){
                this.$http(api_joom_category_tree).then(res => {
                    this.category_tree = this.data_format(res.data);
                    console.log("test", this.category_tree);
                });
            },

            data_format(val){
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },

            get_joom_account(){
                this.$http(api_get_joom_account).then(res => {
                    this.joom_account = [{label: '全部', value: ''}, ...res.data];
                })
            }
        },
        computed: {
            isDelete(){
                return this.selectCategory.length === 0
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {},
        props: {},
        components: {
            searchCard: require('./search-card.vue').default,
            editStoreClassify: require('./edit-store-classify.vue').default
        }
    }
</script>

