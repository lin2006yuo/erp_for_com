<template>
    <page-dialog v-model="dialog" @open="open"
                 :title="title" @close="close_dialog"
                 :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form"
                 label-width="120px"
                 class="mt-sm mr-lg">
            <el-form-item label="小组名称：" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="小组负责人：" >
                <param-account
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
            <el-form-item label="上级部门：">
                <tree-dialog  v-model="form.pid"
                              :is-look="true"
                              :tree="superior"
                              :dbclick="true"
                              dialogSize="large" title="上级部门"></tree-dialog>
            </el-form-item>
            <el-form-item label="类型：">
                <el-radio-group v-model="form.type">
                    <el-radio v-for="item in typeList"
                              :disabled="isDisabled"
                              :label="item.value"
                              :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态：">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="item in statusList"
                              :label="item.value"
                              :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否为末端小组：">
                <el-radio-group v-model="form.is_bottom">
                    <el-radio v-for="item in bottomList"
                              :label="item.value"
                              :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_target_department,
        api_add_develop_department,
        api_get_develop_gepartment,
        api_edit_target_department,
        api_update_develop_department,
        api_get_sales_staffs,
        api_edit_partment_group,
        api_edit_develop_partment_group,
        api_get_get_gepartment} from '@/api/target-configure';
    export default {
        data() {
            return {
                dialog:this.value,
                superior:{},
                form:{
                    name:'',
                    leader_id:'',
                    pid:'',
                    status:0,
                    type:1,
                    is_bottom:0,
                },
                staffList:[],
                departmentList:[],
                leaderList:[],
                typeList:[
                    {label:'部门',value:0},
                    {label:'小组',value:1},
                    {label:'成员',value:2},
                ],
                statusList:[
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
                bottomList:[
                    {label:'是',value:1},
                    {label:'否',value:0},
                ],
                rules:{
                    name:[
                        {required:true,message:'小组名称为必填项',trigger:'change'}
                    ]
                }
            }
        },
        methods:{
            get_department(val){
                this.superior={};
                let url = this.curPage==='seller'?api_get_get_gepartment:api_get_develop_gepartment;
                this.$http(url).then(res=>{
                    if(res instanceof Array) return;
                    this.superior=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            sale_fix_result(res){
                return  res.map(row=>({
                    value:row.id,
                    label:row.realname
                }))
            },
            close_dialog(){
                this.form = {
                    name:'',
                    leader_id:'',
                    pid:'',
                    status:0,
                    type:1,
                    is_bottom:0,
                }
            },
            open(){
                this.get_department();
                if(this.curRow){
                    this.form.pid = this.curRow.id;
                }
                if(this.id){
                    this.edit_department();
                }
            },
            submit(){
                this.$refs.form.validate((b)=>{
                    if(!b)return;
                    if(!this.id){
                        let params = clone(this.form);
                        params.leader_id = [params.leader_id];
                        let url = this.curPage ==='seller'?api_add_target_department:api_add_develop_department;
                        this.$http(url,params).then(res => {
                            this.$message({type:'success',message:res.message||res});
                            this.dialog = false;
                        }).catch(code => {
                            this.$message({type:'error',message:code.message||code});
                        })
                    }else{
                        let params = {
                            name:this.form.name,
                            leader_id:this.form.leader_id?[this.form.leader_id]:[],
                            status:this.form.status,
                            pid:this.form.pid,
                            type:this.form.type,
                            is_bottom:this.form.is_bottom
                        };
                        let url = this.curPage==='seller'?api_edit_target_department:api_update_develop_department;
                        this.$http(url,this.id,params).then(res => {
                            this.$message({type:'success',message:res.message||res});
                            this.dialog = false;
                        }).catch(code => {
                            this.$message({type:'error',message:code.message||code});
                        })
                    }

                })
            },
            edit_department(){
                let url = this.curPage==='seller'?api_edit_partment_group:api_edit_develop_partment_group;
                this.$http(url,this.id).then(res => {
                    this.form = res;
                    this.form.leader_id = res.leader_id[0];
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
        },
        computed:{
            title(){
                if(!this.id){
                    return '添加小组'
                }else{
                    return '编辑小组'
                }
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
            isDisabled:{
                type:Boolean,
                default(){
                    return true
                }
            },
            id:{
                required:true
            },
            curRow:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            treeDialog:require('@/api-components/tree-dialog.vue').default,
        }
    }
</script>