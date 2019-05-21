<template>
    <page-dialog title="导出至富友" v-model="show" @close="close">
        <el-form ref="fuyouRate" :model="fuyouRate" :rules="rules" label-width="100px" class="mt-lg">
            <el-form-item label="请设置汇率：" prop="rate">
                <ui-limit-number v-model="fuyouRate.rate"
                                 style="width:400px;"
                                 :limit="2"
                                 :min="0"
                                 class="limit-input">
                </ui-limit-number>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="mini" @click="show = false">取 消</el-button>
            <el-button type="primary" size="mini" @click="export_sure('fuyouRate')">确定</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return{
                show:false,
                rules:{
                    rate:[
                        {required: true, message: '请设置汇率', trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        methods: {
            close(){
                this.fuyouRate.rate = '';
            },
            export_sure(fuyouRate){
                this.$refs[fuyouRate].validate((valid) => {
                    if(valid){
                        this.$emit('export_sure');
                    }else{
                        return false;
                    }
                })
            }
        },
        computed: {},
        props: {
            value:{},
            fuyouRate:{
                required:true,
                type:Object
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number').default,
        }
    }
</script>
