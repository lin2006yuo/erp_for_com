<template>
    <page-dialog class="p-memeber-management" :title="`添加/编辑收件人`"
                 @open="open"
                 :min-height="600"
                 @close="close"
                 size="full" v-model="memDialog" :close-on-click-modal="false">
        <el-row :gutter="8">
            <el-col :span="12">
                <el-card class="mb-xs">
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="filterMember" placeholder="搜索已添加用户..."></el-input>
                        </el-col>
                        <el-col :span="16" class="t-right">
                            <div>
                                <label >模板名称：</label>
                                <ui-autocomplete v-model="templateInfo.name"
                                                 :fetch-suggestions="querySearch"
                                                 placeholder="请输入或选择模板..."
                                                 ref="autocomplete"
                                >
                                </ui-autocomplete>
                                <el-button class="inline" type="primary" size="mini">存为模板</el-button>
                                <el-button class="inline" type="primary" size="mini">删除模板</el-button>
                                <el-button class="inline" type="danger" size="mini" @click.native="batch_delete" :disabled="isDelDisabled">删除用户</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-table
                            class="scroll-bar mt-xs"
                            :data="members"
                            border
                            height="500"
                            @selection-change="batch_select"
                            :row-class-name="row_class_name"
                            v-loading="isLoading"
                            element-loading-text="玩命加载中...">
                        <div slot="empty" class="no-data-reminder">
                            <i></i>
                            {{emptyText}}
                        </div>
                        <el-table-column type="selection" width="30px"
                                         align="center"></el-table-column>
                        <el-table-column prop="username" width="140px" label="用户名" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="realname" width="80px" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="department" label="部门" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="role"  width="130px" label="角色" align="center" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <el-row>
                        <el-select v-model="snType" class="inline width-xs" @change="typeChange">
                            <el-option v-for="item in searchList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                        <div class="inline" v-if="snType==='username'||snType==='realname'">
                            <el-input class="inline width-super mr-sm" v-model="snText" @keydown.native.enter="search" placeholder="请输入搜索内容..."></el-input>
                            <el-button class="inline" type="primary" size="mini" @click.native="search">搜索</el-button>
                        </div>
                        <el-select v-if="snType==='department_id'" class="inline width-super mr-sm" v-model="snText" @change="change_condition">
                            <el-option v-for="item in condition" :key="item.value" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                        <el-select v-if="snType==='role_id'"
                                   class="inline width-super mr-sm"
                                   v-model="snText"
                                   filterable clearable
                                   @change="change_condition"
                                   placeholder="请选择角色">
                        <el-option
                            v-for="item in roleList"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id"
                        ></el-option>
                    </el-select>
                            <el-button class="inline" size="mini" @click.native="clear_search">清空搜索</el-button>
                        <div class="fr">
                            <el-button class="inline ml-sm" type="primary" size="mini" @click.native="add_member" :disabled="newAdd.length <= 0">添加</el-button>
                        </div>
                    </el-row>
                    <el-row>
                        <el-table
                            class="scroll-bar mt-xs"
                            :data="selectLists"
                            border
                            height="500"
                            @selection-change="check_change"
                            v-loading="loading"
                            element-loading-text="玩命加载中...">
                            <div slot="empty" class="no-data-reminder">
                                <i></i>
                                {{emptyText}}
                            </div>
                            <el-table-column type="selection" width="30px"
                                             :selectable="selectableAdd"
                                             align="center"></el-table-column>
                            <el-table-column prop="username" width="140px" label="用户名" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="realname" width="80px" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="department" label="部门" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="role"  width="130px" label="角色" align="center" show-overflow-tooltip></el-table-column>
                        </el-table>
                        <el-pagination
                            class="fr"
                            @size-change="mem_size_change"
                            @current-change="mem_current_change"
                            :current-page="selList.page"
                            :page-size="selList.pageSize"
                            :page-sizes="[50, 100, 500, 2000, 5000]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="selList.totalSize">
                        </el-pagination>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <div slot="footer">
            <el-button size="mini" type="primary" @click.native="cancel_member">确定</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-memeber-management {
        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
            height: 26px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
        }
        .tr-add {
            color: #FF0000 !important;
        }
        .template {
            tr {
                td.pri-td {
                    div.mem-hidden {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 250px;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {mapGetters} from 'vuex';
    import {api_department_role,api_user_list } from '../../../api/role';
    export default{
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        data(){
            return{
                firstLoading:true,
                memberSize:"large",
                memDialog:false,
                showButton:false,
                snType:"username",
                filterMember:'',
                searchList:[
                    {label:"用户名",value:"username"},
                    {label:"姓名",value:"realname"},
                    {label:"部门",value:"department_id"},
                    {label:"角色",value:"role_id"}
                ],
                condition:[],
                roleList:[],
                snText:"",
                newAdd:[],
                readyDelete:[],
                selList:{
                    table:[],
                    page:1,
                    pageSize:50,
                    totalSize:0,
                },
                clickData:[],
                loading:false,
                templates:[],
                templateInfo:{
                    name:''
                }
            }
        },
        mounted(){
            this.get_role();
            this.search_init();
            this.memDialog = this.value;
            for(let i=0;i<this.selectLists.length;i++){
                this.clickData.push(false)
            }
        },
        watch:{
            memDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.memDialog = val;
                if(val){

                }else{

                }
            }
        },
        filters:{
            filDepartment(val){
                if(val===''){
                    return "-无-";
                }else{
                    return val;
                }
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            },
            ...mapGetters({currentUser:'user/info'}),
            members(){
                return this.memData.filter(row=>row.username.indexOf(this.filterMember)>=0||row.realname.indexOf(this.filterMember)>=0);
            },
            selectLists(){
                return this.selList.table.map(selRow=>{
                    let isFind = !!this.memData.find(memRow=>{
                        return memRow.id === selRow.id;
                    });
                    this.$set(selRow, "isAdd", isFind);
                    this.$set(selRow, "check", isFind);
                    return selRow;
                });
            },
            checkAll:{
                get(){
                    if(this.selectLists.length>0){
                        return !this.selectLists.one(row=>row.check === false);
                    }else{
                        return false;
                    }
                },
                set(val){
                    console.log("checkAll",val);
                }
            },
            ids(){
                return this.memData.map(row=>row.id)
            },
            isDelDisabled(){
                return this.readyDelete.length <= 0;
            }
        },
        methods:{
            open(){
                if(this.sendOrSave){
                    this.showButton = false;
                    this.readyDelete.length = 0;//快速清空数组
                    this.newAdd = [];
                    this.snType="username";
                    this.snText="";
                    this.search();
                }
            },
            close(){
                this.memberSize = 'large';
            },
            selectableAdd(row){
                return !row.isAdd
            },
            querySearch(queryString, cb){
                let restaurants = this.templates;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString){
                return (item) => {
                    return (item.value.indexOf((queryString.toLowerCase())) === 0)
                }
            },
//            添加当前行高亮
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                });
                this.clickData[index]=true
            },
//            ----------------------------------  初始搜索接口
            search_init(){
                let params = {
                    page:this.selList.page,
                    pageSize:this.selList.pageSize,
                    snType:this.snType
                };
                if(this.snType==="department_id"||this.snType==="role_id"){
                    params.snText = this.snText;
                }else{
                    this.snText&&(params.snText = this.snText.trim());
                }
                this.selList.table = [];
                this.loading = true;
                this.$http(api_user_list,params).then(res=>{
                    this.selList.table=res.data;
                    this.selList.totalSize=res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    console.log(code);
                });
            },
            typeChange(){
                if(this.snType==="department_id"||this.snType==="role_id"){
                    this.snText = '';
                }
            },
//            ----------------------------------  select2
            change_condition(){
                this.search_init();
            },
//            ----------------------------------  点击添加  变为红色字体
            row_class_name(row,index){
                if(row.isNewAdd === true){
                    return "tr-add";
                }
                return "";
            },
//            ------------------------------------  批量删除
            batch_delete(){
                let ret = null;
                while(ret = this.readyDelete.shift()){
                    let index = this.memData.indexOfFun(row=>row.id === ret.id);
                    this.memData.splice(index,1);
                }
                this.showButton = true;
            },
//            ------------------------------------  成员列表  多选
            batch_select(selection){
                this.readyDelete=selection;
            },
//            ------------------------------------  取消
            cancel_member(){
                this.showButton = false;
                this.memDialog = false;
                this.filterMember = '';
            },
//            ------------------------------------  搜索
            search(){
                this.search_init();
            },
//            ------------------------------------  清空搜索
            clear_search(){
                if(this.snText!=='') {
                    this.snType = 'username';
                    this.snText = '';
                    this.search_init();
                }
            },
//            ------------------------------------  可添加列表    分页
            mem_size_change(size){
                this.selList.pageSize = size;
                this.search_init();
            },
            mem_current_change(page){
                this.selList.page = page;
                this.search_init();
            },
//            ------------------------------------  可添加列表  添加
            add_member(){
                let ret = null;
                while (ret = this.newAdd.shift()){
                    this.$set(ret,"isNewAdd",true);
                    this.memData.push(ret);
                }
                this.showButton = true;
            },
            check_change(selectList){
                this.newAdd = selectList;
            },
            get_role() {
                this.condition = [];
                this.roleList = [];
                this.$http(api_department_role).then(res => {
                    this.condition=res.departmentList;
                    this.roleList = res.roleList;
                }).catch(code => {
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
            memData:{
                required:true,
                type:Array
            },
            isLoading:{
                required:true,
                type:Boolean
            },
            sendOrSave:{
                required:true,
                type:Boolean
            }
        },
        components:{
            pageDialog,
            uiTips:require('../../../components/ui-tips.vue').default,
            uiTable:require('../../../components/ui-table.vue').default,
            uiAutocomplete:require('@/components/ui-autocomplete').default
        }
    }
</script>
