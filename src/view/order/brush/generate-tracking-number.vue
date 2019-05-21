<template>
    <div class="c-brush-shipments">
        <page-dialog :title="'生成虚拟跟踪号'" v-model="dialog" :close-on-click-modal="false" @open="open">
            <el-form :model="form" label-width="100px" ref="form" :rules="rules">
                <el-form-item label="平台：" prop="channel_id">
                    <el-select class="inline s-width-large"
                               v-model="form.channel_id"
                               placeholder="请选择/输入..."
                               filterable clearable>
                        <el-option
                            :key="item.value"
                            v-for="item in channelList"
                            :value="item.value"
                            :label="item.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货仓库：" prop="warehouse_id">
                    <super-select
                        storageKey="order_warehouse"
                        class="s-width-large"
                        v-model="form.warehouse_id"
                        v-sf.warehouse_id
                        :is-paging="true"
                        :options='warehouseList'
                    ></super-select>
                    <!--<el-select class="s-width-large"-->
                               <!--v-model="form.warehouse_id"-->
                               <!--filterable clearable>-->
                        <!--<el-option v-for="item in warehouseList"-->
                                   <!--:key="item.value"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item label="运输方式：" prop="shipping_id">
                    <ui-select  v-model="form.shipping_id"
                                class="generate-shipments-input"
                                remote
                                filterable
                                clearable
                                default-first-option
                                :remote-method="remoteMethod"
                                :placeholder="shippingPlaceholder"
                    >
                        <el-option v-for="item in shippingOptions"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="发货时间：" class="inline" prop="date_s">
                    <el-date-picker
                        v-model="form.date_s"
                        type="datetime"
                        class="inline"
                        :picker-options="inputTimeStart"
                        placeholder="开始时间">
                    </el-date-picker>
                    <span>--</span>
                    <el-date-picker
                        v-model="form.date_e"
                        type="datetime"
                        class="inline"
                        :picker-options="inputTimeEnd"
                        placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="generate_tracking">生成</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-brush-shipments{
        .generate-shipments-input{
            width:82%
            display:inline-block !important;
        }
        .cover-inline{
            display:block !important;
        }
    }
</style>
<script>
    import {api_get_channel,api_virtual_tracking_virtual_number,api_shipping_method} from '../../../api/order-local';
    import {api_get_warehouse} from '@/api/report-channel';
    export default {
        data() {
            return {
                dialog:false,
                shippingList:[],
                shippingOptions:[],
                rules:{
                    channel_id:[
                        {type:'number',required:true,message:"平台 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    warehouse_id:[
                        {type:'number',required:true,message:"发货仓库 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    shipping_id:[
                        {type:'number',required:true,message:"运输方式 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    date_s:[
                        {type:'date',required:true,message:"发货开始时间 为必填项，请补充完整",trigger:"blur change"}
                    ],
                    date_e:[
                        {type:'date',required:true,message:"发货结束时间 为必填项，请补充完整",trigger:"blur change"}
                    ],
                },
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.form.date_e) {
                            return time.getTime() > this.form.date_e;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.form.date_s) {
                            return time.getTime() < this.form.date_s;
                        } else {
                            return false
                        }
                    }
                },//结束时间
                warehouseList:[],
                channelList:[],

            }
        },
        mounted(){
            this.warehouse_remote();
        },
        methods:{
            open(){
                this.get_channel();
                this.form.shipping_id='';
                this.form.channel_id='';
                this.form.warehouse_id='';
                this.form.date_s='';
                this.form.date_e=''
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
            generate_tracking(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let params = {
                            shipping_id:this.form.shipping_id,
                            channel_id:this.form.channel_id,
                            warehouse_id:this.form.warehouse_id,
                            date_s:datef("YYYY-MM-dd HH:mm:ss",this.form.date_s.getTime()/1000),
                            date_e:datef("YYYY-MM-dd HH:mm:ss",this.form.date_e.getTime()/1000),
                        };
                        this.$http(api_virtual_tracking_virtual_number,this.orderId,params).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            this.dialog = false;
                            this.$emit("generate",res);
                        }).catch(code=>{
                            this.$message({type:"success",message:code.message||code});
                        })
                    }
                })
            },
            warehouse_remote(){
                this.$http(api_get_warehouse).then(res=>{
                    res.forEach(row => {
                        this.warehouseList.push({label: row.name, value: row.id});
                    })
                });
            },
            /*平台*/
            get_channel() {
                this.$http(api_get_channel).then(res => {
                    let index=res.findIndex(row=>row.value===this.oldChannelId);
                    res.splice(index,1);
                    this.channelList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            get_shipping(channel_id,warehouse_id) {
                let data={
                    channel_id:channel_id
                };
                if (warehouse_id) {
                    data.warehouse_id=warehouse_id
                }
                this.$http(api_shipping_method,data).then(res => {
                    this.shippingList=this.fix_shipping_method(res);
                    this.shippingOptions = this.shippingList.length>100? this.shippingList.filter((row,index)=>index<100) : this.shippingList;
                }).catch(code => {
                    console.log(code);
                })
            },
            cancel(){
                this.dialog = false;
            }
        },
        computed:{
            shippingPlaceholder(){
                if (this.form.channel_id<=0) {
                    return '请选择平台'
                }else if (this.form.warehouse_id<=0) {
                    return '请选择发货仓库'
                }else if (this.form.shippingOptions<1){
                    return '该平台和仓库下无运输方式'
                }else{
                    return '输入可选更多数据'
                }
            },
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
            "form.channel_id"(val) {
                if (this.form.warehouse_id&&val) {
                    this.form.shipping_id='';
                    this.shippingOptions=[];
                    this.shippingList=[];
                    this.get_shipping(val,this.form.warehouse_id);
                }
            },
            'form.warehouse_id'(val){
                if (this.form.channel_id&&val) {
                    this.form.shipping_id='';
                    this.shippingOptions=[];
                    this.shippingList=[];
                    this.get_shipping(this.form.channel_id,val);
                }
            }
        },
        props:{
            value:{},
            title:{},
            orderId:{},
            oldChannelId:{},
            form:{
                required:true,
                type:Object
            },
        },

        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../src/api-components/param-account.vue').default,
            labelSelect: require('@/components/label-select').default,
            uiSelect: require('@/components/ui-select').default,
        }
    }
</script>
