<template>
    <div class="c-batch-allot">
        <page-dialog title="指定买家" v-model="dialog" size="small" @open="open" :close-on-click-modal="false">
            <el-form :model="form" class="mt-lg" label-width="180px">
                <el-form-item label="选择买家：">
                    <el-select class="inline s-width-mini ml-sm mr-xs"
                               v-sf.snType
                               v-model="form.functionary_id">
                        <el-option v-for="item in buyerList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_virtual_order_mission_allocation} from '../../../api/scalp-task';
    export default {
        data() {
            return {
                dialog:false,
                form:{
                    functionary_id:"",
                }
            }
        },
        mounted(){

        },
        watch:{
           dialog(val){
              this.$emit("input",val);
           },
           value(val){
              this.dialog = val;
           }
        },
        methods:{
            open(){
                this.form.functionary_id = '';
            },
            submit(){
                if(this.form.functionary_id==='')return this.$message({type:'warning',message:'请选择负责人！'});
                let params = clone(this.form);
                this.$set(params,'ids',JSON.stringify([this.reqData.taskId]));
                this.$http(api_virtual_order_mission_allocation,params).then(res=>{
                    if(!res.code){
                        this.$message({type:"error",message:res.message||res});
                    }else{
                        this.$message({type:"success",message:res.message||res});
                    }
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            cancel(){
                this.dialog = false;
            },
            virtual_fix_result(val){
                return val.map(res=>{
                    return {
                        label:res.realname,
                        value:res.id
                    }

                });
            },
        },
        props:{
            value:{},
            reqData:{
                required:true,
                type:Object
            },
            buyerList:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>
