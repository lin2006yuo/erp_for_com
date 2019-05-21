<template>
    <page-dialog title="修改阿里账号"
                 v-model="addFormVisible"
                 center>
        <el-form :model="addData"
                 :rules="rules"
                 label-width="190px"
                 ref="addData"
                 class="mt-lg">
            <el-form-item label="修改阿里账号为：" prop="ali_account">
                <el-input v-model="addData.ali_account"  class="s-width-large"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
            <request-button req-key="aliAccount_assert_up" @click="add_ymx">确 定</request-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return{
                addFormVisible:this.value,
                rules:{
                    ali_account:[
                        {required: "true", message: '阿里账号输入内容不能为空', trigger: 'blur,change'}
                    ],
                }
            }
        },
        created(){
        },
        methods:{
            add_ymx(){
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        this.$emit('ali-account-submit');//-------事件抛出
                    }else{
                        this.$reqKey('aliAccount_assert_up', false);
                    }
                });
            },
        },
        computed:{},
        watch:{
            addFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.addFormVisible = val;
            }
        },
        props:{
            addData:{required:true, type:Object},
            value:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
        }
    }
</script>
