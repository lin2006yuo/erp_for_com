<template>
    <div class="p-search-purchase">
        <search-card @search="search_list" :params="searchData" :clears="clears" @init-params="clearsData">
            <label-buttons class="inline btn-ml mr-sm" :buttons="buttons" label="采购状态：" @select="select_status"
                           title="请选择状态"></label-buttons>
            <label-buttons class="inline btn-ml mr-sm" :buttons="audit_status" label="审核状态：" @select="audit_select"
                           v-if="searchData.status===15" title="请选择审核状态"></label-buttons>
            <label-buttons class="inline btn-ml mr-sm" :buttons="applyBtn" label="付款申请状态：" @select="apply_select"
                           title="请选择付款申请状态"></label-buttons>
            <label-buttons class="inline btn-ml" :buttons="paymentBtn" label="付款状态：" @select="payment_select"
                           title="请选择付款状态"></label-buttons>
           <div class="el-row mb-mini">
               <el-select v-sf.snType v-model="searchData.snType" class="inline s-width-default" @change="change_label">
                   <el-option
                       :key="item.value"
                       v-for="item in selectList1"
                       :label="item.label"
                       :value="item.value">
                   </el-option>
               </el-select>
               <order-input v-if="notIsSPU" v-model="searchData.snText"
                            class="inline width-super"
                            v-sf.snText
                            @keydown="search_list"
                            placeholder="可批量搜索，Shift+回车换行..."></order-input>
               <el-input v-else v-sf.snText v-model="searchData.snText" :placeholder="`请输入${changeLabel}...`"
                         class="inline width-super"></el-input>
               <el-select  v-model="staff_type" class="s-width-default inline ml-sm" @change="change_buyer_brand">
                   <el-option v-for="item in buyerBrand" :key="item.value" :value="item.value"
                              :label="item.label"></el-option>
               </el-select>
               <!--采购员-->
               <el-select v-model="searchData.purchase_user_id"
                          v-if="staff_type==='purchaser'"
                          v-sf.purchase_user_id
                          filterable
                          remote
                          multiple
                          class="inline self-width s-width-large"
                          placeholder="请选择/输入...">
                   <el-option v-for="(option,index) in purchase_staffs_list"
                              :key="index"
                              :label="option.label"
                              :value="option.value">
                   </el-option>
               </el-select>
               <!--供应链专员-->
               <el-select v-model="searchData.supply_chain_specialist"
                          v-if="staff_type==='supply_chain_specialist'"
                          v-sf.supply_chain_specialist
                          filterable
                          multiple
                          remote
                          class="inline self-width s-width-large"
                          placeholder="请选择/输入...">
                   <el-option v-for="option in chainSpecialist"
                              :key="option.value"
                              :label="option.label"
                              :value="option.value">
                   </el-option>
               </el-select>
               <label class="inline ml-sm" title="请选择供应商"> 供应商：</label>
               <super-select class="inline s-width-default"
                             v-sf.supplier_id
                             v-model="searchData.supplier_id"
                             storageKey="virtual_supplier_packing"
                             :options="supplierList">
               </super-select>
               <label class="ml-sm" title="请选择采购仓库"> 采购仓库：</label>
               <el-select v-sf.warehouse_id
                          v-model="searchData.warehouse_id"
                          placeholder="请选择"
                          multiple
                          filterable
                          class="inline self-width s-width-large">
                   <el-option
                       :key="item.id"
                       v-for="item in depots"
                       :label="item.name"
                       :value="item.id">
                   </el-option>
               </el-select>
               <label class="ml-sm" title="请选择异常类型">采购异常：</label>
               <el-select v-sf.purchase_execept_type
                          v-model="searchData.purchase_execept_type"
                          filterable
                          multiple
                          class="inline self-width s-width-large">
                   <el-option
                       :key="item.value"
                       v-for="item in selectList2"
                       :label="item.label"
                       :value="item.value">
                   </el-option>
               </el-select>
               <label class="ml-sm">采购类型：</label>
               <el-select v-sf.purchase_plan_type v-model="searchData.purchase_plan_type" class="inline s-width-default">
                   <el-option v-for="item in purchaseType"
                              :key="item.value"
                              :value="item.value"
                              :label="item.name">
                   </el-option>
               </el-select>
           </div>
            <div class="mb-mini">
                <label class="inline" title="请选择结算方式">结算方式：</label>
                <el-select class="inline self-width s-width-large"
                           v-sf.balance_type
                           v-model="searchData.balance_type"
                           filterable
                           multiple>
                    <el-option
                        v-for="item in balanceList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
                <label class="inline ml-sm"> 有无运单号：</label>
                <el-select v-sf.has_logistics v-model="searchData.has_logistics" class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in hasLogistics"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm"> 是否接收：</label>
                <el-select v-sf.is_received v-model="searchData.is_received" class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in isReceived"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm" title="是否贴标/套袋"> 是否贴标/套袋：</label>
                <el-select v-model="searchData.label_deck"
                           v-sf.label_deck
                           placeholder="请选择"
                           filterable
                           multiple
                           class="inline self-width s-width-large">
                    <el-option :key="item.value"
                               v-for="item in labelDeck"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="是否是能退货"> 是否能退货：</label>
                <el-select v-model="searchData.return_goods"
                           v-sf.return_goods
                           placeholder="请选择"
                           filterable
                           class="inline s-width-small">
                    <el-option :key="item.value"
                               v-for="item in returnGoods"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-sf.unfinished v-model="searchData.unfinished" class="inline ml-sm s-width-self">
                    <el-option
                        :key="item.value"
                        v-for="item in selectFinish"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <integer-zero-input
                    type="number"
                    clearable
                    :min="0"
                    v-model="searchData.unfinished_day_min"
                    class="inline s-width-small ml-xs">
                </integer-zero-input>
                <span>&nbsp;~</span>
                <integer-zero-input
                    clearable
                    type="number"
                    :min="0"
                    v-model="searchData.unfinished_day_max"
                    class="inline s-width-small ml-xs">
                </integer-zero-input>
            </div>
            <el-select v-sf.dateType v-model="searchData.dateType" placeholder="请选择" class="inline s-width-small mt-mini">
                <el-option
                    :key="item.value"
                    v-for="item in dataT"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker type="date" placeholder="开始时间" v-sf.date_b v-model="searchData.date_b"
                            :picker-options="pickerstart" class="inline date"></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-sf.date_e v-model="searchData.date_e"
                            :picker-options="pickerend" class="inline date mr-sm"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-search-purchase {
        .el-card {
            overflow: inherit;
            .mar_left {
                margin-left: 20px;
            }
            .self-width .el-select__tags{
                height: 30px!important;
                width: 208px
                overflow-y: auto;
                >span{
                    white-space: inherit;
                }
            }
        }
    }
