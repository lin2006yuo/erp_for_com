<template>
    <page>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select class="inline s-width-default" v-sf.snType v-model="searchData.snType" filterable>
                <el-option v-for="(item, index) in snTypeArr" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline s-width-large"  v-sf.snText v-model="searchData.snText"></el-input>
            <label class="ml-sm">帐号：</label>
            <el-select class="inline s-width-default"  v-sf.accountId v-model="searchData.accountId" filterable>
                <el-option v-for="item in amazonAccount" :value="item.id" :label="item.account_name"
                           :key="item.id"></el-option>
            </el-select>
            <label class="ml-sm">状态：</label>
            <el-select class="inline s-width-default"  v-sf.state v-model="searchData.state">
                <el-option v-for="(item, index) in stateArr" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <label class="ml-sm">创建人：</label>
            <param-account
                class="inline s-width-default"
                ref="paramSale"
                placeholder="可输入搜索"
                v-model="searchData.create"
                v-sf.create
                type="memberShipSales"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                url="get|department/getUser">
            </param-account>
            <label class="ml-sm">创建时间：</label>
            <el-date-picker class="inline date" v-sf.startTime v-model="searchData.startTime" placeholder="开始时间"
                            :picker-options="inputTimeStart"></el-date-picker>
            <span>--</span>
            <el-date-picker class="inline date mr-sm" v-sf.endTime v-model="searchData.endTime" placeholder="结束时间"
                            :picker-options="inputTimeEnd"></el-date-picker>
        </search-card>
        <div>
            <permission tag="ElButton" :route="apis.url_down_excel" class="mt-xs mb-xs ml-sm" type="primary" size="mini" @click="download_data" :disabled="isEnable">导出预刊登数据
            </permission>
            <el-table :data="tableData" border v-loading="loading" element-loading-text="玩命加载中..."
                      @select="select_list" @select-all="select_all"
                      v-resize="{height:41}" highlight-current-row class="scroll-bar">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="Main Image" align="center">
                    <template slot-scope="scope">
                        <div style="width: 80px;height: 80px;line-height:80px; display: inline-block;">
                            <img v-lazy="getImg(scope.row)" style="width: 100%;vertical-align: middle">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="本地SPU" prop="spu">
                </el-table-column>
                <el-table-column label="Product Name" prop="name" width="500">
                </el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | status}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" prop="realname">
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <permission tag="ElButton" :disabled="scope.row.status === 2" :route="apis.url_amazon_edit_product" size="mini"
                                    type="text" @click="edit(scope.row)">编辑
                        </permission>
                        <permission tag="span" :route="apis.url_amazon_get_product">|</permission>
                        <permission tag="ElButton" :disabled="scope.row.status === 2" :route="apis.url_amazon_get_product" size="mini"
                                    type="text" @click="read(scope.row)">查看
                        </permission>
                        <permission tag="span" :route="apis.url_amazon_del_product">|</permission>
                        <permission tag="ElButton" :disabled="scope.row.status === 2" :route="apis.url_amazon_del_product" size="mini"
                                    type="text" @click="del(scope.row,scope.$index)">删除
                        </permission>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page=searchData.page
                :page-sizes="[20, 50,100, 200, 500]"
                :page-size=searchData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=count>
            </el-pagination>
            <publish v-model="publishVisible" :id="id" :editData="images" edit="true" @list-edit="list_edit"></publish>
            <only-see v-model="onlySeeVisible" :id="id" :base-url="baseUrl"></only-see>
            <page-dialog title="选择真实目标账号" v-model="downVisible" size="small" :close-on-click-modal="false">
                <label><sup style="color:red">*</sup>帐号：</label>
                <el-select class="inline" v-model="user" filterable>
                    <el-option v-for="item in amazonAccountSales" :value="item.account_id" :label="item.code"
                               :key="item.account_id"></el-option>
                </el-select>
                <div style="text-align: right">
                    <el-button type="primary" size="mini" @click="down_excel" :disabled="isDown">{{isDownText}}</el-button>
                </div>
            </page-dialog>
        </div>
    </page>
</template>

<style lang="stylus">

