<template>
    <div class="p-add-group">
        <page-dialog :title="titleName" v-model="formVisible" size="small" :close-on-click-modal="false">
            <el-form :model="groupForm" ref="groupForm" label-width="100px">
                <el-form-item label="分组标识：">
                    <el-input v-model="groupForm.name" style="width: 200px;"></el-input>
                </el-form-item>

                <el-form-item label="分组标题：">
                    <el-input v-model="groupForm.title" style="width: 200px;"></el-input>
                </el-form-item>

                <el-form-item label="排序：">
                    <el-input v-model="groupForm.sort" style="width: 100px;"></el-input>
                </el-form-item>

                <el-form-item label="状态：">
                    <el-radio-group v-model="groupForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <permission tag="request-button" reqKey="addGroup" :route="apis.url_args_add"
                          @click="submit" v-if="markId==0">确定</permission>
              <permission tag="ElButton" :route="apis.url_args_update" reqKey="updateGroup"
                          @click="update" v-else>确定</permission>
                <el-button size="mini" @click.native="formVisible = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue'
    import {args_add,args_update,url_args_add,url_args_update} from '../../../../api/system'
    export default{
        permission:{
          url_args_add,
          url_args_update
        },
        data(){
            return {
                formVisible:false
            }
        },
        methods: {
            submit(){
                this.$http(args_add,this.groupForm).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.formVisible = false;
                    this.$emit('submit')
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                }).finally(()=>{
                    this.$reqKey('addGroup',false)
                })
            },
            update(){
                this.$http(args_update,this.markId,this.groupForm).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.formVisible = false;
                    this.$emit('submit')
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                }).finally(()=>{
                    this.$reqKey('updateGroup',false)
                })
            }
        },
        watch: {
            value(val){
                this.formVisible = val;
            },
            formVisible(val){
                this.$emit('input',val)
            }
        },
        props: {
            value:{},
            groupForm:{},
            titleName:{},
            markId:{}
        },
        components: {
            pageDialog
        }
    }
</script>
