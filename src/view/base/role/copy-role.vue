<template>
    <page-dialog v-model="dialog" :title="`复制：${oldData.name} 角色`" @open="open">
        <div style="width:100%;text-align:center;margin-top:20px">
            <div>
                <label-item  class="required-sign" label="新角色名：">
                    <el-input v-model="newName" style="width:210px"></el-input>
                </label-item>
            </div>
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_copy_role} from '@/api/role';
    export default {
        data() {
            return {
                dialog:this.value,
                newName:''
            }
        },
        methods:{
            submit(){
                if(!this.newName)return this.$message({type:"warning",message:'新角色名为必填项！'});
                this.$http(api_copy_role,this.oldData.id,{name:this.newName}).then(res => {
                    this.dialog = false;
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('submit-copy-role',res.data);
                }).catch(code => {
                    console.log(code);
                    this.$message({type:"error",message:code.message||code});
                })
            },
            open(){
                this.newName = '';
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
            value:{},
            oldData:{
                required:true,
                type:Object
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,

        }
    }
</script>