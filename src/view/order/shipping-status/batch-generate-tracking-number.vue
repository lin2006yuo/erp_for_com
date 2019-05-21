<template>
    <div class="c-brush-shipments">
        <page-dialog :title="'批量生成虚拟跟踪号'" v-model="dialog" width="850px" :close-on-click-modal="false" @open="open">
            <el-form :model="form" label-width="200px" ref="form" :rules="rules">
                <el-form-item label="平台：" prop="channel_id">
                    <super-select
                        storageKey="order_channel"
                        class="inline s-width-large"
                        v-model="form.channel_id"
                        :placeholder="'请选择/输入...'"
                        :is-paging="true"
                        :options='channelList'
                    ></super-select>
                    <!--<el-select class="inline s-width-large"-->
                               <!--v-model="form.channel_id"-->
                               <!--placeholder="请选择/输入..."-->
                               <!--filterable clearable>-->
                        <!--<el-option-->
                            <!--:key="item.value"-->
                            <!--v-for="item in channelList"-->
                            <!--:value="item.value"-->
                            <!--:label="item.label"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item label="发货仓库：" prop="warehouse_id">
                    <super-select
                        storageKey="order_warehouse"
                        class="s-width-large mt-xs"
                        v-model="form.warehouse_id"
                        v-sf.warehouse_id
                        :is-paging="true"
                        :options='warehouseList'
                    ></super-select>
                    <!--<el-select class="s-width-large mt-xs"-->
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
                                class="batch-generate-shipments-input mt-xs"
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
                <el-form-item label="发货时间：" class="inline mt-xs" prop="date_s">
                    <el-date-picker
                        v-model="form.date_s"
                        type="datetime"
                        :picker-options="inputTimeStart"
                        placeholder="开始时间">
                    </el-date-picker>
                    <span>--</span>
                    <el-date-picker
                        v-model="form.date_e"
                        type="datetime"
                        :picker-options="inputTimeEnd"
                        placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-button type="primary" size="medium" class="inline ml-sm mt-xs" @click.native="batch_generate_tracking">批量生成</el-button>
            </el-form>
            <el-table class="mt-sm"
                      ref="tableData"
                      border :data="tableData"
                      highlight-current-row
                      v-resize="{height:120}"
                      v-loading="loading"
                      element-loading-text="玩命加载中...">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column label="订单号" min-width="50" inline-template>
                    <div class="p-table-list-td-text" :title="row.id">{{row.id}}</div>
                </el-table-column>
                <el-table-column label="运输方式" min-width="100" inline-template>
                    <div class="p-table-list-td-text" :title="row.synchronize_shipping_id">
                        <ui-select  v-model="row.synchronize_shipping_id"
                                    :disabled="!!row.data"
                                    @change="watch_change(row)"
                                    class="batch-generate-shipments-input"
                                    remote
                                    filterable
                                    clearable
                                    default-first-option
                                    placeholder="输入可选更多数据..."
                        >
                            <el-option v-for="item in shippingList"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </ui-select>
                    </div>
                </el-table-column>
                <el-table-column label="跟踪号物流商单号" min-width="80" inline-template>
                    <div class="p-table-list-td-text" :title="row.synchronize_tracking_number">
                        <el-input class="shipments-input"  :disabled="!!row.data"  @change="watch_change(row)" v-model="row.synchronize_tracking_number"></el-input>
                    </div>
                </el-table-column>
                <el-table-column label="发货时间" min-width="50" inline-template>
                    <div class="p-table-list-td-text" :title="row.synchronize_shipping_time">
                        <el-date-picker
                            v-model="row.synchronize_shipping_time"
                            @change="watch_change(row)"
                            class="inline"
                            type="datetime">
                        </el-date-picker>
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="save">保存</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-brush-shipments{
        .batch-generate-shipments-input{
            width:72%
            display:inline-block !important;
            input{
                width:370px;
            }
        }
        .cover-inline{
            display:block !important;
        }
    }
