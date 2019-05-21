<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="210px"
                 ref="lookData">
            <el-form-item label="Payoneer邮箱：">
                <el-col :span="16">
                    <span>{{lookData.account_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="密码：">
                <el-col :span="16">
                    <span>*******</span>
                </el-col>
            </el-form-item>
            <el-form-item label="注册名称：">
                <el-col :span="16">
                    <span>{{lookData.registered_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="公司名称：">
                <el-col :span="16">
                    <span>{{lookData.company_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账户持有人：">
                <el-col :span="16">
                    <span>{{lookData.belong}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="电话号码：">
                <el-col :span="16">
                    <span>{{lookData.phone}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="生日：">
                <el-col :span="16">
                    <span>{{lookData.birthday}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="客户ID：">
                <el-col :span="16">
                    <span>{{lookData.client_code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="密保答案：">
                <el-col :span="16">
                    <span>*******</span>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：">
                <el-col :span="16">
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
                Object.keys(this.addList).forEach(key=>{
                    this.addList[key] = "";
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
            lookData:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>