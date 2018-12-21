<template>
    <page-dialog v-model="dialog"
                 title="编辑成员"
                 @open="open">
        <el-form :model="form" label-width="120px" class="mr-lg mt-sm">
            <el-form-item label="成员名称：">
                <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="上级部门：">
                <tree-dialog  v-model="form.pid"
                              :is-look="true"
                              :tree="superior"
                              :dbclick="true"
                              dialogSize="large" title="上级部门"></tree-dialog>
            </el-form-item>
            <el-form-item label="所属部门/组：">
                <!--<tree-dialog  v-model="form.id"-->
                              <!--:is-look="true"-->
                              <!--:tree="superior"-->
                              <!--:dbclick="true"-->
                              <!--dialogSize="large" title="上级部门"></tree-dialog>-->
            </el-form-item>
            <el-form-item label="工号：">
                <div>{{form.job_number}}</div>
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
            <el-button type="primary" size="mini"
                       @click.native="submit"
                       class="inline">确定</el-button>
            <el-button size="mini" @click.native="dialog = false"
                       class="inline" >取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_edit_target_user,api_develop_edit_user,api_update_target_user,api_develop_update_user} from '@/api/target-configure';
    export default{
        data(){
            return{
                dialog:this.value,
                form:{
                    name:'',
                    pid:'',
                    job_number:'',
                    status:0,
                },
                statusList:[
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
            }
        },
        methods:{
            submit(){
                let params= {
                    status:this.form.status
                };
                let url = this.curPage==='seller'?api_update_target_user:api_develop_update_user;
                this.$http(url,this.id,params).then(res => {
                    this.$message({type:'success',message:'更新成功'});
                    this.dialog = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            open(){
                this.edit();
            },
            edit(){
                let url = this.curPage==='seller'?api_edit_target_user:api_develop_edit_user;
                this.$http(url,this.id).then(res => {
                    this.form = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            curPage:{},
            value:{},
            id:{},
            superior:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            treeDialog:require('@/api-components/tree-dialog.vue').default,
        }
    }
</script>