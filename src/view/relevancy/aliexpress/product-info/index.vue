<template>
    <page>
        <!--页面头部-->
        <search-card @search="search" :params="searchData" :clears="clears">
            <label>账号简称：</label>
            <permission v-sf.account_id class="inline s-width-default" tag="ElSelect" :route="apis.url_get_account" v-model="searchData.account_id" filterable>
                <el-option
                    v-for="item in accountList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </permission>
            <label class="ml-sm">产品信息模块名称：</label>
            <div class="select-and-input">
                <el-input v-sf.scontent class="inline" placeholder="请输入" @keyup.enter.native="search" v-model="searchData.scontent"></el-input>
            </div>
            <label class="ml-sm">模板类型：</label>
            <el-select v-sf.type v-model="searchData.type" placeholder="请选择" class="inline mr-sm s-width-default">
                <el-option
                    v-for="item in modeType"
                    :key="item.value"
                    :label="item.code"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--<permission tag="ElButton" :route="apis.url_category_list" class="inline ml-sm" size="mini" type="primary" @click="search">搜索</permission>-->
            <!--<el-button class="inline" size="mini" @click="clearSearch">清空搜索</el-button>-->
        </search-card>
        <!--表格-->
        <div class="ml-sm mt-sm mb-sm">
            <el-button class="inline"
                       size="mini"
                       type="primary"
                       @click.native="selectBoxShowAndHide = true">添加产品信息模块</el-button>
            <permission tag="request-button" :route="apis.url_del" class="inline" :mintime="200" req-key="apis_url_del" @click="del_select_list" :disabled="isDel">删除</permission>
        </div>
        <el-table
            class="scroll-bar"
            v-resize="{height:38}"
            v-loading="loading"
            highlight-current-row
            element-loading-text="拼命加载中"
            border
            :data="dataList"
            @select="select_list"
            @select-all="select_all"
            :default-sort = "{prop: 'gmt_create', order: 'descending'}"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column
                inline-template
                label="账号简称"
            >
                <span>{{!!row.account?row.account.code:''}}</span>
            </el-table-column>
            <el-table-column
                inline-template
                label="模块名称"
            >
                <span>{{row.name}}</span>
            </el-table-column>
            <el-table-column
                inline-template
                label="模块类型"
            >
                <span>
                  {{row.type}}
                </span>
            </el-table-column>
            <el-table-column
                sortable
                label="添加时间"
                prop="gmt_create"
                inline-template
            >
                <span>{{row.gmt_create}}</span>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="editModel(scope.row)">编辑
                    </el-button>
                    <span>|</span>
                    <el-button
                        size="mini"
                        type="text"
                        @click="delete_row(scope.row.id,scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--弹出选择框-->
        <page-dialog title="模块类型" size="small"  v-model="selectBoxShowAndHide" :close-on-click-modal="false" width="250px">
            <div>
                <div style="padding: 30px;">
                    <!--<el-radio class="radio" v-model="radio" label="1" @change.native="isDisabled = false">关联产品模块</el-radio>-->
                    <permission tag="ElRadio" :route="apis.url_create_category" class="radio" v-model="radio" label="1">关联产品模块</permission>
                    <p></p>
                    <!--<el-radio class="radio" v-model="radio" label="2" @change.native="isDisabled = false">自定义模块</el-radio>-->
                    <permission tag="ElRadio" :route="apis.url_create_custom" class="radio" v-model="radio" label="2">自定义模块</permission>
                </div>
                <div style="text-align: center;margin-top: 20px;">
                    <el-button size="mini" type="primary" @click="selectModelType" :disabled="isDisabled">继续</el-button>
                </div>
            </div>
        </page-dialog>
        <!--增加默认模块-->
        <add-relevancy-model v-model="relevancyVisible" @previewModel="previewRel" @add-model="add_model" :accountList="accountList"></add-relevancy-model>
        <!--编辑默认模块-->
        <edit-relevancy-model v-model="editRelevancyVisible" @previewEditModel="previewEditRel" :id="id" @edit="edit_user_de" :accountList="accountList"></edit-relevancy-model>
        <!--预览默认模块-->
        <preview-relevancy-model v-model="previewModelVisible" :previewHtml = "previewHtml"></preview-relevancy-model>
        <!--增加自定义模块-->
        <add-user-defined-model v-model="userDefinedVisible" @preview-def-model="previewDef" @add-model="add_model" :accountList="accountList"></add-user-defined-model>
        <!--编辑默认模块-->
        <edit-user-defined-model v-model="editUserDefinedVisible" @previewEditDefModel="previewEditDef" :id="id" @edit-user-de="edit_user_de" :accountList="accountList"></edit-user-defined-model>
        <!--预览自定义模块-->
        <preview-user-defined-model v-model="previewDefinedModelVisible"></preview-user-defined-model>
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
<style>
    .select-and-input{
        display: inline-block;
    }
    .select-and-input .el-select{
        width: 70px;
    }
