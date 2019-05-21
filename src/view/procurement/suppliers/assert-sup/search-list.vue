<template>
    <div class="p-search-assert-sup">
        <search-card @search="search"  :params="form" :clears="clears">
            <div>
                <label-buttons label="状态：" title="请选择状态" :buttons="statusList" @select="select_status"></label-buttons>
            </div>
            <div class="mb-mini">
                <label class="inline" title="请选择等级">等级：</label>
                <el-select class="inline self-width s-width-large"
                           v-sf.level
                           v-model="form.level"
                           filterable multiple
                           placeholder="请选择" >
                    <el-option
                        v-for="item in levelList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择分类">分类：</label>
                <el-cascader
                    filterable
                    clearable
                    placeholder="请选择分类..."
                    class="inline s-width-large"
                    change-on-select
                    expand-trigger="hover"
                    v-model="form.categorys"
                    v-sf.categorys
                    :options="categorysLists"
                ></el-cascader>
                <label class="inline ml-sm" title="请选择所在地">所在区/省/市：</label>
                <el-cascader
                    clearable
                    filterable
                    change-on-select
                    placeholder="请选择城市..."
                    class="inline s-width-large"
                    expand-trigger="hover"
                    v-model="form.place_type"
                    v-sf.place_type
                    :options="areaLists"
                ></el-cascader>
                <label class="inline ml-sm" title="请选择合作次数">合作次数：</label>
                <ui-limit-number
                    v-sf.num_cooperation_b
                    v-model="form.num_cooperation_b"
                    @keyup.enter.native="search"
                    :limit="0"
                    class="inline enter-result s-width-mini"></ui-limit-number>&nbsp;--
                <ui-limit-number
                    v-sf.num_cooperation_e
                    v-model="form.num_cooperation_e"
                    @keyup.enter.native="search"
                    :limit="0"
                    class="inline enter-result s-width-mini"></ui-limit-number>
                <label class="inline ml-sm" title="请选择交易方式">交易类型：</label>
                <el-select class="inline s-width-default" v-sf.transaction_type v-model="form.transaction_type">
                    <el-option
                        v-for="item in transactionList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择支付方式">支付方式：</label>
                <el-select class="inline s-width-default" v-sf.pay_type v-model="form.pay_type">
                    <el-option
                        v-for="item in paymentList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
            </div>
            <label class="inline" title="请选择结算方式">结算方式：</label>
            <el-select class="self-width inline s-with-large"
                       v-sf.balance_type
                       v-model="form.balance_type"
                       multiple filterable>
                <el-option
                    v-for="item in balanceList"
                    :key="item.label"
                    :label="item.name"
                    :value="item.label">
                </el-option>
            </el-select>
            <el-select v-sf.staff_type v-model="form.staff_type" class="s-width-default inline  ml-sm" @change="change_buyer_brand(1)">
                <el-option v-for="item in buyerBrand" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <el-select v-model="form.staff"
                       v-show="form.staff_type==='purchaser'"
                       v-sf.staff
                       filterable
                       remote
                       multiple
                       class="inline self-width s-width-large"
                       placeholder="请选择/输入...">
                <el-option v-for="(option,index) in purchaseStaffsList"
                           :key="index"
                           :label="option.label"
                           :value="option.value">
                </el-option>
            </el-select>
            <el-select v-model="form.staff"
                       v-show="form.staff_type==='developer'"
                       v-sf.staff
                       filterable
                       remote
                       multiple
                       class="inline self-width s-width-large"
                       placeholder="请选择/输入...">
                <el-option v-for="(option,index) in purchaseDevelopmentList"
                           :key="index"
                           :label="option.label"
                           :value="option.value">
                </el-option>
            </el-select>
            <el-select v-model="form.staff"
                       v-show="form.staff_type==='supply_chain_specialist'"
                       v-sf.staff
                       remote
                       filterable
                       multiple
                       class="inline self-width s-width-large"
                       default-first-option
                       placeholder="请选择/输入...">
                <el-option v-for="(option,index) in chainSpecialistSearch"
                           :key="index"
                           :label="option.label"
                           :value="option.value">
                </el-option>
            </el-select>
            <el-select v-sf.snType v-model="form.snType"  class="ml-sm s-width-small inline s-width-snType" @change="change_buyer_brand(2)">
                <el-option v-for="item in snType" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <order-input class="inline width-super" @keydown='key_down'  v-sf.snText
                         placeholder="可批量搜索，Shift+回车换行..."
                         v-model="form.snText"></order-input>
            <el-select v-sf.search_time_type v-model="form.search_time_type" class="ml-sm s-width-small inline s-width-snType"  @change="change_buyer_brand(3)" >
                <el-option v-for="item in searchTimeType" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <el-date-picker
                class="inline date mr-sm"
                :picker-options="pickerStart"
                type="date"
                v-sf.date_b
                v-model="form.date_b"
                placeholder="年/月/日"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
            </el-date-picker>&nbsp;--&nbsp;
            <el-date-picker
                class="inline date mr-sm"
                v-sf.date_e
                :picker-options="pickerEnd"
                type="date"
                v-model="form.date_e"
                placeholder="年/月/日"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </search-card>
    </div>
