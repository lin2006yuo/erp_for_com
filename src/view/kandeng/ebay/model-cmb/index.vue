<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label class="inline">站点：</label>
            <el-select class="inline s-width-default"
                       @change="change_site"
                       v-sf.site_id v-model="searchData.site_id"
                       filterable clearable placeholder="请选择站点">
                <el-option
                        :key="item.value"
                        v-for="item in c_siteList"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm">创建人：</label>
            <el-input class="inline width-lg" @keyup.enter.native='search' v-model="searchData.creator"></el-input>
            <label class="inline ml-sm">模块组合名称：</label>
            <el-input class="inline width-super mr-sm" v-sf.name v-model="searchData.name" placeholder="请输入搜索名称"></el-input>
        </search-card>
        <!--添加模块组合  && 删除-->
        <div class="mt-xs mb-xs ml-sm">
            <permission
                    tag="ElButton"
                    :route="apis.url_save_combList"
                    type="primary"
                    size="mini"
                    @click.native="add_model_cmb">添加模块组合</permission>
        </div>
        <!--添加模块组合页面    添加和编辑 为一个页面-->
        <add-model-cmd v-model="addModelCmd"
                       :title="title"
                       :form="add_edit_form"
                       :site-list="siteList"
                       @add="add_model"
        ></add-model-cmd>
        <!--模块组合列表-->
        <el-table
                v-resize="{height:41}"
                class="scroll-bar"
                :data="data.dataList"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="模块组合名称" prop="model_name"></el-table-column>
            <el-table-column label="站点" inline-template width="300px">
                <div>
                    {{filter_date(this.siteList,row.site)}}
                </div>
            </el-table-column>
            <el-table-column label="创建人" prop="creator"></el-table-column>
            <el-table-column label="创建时间" prop="create_time"></el-table-column>
            <el-table-column label="更新人" prop="updator"></el-table-column>
            <el-table-column label="更新时间" prop="update_time"></el-table-column>
            <el-table-column label="操作" inline-template width="200px">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_save_combList"
                            class="operate"
                            @click="edit_row(row)">编辑</permission>
                    <span v-if="showLine">|</span>
                    <permission
                            tag="span"
                            :route="apis.url_delete_combList"
                            class="operate"
                            @click="delete_row(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="page_change"
                :current-page="data.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="data.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.count">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_ebay_site,api_edit_combList,api_get_combList,api_get_account,api_delete_combList} from '../../../../api/ebay-kandeng-public-module';
    import {url_save_combList,url_delete_combList} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_combList,
            url_delete_combList
        },
        page:{},
        refresh(){
            this.searchData = {
//                account_id:"",
                creator:'',
                name:"",
                site_id:"",
            };
            this.init();
        },
        data(){
            return{
                firstLoading: true,
                accountsList:[],//没有站点过滤的账号
                accountList:[],//有站点过滤的账号
                siteList:[],
                creatorList:[],//创建人
                //列表 数据
                data:{
                    dataList:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
                loading:false,
                //添加模块组合
                addModelCmd:false,
                title:"",
                add_edit_form:{
                    model_name:"",//模块组合名称
                    site:"",//站点
                    ebay_account:"",//ebay账号
                    promotion:"",//促销策略
                    sale:"",//销售说明
                    style:"",//风格
                    bargaining:"",//议价
                    choice:"",//备货
                    exclude:"",//不送达地区
                    gallery:"",//橱窗展示
                    pickup:"",//自提
                    location:"",//发货地
                    individual:"",//私有
                    quantity:"",//数量
                    receivables:"",//收款方式
                    refuse:"",//买家限制
                    returngoods:"",//退货策略
                    trans:"",//物流方式
                },
                searchData:{
//                    account_id:"",
                    creator:'',
                    name:"",
                    site_id:"",
                },
                clears:{}
            }
        },
        created(){
            this.get_ebay_site();
            this.get_ebay_accounts();
            this.init();
        },
        computed:{
            showLine(){
                return this.$hasPermission(url_save_combList)&&this.$hasPermission(url_delete_combList);
            },
            c_siteList(){
                let arr = window.clone(this.siteList);
                arr.unshift({label:"全部",value:""});
                return arr;
            },
            comPlaceholder(){
                let cur = '';
                if(this.searchData.site_id===''){
                    cur = '请先选择站点';
                }else if(this.searchData.site_id&&this.accountList.length<=0){
                    cur = '该站点下暂无数据';
                }else{
                    cur = '全部';
                }
                return cur;
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        methods:{
            sale_fix_result(val){
                console.log(val,'val');
                return  val.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            change_site(val){

            },
            /*搜索  && 清空搜索*/
            search(){
                this.init();
            },
            /*添加模块 && 删除*/
            add_model_cmb(){
               this.add_edit_form = {
                        model_name:"",//模块组合名称
                        site:"",//站点
                        ebay_account:"",//ebay账号
                        promotion:"",//促销策略
                        sale:"",//销售说明
                        style:"",//风格
                        bargaining:"",//议价
                        choice:"",//备货
                        exclude:"",//不送达地区
                        gallery:"",//橱窗展示
                        pickup:"",//自提
                        location:"",//发货地
                        individual:"",//私有
                        quantity:"",//数量
                        receivables:"",//收款方式
                        refuse:"",//买家限制
                        returngoods:"",//退货策略
                        trans:"",//物流方式,

                };
                this.addModelCmd = true;
                this.title = "新增模块组合";
            },
            cur_del(){
                console.log("cur_del");
            },
            add_model(data){
                let find = this.data.dataList.find(row=>Number(row.id)===Number(data.id));
                if(find){
                    Object.assign(find,data)
                }else{
                    this.data.dataList.unshift(val);
                    this.data.count++;
                }
            },
            /*转换  表格站点&&账号*/
            filter_date(Array,id){
                let cur = Array.find((row)=>{
                    if(row.value === id){
                        return row;
                    }
                });
                if(!!cur)return  cur.label;
                return '- -'
            },

            /*列表编辑  && 删除*/
            edit_row(row){
                this.addModelCmd = true;
                this.title = `编辑模块组合：${row.model_name} 信息`;
                this.edit_model(row.id);
            },
            delete_row(row){
                this.delete_model(row);
            },

            /*列表  翻页*/
            size_change(size){
                this.data.pageSize = size;
                this.init();
            },
            page_change(page){
                this.data.page = page;
                this.init();
            },

            /*列表API*/
            init(){
                let params = {
                    model_type:"comb",
                    page:this.data.page,
                    size:this.data.pageSize,
                    site:this.searchData.site_id,
                    model_name:this.searchData.name.trim(),
                    creator:this.searchData.creator
                };
                this.loading = true;
                this.$http(api_get_combList,params).then(res=>{
                    this.loading = false;
                    this.firstLoading = false;
                    this.data.dataList = res.data;
                    this.data.count = res.count;
                }).catch(code=>{
                    setTimeout(()=>{
                        this.loading = false;
                        this.firstLoading = false;
                    },200);
                    console.log("code",code);
                });
            },

            /*站点   API*/
            get_ebay_site(){
                this.$http(api_get_ebay_site,{site:this.searchData.site_id}).then(res=>{
                    this.siteList = res.data.map(row=>{
                        return {
                            label:row.name,
                            value:row.siteid,
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },

            /*账号  API*/
            get_ebay_account(val){
                this.accountList = [];
                if(val==='')return;
                this.$http(api_get_account,{site:val}).then(res=>{//接口--》曾
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*调取账号  不需要站点*/
            get_ebay_accounts(){
                this.accountsList = [];
                this.$http(api_get_account).then(res=>{//接口--》曾
                    this.accountsList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*编辑   API*/
            edit_model(id){
                let params = {
                    model_type:"comb",
                    id:id,
                };
                this.$http(api_edit_combList,params).then(res=>{
                    this.add_edit_form = window.clone(res.data);
                    this.$nextTick(()=>{
                        this.add_edit_form.ebay_account = res.data.ebay_account;
                        this.add_edit_form.sale = res.data.sale;
                        this.add_edit_form.bargaining=res.data.bargaining;
                        this.add_edit_form.choice=res.data.choice;
                        this.add_edit_form.exclude=res.data.exclude;
                        this.add_edit_form.receivables = res.data.receivables;
                        this.add_edit_form.trans = res.data.trans;
                        this.add_edit_form.returngoods = res.data.returngoods;
                    })
                }).catch(code=>{
                    console.log("code",code);
                });
            },
            /*删除  Api*/
            delete_model(row){
                this.$confirm(`您将删除${row.model_name}模块组合,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        model_type:"comb",
                        id:row.id,
                    };
                    this.$http(api_delete_combList,params).then(res=>{
                        this.$message(res.message);
                        let index = this.data.dataList.indexOfFun(row,function (old,row) {
                            return old.id===row.id
                        });
                        this.data.dataList.splice(index,1);
                        this.data.count--;
                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
        },
        components:{
            addModelCmd:require('./add-model-cmb.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        }
    }
</script>