</style>
<script>
    import labelButtons from '../../../components/label-all-buttons.vue'
    import {publish_edit_depot, publish_edit_user,api_get_purchaser_staffs} from "../../../api/purchase"
    import {api_get_balance,api_supply_chain_specialist,api_get_supply_chain_department_id,} from '../../../api/assert-sup';
    import {api_pack_getSupplier} from '../../../api/pack';

    export default {
        page: {
            devinfo: {
                frontEnd: '张兵根;张明亮;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-1-10',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b
                        } else {
                            return false
                        }
                    }
                },
                buyers: [],
                supplierList: [],
                purchase_staffs_list: [],
                suppliers: [],
                chainSpecialist:[],
                staff_type:'purchaser',
                buyerBrand: [
                    {label: "采购员", value: "purchaser"},
                    {label: "供应链专员", value: "supply_chain_specialist"}
                ],
                dataT: [
                    {label: "采购时间", value: "purchase_time"},
                    {label: "预计到货", value: "expect_arrive_date"},
                    {label: "实际到货", value: "real_arrive_date"},
                ],
                purchaseList: [
                    {label: "采购异常", value: "purchase_execept_type"},
                    {label: "结算方式", value: "balance_type"}
                ],
                depots: [],
                buttons: [
                    {name: "全部", value: ''},
                    {name: "等待下单", value: 0},
                    {name: "等待到货", value: 10},
                    {name: "部分到货等待剩余", value: 11},
                    {name: "不等待剩余待审", value: 15},
                    {name: "部分到货不等待剩余", value: 20},
                    {name: "全部到货", value: 21},
                    {name: "作废待审", value: -11},
                    {name: "已作废", value: -1},
                ],
                returnGoods:[
                    {label:'请选择',value:''},
                    {label:'是',value:1},
                    {label:'否',value:2},
                ],
                selectFinish:[
                    {label:'下单未完结(天)', value:'order_unfinished'},
                    {label:'发货未完结(天)', value:'shipping_unfinished'},
                ],
                labelDeck:[
                    {label:'全部',value:''},
                    {label:'仅贴标',value:1},
                    {label:'仅套袋',value:2},
                    {label:'贴标和套袋',value:3},
                    {label:'都不支持',value:4},
                ],
                audit_status: [
                    {name: '全部', value: ''},
                    {name: '待审批', value: 1},
                    {name: '审批不通过', value: 3}
                ],
                hasLogistics: [
                    {name: '全部', value: ''},
                    {name: '有', value: 1},
                    {name: '无', value: 0}
                ],
                isReceived: [
                    {name: '全部', value: ''},
                    {name: '是', value: 1},
                    {name: '否', value: 0}
                ],
                purchaseType: [
                    {name: '全部', value: ''},
                    {name: '正常采购', value: 'normal_purchasing'},
                    {name: '供应商多送', value: 'purchase_order_overcharged'}
                ],
                applyBtn: [
                    {name: "全部", value: ''},
                    {name: "未申请付款", value: 1},
                    {name: "已申请付款", value: 2},
                    {name: "取消申请", value: 3},
                    {name: "财务驳回", value: 4}
                ],
                paymentBtn: [
                    {name: "全部", value: ''},
                    {name: "未付款", value: 7},
                    {name: "已付款", value: 8},
                    {name: "部分付款", value: 9},
                ],
                selectList1: [
                    {label: "采购单号", value: "purchase_order_code"},
                    {label: "SKU", value: "sku"},
                    {label: "采购计划编号", value: "purchase_plan_number"},
                    {label: "运单号", value: "tracking_number"},
                    {label: "外部流水账号", value: "external_number"},
                    {label: "SPU", value: "spu"},
                ],
                selectList2: [
                    {label: "全部", value: ""},
                    {label: "有不良品", value: "1"},
                    {label: "5天未完结", value: "2"},
                    {label: "10天未完结", value: "3"} ,
                    {label: "包裹丢失", value: "4"},
                    {label: "包裹找回无差异", value: "5"},
                    {label: "包裹找回有差异", value: "6"}
                ],
                selectList3: [
                    {label: "全部", value: ""},
                    {label: "货到付款", value: "1"},
                    {label: "款到发货", value: "2"},
                    {label: "定期结算", value: "3"},
                    {label: "周结", value: "4"},
                    {label: "半月结", value: "5"},
                    {label: "月结", value: "6"},
                ],
                changeLabel: "采购单号",
                balanceList: [],
                clears: {
                    snType:"purchase_order_code",
                    unfinished:"order_unfinished",
                    snText:"",
                    date_b:"",
                    date_e:"",
                    purchase_user_id:[],
                    supplier_id:'',
                    dateType:"purchase_time",
                    warehouse_id:[],
                    purchase_execept_type:[],
                    balance_type:[],
                    has_logistics:"",
                    is_received:"",
                    label_deck:[],
                    return_goods:'',
                    supply_chain_specialist:[],
                },
                initCount:0,
                chainDepartmentId:'',
            }
        },
        created() {
            this.purer_init();
            this.depot_init();
            this.get_balance();
            this.get_supply_chain_specialist_id();
            this.get_purchase_staffs();//采购员
        },
        mounted() {
            this.get_packing_supplier();
        },
        computed: {
            notIsSPU() {
                return this.searchData.snType.toUpperCase() !== 'SPU'
            }
        },
        methods: {
            get_packing_supplier() {
                this.$http(api_pack_getSupplier).then(res=>{
                    this.supplierList = res.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_purchase_staffs() {//获取采购员
                this.$http(api_get_purchaser_staffs).then(res => {
                    this.purchase_staffs_list = res.map(item => {
                        return {
                            label: item.realname,
                            value: item.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            /*清除搜索*/
            clearsData(){
                this.staff_type='purchaser';
            },
            init_status_btn() {
                let curBtn = this.buttons;
                let statusesBtn = this.audit_status;
                let applyBtn = this.applyBtn;
                let paymentBtn = this.paymentBtn;
                this.buttons = [];
                this.audit_status = [];
                this.applyBtn = [];
                this.paymentBtn = [];
                this.$nextTick(() => {
                    this.buttons = curBtn;
                    this.audit_status = statusesBtn;
                    this.applyBtn = applyBtn;
                    this.paymentBtn = paymentBtn;
                });
            },
            change_label(val) {
                let find = this.selectList1.find(res => {
                    return res.value === val;
                });
                if (!!find) {
                    this.changeLabel = find.label;
                }
            },
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            select_status(index,item) {
                this.searchData.status = item.value;
                this.initCount++;
                if(this.initCount>3)
                this.$emit("search");
            },
            apply_select(index,item) {
                this.searchData.payment_apply_status = item.value;
                this.initCount++;
                if(this.initCount>3)
                this.$emit("search");
            },
            payment_select(index,item) {
                this.searchData.payment_status = item.value;
                this.initCount++;
                if(this.initCount>3)
                this.$emit("search");
            },
            audit_select(index,item) {
                this.searchData.partial_arrival_status = item.value;
                this.initCount++;
                if(this.initCount>4)
                this.$emit("search");
            },
            search_list() {
                if(this.searchData.unfinished_day_max && this.searchData.unfinished_day_min && (Number(this.searchData.unfinished_day_max) < Number(this.searchData.unfinished_day_min))){
                    this.$message({type: 'info', message: '下单未完成或发货未完结最小值不能大于最大值'});
                    return;
                }
                this.$emit("search");
            },
            /*切换采购员/供应链专员*/
            change_buyer_brand(val){
                if (val==='supply_chain_specialist') {
                    this.searchData.purchase_user_id=[];
                }else{
                    this.searchData.supply_chain_specialist=[]
                }
            },
            //  获取所有采购人员
            purer_init() {
                this.buyers = [];
                this.$http(publish_edit_user).then(res => {
                    this.buyers = res;
                    this.buyers.unshift({realname: "全部", id: ""})
                }).catch(code => {
                    console.log(code)
                })
            },
            /*供应链专员*/
            get_supply_chain_specialist_id(){
                this.$http(api_get_supply_chain_department_id).then(res => {
                    this.chainSpecialist = res.map(row=>{return {value:row.id,label:row.realname}});
                }).catch(code => {
                    console.log(code);
                })
            },
            //获取所有仓库
            depot_init() {
                this.$http(publish_edit_depot).then(res => {
                    this.depots = res;
                    this.depots.unshift({name: "全部", id: ""})
                }).catch(code => {
                    console.log(code)
                })
            }

        },
        props: {
            searchData: {
                required: true,
                type: Object
            }
        },
        components: {
            labelButtons,
            supplier: require('../../../api-components/supplier.vue').default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require('../../../components/order-input').default,
            integerZeroInput:require('@/components/integer-zero-input').default,
        }
    }
</script>
