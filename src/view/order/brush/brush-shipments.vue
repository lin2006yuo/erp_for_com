<template>
    <div class="c-brush-shipments">
        <page-dialog :title="title" v-model="dialog" :close-on-click-modal="false">
            <el-form :model="form" label-width="100px" ref="form" :rules="rules">
                <el-form-item label="物流方式：" prop="synchronize_shipping_id">
                    <param-account
                            ref="account"
                            class="cover-inline"
                            v-model="form.synchronize_shipping_id"
                            url="get|shipping-method/list-order"
                            type="shippingMethod"
                            :fix-result="fix_shipping_method"
                            placeholder="输入可选更多数据..."
                    ></param-account>
                </el-form-item>
                <el-form-item label="跟踪号：" prop="synchronize_tracking_number">
                    <el-input v-model="form.synchronize_tracking_number"></el-input>
                </el-form-item>
                <el-form-item label="发货时间：" prop="synchronize_shipping_time">
                    <el-date-picker
                            v-model="form.synchronize_shipping_time"
                            type="datetime"
                            placeholder="请选择发货日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="save">保存</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
.c-brush-shipments{
    .cover-inline{
        display:block !important;
    }
}
</style>
<script>
    import {api_brush_shipments,api_shipping_method} from '../../../api/order-local';
    export default {
        data() {
            return {
                dialog:false,
                rules:{
                    synchronize_shipping_id:[
                        {type:'number',required:true,message:"物流商 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    synchronize_tracking_number:[
                        {required:true,message:"跟踪号 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    synchronize_shipping_time:[
                        {type:'date',required:true,message:"发货时间 为必填项，请补充完整",trigger:"blur change"}
                    ],
                },
                shippingList:[]
            }
        },
        methods:{
            fix_shipping_method(res){
                return res.map(row=>{
                    if(!row.shipping_method_id){console.log("row",row);}

                    return {
                        label:`${row.shortname}>>${row.carrier_name}`,
                        value:row.shipping_method_id,
                    }
                })
            },
            save(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let params = {
                            synchronize_shipping_id:this.form.synchronize_shipping_id,
                            synchronize_tracking_number:this.form.synchronize_tracking_number,
                            synchronize_shipping_time:datef("YYYY-MM-dd HH:mm:ss",this.form.synchronize_shipping_time.getTime()/1000),
                        };

                        this.$http(api_brush_shipments,this.orderId,params).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            this.dialog = false;
                            this.$emit("save");
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message||code});
                        })
                    }
                })
            },
            cancel(){
                this.dialog = false;
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
        props:{
            value:{},
            title:{},
            orderId:{},
            form:{
                required:true,
                type:Object
            }
        },

        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../src/api-components/param-account.vue').default,
        }
    }
</script>