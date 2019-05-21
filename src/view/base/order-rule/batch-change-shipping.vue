<template>
    <page-dialog v-model="dialog" size="small"
                 @open="open"
                 height="350px"
                 title="批量修改运输方式"
                 :close-on-click-modal="false">
                <el-form label-width="140px" class="mt-lg">
                    <el-form-item label="统一修改运输方式为：" required>
                        <el-cascader
                                style="width:100%"
                                clearable
                                filterable
                                change-on-select
                                v-model="shipping"
                                expand-trigger="hover"
                                :options="shippingList"
                        ></el-cascader>
                    </el-form-item>
                </el-form>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_shipping} from '@/api/common';
    import {api_batch_shipping} from '@/api/order-rules';
    export default{
        data(){
            return{
                dialog:this.value,
                shippingList:[],
                shipping:[],
            }
        },
        methods:{
            open(){
                this.get_shipping();
            },
            get_shipping(){
                this.$http(api_get_shipping).then(res => {
                    let carrierId = res.map(row=>row.carrier_id);
                    let carrierIds = [...new Set(carrierId)];
                    this.shippingList = carrierIds.map(row=>{
                        let curObj = {};
                        let find = res.find(val=>val.carrier_id===row);
                        let children = res.filter(val=>val.carrier_id===row).map(val=>{
                            return {
                                value:val.shipping_method_id,
                                label:val.shortname
                            }
                        });
                        if(find){
                            curObj = {
                                value:row,
                                label:find.carrier_name,
                            }
                        }
                        if(children&&children.length>0){
                            this.$set(curObj,'children',children)
                        }
                        return curObj
                    });

                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            submit(){
                if(this.shipping.length<=0)return this.$message({type:'warning',message:'请选择运输方式!'});
                let length = this.shipping.length;
                this.$http(api_batch_shipping,{ids:this.ids,shipping_id:this.shipping[length-1]}).then(res => {
                    this.$message({type:'success',message:res.message||res});

                    let arr=this.shippingList.find(item=>{
                        return  item.value==this.shipping[0];
                    })
                    let arr2=arr.children.find(item=>{
                        return item.value==this.shipping[1];
                    })
                    this.$emit('changeShipping',arr2.label);
                    this.dialog = false;
                    this.$emit('close')
                }).catch(code => {
                    this.$message({type:'success',message:code.message||code});
                })
            },
            cancel(){
                this.dialog = false;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            ids:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
