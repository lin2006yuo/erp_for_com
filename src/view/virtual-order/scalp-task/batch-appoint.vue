<template>
    <div class="c-batch-allot">
        <page-dialog title="批量指定负责人" v-model="dialog" size="small" @open="open" :close-on-click-modal="false">
            <el-form :model="form" class="mt-lg" label-width="180px">
                <el-form-item label="选择负责人：">
                    <param-account
                        class="inline s-width-default"
                        ref="paramSale"
                        placeholder="可输入搜索..."
                        v-model="form.functionary_id"
                        :param="{type:'virtual',data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="virtual_fix_result"
                        type="memberShipVirtual"
                        url="get|virtual-order/principal-list">
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
import {api_virtual_order_mission_buyer} from '../../../api/scalp-task';
    export default {
        data() {
            return {
                dialog:false,
                form:{
                    functionary_id:"",
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
            open(){
                this.form.functionary_id = '';
            },
            submit(){
                if(this.form.functionary_id==='')return this.$message({type:'warning',message:'请选择买家！'});
                let params = clone(this.form);
                this.$set(params,'ids',JSON.stringify(this.ids));
                this.$http(api_virtual_order_mission_buyer,params).then(res=>{
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
            ids:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>
