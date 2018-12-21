<template>
    <page-dialog class="p-wish-management"
                 :title="`账号简称: ${mdfTitle} 的成员管理`"
                 :size="memberSize"
                 v-model="memDialog"
                 :close-on-click-modal="false">
        <el-row :gutter="8">
            <el-col :span="memberList">
                <el-card class="mb-xs">
                    <el-row>
                        <el-col :span="16">
                            <el-input v-model="filterMember" placeholder="搜索用户"></el-input>
                        </el-col>
                        <el-col :span="8" class="t-right">
                            <el-button class="inline"
                                       type="danger"
                                       size="mini"
                                       @click.native="batch_delete"
                                       :disabled="isDelDisabled">批量删除</el-button>
                            <el-button class="inline"
                                       type="primary"
                                       size="mini"
                                       @click.native="addShow">
                                {{memberListName}}</el-button>
                        </el-col>
                    </el-row>
                    <el-table :class="[showAdd ? '':'mb-lg','scroll-bar','mt-xs']"
                              :data="members"
                              border
                              v-resize="{height:200}"
                              @selection-change="batch_select"
                              :row-class-name="row_class_name"
                              v-loading="isLoading"
                              element-loading-text="玩命加载中...">
                        <el-table-column type="selection" width="35px"
                                         :selectable="selectable"
                                         align="center"></el-table-column>
                        <el-table-column prop="username"
                                         label="用户名"
                                         align="center"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="realname"
                                         width="60px"
                                         label="姓名"
                                         align="center"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column label="部门"
                                         align="center"
                                         inline-template>
                            <span :title="row.department">{{row.department}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col v-if="showAdd" :span="12">
                <el-card class="mb-xs">
                    <label>可选用户：</label>
                    <el-button class="inline ml-sm"
                               type="primary"
                               size="mini"
                               @click.native="add_member"
                               :disabled="newAdd.length <= 0">添加</el-button>
                    <div class="fr">
                        <el-select v-model="snType"
                                   class="inline width-xs"
                                   @change="chang_select">
                            <el-option v-for="item in searchList"
                                       :key="item.value"
                                       :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                        <div class="inline" v-if="isShow">
                            <el-input class="inline"
                                      v-model="snText"
                                      placeholder="请输入搜索内容..."></el-input>
                            <el-button class="inline"
                                       type="primary"
                                       size="mini"
                                       @click.native="search">搜索</el-button>
                        </div>
                        <el-select class="inline"
                                   v-else
                                   v-model="snText"
                                   filterable
                                   @change="change_condition">
                            <el-option v-for="item in condition"
                                       :key="item.value"
                                       :value="item.id"
                                       :label="item.name"></el-option>
                        </el-select>
                        <el-button class="inline ml-xs"
                                   size="mini"
                                   @click.native="clear_search">清空搜索
                        </el-button>
                    </div>
                </el-card>
                <el-card>
                    <el-row>
                        <ui-table :has-data="selectLists.length>0"
                                  v-model="checkAll"
                                  @check="check_all"
                                  :body-height="200"
                                  :heads="[
                                      {isCheck:true,width:2,},
                                      {label:'用户名',width:30},
                                      {label:'姓名',width:20},
                                      {label:'部门',width:58},]">
                            <tbody v-loading="loading" element-loading-text="玩命加载中......">
                            <template v-for="(item,index) in selectLists">
                                <tr :class="[clickData[index]?'active-color':'']"
                                    @click="addClass(index)">
                                    <td><el-checkbox v-model="item.check"
                                                     :disabled="item.isAdd"
                                                     @change="check(item)">
                                    </el-checkbox></td>
                                    <td>
                                        <ui-tips :content="item.username"></ui-tips>
                                    </td>
                                    <td>
                                        <ui-tips :content="item.realname"></ui-tips>
                                    </td>
                                    <td class="pri-td">
                                        <span :title="item.department | filDepartment">
                                            {{item.department | filDepartment}}
                                        </span>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </ui-table>
                        <el-pagination
                                @size-change="mem_size_change"
                                @current-change="mem_current_change"
                                :current-page="selList.page"
                                :page-size="selList.pageSize"
                                layout="total, prev, pager, next, jumper"
                                :total="selList.totalSize">
                        </el-pagination>
                    </el-row>
                </el-card>
                <div class="fr mt-md mb-xs">
                    <request-button :disabled="!showButton"
                               req-key="saveMember"
                               @click="save_member">保存
                    </request-button>
                    <el-button size="mini"
                               @click.native="cancel_member">取消
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </page-dialog>
</template>
<style lang="stylus">
    .p-wish-management{
        .tr-add{
            color: #FF0000 !important;
        }
        .template{
            tr{
                td.pri-td{
                    div.mem-hidden{
                        vertical-align: middle;
                        margin:0 0;
                        display: inline-block;
                        width:250px;
                        padding:0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space:nowrap;
                        overflow:hidden;
                    }
                }
            }
        }
        .secTable{
            width: auto !important;
        }
        .inner{
            padding-bottom: 0 !important;
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {mapGetters} from 'vuex';
    import {api_role_addUser,api_department_role,api_user_list } from '../../../api/role';
    import {depart_list} from '../../../api/department'
    import {api_post_account_users} from '../../../api/account-apply'
    export default{
        data(){
            return{
                memberSize:"large",
                memDialog:false,
                showAdd:false,
                showButton:false,
                snType:"username",
                filterMember:'',
                searchList:[
                    {label:"用户名",value:"username"},
                    {label:"姓名",value:"realname"},
                    {label:"部门",value:"department_id"},
                ],
                condition:[],
                snText:"",
                isDelDisabled:true,
                newAdd:[],
                readyDelete:[],
                selList:{
                    table:[],
                    page:0,
                    pageSize:20,
                    totalSize:0,
                },
                clickData:[],
                loading:false,
                dataList:[],
                parentsList:[],
                leaderList:[]
            }
        },
        mounted(){
            this.memDialog = this.value;
            for(let i=0;i<this.selectLists.length;i++){
                this.clickData.push(false)
            }
            this.$http(depart_list,this.dataParams).then(res=>{
                //TODO:这里返回的res里面是一个数组对象 但是不知道为什么后台分会的最后一个数据为数组，所以这里只能判断一下
                if(!res instanceof Array){
                    this.dataList = Object.values(res);
                }
            }).catch(code=>{
                console.log(code)
            })
        },
        watch:{
            memDialog(val){
                if(!val){
                    this.showAdd = false;
                    this.memberSize = 'large';
                }
                this.$emit("input",val);
            },
            value(val){
                this.memDialog = val;
                if(val){
                    this.newAdd = [];
                    this.isDelDisabled = !!val;
                    this.snType="username";
                    this.snText="";
                    this.search_init();
                }
            },
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
        created(){
//            this.search_init();
        },
        computed:{
            ...mapGetters({currentUser:'user/info'}),
            isShow(){
                return (this.snType==="username"||this.snType==="realname")
            },
            memberList(){
                return this.showAdd? 12 :24;
            },
            members(){
                return this.memForm.filter(row=>row.username.indexOf(this.filterMember)>=0);
            },
            memberListName(){
                return this.showAdd? "仅显示成员":"添加成员"
            },
            selectLists(){
                return this.selList.table.map(selRow=>{
                    let isFind = !!this.memForm.find(memRow=>{
                        //ToDo:此处判断可能有问题 因为user_id本身是没有的 是保存后后台给返回的所以当第一次添加的时候为了禁用右边的选项只能用id来判断，但是左边也是有id的可能产生混乱
                        return memRow.user_id === selRow.id || memRow.id === selRow.id;
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
                return this.memForm.map(row=>{
                    if(row.user_id){
                        return row.user_id;
                    }else {
                        return row.id;
                    }
                })
            }
        },
        methods:{
            selectable(row){
                //新加的，或不是自已，可以勾选删除
                return row.isNewAdd || (row.id !== this.currentUser.user_id);
            },
//            添加当前行高亮
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                    return false
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
                if(this.snType==="department_id"){
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
                }).catch(code=>{
                    this.loading = false;
                    console.log(code);
                });
            },
//            ----------------------------------  select1
            chang_select(selection){
                selection==="department_id"&& this.$http(api_department_role).then(res=>{this.condition=res.departmentList});
                this.snText="";
            },
//            ----------------------------------  select2
            change_condition(selection){
                this.search_init();
            },
//            ----------------------------------  点击添加  变为红色字体
            row_class_name(row,index){
                if(row.isNewAdd === true){
                    return "tr-add";
                }
                return "";
            },
            uniqueArray(array, key){
                var result = [array[0]];
                for(var i = 1; i < array.length; i++){
                    var item = array[i];
                    var repeat = false;
                    for (var j = 0; j < result.length; j++) {
                        if (item[key] == result[j][key]) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) {
                        result.push(item);
                    }
                }
                return result;
            },
            check(item){
                if(item.check){
                    this.dataList.find((row, ind)=>{
                        if(row.id === item.department_id){
                            this.parentsList = row.parents;
                            return true;
                        }
                    });
                    console.log('this.parentsList',this.parentsList);
                    for(let i = 0; i < this.parentsList.length; i++){
                        this.dataList.find(row=>{
                            if(this.parentsList[i] === row.id && !!row.leader_name){
                                this.leaderList.push(row.leader_name);
                            }
                        })
                    }
                    console.log('old',this.leaderList);
                    console.log(this.members);
                    for(let i = 0; i < this.leaderList.length; i++){
                        for(let j = 0; j < this.members.length; j++){
                            if(this.leaderList[i] === this.members[j].username){
                                this.leaderList.splice(i, 1);
                            }
                        }
                    }
                    console.log('new',this.leaderList)
                    for(let i = 0; i < this.leaderList.length; i++){
                        let params = {
                            page:this.selList.page,
                            pageSize:this.selList.pageSize,
                            snType:'username',
                            snText:this.leaderList[i]
                        };
                        this.$http(api_user_list,params).then(res=>{
                            this.newAdd.push(res.data[0]);
                        }).catch(code=>{
                            console.log(code);
                        });
                    }
                    this.newAdd.push(item);
                    console.log('newAdd',this.newAdd)
                }else{
                    let index = this.newAdd.indexOfFun(row=>{
                        return row.id === item.id;
                    });
                    if(index >= 0){
                        this.newAdd.splice(index, 1);
                    }
                }
            },
//            ------------------------------------  批量删除
            batch_delete(){
                let ret = null;
                console.log(this.memForm)
                while(ret = this.readyDelete.shift()){
                    let index = this.memForm.findIndex(row=>row.user_id === ret.user_id);
                    this.memForm.splice(index,1);

                }
                console.log(this.memForm)
                this.isDelDisabled = true;
                this.showButton = true;
                this.memberSize = 'full';
                this.showAdd = true;
            },
//            ------------------------------------  成员列表  多选
            batch_select(selection){
                this.isDelDisabled = selection.length<=0;
                this.readyDelete=selection;
            },
//            ------------------------------------  取消
            cancel_member(){
                this.$emit("cancel-member",this.id);
                this.leaderList=[];
                this.newAdd = [];
                this.showButton = false;
                this.memDialog = false;
            },
//            ------------------------------------  保存
            save_member(){
                let data={
                    account_id:this.id,
                    users:this.ids
                };
                this.$http(api_post_account_users,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res,
                    });
                    this.memForm.map(row=>{
                        this.$set(row,"isNewAdd",false);
                    });
                    this.showButton = false;
                    this.memDialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('saveMember', false);
                    }, 300)
                })
            },
//            ------------------------------------  搜索
            search(){
                this.search_init();
            },
//            ------------------------------------  清空搜索
            clear_search(){
                this.snType = 'username';
                this.snText = '';
                this.search_init();
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
                this.newAdd = this.uniqueArray(this.newAdd, 'id');
                while (ret = this.newAdd.shift()){
                    this.$set(ret,"isNewAdd",true);
                    this.memForm.push(ret);
                }
                this.showButton = true;
            },
            check_all(bool){
                this.selectLists.forEach(row=>{
                    if(bool){
                        if(!row.isAdd){
                            row.check = true;
                            this.newAdd.push(row);
                        }else{
                            return;
                        }
                    }else{
                        if(!row.isAdd){
                            row.check = false;
                            let index = this.newAdd.indexOfFun(item=>{
                                return item.id === row.id;
                            });
                            if(index >= 0){
                                this.newAdd.splice(index, 1);
                            }
                        }
                    }
                });
            },
            addShow(){
                if(this.memberSize === 'full'){
                    this.memberSize = 'large';
                } else {
                    this.memberSize = 'full';
                }
                this.showAdd = !this.showAdd;
            }
        },
        props:{
            value:{},
            memForm:{
                required:true,
                type:Array
            },
            mdfTitle:{},
            isLoading:{
                required:true,
                type:Boolean
            },
            id:{
                required:true,
            }
        },
        components:{
            pageDialog,
            uiTips:require('../../../components/ui-tips.vue').default,
            uiTable:require('../../../components/ui-table.vue').default,
        }
    }
</script>
