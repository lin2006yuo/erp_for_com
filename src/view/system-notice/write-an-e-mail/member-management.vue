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
                                <label>模板名称：</label>
                                <!--<el-select v-model="templatearr" multiple placeholder="请选择">-->
                                <!--<el-option v-for="item in testList"-->
                                           <!--:label="item.label"-->
                                           <!--:value="item.value"-->
                                           <!--:key="item.value"-->
                                <!--&gt;</el-option>-->
                                <!--</el-select>-->
                                <el-select v-model="templatearr"
                                           multiple
                                           class="inline input-no-margin"
                                           @change="change_select">
                                    <el-option v-for="item in testList"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value"
                                        ></el-option>
                                </el-select>
                                <el-button class="inline" type="primary" size="mini" @click="opentemplate">{{savevalue}}</el-button>
                                <el-button class="inline" type="primary" size="mini" @click="deletetemplate">删除模板</el-button>
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
                            ref="datetable"
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
        <page-dialog title="输入模板名称" width="20%" v-model="tamplateopen">
            <label>模板名称：</label>
            <el-input  class="inline s-width-large" v-model="templatevalue"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tamplateopen = false">取 消</el-button>
                <el-button type="primary" @click="savetemplate">确 定</el-button>
            </span>
        </page-dialog>
    </page-dialog>
</template>
<style lang="stylus">
    .p-memeber-management {
        >.el-dialog--small{
            width: 20%;
        }
        .box{
            .el-dialog--small{
                top: 20%;
                width:20%;
            }
        }
        .t-right {
            .input-no-margin {
                .el-select__tags {
                    text-align left;
                    height: 30px !important;
                    width: 145px !important;
                    max-width: 145px !important;
                    overflow-y: auto;

                    > span {
                        white-space: inherit;
                    }
                }
                .el-select__input {
                    width: 196px !important;
                    margin-left: 4px !important;
                }
            }
        }
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
    import {api_department_role,api_user_list,api_preserve_user_template,api_user_template,api_delete_user,api_user_dete } from '../../../api/role';
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
                tamplateopen:false,
                templatearr:[],
                testList:[],
                innerVisible:false,
                templatevalue:"",
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
                },
                thisitem:0,
                oldcheck:[],
                selectvalue:[],
            }
        },
        mounted(){
            this.get_role();
            this.search_init()
            this.get_data();
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
                        return memRow.username === selRow.username;
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
            },
            savevalue(){
                if(this.templatearr.length<=0) {
                    return '存为模板'
                } else if(this.templatearr.length==1) {
                    return `覆盖模板`
                } else {
                    return `存为模板`
                }
            }
        },
        methods:{
            opentemplate(){
                if(this.memData.length==0){
                  return this.$message({type: 'warning', message:"请先选择需要保存的模板联系人"})
                }
                if(this.templatearr.length==1){
                    this.templatevalue=this.testList[this.testList.findIndex(r=>r.value==this.templatearr[0])].label;
                    this.savetemplate();
                    return
                }
                this.templatevalue='';
                this.tamplateopen=true;
            },
            change_select(val){
                this.$emit('change-select',val);
            },
            get_data(){
                return this.$http(api_user_template).then(res=>{
                    this.testList = res.data.map(row=>{
                        return {
                            value:row.id,
                            label:row.name
                        }
                    })
                    return Promise.resolve()
                })
            },
            savetemplate(){
                if(this.templatevalue=='') {
                    return this.$message(`请输入模板名称`)
                }
                    let data={
                        "template_name":this.templatevalue,
                        "member_list":[],
                    };
                    this.memData.forEach((el,index)=>{
                       let json={}
                        json.user_id=el.user_id||el.id;
                        json.username=el.username;
                        json.realname=el.realname;
                        json.department =el.department;
                        json.role =el.role;
                        data.member_list.push(json);
                    })
                    console.log(data)
                    this.$http(api_preserve_user_template,data).then(res=>{
                        this.$message({type:'success',message:res.message});
                        console.log(res)
                        this.get_data().then(code=>{
                            this.templatearr=[+res.template_id];
                            this.tamplateopen=false;
                        });
                    }).catch(code=>{
                        this.message({type:'error',message:code||code.message})
                    })
            },
            deletetemplate(){
                if(this.templatearr.length==0) {
                    this.$message({type: 'warning', message: "请选择需要删除的模板"})
                } else if(this.templatearr.length>1){
                    this.$message({type: 'warning', message: "只能选一个模板"})
                } else {
                    this.$confirm('此操作将删除模板中勾选的数据，确认此操作吗？',"提示",{
                        confirmButtonText: '确定',
                        cancelButtonText:'取消',
                        type: 'warning',
                        closeOnClickModal:false,
                    }).then(()=>{
                       this.deletetemplate_affirm();
                    }).catch(code=>{
                        this.$reqKey('batchDelete',false);
                    });
                }
            },
            deletetemplate_affirm(){
                this.$http(api_delete_user,{"template_id":this.templatearr[0]}).then(res=>{
                    this.$message({type:'success',message:res.message})
                    this.templatearr=[];
                    this.$emit('change-select',[]);
                    this.get_data()
                }).catch(code=>{
                    this.$message({type:'error',message:code.message})
                })
                this.innerVisible=false;
            },
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
            selectableAdd(row,index){
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
                this.readyDelete.forEach(el=>{
                    let index=this.memData.findIndex(row=>el===row)
                    this.memData.splice(index,1);
                })
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
                this.$emit('select',this.memData);
                // console.log(this.memData);
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
                    this.$set(ret,'isNewAdd',true)
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
