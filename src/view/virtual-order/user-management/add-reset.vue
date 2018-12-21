<template>
    <page-dialog title="重置密码" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="saveData"
                 label-width="190px">
            <el-form-item label="新密码：">
                <el-col :span="14">
                    <el-input v-model="saveData.new_pwd"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_user_save} from '@/api/api-user-management';

    export default{
        data(){
            return{
                show:this.value,

            }
        },
        methods:{
            open(){
            
            },
            cloce(){
                this.saveData = {
                    new_pwd:'',
                    userId:row,
                }
            },
            keep(){
            	this.$http(api_user_save,this.saveData).then(res=>{
            	    this.show = false;
                    this.$message({type:'success',message: res.message});
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code});
                })
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            saveData:{
                required:true,
                type:Object,
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>