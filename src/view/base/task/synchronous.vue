<template>
    <page-dialog v-model="show" title="同步任务数据">
        <label-panel label="原redis">
            <el-form label-width="120px">
                <el-form-item label="地址：">
                    <el-input v-model="sip"></el-input>
                </el-form-item>
                <el-form-item label="端口：">
                    <el-input v-model="sport"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input v-model="spass"></el-input>
                </el-form-item>
            </el-form>
        </label-panel>
        <label-panel label="目标redis">
            <el-form label-width="120px">
                <el-form-item label="地址：">
                    <el-input v-model="dip"></el-input>
                </el-form-item>
                <el-form-item label="端口：">
                    <el-input v-model="dport"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input v-model="dpass"></el-input>
                </el-form-item>
            </el-form>
        </label-panel>
        <span slot="footer">
            <reuqest-button req-key='synchronous' @click="submit">提交</reuqest-button>
            <el-button @click.native="show=false">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_synchronous} from '../../../api/task';
    export default{
        data(){
            return{
                show:this.value,
                sip:'',
                sport:6379,
                spass:'',

                dip:'',
                dport:6379,
                dpass:''
            }
        },
        methods:{
            submit(){
                this.$confirm('目标redis上的任务会被原redis上的任务复盖, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        sip:this.sip,
                        sport:this.sport,
                        spass:this.spass,
                        dip:this.dip,
                        dport:this.dport,
                        dpass:this.dpass
                    };
                    this.$http(api_synchronous, params).then(res=>{
                        this.$message(res.message);
                        this.show =false;
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('synchronous', false);
                        }, 300)
                    })
                }).catch(() => {
                    this.$reqKey('synchronous', false);
                });
            }
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
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelPanel:require('../../../components/label-panel.vue').default
        }
    }
</script>