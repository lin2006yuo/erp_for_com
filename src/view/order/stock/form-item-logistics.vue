<template>
    <el-card>
        <div v-if="form.length<=0">
            暂未关联仓储物流信息.....
        </div>
        <el-form v-else ref="form" v-for="(item,index) in form"
                 :key="`${index}${item.buyer_selected_logistics}`"
                 label-width="100px"
                 :class="[index>0?'split-line':'','card']" >
            <div v-if="item.merge_message" class="ml-lg red">
                该包裹已经与其他订单[
                <template v-for="(it,itIndex) in item.merge_order_number">
                <span class="operate"
                      @click="message_detail(it)">{{it.order_number}}</span>
                    <span v-if="itIndex!==item.merge_order_number.length-1">,</span>
                </template>
                ]的包裹合并
            </div>
            <el-form-item label="买家选择物流：" :class="[index>0?'mt-xs':'']">
                <div>{{item.buyer_selected_logistics}}</div>
                <!--权限设置  -->
                <permission v-if="btnShow&&!shippingTime"
                            tag="ElButton"
                            :route="apis.url_keep_splitInfo"
                            type="primary"
                            size="mini"
                            class="fr mr-sm"
                            @click.native="split_package(item)">拆分包裹</permission>
                <permission v-if="btnShow&&!shippingTime"
                            tag="ElButton"
                            :route="apis.url_keep_mergeInfo"
                            type="primary"
                            size="mini"
                            class="fr mr-sm"
                            @click.native="merge_package">合并包裹</permission>
                <permission v-if="!!shippingTime&&isHold"
                            tag="ElButton"
                            :route="apis.url_order_hold_status"
                            type="primary"
                            size="mini"
                            class="fr"
                            @click.native="intercept_package(item)">拦截包裹</permission>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="优先配货：">
                        <div v-if="!edit">{{item.prior ? '优先' : '正常'}}</div>
                        <el-switch v-else v-model="item.prior"
                                   on-text="优先"
                                   off-text="正常"
                        >
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申报金额：">
                        <label class="inline">{{item.declared_currency_code}}</label>
                        <div class="inline">
                            {{item.declared_amount | retainDecimals}}
                            <!--<el-input v-else v-model="item.declared_amount" @blur="check_number(item.declared_amount)"></el-input>-->
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="发货仓库：">
                        <div v-if="!edit">{{item.warehouse_name}}</div>
                        <el-select v-else
                                   class="inline width-default"
                                   ref="warehouse"
                                   v-mouse-side.mousewheel="()=>{$refs.warehouse[0].visible=false}"
                                   v-model="item.warehouse_id"
                                   @change="change_warehouse(item)">
                            <el-option
                                :key="item.value"
                                v-for="item in warehouseList"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="运输方式：">
                        <div v-if="!edit">{{com_shipping_name(item)}}</div>
                        <el-select v-else-if="item.shippingList"
                                   class="inline width-default"
                                   ref="shippingName"
                                   v-mouse-side.mousewheel="()=>{$refs.shippingName[0].visible=false}"
                                   v-model="item.shipping_id"
                                   :placeholder="placeholder(item)"
                                   :disabled="item.shippingList.length<=0"
                                   filterable
                                   @change="set_valuation(item)">
                            <el-option
                                :key="res.shipping_id"
                                v-for="res in item.shippingList"
                                :value="res.value"
                                :label="res.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="订单估重：">
                        <div class="inline">
                            <div>{{item.estimated_weight | retainInt}}</div>
                            <!--<el-input v-else v-model="item.estimated_weight" class="width-default" :disabled="true"></el-input>-->
                        </div>
                        &nbsp;<label class="inline">g</label>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="估算运费：">
                        <label class="inline">{{item.estimated_currency_code}}</label>&nbsp;
                        <div class="inline">
                            <div>{{item.estimated_fee | retainDecimals}}</div>
                            <!--<el-input v-else v-model="item.estimated_fee" class="width-default" :disabled="true"></el-input>-->
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="跟踪单号：">
                        <a class="link" :href="`http://www.17track.net/zh-cn/track?nums=${item.shipping_number}`" target="_blank">{{item.shipping_number}}</a>
                        <!--<el-input v-else v-model="item.shipping_number" class="width-default" :disabled="true" @blur="check_chinese(item.shipping_number)"></el-input>-->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="包裹号：">
                        <span class="operate"
                              @click="click_number(item.number)">{{item.number}}</span>
                        <!--<el-input v-else v-model="item.number"-->
                                  <!--class="width-default"-->
                                  <!--:disabled="true"></el-input>-->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="重量：">
                        <div class="inline">
                            <div>{{item.package_weight | retainInt}}</div>
                            <!--<el-input v-else v-model="item.package_weight" class="width-default" disabled></el-input>-->
                        </div>
                        &nbsp;<label class="inline">g</label>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="运费：">
                        <label class="inline">{{item.shipping_currency_code}}</label>&nbsp;
                        <div class="inline">
                            <div>{{item.shipping_fee | retainDecimals}}</div>
                            <!--<el-input v-else v-model="item.shipping_fee" class="width-default" :disabled="true" @blur="check_number(item.shipping_fee)"></el-input>-->
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物流商称重：">
                        <div class="inline">{{item.providers_weight | retainInt}}</div>
                        <label class="inline">g</label>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物流商运费：">
                        <div class="inline">{{item.providers_currency_code}}&nbsp;{{item.providers_fee |
                        retainDecimals}}
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物流商单号：">
                        <div class="inline">{{item.process_code}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="包裹状态：">
                        <div class="inline" style="vertical-align: bottom;">{{item.package_status}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="deadline">
                <el-col :span="12">
                    <el-form-item label="剩余收货时间：" :title="filterCountDown==='已超时'?filterDeadline:''">
                        <div class="inline" style="color: red;vertical-align: bottom;">{{filterCountDown}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="">
                        <div class="inline">
                            <permission tag="ElButton"
                                        size="mini"
                                        :route="apis.url_orders_day_address"
                                        type="primary"
                                        :disabled="shippingTime>0"
                                        @click="aliExpressTimeDialog">延长收货时间
                            </permission></div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row v-if="showBtn">
            <el-col :span="24" class="t-right">
                <permission
                        v-if="!edit"
                        tag="ElButton"
                        :route="apis.url_update"
                        size="mini"
                        type="primary"
                        @click.native="do_edit"
                >编辑</permission>
                <div v-else>
                    <el-button size="mini" type="primary" @click.native="submit">确认</el-button>
                    <el-button size="mini" @click.native="cancel">取消</el-button>
                </div>
            </el-col>
        </el-row>
        <split-package v-model="splitDialog"
                       :id="id" :form="form"
                       :package-id="package_id"
                       :order-data="orderData"
                       :smalls="smalls"
                       :warehouseList="warehouseList"
                       @refresh="refresh_data"></split-package>
        <merge-package v-model="mergeDialog" :id="id" :form="form" :orders="orders" :warehouseList="warehouseList" @refresh="refresh_data"></merge-package>
        <intercept-package v-model="interceptVisable"  :package-id="package_id"></intercept-package>
        <prolong-dialog :title="`延长收货时间`" v-model="prolongAliExpress" :is-close="true"
                        @update-time="updateTime"></prolong-dialog>
    </el-card>
</template>
<style lang="stylus">
    .split-line{
        border-top: 2px dotted #ddd;
    }
    table {
        width: 100%;
    }
</style>
<script>
    import {api_update, api_get_warehouse, api_get_shipping,api_get_splitInfo,api_get_mergeInfo} from '../../../api/order-local';
    import {url_update,url_keep_mergeInfo,url_keep_splitInfo} from '../../../api/order-local';
    import {chinese,plus} from '../../../define/validator_reg';
    import {url_order_hold_status} from "../../../api/order-intercept";
    import {url_package} from "../../../api/shipment"
    export default{
        permission:{
            url_update,
            url_keep_splitInfo,
            url_keep_mergeInfo,
            url_order_hold_status,
            url_package
        },
        data(){
            return {
                edit: false,
                oldform: [],
                loadWarehouse: [],
                loadShipping: [],
                warehouseList: [],
                valuation: null,
                splitDialog: false,
                mergeDialog:false,
                interceptVisable:false,
                orderData:[],
                opened:false,
                packageId:"",
                mdfValue:false,
                mdfid:"",
                order_id:0,
                isEdit:{edit:false},
                hasAfterRemark:false,
                mdfTitle:"",
                mdfbtnShow:false,
                orders:[],
                smalls:[],
                informationVisble:false,
                parcelData:{},
                shippingData:{},
                is_init_warehouse:true
            }
        },
        mounted(){
            this.init_warehouse();
        },
        filters: {
            retainInt(val){
                return val&&val!=='0.000' ? parseInt(val): '--'
            },
            retainDecimals(val){
                return val ? parseFloat(val).toFixed(2) : '0.00';
            },
        },
        watch:{
            form(val){
                if(val instanceof Array){
                    val.forEach((row)=>{
                        this.init_shipping(row);
                    })
                }
            },
        },
        computed:{
            shippingTime(){
                if(!!this.newformData){
                    return this.newformData.shipping_time;
                }else{
                    return false;
                }
            },
            filterDeadline(){
                return datef('YYYY-MM-dd hh:mm:ss',this.deadline);
            },
            filterCountDown(){
                if(this.deadline*1000-this.now>0) {
                    let sec = this.deadline*1000 - this.now;
                    sec = Math.max(sec, 0);
                    let d = parseInt(sec / 1000 / 60 / 60 / 24, 10);
                    let h = parseInt(sec / 1000 / 60 / 60 % 24, 10);
                    let m = parseInt(sec / 1000 / 60 % 60, 10);
                    let s = parseInt(sec / 1000 % 60, 10);
                    `${m}`.length===1&&(m='0'+m);
                    `${s}`.length===1&&(s='0'+s);
                    return `${d}天${h}时${m}分${s}秒`;
                }else{
                    return '已超时'
                }
            },
            package_id(){
                return this.packageId
            },
            shippingTime(){
                if(!!this.newformData){
                    return this.newformData.shipping_time;
                }else{
                    return false;
                }
            },
            newformData(){
//            	console.log(this.formData)
            	return this.formData[this.id];
            }
        },
        methods: {
            updateTime(time) {
                let data = {order_ids: [this.id]};
                this.$http(api_orders_day_address, time, data).then(res => {
                    let errorData = res.data;
                    if (errorData.length > 0) {
                        let newDatas = [];
                        const h = this.$createElement;
                        //通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
                        for (let i in errorData) {
                            //将data数据push进newDatas数组中
                            newDatas.push(h('p', null, errorData[i]));
                        }
                        ;
                        this.$msgbox({title: '提示', type: 'error', message: h('div', null, newDatas) || code});
                    } else {
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            aliExpressTimeDialog() {
                this.prolongAliExpress = true;
            },
            click_number(val){
                if (this.$hasPermission(this.apis.url_package)) {
                    this.parcelData.id = val;
                    this.informationVisble = true;
                    let params = {
                        orderData:this.parcelData,
                        mdfId:val,
                        informationVisble:true,
                    };
                    this.$emit('click-number',params);
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            refresh_data(){
                this.$emit("refresh");
            },
            check_chinese(val){
                if(val) {
                    if (chinese.test(val)) this.$message({type: "warning", message: "跟踪单号不允许输入中文"})
                }
                return chinese.test(val);
            },
            check_number(val){
                if(val){
                    if(!plus.test(val))this.$message({type:"warning",message:"申报金额和运费只能输入非负数"});
                }
                return plus.test(val);
            },
            com_shipping_name(item){
                let cur = item.shipping_name;
                if(item.shippingList&&item.shippingList.length>0){
                    let curObj = item.shippingList.find(row=>{return row.value === item.shipping_id});
                    if(!!curObj) cur = curObj.label;
                }
                return cur;
            },
            cur_operate(){
                this.$emit("cur-operate");
            },
            message_detail(val){
                if(!val)return;
//                let orderId = item.merge_order_number.find(row=>{return row.order_number===val});
                this.mdfid = val.order_id;
                this.order_id = val.order_id;
                this.mdfTitle = `查看订单： ${val.order_number} 信息`;
                let params = {
                    mdfid:this.mdfid,
                    orderid:this.order_id,
                    mdfTitle:this.mdfTitle
                };
                this.$emit("message-detail",params);
            },
            merge_message(val){
                if(!val)return;
                let step1 = val.split("[");
                let step2 = step1[1].split("]");
                console.log(step2,'step2');
                return step2[0];
            },
            shipName(item){
                const shippings = item.shippingList || [];
                const shipping = shippings.find(row=>row.shipping_id === item.shipping_id);
                if(shipping){
                    return shipping.shipping_method_name;
                }else{
                    return  `Not Find ${item.shipping_id}`;
                }
            },
            warehouseName(item){
                const warehouse = this.warehouseList.find(row=>row.value === item.warehouse_id);
                if(warehouse){
                    return warehouse.label;
                }else{
                    return `not find ${item.warehouse_id}`;
                }
            },
            split_package(item){
                this.packageId=item.id;
                let parm={
                    package_id : item.id
                };
                this.$http(api_get_splitInfo,this.id,parm).then(res => {
                    this.orderData = res;
                    this.smalls = [];
                    this.smalls.push({
                        country_code:this.orderData.country_code,
                        order_number:this.orderData.order_number,
                        warehouse_id: this.orderData.warehouse_id,
                        shipping_id: this.orderData.shipping_id ||0,
                        shipping_name: this.orderData.shipping_name || this.shipping_id,
                        number:this.orderData.number,
                        detail:this.orderData.detail.map(row=>{
                            this.$set(row, 'sends', row.sku_quantity);
                            return row;
                        })
                    });
                    this.splitDialog = true;
                }).catch(code => {
                    if(code.code==="confirm"){
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$set(parm,"confirm",true);
                            this.$http(api_get_splitInfo,this.id,parm).then(res => {
                                this.$message({
                                    type:"success",
                                    message: res.message || res
                                });
                                this.$emit("refresh");
                            }).catch(code => {
                                this.$message({message: code.message || code, type: 'error'});
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '取消操作'
                            });
                        });
                    }else{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    }
                });
            },
            merge_package(){
                this.$http(api_get_mergeInfo,this.id).then(res => {
                    this.orders = res;
                    this.mergeDialog = true;
                }).catch(code => {
                    this.$message({
                        type:'error',
                        message: code.message || code
                    })
                });
            },
            intercept_package(item){
                this.packageId=item.id;
            	this.interceptVisable = true;
            },
            set_valuation(item){
                this.oldform.forEach(row=>{
                    if(row.id === item.id){
                        if(row.shipping_id === item.shipping_id){
                            item.shipping_number = row.shipping_number;
                            item.process_code = row.process_code;
                        } else {
                            item.shipping_number = '';
                            item.process_code = '';
                        }
                    }
                });
                item.shippingList.forEach(x => {
                    if(x.value === item.shipping_id){
                        this.valuation =  x.cny_amount;
                        this.$set(item,'shipping_name',x.label);
                    }
                });
                this.$set(item,'estimated_fee',this.valuation);
                this.$emit('set-valuation',item);
            },
//            获取仓库
            init_warehouse(){
                if(this.is_init_warehouse) {
                    this.is_init_warehouse = false;
                    this.$http(api_get_warehouse).then(res => {
                        this.warehouseList = res;
                    }).catch(code => {
                        console.log(code);
                    })
                }
            },
            change_warehouse(item){
                item.shipping_id = "";
                this.init_shipping(item);
            },
            init_shipping(item){
                if(item.warehouse_id!==0){
                    if(!this.shippingData[`${item.warehouse_id}${item.country_code}${item.id}`]) {
                        let params = {
                            warehouse_id: item.warehouse_id,
                            country_code: item.country_code,
                            package_id: item.id,
                        };
                        this.$http(api_get_shipping, params).then(res => {
                            this.shippingData[`${item.warehouse_id}${item.country_code}${item.id}`] = window.clone(res);

                            this.shipList = res.map(row=>{
                                return {
                                    label:`${row.carrier_name}>>${row.shipping_method_name}`,
                                    value:row.shipping_id,
                                    cny_amount:row.cny_amount,
                                }
                            });
                            this.$set(item, "shippingList", this.shipList);
                        }).catch(code => {
                            console.log(code);
                        })
                    }else {
                        let res = window.clone(this.shippingData[`${item.warehouse_id}${item.country_code}${item.id}`]);
                        this.shipList = res.map(row=>{
                            return {
                                label:`${row.carrier_name}>>${row.shipping_method_name}`,
                                value:row.shipping_id,
                                cny_amount:row.cny_amount,
                            }
                        });
                        this.$set(item, "shippingList", this.shipList);
                    }
                }
            },
            do_edit(){
                this.oldform = window.clone(this.form);
                this.edit = true;
            },
            submit_params(isTrue){
                Object.keys(this.form).forEach(key=>{
                    if(typeof this.form[key]==='string'){
                        this.form[key] = this.form[key].trim();
                    }
                });
                let cur = this.form.map(row=>{
                    return {
                        prior:row.prior,
                        warehouse_id:row.warehouse_id,
                        shipping_id:row.shipping_id,
                        estimated_fee:row.estimated_fee,
                        id:row.id,
                        shipping_fee:row.shipping_fee
                    }
                });
                let params = {
                    package_list:cur,
                };
                if(isTrue){
                    params.confirm = true;
                }

                this.$http(api_update,this.id,params).then(res=>{
                    this.$emit('submit', this.form);
                    this.$message(res.message);
                    this.edit = false;
                }).catch(code=>{
                    if(code.hasOwnProperty("code")&&code.code==="confirm"){
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.submit_params(true);
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }
                })
            },
            submit(){
                this.submit_params(false);
            },
            cancel(){
                for (let i in this.oldform) {
                    if (this.oldform.hasOwnProperty(i)) {
                        this.form[i] = this.oldform[i];
                        this.init_shipping(this.form[i]);
                    }
                }
                this.edit = false;
            },
            placeholder(item){
                if(item.shippingList.length<=0)return '暂无数据';
                return '请选择运输方式'
            }
        },
        props: {
            form: {
                required: true,
            },
            id: {},
            showBtn: {
                default(){
                    return true;
                }
            },
            formData:{},
            btnShow:{
                default(){
                    return false;
                }
            },
            isHold:{
                default(){
                    return false;
                }
            },
            deadline:{
                default(){
                    return ''
                }
            }
        },
        components: {
            selectRemote: require('../../../components/select-remote.vue').default,
            labelSelect: require('../../../components/label-select.vue').default,
            splitPackage: require('../../entrepot/package/split/split-package.vue').default,
            mergePackage: require('../../entrepot/package/merge/merge-package.vue').default,
            interceptPackage:require('../../entrepot/package/intercept/index.vue').default,
            prolongDialog: require('../local/prolong-dialog').default,
        }
    }
</script>
