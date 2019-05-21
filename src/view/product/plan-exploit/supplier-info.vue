<template>
    <el-form label-width="82px" class="p-supplier-plan">
        <el-form-item label="供应商：" required>
            <supplier class="inline" v-if="!isAddSuppler" v-model="supplierId"></supplier>
            <el-input class="inline" v-else></el-input>
            <el-button class="inline" type="primary" size="mini" @click="is_add_suppler" :disabled="!isDisposeEdit">增加
            </el-button>
        </el-form-item>
        <add
            v-model="addDialog"
            :add-form="addForm"
            @save="save"
            :balance-list="balanceList"
            @select-province="select_province"
            @select-city="select_city"
        ></add>
        <div class="mb-sm">
            <label>采购价：</label>
            <el-input class="inline" style="width: 150px;"
                      v-model="supplierInfo.price"></el-input>
            <label>最小起定量：</label>
            <el-input class="inline" style="width: 150px;"
                      v-model="supplierInfo.moq"></el-input>
        </div>
        <div class="mb-sm">
            <label>交期仓库：</label>
            <el-input class="inline" style="width: 150px;"
                      v-model="supplierInfo.safe_warehouse_id "></el-input>
            <label style="width: 80px;display: inline-block"> 安全交期：</label>
            <el-input class="inline" style="width: 150px;"
                      v-model="supplierInfo.delivery_days "></el-input>
        </div>
        <div class="mb-sm">
            <label>结算方式：</label>
            <el-select v-model="supplier.balance_type" class="inline" style="width: 150px;">
                <el-option v-for="(item, index) in balance_type_arr" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="mb-sm">
            <label>联系人：</label>
            <span class="inline" style="width: 150px;">{{supplier.contacts}}</span>
            <!--<el-input class="inline" :disabled="!isAddSuppler" style="width: 150px;"-->
                      <!--v-model="supplier.contacts"></el-input>-->
            <label style="width: 80px;display: inline-block">联系方式：</label>
            <span class="inline" style="width: 150px;">{{supplier.mobile}}</span>
            <!--<el-input class="inline" :disabled="!isAddSuppler" style="width: 150px;"-->
                      <!--v-model="supplier.mobile"></el-input>-->
        </div>
        <div class="mb-sm">
            <label>供应商地址：</label>
            <span class="inline" style="width: 300px;">{{supplier.address}}</span>
        </div>
        <div class="mb-sm">
            <label>供应商链接：</label>
            <!--<el-input class="inline" :disabled="!isAddSuppler" style="width: 150px;"-->
                      <!--v-model="supplier.link"></el-input>-->
            <a :href="supplier.link" target="_blank">{{supplier.link}}</a>
        </div>
    </el-form>
</template>

<style lang="stylus">
    .p-supplier-plan {

    .box-label {
        box-sizing: border-box;
        width: 100%;
        color: #5e6d82;
        font-size: 1.25rem;
        padding: 0 21px 10px;
        display: inline-block;
        border-bottom: 2px solid #dee5ee;
        margin-bottom: 20px;
    }

    .mb-sm {

    label {
        display: inline-block;
        text-align: right;
        width: 82px;
    }

    }
    }
</style>
<script>
    import {api_get_balance, api_add_supplier, api_look_supplier} from '../../../api/assert-sup';
    export default{

        data(){
            return {
                isAddSuppler: false,
                supplierId: '',
                aaa: '',
                addForm: {},
                addDialog: false,
                balanceList: [],
                supplierInfo: {
                    price:'',
                    moq:'',
                    safe_warehouse_id:'',
                    delivery_days:''
                },
                supplier:{
                    supplierId:this.supplierId,
                    balance_type:'',
                    mobile:'',
                    address:'',
                    link:'',
                    contacts:''
                },
                balance_type_arr: [
                    {
                        label: '全部',
                        value: 0
                    },
                    {
                        label: '货到付款',
                        value: 1
                    },
                    {
                        label: '款到发货',
                        value: 2
                    },
                    {
                        label: '定期结算',
                        value: 3
                    },
                    {
                        label: '周结',
                        value: 4
                    },
                    {
                        label: '半月结',
                        value: 5
                    },
                    {
                        label: '月结',
                        value: 6
                    }
                ]
            }
        },
        created(){

        },
        filters: {},
        mounted(){
        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){

            },
            //增加供应商
            is_add_suppler(){
                this.get_balance();
                this.addForm = {
                    company_name: "",
                    code: "",
                    level: "",
                    type: 0,
                    invoice: '',
                    legal: "",
                    system_name: "",
                    business_license: "",
                    introduce: "",
                    balance_type: "",
                    balance_remark: "",
                    pay_type: "",
                    bank: "",
                    bank_account: "",
                    account_name: "",
                    paypal: "",
                    alipay: "",
                    contacts: "",
                    tel: "",
                    mobile: "",
                    email: "",
                    qq: "",
                    ww: "",
                    weixin: "",
                    zipcode: "",
                    province_id: "",
                    city_id: "",
                    area_id: "",
                    address: "",
                    link: "",
                    remark: "",
                    contacts_job: "",
                    contacts2: "",
                    contacts2_job: "",
                };
                this.addDialog = true;
            },
            save(){
                this.$http(api_add_supplier, this.addForm).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    });
                    this.init();
                    this.addDialog = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            /*选择省*/
            select_province(){
                this.addForm.city_id = "";
                this.addForm.area_id = "";
            },
            /*选择市*/
            select_city(){
                this.addForm.area_id = "";
            },
            get_balance(){
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    //console.log(code);
                })
            },
            get_info(id){
                this.$http(api_look_supplier, id).then(res => {
                    this.supplier.balance_type = res.balance_type;
                    this.supplier.mobile = res.mobile;
                    this.supplier.address = res.address;
                    this.supplier.link = res.link;
                    this.supplier.contacts = res.contacts;
                })
            }
        },
        computed: {},
        watch: {
            supplierId(val){
                console.log(this.supplierId);
                this.$emit('choose-supplier', this.supplierId);
                this.get_info(this.supplierId);
            }
        },
        props: {
            isDisposeEdit: {}
        },
        components: {
            scroll: require('../../../components/scroll.vue').default,
            add: require('../../procurement/suppliers/assert-sup/add.vue').default,
            supplier: require('../../../api-components/supplier.vue').default,
        }
    }
</script>

