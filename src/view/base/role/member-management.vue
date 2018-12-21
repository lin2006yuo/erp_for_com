<template>
    <page-dialog class="p-memeber-management" :title="`给角色：${titleName} 添加成员`"
                 @open="open"
                 @close="close"
                 :size="memberSize" v-model="memDialog" :close-on-click-modal="false">
        <el-row :gutter="8">
            <el-col :span="memberList">
                <el-card class="mb-xs">
                    <el-row>
                        <el-col :span="16">
                            <el-input v-model="filterMember" placeholder="搜索用户"></el-input>
                        </el-col>
                        <el-col :span="8" class="t-right">
                            <el-button class="inline" type="danger" size="mini" @click.native="batch_delete" :disabled="isDelDisabled">批量删除</el-button>
                            <el-button class="inline" type="primary" size="mini" @click.native="addShow">{{memberListName}}</el-button>
                        </el-col>
                    </el-row>
                    <el-table
                            :class="[showAdd ? '':'mb-lg','scroll-bar','mt-xs']"
                            :data="members"
                            border
                            v-resize="{height:200}"
                            @selection-change="batch_select"
                            :row-class-name="row_class_name"
                            v-loading="isLoading"
                            element-loading-text="玩命加载中..."
                    >
                        <el-table-column type="selection" width="35px"
                                         :selectable="selectable"
                                         align="center"></el-table-column>
                        <el-table-column prop="username" label="用户名" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="realname"  width="60px" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="部门" align="center" inline-template>
                            <span :title="row.department">{{row.department}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col v-if="showAdd" :span="12">
                <el-card class="mb-xs">
                    <label>可选用户：</label>
                    <el-button class="inline ml-sm" type="primary" size="mini" @click.native="add_member" :disabled="newAdd.length <= 0">添加</el-button>
                    <div class="fr">
                        <el-select v-model="snType" class="inline width-xs" @change="chang_select">
                            <el-option v-for="item in searchList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                        <div class="inline" v-if="isShow">
                            <el-input class="inline" v-model="snText" placeholder="请输入搜索内容..."></el-input>
                            <el-button class="inline" type="primary" size="mini" @click.native="search">搜索</el-button>
                        </div>
                        <el-select  class="inline"  v-else  v-model="snText" @change="change_condition">
                            <el-option v-for="item in condition" :key="item.value" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                        <el-button class="inline ml-xs" size="mini" @click.native="clear_search">清空搜索</el-button>
                    </div>
                </el-card>
                <el-card>
                    <el-row>
                        <ui-table
                                :has-data="selectLists.length>0"
                                v-model="checkAll"
                                @check="check_all"
                                :body-height="200"
                                :heads="[
                                {isCheck:true,width:2,},
                                {label:'用户名',width:30},
                                {label:'姓名',width:20},
                                {label:'部门',width:58},
                            ]"
                        >
                            <tbody v-loading="loading" element-loading-text="玩命加载中......">
                            <template v-for="(item,index) in selectLists">
                                <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)">
                                    <td><el-checkbox v-model="item.check" :disabled="item.isAdd" @change="check(item)"></el-checkbox></td>
                                    <td>
                                        <ui-tips :content="item.username"></ui-tips>
                                    </td>
                                    <td>
                                        <ui-tips :content="item.realname"></ui-tips>
                                    </td>
                                    <td class="pri-td">
                                        <span :title="item.department | filDepartment">{{item.department | filDepartment}}</span>
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
            </el-col>
        </el-row>
        <div slot="footer">
            <el-button  req-key='memberManage' :disabled="!showButton" @click="save_member">确定</el-button>
            <el-button size="mini" @click.native="cancel_member()">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
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
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {mapGetters} from 'vuex';
    import {api_role_addUser,api_department_role,api_user_list } from '../../../api/role';
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
                newAdd:[],
                readyDelete:[],
                selList:{
                    table:[],
                    page:0,
                    pageSize:20,
                    totalSize:0,
                },
                clickData:[],
                loading:false
            }
        },
        mounted(){
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
                return (this.snType==="username"||this.snType==="realname")?true:false
            },
            memberList(){
                return this.showAdd? 12 :24;
            },
            members(){
                return this.memForm.data.filter(row=>row.username.indexOf(this.filterMember)>=0);
            },
            memberListName(){
                return this.showAdd? "仅显示成员":"添加成员"
            },
            selectLists(){
                return this.selList.table.map(selRow=>{
                    let isFind = !!this.memForm.data.find(memRow=>{
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
                return this.memForm.data.map(row=>row.id)
            },
            isDelDisabled(){
                return this.readyDelete.length <= 0;
            }
        },
        methods:{
            open(){
                this.showButton = false;
                this.readyDelete.length = 0;//快速清空数组
                this.newAdd = [];
                this.snType="username";
                this.snText="";
                this.search_init();
            },
            close(){
                this.showAdd = false;
                this.memberSize = 'large';
            },
            selectable(row){
                //新加的，或不是自已，可以勾选删除
                return row.isNewAdd || (row.id != this.currentUser.user_id);
            },
//            添加当前行高亮
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                })
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
            check(item){
                if(item.check){
                    this.newAdd.push(item);
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
                while(ret = this.readyDelete.shift()){
                    let index = this.memForm.data.indexOfFun(row=>row.id === ret.id);
                    this.memForm.data.splice(index,1);
                }
                this.showButton = true;
            },
//            ------------------------------------  成员列表  多选
            batch_select(selection){
                this.readyDelete=selection;
            },
//            ------------------------------------  取消
            cancel_member(){
                this.$emit("cancel-member",this.id);
                this.showButton = false;
                this.memDialog = false;
            },
//            ------------------------------------  保存
            save_member(){
                let data={
                    id:this.id,
                    ids:this.ids.join(",")
                };
                this.$http(api_role_addUser,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res,
                    });
                    this.memForm.data.map(row=>{
                        this.$set(row,"isNewAdd",false);
                    });
                    this.showButton = false;
                    this.memDialog = false;
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'})
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('memberManage', false);
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
                while (ret = this.newAdd.shift()){
                    this.$set(ret,"isNewAdd",true);
                    this.memForm.data.push(ret);
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
                type:Object
            },
            isLoading:{
                required:true,
                type:Boolean
            },
            id:{
                required:true,
            },
            titleName:{}
        },
        components:{
            pageDialog,
            uiTips:require('../../../components/ui-tips.vue').default,
            uiTable:require('../../../components/ui-table.vue').default,

        }
    }
</script>
