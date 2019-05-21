<template>
    <page-dialog :title="batchTitle" v-model="show" size="small"
                 @close="close" :close-on-cilck-modal="false">
        <el-form :model="batchData"
                 :rules="rules"
                 label-width="190px"
                 ref="batchData">
            <el-form-item  label="系统状态：" prop="is_invalid">
                <el-col :span="14">
                    <el-select class="s-width-large"
                               v-model="batchData.is_invalid">
                        <el-option v-for="item in statusList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item  label="账号状态："  prop="site_status">
                <el-col :span="14">
                    <el-select class="s-width-large"
                               v-model="batchData.site_status">
                        <el-option v-for="item in accountStatus"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="downloadAdd" @click.native="keep" type="primary">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                statusList:[
                    {label:'请选择',value:''},
                    {label:'已启用',value:1},
                    {label:'已停用',value:0},
                ],
                show:this.value,
                accountStatus:[
                    {label:'请选择',value:''},
                    {label:'运营中',value:1},
                    {label:'冻结中',value:3},
                    {label:'申诉中',value:4},
                ],
                rules: {
                    // is_invalid: [
                    //     { required: true, message: '请选择系统状态', trigger: 'change',type:'number' },
                    // ],
                    // site_status: [
                    //     { required: true, message: '请选择账号状态', trigger: 'change' ,type:'number'},
                    // ],
                }
            }
        },
        methods:{
            close(){

            },
            keep(){
                // this.$refs['batchData'].validate((valid) => {
                //     if (valid){
                        this.$emit('set-clich',this.batchData);
                //     }else{
                //         this.$reqKey('downloadAdd',false)  ;
                //         this.$message({type:'warning',message:'还有选项未被选择,请选择完成后确认'})
                //     }
                // });
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
            batchData:{
                required:true,
                type:Object
            },
            value:{
                required:true,
                type:Boolean
            },
            batchTitle:{
                type:String
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
