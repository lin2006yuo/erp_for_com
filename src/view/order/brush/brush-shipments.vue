<template>
    <div class="c-brush-shipments">
        <page-dialog :title="title" v-model="dialog" :close-on-click-modal="false" @close="cancel" @open="open">
            <el-form :model="form" label-width="100px" ref="form" :rules="rules">
                <el-form-item label="跟踪号：" prop="synchronize_tracking_number">
                    <el-input class="shipments-input" v-model="form.synchronize_tracking_number"></el-input><el-button type="primary" size="medium" class="inline ml-sm" @click.native="generate_tracking">生成虚拟跟踪号</el-button>
                </el-form-item>
                <el-form-item label="运输方式：" prop="synchronize_shipping_id">
                    <ui-select  v-model="form.synchronize_shipping_id"
                                class="shipments-input"
                                remote
                                filterable
                                clearable
                                :remote-method="remoteMethod"
                                default-first-option
                                placeholder="输入可选更多数据...">
                        <el-option v-for="item in shippingOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </ui-select>
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
        <generate-tracking-number v-model="generateTracking" :form="generateTrackingForm" :order-id="orderId" :oldChannelId="oldChannelId" @generate="generate"></generate-tracking-number>
    </div>
</template>
<style lang="stylus">
.c-brush-shipments{
    .shipments-input{
        width:72%
        display:inline-block !important;
    }
    .cover-inline{
        display:block !important;
    }
}
</style>
<script>
    import {api_shipping_method,api_save_virtual_number,api_get_shipping} from '../../../api/order-local';
    export default {
        data() {
            return {
                dialog:false,
                generateData:'',
                generateTracking:false,
                rules:{
                    synchronize_shipping_id:[
                        {type:'number',required:true,message:"物流商 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    synchronize_tracking_number:[
                        {required:true,message:"跟踪号 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    synchronize_shipping_time:[
                        {type:'date',required:true,message:"发货时间 为必填项，请补充完整",trigger:"blur change" }
                    ],
                },
                shippingList:[],
                shippingOptions:[],
                generateTrackingForm:{
                    date_s:"",
                    date_e:"",
                    shipping_id:'',
                    warehouse_id:'',
                    channel_id:"",
                },
            }
        },
        created(){
           this.get_shipping();
        },
        methods:{
            open(){
                this.generateData='';
            },
            remoteMethod(query){
                if (query !== '') {
                    this.shippingOptions = this.shippingList.filter(item => {
                        return typeof query === 'string' ?item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1:item.value === query;
                    });
                } else {
                    this.shippingOptions = this.shippingList.length>100? this.shippingList.filter((row,index)=>index<100) : this.shippingList;
                }
            },
            fix_shipping_method(res){
                return res.map(row=>{
                    if(!row.shipping_method_id){console.log("row",row);}
                    return {
                        label:`${row.shortname}>>${row.carrier_name}`,
                        value:parseInt(row.shipping_method_id),
                    }
                })
            },
            save(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let params;
                        if (!!this.generateData){
                            params = {
                                synchronize_shipping_id:this.form.synchronize_shipping_id,
                                synchronize_tracking_number:this.form.synchronize_tracking_number,
                                synchronize_shipping_time:datef("YYYY-MM-dd HH:mm:ss",this.form.synchronize_shipping_time.getTime()/1000),
                                data:this.generateData,
                            }
                        } else{
                            params = {
                                synchronize_shipping_id:this.form.synchronize_shipping_id,
                                synchronize_tracking_number:this.form.synchronize_tracking_number,
                                synchronize_shipping_time:datef("YYYY-MM-dd HH:mm:ss",this.form.synchronize_shipping_time.getTime()/1000),
                                data:'',
                            };
                        }
                        this.$http(api_save_virtual_number,this.orderId,params).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            this.dialog = false;
                            this.$emit("save");
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message||code});
                        })
                    }else {
                        this.$message({type:"warning",message:"还有必填选项未被填写"})
                    }
                })
            },
            generate(val){
                this.generateData=val.data;
                this.$set(this.form,'synchronize_shipping_id',val.data.shipping_id);
                this.$set(this.form,'synchronize_tracking_number',val.data.shipping_number);
                this.$set(this.form,'synchronize_shipping_time',new Date());
            },
            generate_tracking(){
              this.generateTracking=true;
            },
            get_shipping() {
                this.$http(api_shipping_method).then(res => {
                    this.shippingList = this.fix_shipping_method(res);
                    this.shippingOptions = this.shippingList.length>100? this.shippingList.filter((row,index)=>index<100) : this.shippingList;
                }).catch(code => {
                    console.log(code);
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
            },
            oldChannelId:{}
        },

        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../src/api-components/param-account.vue').default,
            generateTrackingNumber:require('./generate-tracking-number.vue').default,
            labelSelect: require('@/components/label-select').default,
            uiSelect: require('@/components/ui-select').default,
        }
    }
</script>