</template>

<script>
    export default {
        name: "search-list",
        data(){
            return{
                statusList: [
                    {name: "全部", status: ''},
                    {name: "待审核", status: 0},
                    {name: "已审核", status: 1},
                    {name: "审核未通过", status: 3},
                    {name: "停用", status: 2}
                ],
                buyerBrand: [
                    {label: "采购员", value: "purchaser"},
                    {label: "开发员", value: "developer"},
                    {label: "供应链专员", value: "supply_chain_specialist"}
                ],
                searchTimeType: [
                    {label: "创建时间", value: "create_time"},
                    {label: "更新时间", value: "update_time"},
                    {label: "最后交易时间", value:"last_trading_time"}
                ],
                snType: [
                    {label: "供应商名称", value: "company_name"},
                    {label: "联系人", value: "contacts"},
                    {label: "联系电话", value: "tel"},
                    {label: "联系地址", value: "address"}
                ],
                clears: {
                    status:'',//状态
                    balance_type:[],//结算方式
                    snType:'company_name',//供应商名称
                    snText:'',//供应商名称对应文本
                    level:[],//等级
                    categorys:[],//分类
                    categorys_type:[],
                    place_type:[],//所在省province/市city/区area
                    place_id:'',//所在省/市/区的ID
                    transaction_type:'', //交易类型
                    num_cooperation_b:'',//最小合作次数
                    num_cooperation_e:'',//最大合作次数
                    pay_type:'',//支付方式
                    staff_type:'purchaser',//采购员purchaser、开发员developer
                    staff:[],//采购员、开发员的ID
                    search_time_type:'create_time',//时间刷选：创建时间create_time，更新时间update_time，最后交易时间last_trading_time
                    date_b:'',//开始时间例：2018-12-22
                    date_e:'',//结束时间例：2018-12-22'
                    sort_field:'',//排序
                    sort_order:'',
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.form.date_e) {
                            return time.getTime() > this.form.date_e;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.date_b) {
                            return time.getTime() < this.form.date_b ||time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        methods:{
            key_down() {
                this.search()
            },
            //            ---------------------------------   搜索不同的状态
            select_status(val, item) {
                this.form.status=item.status;
                this.$emit('select-status',val, item);
                this.search()
            },
//            ---------------------------------   搜索
            search() {
                this.$emit("search");
            },
//            ---------------------------------   清空搜索
            clear_search() {
                this.search()
            },
            change_buyer_brand(val) {
                switch (val) {
                    case 1:
                        //切换采购员/开发员
                        this.form.staff = [];
                        break;
                    case 2:
                        this.form.sntext='';
                        break;
                    case 3:
                        this.form.date_b='';
                        this.form.date_e='';
                        break;
                }
            },
        },
        props:{
            form:{
                required:true,
                type:Object,
            },
            levelList:{},
            areaLists:{},
            chainSpecialistSearch:{},
            purchaseDevelopmentList:{},
            purchaseStaffsList:{},
            balanceList:{},
            paymentList:{},
            transactionList:{},
            categorysLists:{},
        },
        components:{
            labelButtons:require('@/components/label-buttons').default,
            orderInput:require("@/components/order-input.vue").default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
        }
    }
</script>

<style scoped>

</style>