</style>

<script>
    import {api_category_list, api_del,url_category_list, url_del,url_create_category,url_create_custom} from '../../../../api/aliexpress-product-info'
    import {api_aliexpress_classify,api_aliexpress_sale_list,url_aliexpress_sale_list} from '../../../../api/publish-smt'
    import {api_get_account,url_get_account} from '../../../../api/handwork'
    export default{
        permission:{
            url_aliexpress_sale_list,
            url_category_list,
            url_del,
            url_create_category,
            url_create_custom,
            url_get_account
        },
        page:{},
        refresh(){
            this.searchData = {
                page: 1,
                pageSize: 50,
                account_id: '',
                stype: 'name',
                scontent:'',
                type:''
            };
            this.init();
        },
        data(){
            return {
                firstLoading:true,
                dataList:[],
                delIds:"",//要删除的id
                delArr:[],
                accountList:[],//账号简称
                modeName:[
                    {code:"名称",value:'name'}
                ],
                modeType:[
                    {code:"关联产品模块",value:'relation'},
                    {code:"自定义模板",value:'custom'}
                ],
                searchData: {
                    page: 1,
                    pageSize: 50,
                    account_id: '',
                    stype: 'name',
                    scontent:'',
                    type:''
                },
                clears: {
                    page: 1,
                    pageSize: 50,
                    account_id: '',
                    stype: 'name',
                    scontent:'',
                    type:''
                },
                editObject: {},
                radio:0,
                total:0,
                selectBoxShowAndHide:false,
                relevancyVisible:false,
                userDefinedVisible: false,
                previewModelVisible: false,
                previewDefinedModelVisible: false,
                editRelevancyVisible: false,
                editUserDefinedVisible: false,
                loading: true,
                previewHtml:'',
                isDel:true,
                lookId:0,
                id:0,
                radioName:""
            }
        },
        created(){
            this.init();
        },
        mounted(){
            this.getAccount();
        },
        methods: {
            edit_user_de(val){
            	let find = this.dataList.find(row =>{
            		return row.id===val.id;
                })
                if(!!find){
            		Object.assign(find,val)
                }
            },
            add_model(val,data){
                console.log("添加",val)
                let update_time = Date.parse(new Date(data.gmt_create));
                update_time = datef('YYYY-MM-dd HH:mm:ss',update_time/1000);
                this.$set(val,"id",data.id)
                this.$set(val,'gmt_create',update_time);
                this.$set(val,'type',this.radioName)
                this.$set(val,'account',{});
                this.$set(val.account,'code',this.accountList.find(row=>{return row.value === val.account_id}).label);
                this.dataList.unshift(val)
            },
            select_all(selection){
                if(selection.length===0){
                    this.isDel = true;
                }else {
                    this.isDel = false;
                }
                let arr= [];
                selection.forEach((val)=>{
                    arr.push(val.id);
                });
                this.delIds = arr.join(',');
                this.delArr = arr;
            },
            select_list(selection, row){//或许选中的ids
                if(selection.length===0){
                    this.isDel = true;
                }else {
                    this.isDel = false;
                }
                let arr= [];
                selection.forEach((val)=>{
                    arr.push(val.id);
                });
                this.delIds = arr.join(',');
                this.delArr = arr;
            },
            del_select_list(){//删除选中的
                this.$confirm('此操作将删除该选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteModel(this.delIds,this.delArr);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('apis_url_del',false);
                    },200);
                })
            },
            editModel(data){
            	this.id=data.id
                if(data.type === "自定义模块"){
                    this.editUserDefinedVisible = true;
                }else {
                    this.editRelevancyVisible = true;
                }
            },
            delete_row(id,row){
                this.$confirm('此操作将删除该选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteModel(id,row);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            deleteModel(id,datas){//删除一行
                this.$http(api_del,{ids:id}).then(res=>{
                    this.$message({
                        type:'success',
                        message: res.message
                    });
                    if(datas instanceof Array){
                        datas.forEach(row=>{
                            let index=this.dataList.indexOfFun(row,function (old,row) {
                                return old.id===row
                            });
                            this.dataList.splice(index,1)
                            this.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.dataList.indexOfFun(datas,function (old,datas) {
                            return old.id===datas.id
                        });
                        this.dataList.splice(i,1)
                        this.total-=1;
                    }
                    this.delIds = '';
                    this.delArr = [];
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:'error',
                        message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('apis_url_del',false);
                    },200);
                });
            },
            search(){
                this.init();
            },
            clearSearch(){
                this.searchData={
                    page: 1,
                    pageSize: 50,
                    account_id: '',
                    stype: '',
                    scontent: "",
                    type: ""
                }
                this.init();
            },
            previewRel(data){
                this.previewModelVisible = true;
                this.previewHtml = data;
                //console.log(this.previewHtml);
            },
            previewEditRel(data){
                this.previewModelVisible = true;
                this.previewHtml = data;
                //console.log(this.previewHtml);
            },
            previewDef(){
                this.previewDefinedModelVisible =true;
            },
            previewEditDef(){
                this.editUserDefinedVisible =true;
            },
            selectModelType(){//选择模块类型
                if(this.radio == 1){
                    this.selectBoxShowAndHide = false;
                    this.relevancyVisible = true;
                    this.radioName = "关联产品模块"
                }else if(this.radio == 2){
                    this.selectBoxShowAndHide = false;
                    this.userDefinedVisible = true;
                    this.radioName = "自定义模块"
                }else{
                    this.$message({
                        type:'error',
                        message: "请选择模块类型"
                    });
                }
                this.radio = "";
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            init(){
                this.dataList=[];
                this.loading = true;
                this.$http(api_category_list,this.searchData).then(res=>{
                    //console.log(res.data);
                    this.dataList = res.data;
                    this.total=res.total;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            getAccount(){//获取账号简称
                this.accountList = [];
                this.$http(api_get_account,{channel_id:4}).then(res => {
                    this.accountList = res.account;
                    //console.log(res);
                }).catch(code => {
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            }
        },
        computed: {
            isDisabled(){
                let boolValue = false;
                if(!this.radio){
                    boolValue = true;
                }
                return boolValue;
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {},
        props: {},
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
            addRelevancyModel: require("./add-relevancy-model.vue").default,
            addUserDefinedModel: require('./add-user-defined-model.vue').default,
            editRelevancyModel: require("./edit-relevancy-model.vue").default,
            editUserDefinedModel: require('./edit-user-defined-model.vue').default,
            previewRelevancyModel: require("./preview-relevancy-model.vue").default,
            previewUserDefinedModel: require("./preview-user-defined-model.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
        }

    }
</script>