</style>
<script>
    import {
        api_amazon_account_sales,
        api_amazon_product_list,
        api_amazon_del_product,
        api_amazon_account,
        api_down_excel,
        api_get_user,

        url_down_excel,
        url_amazon_product_list,
        url_amazon_edit_product,
        url_amazon_del_product,
        url_amazon_product_export,
        url_amazon_get_product

    } from '../../../../api/amazon-publish';
    import {downloadFile} from '../../../../lib/http';
    export default{
        permission:{
            url_down_excel,
            url_amazon_product_list,
            url_amazon_edit_product,
            url_amazon_del_product,
            url_amazon_product_export,
            url_amazon_get_product
        },
        page: {},
        refresh(){
            this.searchData = {
                page: 1,
                pageSize: 50,
                snType: 1,
                snText: '',
                accountId: '',
                state: '',
                create: '',
                startTime: '',
                endTime: ''
            };
            this.init();
        },
        data(){
            return {
                firstLoading: true,
                onlyRead:'',
                downloadUrl:'',
                host:config.apiHost,
                user: '',
                id: 0,
                amazonAccount: [],
                tableData: [],
                loading: false,
                count: 0,
                searchData: {
                    page: 1,
                    pageSize: 50,
                    snType: 1,
                    snText: '',
                    accountId: '',
                    state: '',
                    create: '',
                    startTime: '',
                    endTime: ''
                },
                clears: {
                    page: 1,
                    pageSize: 50,
                    sku_search: [],
                    status: '',
                    account_id: '',
                    create_user_id:'',
                    create_time:[]
                },
                snTypeArr: [
                    {
                        label: '本地SKU',
                        value: 1
                    },
                    {
                        label: '本地SPU',
                        value: 2
                    },
                    {
                        label: 'Seller SKU',
                        value: 3
                    },
                ],
                account: [],
                stateArr: [
                    {
                        label: '全部',
                        value: ''
                    },
                    {
                        label: '已导出',
                        value: 1
                    },
                    {
                        label: '未导出',
                        value: 0
                    },
                    {
                        label: '已删除',
                        value: 2
                    }
                ],
                createArr: [

                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.endTime) {
                            return time.getTime() > this.searchData.endTime;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.startTime) {
                            return time.getTime() < this.searchData.startTime;
                        } else {
                            return false
                        }
                    }
                },//结束时间
                publishVisible: false,
                onlySeeVisible: false,
                downVisible: false,
                images: {},
                selectIds:[],
                baseUrl:'',
                isDownText:'导出',
                isDown: false,
                amazonAccountSales:[]
            }
        },
        methods: {
            init(){
                let data = {
                    page: '',
                    pageSize: '',
                    sku_search: [],
                    status: '',
                    account_id: '',
                    create_user_id:'',
                    create_time:[]
                };
                this.loading = true;
                data.page = this.searchData.page;
                data.pageSize = this.searchData.pageSize;
                data.sku_search.push(this.searchData.snType);
                data.sku_search.push(this.searchData.snText);
                data.status = this.searchData.state;
                data.account_id = this.searchData.accountId;
                data.create_user_id = this.searchData.create;
                data.create_time.push(this.searchData.startTime&&datef("YYYY-MM-dd HH:mm:ss",this.searchData.startTime/1000));
                data.create_time.push(this.searchData.endTime&&datef("YYYY-MM-dd HH:mm:ss",this.searchData.endTime/1000));
                this.$http(api_amazon_product_list, data).then(res => {
                    console.log("test", res);
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.count = res.count;
                    this.baseUrl = res.data[0] && res.data[0].baseUrl;
                })
            },
            list_edit(val){
                let index = this.tableData.findIndex(item=>{
                   return item.id === val.id;
                });
                this.tableData.splice(index,1,val);
            },
            get_account(){
                this.$http(api_amazon_account).then(res => {
                    this.amazonAccount = res.data;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            get_account_sales(){
                return this.$http(api_amazon_account_sales).then(res=>{
                    this.amazonAccountSales = res;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            get_user(){//
                this.$http(api_get_user).then(res => {
                    this.createArr = res.userList;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            sale_fix_result(res){
                return  res.userList.map(row=>{
                    return {
                        value:row.id,
                        label:row.username
                    }
                })
            },
            select_list(section){
                this.selectIds = section.map(item=>item.goods_id);
            },
            select_all(section){
                this.selectIds = section.map(item=>item.goods_id);
            },
            down_excel(){
                this.isDownText='正在导出';
                this.isDown= true;
                let row = this.amazonAccountSales.find(item=>item.account_id === this.user);
                let data = {
                    account: [row.account_id,row.code],
                    goods_id: this.selectIds
                };
                let url = config.apiHost+'publish/amazon-product-export/download';
                downloadFile({
                    url:url,
                    get:data,
                    fileName:'亚马逊预刊登数据',
                    suffix:'.xls',
                });
                this.selectIds.forEach(item=>{
                  let index =  this.tableData.findIndex(row=>{
                       return row.goods_id === item;
                   });
                  this.tableData[index].status = 1;
                });
                this.downVisible = false;
                this.isDownText='导出';
                this.isDown= false;
            },
            search(){
                this.init();
            },
            download_data(){
                this.get_account_sales();
                this.downVisible = true;
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            edit(row){
                this.publishVisible = true;
                this.id = row.goods_id;
                console.log("test", this.id);
                this.images = row;
            },
            message(){

            },
            del(row, index){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_amazon_del_product, row.goods_id).then(res => {
                        this.tableData[index].status = 2;
                        this.$message({
                            type: 'success',
                            message: res.message || res
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
                });


            },
            read(row){
                this.onlySeeVisible = true;
                this.id = row.goods_id;
            },
            getImg(val){
                let arr = val.attributes_images;
                let main =arr && arr[0] && arr[0].images;
                let path = main && main[0] && main[0].path;
                return this.url_join(path);
            },
            url_join(path = '', size='_100x100.'){
                let isBlob = path.includes('blob:');
                if(isBlob) return path;
                let bl = path.includes('http://');
                let index = path.lastIndexOf('.');
                let arr = [...path];
                arr.splice(index,1, size);
                let str = arr.join('');
                return bl?str:this.baseUrl+str;
            }
        },
        created(){

        },
        filters: {
            status(val){
                return val === 0 ? '未导出' : val === 1 ? '已导出' : val === 2 ? '已删除' : '-'
            },
            mainImage(val){

            }
        },
        mounted(){
            this.init();
            this.get_account();
           // this.get_user();
        },
        updated(){

        },
        destroy(){

        },
        computed: {
            isEnable(){
                return this.selectIds.length === 0;
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {},
        props: {},
        components: {
            searchCard: require('../../../../components/search-card.vue').default,
            publish: require('./publish.vue').default,
            onlySee: require('./only-see.vue').default,
            pageDialog: require('../../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default
        }
    }
</script>

