<template>
    <page>
        <search-card :site="site" :category="category" @search="search" :total="total"></search-card>
        <div class="mb-xs mt-xs">
            <!--<el-button type="primary" size="mini" @click="add_template">添加模板属性</el-button>-->
            <permission tag="ElButton" :route="apis.url_save_attr" class="ml-sm"
                        type="primary" size="mini" @click="add_template">添加模板属性
            </permission>
        </div>
        <el-table :data="tableData" border v-loading="loading" element-loading-text="玩命加载中..."
                  v-resize="{height:41}" highlight-current-row class="scroll-bar">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="站点" prop="sites"></el-table-column>
            <el-table-column label="产品模板" prop="category_name"></el-table-column>
            <el-table-column label="创建人" prop="creator"></el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <times :time="scope.row.last_update_time"></times>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!--<el-button type="text" size="mini" @click="edit_attr(scope.row)">编辑</el-button>-->
                    <permission tag="ElButton" :route="apis.url_save_attr"
                                type="text" size="mini" @click="edit_attr(scope.row, scope.$index)">编辑
                    </permission>
                </template>
            </el-table-column>
        </el-table>

        <template-set v-model="templateVisible" :site="site" :category="category" :edit="edit"
                      :is-edit="is_edit" @update="update"></template-set>
    </page>
</template>

<style lang="stylus">

</style>
<script>
    import {api_account_site} from '../../../../api/amazon-publish-list';
    import {
        api_amazon_get_category,
        api_attr_list,

        url_save_attr
    } from './../../../../api/amazon-publish-template-set';
    export default{
        permission:{
            url_save_attr
        },
        page: {},
        refresh(){
            this.searchData = {
                page: 1,
                pageSize: 50,
                site: '',
                first_category_id: '',
                second_category_id: ''
            };
            this.init();
        },
        data(){
            return {
                searchData: {
                    page: 1,
                    pageSize: 50,
                    site: '',
                    first_category_id: '',
                    second_category_id: ''
                },
                templateVisible: false,
                site: [],
                category: [],
                total: 0,
                tableData: [],
                loading: false,
                firstLoading: true,
                edit: {},
                is_edit: false,
                tableIndex:''
            }
        },
        created(){

        },
        filters: {},
        mounted(){
            this.search_data();
            this.init();
        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_attr_list, this.searchData).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            search(val){
                this.searchData = val;
                this.init();
            },
            add_template(){
                this.templateVisible = true;
                this.is_edit = false
            },
            search_data(){
                this.$http(api_account_site, {channel_id: 2}).then(res => {
                    this.site = [{label: '全部', value: ''}, ...res.site];
                }).catch(code => {
                    console.log(code);
                });
                this.$http(api_amazon_get_category).then(res => {
                    //this.fix = res.fix;
                    this.category = res.category;
                })

            },
            edit_attr(val, index){
                console.log(index);
                this.tableIndex = index;
                this.templateVisible = true;
                this.edit = val;
                this.is_edit = true;
            },
            update(val){
                if(this.is_edit){
                    console.log(this.tableData[this.tableIndex]);
                    this.tableData[this.tableIndex].sites = val.site;
                    let find = this.category.find(row=>{
                       return row.id === val.first_category_id
                    });

                    if(!!find){
                        let first_category = find.category_name;
                        if(find.children && find.children.length > 0){
                            let second_find = find.children.find(item=>{
                                return item.id===val.second_category_id;
                            });
                            if(!!second_find){
                                let second_category = second_find.category_name;
                                this.tableData[this.tableIndex].category_name = first_category+ '-' + second_category;
                            }
                        }else {
                            this.tableData[this.tableIndex].category_name = first_category;
                        }
                    }
                }else {
                    let item={
                        sites: val.site,
                        category_name: '',
                        last_update_time: new Date().getTime()/1000,
                        creator:''
                    };

                    let find = this.category.find(row=>{
                        return row.id === val.first_category_id
                    });

                    if(!!find){
                        let first_category = find.category_name;
                        if(find.children && find.children.length > 0){
                            let second_find = find.children.find(item=>{
                                return item.id===val.second_category_id;
                            });
                            if(!!second_find){
                                let second_category = second_find.category_name;
                                item.category_name = first_category+ '-' + second_category;
                            }
                        }else {
                            item.category_name = first_category;
                        }
                    }

                    this.tableData.unshift(item);
                    console.log('create')
                }
            }
        },
        computed: {
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {},
        props: {},
        components: {
            searchCard: require('./search-card.vue').default,
            templateSet: require('./template-set.vue').default
        }
    }
</script>

