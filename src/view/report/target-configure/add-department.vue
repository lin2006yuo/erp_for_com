<template>
    <page-dialog v-model="dialog" @open="open"
                 :title="title" @close="close_dialog"
                 :close-on-click-modal="false">
        <el-form :model="form" ref="form"
                 :rules="rules"
                 label-width="120px"
                 class="mr-lg mt-sm">
            <el-form-item label="部门名称：" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人：" prop="leader_id">
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
    import {api_add_target_department,api_edit_target_department,api_edit_partment_group,api_edit_develop_partment_group,
        api_add_develop_department,api_update_develop_department} from '@/api/target-configure';
    export default {
        data() {
            return {
                form:{
                    name:'',
                    leader_id:'',
                    status:0,
                    type:0,
                    pid:0,
                    is_bottom:0,
                },
                dialog:this.value,
                staffList:[],
                typeList:[
                    {label:'部门',value:0},
                    {label:'小组',value:1},
                    {label:'成员',value:2},
                ],
                statusList:[
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
                rules:{
                    name:[
                        {required:true,message:'部门名称为必填项！',trigger:'change'}
                    ],
                    leader_id:[
                        {required:true,message:'部门负责人为必填项！',trigger:'change',type:'number'}
                    ]
                }
            }
        },
        methods:{
            sale_fix_result(res){
                return  res.map(row=>({
                    value:row.id,
                    label:row.realname
                }))
            },
            submit(){
                this.$refs.form.validate((b)=>{
                    if(!b)return;
                    if(!this.form.id){//添加
                        let params = clone(this.form);
                        params.leader_id = [params.leader_id];
                        let url = this.curPage==='seller'?api_add_target_department:api_add_develop_department;
                        this.$http(url,params).then(res =>{
                            this.$message({type:'success',message:res.message||res});
                            this.dialog = false;
                        }).catch(code => {
                            this.$message({type:'error',message:code.message||code});
                        })
                    }else{ //更新
                        let url = this.curPage==='seller'?api_edit_target_department:api_update_develop_department;
                        this.$http(url,this.form.id,this.form).then(res => {
                            this.$message({type:'success',message:res.message||res});
                            this.dialog = false;
                        }).catch(code => {
                            this.$message({type:'warning',message:code.message||code});
                        })
                    }
                })
            },
            close_dialog(){
                this.form = {
                    name:'',
                    leader_id:'',
                    status:0,
                    type:0,
                    pid:0,
                    is_bottom:0,
                }
            },
            open(){
                if(this.id){
                    this.edit_department();
                }
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
                    return '添加部门'
                }else{
                    return '编辑部门'
                }
            }
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
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        }
    }
</script>