</style>
<script>
    import {api_get_channel,api_batch_virtual_tracking_virtual_number,api_shipping_method,api_batch_save_tracking_virtual_number} from '../../../api/order-local';
    import {api_get_warehouse} from '../../../api/common';
    export default {
        data() {
            return {
                dialog:false,
                loading: false,
                tableData:[],
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
                warehouseList:[],
                channelList:[],
                shippingList:[],
                shippingOptions:[],
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
                this.form.date_e='';
                this.tableData=this.orderId.map(row=>{
                    return {
                        id:row,
                        synchronize_shipping_id:'',
                        synchronize_tracking_number:'',
                        synchronize_shipping_time:'',
                        isRequire:false,
                        data:'',
                    }
                })
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
                        let data=[];
                        let noRequire=[];
                        this.tableData.forEach(row=>{
                            if (row.isRequire){
                                data.push(
                                    { id:row.id,
                                        synchronize_shipping_id:row.synchronize_shipping_id,
                                        synchronize_tracking_number:row.synchronize_tracking_number,
                                        synchronize_shipping_time:row.synchronize_shipping_time,
                                        data:row.data
                                    })
                            } else {
                                noRequire.push(row.id)
                            }
                        });
                        if (data.length){
                            let params = {
                                re_data:data
                            };
                            this.$http(api_batch_save_tracking_virtual_number,params).then(res=>{
                                if (res[0].failure===0){
                                    setTimeout(()=> {
                                        this.$message({type: "success", message: "保存成功"});
                                    },1000)
                                } else {
                                    if (res[0].failure!==0&&res[0].failure!==data.length&&data.length!==0){
                                        setTimeout(()=> {
                                            this.$message({type:"success",message:"成功保存"+res[0].success+"条"});
                                        },1000);
                                        setTimeout(()=>{
                                            this.$message({type:"warning",message:res[0].message});
                                        },2000)
                                    } else {
                                        setTimeout(()=> {
                                            this.$message({type:"warning",message:res[0].message});
                                        },1000)
                                    }
                                }
                                this.dialog = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message||code});
                            })
                        }else {
                            this.$message({type:"warning",message:"未填写完整的跟踪号信息！"})
                        }

                    }else {
                        this.$message({type:"warning",message:"还有必填选项未被填写"})
                    }
                })
            },
            batch_generate_tracking(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let params = {
                            order_ids:this.orderId,
                            condition:{
                                shipping_id:this.form.shipping_id,
                                channel_id:this.form.channel_id,
                                warehouse_id:this.form.warehouse_id,
                                date_s:datef("YYYY-MM-dd HH:mm:ss",this.form.date_s.getTime()/1000),
                                date_e:datef("YYYY-MM-dd HH:mm:ss",this.form.date_e.getTime()/1000),
                            }
                        };
                        this.$http(api_batch_virtual_tracking_virtual_number,params).then(res=>{
                            if (res[0].failure===0){
                                this.$message({type:"success",message:"生成成功"});
                            } else {
                                if (res[0].failure!==0&&res[0].failure!==this.tableData.length&&this.tableData.length!==0){
                                    this.$message({type:"success",message:"成功生成"+res[0].success+"条"});
                                    setTimeout(()=>{
                                        this.$message({type:"warning",message:res[0].message});
                                    },500)
                                } else {
                                    this.$message({type:"warning",message:res[0].message});
                                }
                            }
                            if (res[0].re_data.length){
                                res[0].re_data.forEach(row=>{
                                    row.shipping_time=new Date();
                                    this.tableData.forEach(item=>{
                                        if (Number(item.id) === Number(row.id)) {
                                            item.synchronize_shipping_id=row.shipping_id;
                                            item.synchronize_tracking_number=row.shipping_number;
                                            item.synchronize_shipping_time=new Date();
                                            item.data=row
                                        }
                                    })
                                })
                            }
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message||code});
                        })
                    }
                })
            },
            /*检测是否填入完整*/
            watch_change(row){
                row.isRequire=!!row.synchronize_shipping_id&&!!row.synchronize_tracking_number&&!!row.synchronize_shipping_time
            },
            warehouse_remote(){
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList=res;
                }).catch(code => {
                    console.log(code);
                });
            },
            /*平台*/
            get_channel() {
                this.$http(api_get_channel).then(res => {
                    let index=res.findIndex(row=>row.value===this.channelId);
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
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            },
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
            form:{
                required:true,
                type:Object
            },
            channelId:{}
        },

        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../src/api-components/param-account.vue').default,
            labelSelect: require('@/components/label-select').default,
        }
    }
</script>
