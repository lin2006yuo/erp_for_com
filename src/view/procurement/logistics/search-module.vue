<template>
    <el-card>
        <el-form :model="searchData" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="采购单ID：" prop="name">
                <el-input v-model="searchData.purchase_id" class="inline width-lg" autofocus @keyup.enter.native="search"></el-input>
                <request-button :request="search" :mintime="200" req-key="search_purchase_id" class="inline ml-sm">查询</request-button>
            </el-form-item>
            <el-form-item label="外部流水号：" prop="region">
                <el-input v-model="searchData.external_number" class="inline width-lg"></el-input>
            </el-form-item>
            <el-form-item label="运费：">
                <span>{{searchData.shipping_cost|filterCost}}</span>
            </el-form-item>
            <el-row v-for="(item,index) in searchData.logistics" :key="index">
                <el-col :span="4">
                    <el-form-item label="运输方式：" class="inline" prop="logistics_company_name" required>
                        <span v-if="isEdit">
                            <allow-create-select v-model="item.logistics_company_name"
                                                 :disabled="item.is_from_input === 0"
                                                 class="s-width-default">
                            </allow-create-select>
                        </span>
                        <span v-if="!isEdit">{{item.logistics_company_name}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="运单号：" prop="logistics_bill_no" required>
                        <el-input v-model="item.logistics_bill_no"
                                  :disabled="item.is_from_input === 0"
                                  class="inline width-lg"
                                  v-if="isEdit"></el-input>
                        <span v-if="!isEdit">{{item.logistics_bill_no}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="发货时间：">
                        <el-date-picker
                            v-if="isEdit"
                            v-model="item.delivered_time"
                            :disabled="item.is_from_input === 0"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerArriveDate">
                        </el-date-picker>
                        <span v-if="!isEdit">{{item.delivered_time | timeFilter}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="预计到达日期：" class="inline">
                        <el-date-picker
                            v-if="isEdit"
                            v-model="item.expect_arrive_date"
                            :disabled="item.is_from_input === 0"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerArriveDate">
                        </el-date-picker>
                        <span v-if="!isEdit">{{item.expect_arrive_date | timeFilter}}</span>
                    </el-form-item>
                    <div class="mt-mini inline" @click="add_way">
                        <img src="../../../assets/add2.png" style="vertical-align: sub;" v-if="isEdit">
                    </div>
                    <div class="mt-mini inline" @click="delete_tracks(index)" v-if="searchData.logistics.length > 1 && isEdit">
                        <img src="../../../assets/delete(2).png">
                    </div>
                </el-col>
            </el-row>
            <el-form-item>
                <div v-if="!isEdit">
                    <el-button type="primary" size="mini" @click="auto_swoop">自动抓取</el-button>
                    <el-button type="primary" size="mini" @click="edit">手动填写</el-button>
                </div>
                <div v-if="isEdit">
                    <el-button type="primary" size="mini" @click="save">确定</el-button>
                    <el-button type="primary" size="mini" @click="cancel">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_tracking_number, api_get_logistics, api_update_logistics} from "../../../api/purchase"
    import {chinese} from '../../../define/validator_reg'
    export default {
        data() {
            var checkChinese = (rule, value, callback) => {
                setTimeout(() => {
                    if (chinese.test(value)) {
                        callback(new Error('请不要输入中文'));
                    }else{
                        callback();
                    }
                });
            };
            return {
                searchData:{
                    purchase_id:'',
                    external_number:'',
                    shipping_cost:'',
                    logistics:[],
                },
                rules:{},
                clone_logistics:[],
                isEdit:false,
                pickerArriveDate:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                trackingNumberData:[]
            }
        },
        filters:{
            filterCost(val){
                if(Number(val)>0){
                    return Number(val).toFixed(3);
                }else{
                    return val;
                }
            },
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val/1000);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            search(){
                if(!this.searchData.purchase_id.trim()){
                    this.$reqKey('search_purchase_id',false);
                    this.$message({type:'error',message:'请填写采购单ID'});
                    return
                }
                this.searchData.external_number = '';
                this.searchData.shipping_cost = '';
                this.searchData.logistics.length = 0;
                return this.$http(api_get_logistics, {id:this.searchData.purchase_id}).then(res=>{
                    this.searchData.external_number = res.external_number;
                    if(!!res.shipping_cost){
                        res.shipping_cost = 0;
                    }
                    this.searchData.shipping_cost = res.shipping_cost;
                    this.searchData.logistics = res.data.map(row=>{
                        row.delivered_time = row.delivered_time * 1000;
                        row.expect_arrive_date = row.expect_arrive_date * 1000;
                        this.$set(row, 'external_number', this.searchData.external_number);
                        return row;
                    });
                    this.clone_logistics = clone(this.searchData.logistics);
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('search_purchase_id',false);
                    },200);
                });
            },
            save(){
                if(!this.searchData.purchase_id.trim()){
                    this.$message({type:"error",message:'请输入采购单id'});
                    return false;
                }
                let logistics = clone(this.searchData.logistics).map(row=>{
                    row.delivered_time = row.delivered_time / 1000;
                    row.expect_arrive_date = row.expect_arrive_date / 1000;
                    return row;
                });
                let data = {
                    id:this.searchData.purchase_id,
                    shipping_cost:this.searchData.shipping_cost,
                    external_number:this.searchData.external_number.trim(),
                    logistics:logistics
                };
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.$http(api_update_logistics, this.searchData.purchase_id.trim(), data).then(res=>{
                            if(res.status === 200){
                                this.isEdit = false;
                                this.$emit('save', clone(this.searchData));
                                this.$message({type:"success",message:res.message || res});
                            } else {
                                this.$message({type:"error",message:res.message || res});
                            }
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message || code});
                        });
                    }
                });
            },
            delete_tracks(index){
                this.searchData.logistics.splice(index,1);
            },
            add_way(){
                this.searchData.logistics.push({
                    logistics_company_name:'',
                    purchase_id:this.searchData.purchase_id,
                    external_number:this.searchData.external_number,
                    logistics_bill_no:'',
                    delivered_time:'',
                    expect_arrive_date:''
                })
            },
            edit(){
                this.isEdit = true;
                if(this.searchData.logistics.length === 0){
                    this.add_way();
                }
            },
            cancel(){
                this.searchData.logistics = clone(this.clone_logistics);
                this.isEdit = false;
            },
            auto_swoop(){

            },
            hand_swoop(){
                this.isEdit = true;
            },
            //获取网络下单运单号
            get_tracking_number(){
                this.$http(api_get_tracking_number,{external_number:this.lookData.external_number}).then(res =>{
                    this.trackingNumberData = res.data;
                    if(res.status === 200){
                        this.$message({type:'success',message:`获取运单号成功!`});
                    }else{
                        this.$message({type:'error',message:res.message || res});
                    }
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
        },
        watch: {},
        computed:{},
        props: {},
        components: {
            labelItem:require('../../../components/label-item').default,
            allowCreateSelect: require('../../../components/allow-create-select.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        }
    }
</script>
