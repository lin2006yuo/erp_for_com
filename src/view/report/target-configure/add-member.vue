<template>
    <page-dialog v-model="dialog"
                 title="添加成员" @open="open"
                 size="large" @close="close_dialog"
                 :close-on-click-modal="false">
        <el-form :model="form" label-width="120px" class="mt-sm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="小组名称：">
                        <el-input v-model="form.name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="上级部门：">
                        <tree-dialog  v-model="form.pid"
                                      :is-look="true"
                                      :tree="superior"
                                      :dbclick="true"
                                      dialogSize="large" title="上级部门"></tree-dialog>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="小组负责人：">
                        <param-account
                                :disabled="true"
                                style="width:100%"
                                ref="paramSale"
                                placeholder="可输入搜索"
                                v-model="form.leader_id"
                                :param="{type:curPage==='seller'?'sales':'development',data:{content:''}}"
                                :fixUrl="true"
                                :fixResult="sale_fix_result"
                                type="memberShipSales"
                                url="get|user/:type/staffs">
                        </param-account>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="状态：">
                        <el-radio-group v-model="form.status" disabled>
                            <el-radio v-for="item in statusList"
                                      :label="item.value"
                                      :key="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="小组成员：">
                <div class="mb-sm">
                    <el-button type="primary" size="mini"
                               @click.native="batch_add_member"
                               class="inline" >批量添加成员</el-button>
                    <el-button type="primary" size="mini"
                               @click.native="add_member"
                               class="inline">添加成员</el-button>
                    <el-button type="primary" size="mini"
                               @click.native="batch_delete_member"
                               class="inline">批量删除</el-button>
                </div>
                <el-table
                    class="scroll-bar" 
                    :data="memberList"
                    v-loading="loading"
                    height="450"
                    element-loading-text="玩命加载中..."
                    @selection-change="selection_change"
                    highlight-current-row>
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column label="成员" prop="realname"></el-table-column>
                    <el-table-column label="工号" prop="job_number"></el-table-column>
                    <el-table-column label="状态" inline-template>
                        <div>
                            {{row.status|filterStatus}}
                        </div>
                    </el-table-column>
                    <el-table-column label="操作" inline-template>
                        <span class="operate" @click="delete_row($index)">删除</span>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <batch-add-member v-model="batchDialog" @skip="skip"></batch-add-member>
        <single-add-member v-model="singleDialog" @submit="single_add"></single-add-member>
        <div slot="footer">
            <el-button type="primary" size="mini"
                       @click.native="submit"
                       class="inline">确定</el-button>
            <el-button size="mini" class="inline"
                       @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_get_gepartment,api_get_develop_gepartment,api_add_user,api_develop_add_user} from '@/api/target-configure';
    import {api_user_list} from '../../../api/role';
    export default {
        data() {
            return {
                form:{
                    name:'',
                    pid:0,
                    leader_id:'',
                    status:0,
                },
                loading:false,
                dialog:this.value,
                departmentList:[],
                staffList:[],
                statusList:[
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
                memberList:[],
                batchDialog:false,
                singleDialog:false,
                superior:{},
            }
        },
        filters:{
            filterStatus(val){
                switch(val){
                    case 1:
                        return '启用';
                    case 0:
                        return '停用';
                    default:
                        return '--';
                }
            },
        },
        methods:{
            single_add(list){
                list.forEach(row=>{
                    let find = this.memberList.find(res=>res.id===row.id);
                    if(find)return;
                    this.memberList.push(row);
                });
            },
            submit(){
                if(this.memberList.length<=0)return this.$message({type:'warning',message:'尚未添加任何成员'});
                let user_ids = this.memberList.map(row=>row.id);
                let params = {
                    department_id:this.form.pid,
                    user_ids:JSON.stringify(user_ids)
                };
                let url = this.curPage==='seller'?api_add_user:api_develop_add_user;
                this.$http(url,params).then(res => {
                    this.$message({type:'success',message:res.message||res});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                });
                this.dialog = false;
            },
            sale_fix_result(res){
                return  res.map(row=>({
                    value:row.id,
                    label:row.realname
                }))
            },
            get_department(){
                this.superior={};
                let url = this.curPage==='seller'?api_get_get_gepartment:api_get_develop_gepartment;
                this.$http(url).then(res=>{
                    if(res instanceof Array) return;
                    this.superior=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            batch_add_member(){
                this.batchDialog = true;
            },
            add_member(){
                this.singleDialog = true;
            },
            skip(val){
                let params = {
                    page:1,
                    pageSize:999999,
                    snType:'department_id',
                    snText:val,
                };
                let job =  this.curPage==='seller'?'sales':'development';
                this.$set(params,'job',job);
                this.loading = true;
                this.$http(api_user_list,params).then(res=>{
                    res.data.forEach(item=>{
                        let find = this.memberList.find(row=>row.id===item.id);
                        if(!find)this.memberList.push(item)
                    });
                }).catch(code=>{
                    console.log(code,'code');
                }).finally(()=>{
                    this.loading = false;
                });
            },
            batch_delete_member(){
                this.selectList.forEach(row=>{
                    let index = this.memberList.findIndex(res=>res.id===row.id);
                    if(index>-1)this.memberList.splice(index,1);
                });
            },
            close_dialog(){
                this.form = {
                    name:'',
                    pid:0,
                    leader_id:'',
                    status:0,
                };
                this.memberList = []
            },
            open(){
                this.form.pid = this.curRow.id;
                this.form.leader_id = this.curRow.leader_id?this.curRow.leader_id[0]:'';
                this.form.name = this.curRow.name;
                this.form.status = this.curRow.status;
                this.get_department();
            },
            delete_row(index){
                this.memberList.splice(index,1);
            },
            selection_change(val){
                this.selectList = val;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            curPage:{
                type:String
            },
            value:{},
            curRow:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            batchAddMember:require('./batch-add-member.vue').default,
            singleAddMember:require('./single-add-member.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            treeDialog:require('@/api-components/tree-dialog.vue').default,
        }
    }
</script>