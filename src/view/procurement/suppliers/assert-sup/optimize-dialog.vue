<template>
    <page-dialog title="修改优化专员"
                 v-model="addFormVisible"
                 center>
        <el-form :model="addData"
                 :rules="rules"
                 label-width="190px"
                 ref="addData"
                 class="mt-lg">
            <el-form-item label="修改优化专员为：" prop="supply_chain_specialist_id">
                <el-select v-model="addData.supply_chain_specialist_id"
                           remote
                           filterable
                           clearable
                           class="inline s-width-default"
                           default-first-option
                           placeholder="请选择/输入...">
                    <el-option v-for="(option,index) in optimizeList"
                               :key="index"
                               :label="option.label"
                               :value="option.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
            <request-button req-key="optimizeSpecialist" @click="add_ymx">确 定</request-button>
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
                    supply_chain_specialist_id:[
                        {required: true, message: '请选择优化专员', trigger: 'change',type:'number'}
                    ],
                }
            }
        },
        created(){
        },
        methods:{
            add_ymx(){//-------------点击保存
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        this.$emit('specialist-submit');//-------事件抛出
                    }else{
                        this.$reqKey('optimizeSpecialist', false);
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
            optimizeList: {required: true, type: Array},
            value:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
        }
    }
</script>
