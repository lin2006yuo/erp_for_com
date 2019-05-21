<template>
    <div class="c-batch-allot">
        <page-dialog title="批量分配" v-model="dialog" size="small" :close-on-click-modal="false">
            <el-form :model="form" label-width="180px">
                <el-form-item label="虚拟订单类型：">
                    <el-radio class="radio" v-model="form.type" :label="0">内部订单</el-radio>
                    <el-radio class="radio" v-model="form.type" :label="1">外部订单</el-radio>
                </el-form-item>
                <el-form-item label="指定操作人：">
                    <param-account
                            class="inline width-super"
                            ref="paramSale"
                            placeholder="可输入搜索"
                            v-model="form.operator_id"
                            :param="{type:'virtual',data:{content:''}}"
                            :fixUrl="true"
                            :fixResult="virtual_fix_result"
                            type="memberShipVirtual"
                            url="get|user/:type/staffs">
                    </param-account>
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
import {api_batch_allot} from '../../../api/request-note';
    export default {
        data() {
            return {
                dialog:false,
                form:{
                    type:0,
                    operator_id:"",
                },
            }
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
            submit(){
                let params = clone(this.form);
                this.$set(params,'ids',this.ids);
                this.$http(api_batch_allot,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            cancel(){
                this.dialog = false;
            },
            virtual_fix_result(val){
                console.log(val);
            },

        },
        props:{
            value:{},
            ids:{
                required:true,
                type:Array
            },

        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>