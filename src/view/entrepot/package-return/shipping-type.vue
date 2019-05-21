<template>
    <page-dialog title="选择邮寄方式"
                 size="small"
                 v-model="visible"
                 class="p-parcel-returned-manage"
                 :close-on-click-modal="false">
        <label-item label="新邮寄方式：">
                <el-select v-model="shippingAction.shipping_id">
                    <el-option v-for="(item, index) in shippingList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
        </label-item>
        <div slot="footer">
            <request-button req-key="queryAdd" @click="query">确定</request-button>
            <el-button size="mini" @click="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_shipping, api_post_waitreissued, api_batch_reissued} from '@/api/package-return'
    export default {
        data() {
            return {
                visible:false,
                shippingList:[]
            }
        },
        mounted(){},
        methods: {
            init_shipping(){
                this.$http(api_get_shipping, {warehouse_id:this.warehouse,country_code:this.shippingAction.country_code,number:this.shippingAction.number}).then(res=>{
                	res = res.map(row=>{
                        return {
                            label:`${row.carrier_name}>>${row.shipping_method_name}`,
                            value:row.shipping_id
                        }
                    });
                    this.shippingList = res;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            query(){
                if(this.isBatch){
                    let data = {
                        shipping_id:this.shippingAction.shipping_id,
                        ids:this.checkData
                    };
                    this.$http(api_batch_reissued, data).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                        this.$emit('visible',this.visible);
                        this.visible = false;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`queryAdd`, false);
                        },200);
                    });
                } else {
                    let data = {
                        shipping_id:this.shippingAction.shipping_id,
                    };
                    this.$http(api_post_waitreissued, this.shippingAction.id, data).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                        this.$emit('visible',this.visible);
                        this.visible = false;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`queryAdd`, false);
                        },200);
                    });
                }
            }
        },
        computed: {
           isBatch(){
               return this.shippingAction.value === 'batch_send';
           }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.init_shipping();
                    this.shipping_id = '';
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            warehouse:{},
            number:{},
            shippingAction:{},
            checkData:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>
