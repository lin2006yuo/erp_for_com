<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="210px"
                 ref="lookData">
            <el-form-item label="服务器IP地址：">
                <el-col :span="14">
                    <span>{{lookData.ip_address}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="登录邮箱：">
                <el-col :span="14">
                    <span>{{lookData.wf_account}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="登录密码：">
                <el-col :span="14">
                    <span>*******</span>
                </el-col>
            </el-form-item>
            <el-form-item label="密保答案：">
                <el-col :span="14">
                    <span>*******</span>
                </el-col>
            </el-form-item>
            <el-form-item label="持有人姓名：">
                <el-col :span="14">
                    <span>{{lookData.belong}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：">
                <el-col :span="14">
                    <span>{{lookData.operator}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.lookData).forEach(key=>{
                    this.lookData[key] = "";
                });
            },
            keep(){

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
            title:{},
            lookData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>