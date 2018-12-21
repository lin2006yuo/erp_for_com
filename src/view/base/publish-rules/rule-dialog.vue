<template>
    <page-dialog v-model="show" size="large" :title="pageTitle" @change="change_dialog" :close-on-click-modal="false">
        <el-card class="rule-dialog-header">
            <el-form label-width="125px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="销售价规则名称：" required>
                            <el-col :span="24">
                                <el-input v-model="title" style="width:300px"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="12">
                            <el-form-item label="平台：">
                                <ui-select v-model="platform"
                                           ref="brand"
                                           v-mouse-side.mousewheel="()=>{$refs.brand.visible=false}"
                                           class="width-sm">
                                    <el-option v-for="item in channelList"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value">
                                    </el-option>
                                </ui-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="有效期：" class="inline">
                            <el-date-picker
                                    ref="startTime"
                                    v-mouse-side.mousewheel="()=>{$refs.startTime.pickerVisible=false}"
                                    type="date"
                                    v-model="start_time"
                                    class="inline date"
                                    :picker-options="pickerstart"
                                    placeholder="选择开始日期时间">
                            </el-date-picker>&nbsp;--&nbsp;
                            <el-date-picker
                                    ref="endTime"
                                    v-mouse-side.mousewheel="()=>{$refs.endTime.pickerVisible=false}"
                                    type="date"
                                    v-model="end_time"
                                    class="inline date"
                                    :picker-options="pickerend"
                                    placeholder="选择过期日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购价：" class="inline">
                            <span>自动获取产品采购价</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <label-items label="是否启用：" class="inline ml-lg" required>
                            <div>
                                <el-switch class="fl" v-model="isSetup"
                                           on-text="启用"
                                           off-text="停用"
                                           on-color="#20a0ff"
                                           off-color="#C0CCDA">
                                </el-switch>
                            </div>
                        </label-items>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-xs">
            <el-row>
                <el-col class="rule-dialog-body" v-if="leftSpan" :span="leftSpan">
                    <el-card style="height: 99%;overflow: hidden;" :body-style="{height:'90%',overflowY:'auto'}">
                        <div slot="header">
                            <el-checkbox v-model="showSelect" label="仅显示勾选项"></el-checkbox>
                            <el-checkbox v-model="showContext" :label="showContext ? '显示选项内容' :'隐藏选项内容' "></el-checkbox>
                        </div>
                        <div>
                            <div class="rules" v-for="item in showRules" :key="item.label">
                                <label>{{item.label}}</label>
                                <ul>
                                    <li v-for="subItem in item.child" :key="subItem.name" :class="current(subItem)">
                                        <el-checkbox :value="subItemStatus(subItem)"
                                                     @change="change(subItem)"
                                                     :disabled="disable(subItem)">
                                        </el-checkbox>
                                        <span @click="click_item(subItem)">
                                        {{subItem.name}}
                                        <span class="context"
                                              v-if="showContext || showSelect">{{item_context(subItem)}}</span>
                                    </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col class="rule-dialog-body" v-if="rightSpan" :span="rightSpan">
                    <el-card>
                        <rule-cond :config="ruleConfig"
                                   :channel="platform"
                                   :data="ruleData"
                                   :code="ruleCode"
                                   :title="ruleTitle">
                        </rule-cond>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="mt-xs">
            <pricing-cond :configs="priceingConfigs" :cardShow="true" @change-country="change_country"></pricing-cond>
            <div>
                <p v-if="platform === 1">
                    总销售价=（采购价格+重量*运费/g+Paypal固定金额费用*汇率+物流附加费+物流挂号费+其他固定成本+重量*其他动态成本/g）/（1-毛利润率-平台佣金率-折扣率-Paypal收款账户费率）/ 汇率
                </p>
                <p v-else-if="platform === 3 || platform === 4">
                    总销售价=（采购价格+重量*运费/g+物流附加费+物流挂号费+其他固定成本+重量*其他动态成本/g）/（1-毛利润率-平台佣金率-折扣率）/ 汇率
                </p>
            </div>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="price_calculation" size="mini">价格测算</el-button>
            <request-button req-key="ruleDialog" @click="submit"
                       :disabled="is_submit">确定
            </request-button>
            <el-button @click.native="show=false" size="mini">取消</el-button>
        </div>
        <price-calculation v-model="priceVisible"
                           :platform-information="platformInformation"></price-calculation>
    </page-dialog>
</template>
<style lang="stylus">
    .rule-dialog-header {
        height: 20%;
    }

    .rule-dialog-body {
        height: 400px;
        max-height: 400px;
        overflow-y: auto;
    }

    .rules {
        border: 1px solid #d6d6d6;
        margin-top: 5px;
        padding: 5px;
        >
        label {
            margin: 5px;
            display: block;
        }

        li {
            cursor: pointer;
            padding-top: 5px;
            padding-bottom: 5px;
        }

        .current {
            background-color: rgba(22, 22, 22, 0.1);
        }

        .context {
            display: flex;
            flex: 1;
            color: #4e92ce;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &
            :hover {
                color: #bb7829;
            }
        }
        .content-select {

        }
    }

    .publish-rules-title {
        margin: 0;
    }

    .publish-rule-redColor {
        color: red;
    }
    .date .el-date-editor{
        width:140px;
        height:26px;
        font-size:1.2rem;
        .el-date-editor__trigger.el-icon{
            top:-7px;
        }
    }
    .date>.el-date-editor__editor{
        height:26px;
    }
</style>
<script>
    import {
        api_rule_items,
        api_getaction,
        api_getchannel,
        api_getwarehouse,
        api_get_resource,
        api_shiping} from '../../../api/order-rules';
    import http from '../../../lib/http';
    import {calc_item_context} from '../order-rule/help';
    import {
        api_get_pricing_items,
        api_get_currency,
        api_get_pricing_default,
        api_lookup,
        api_modify,
        api_get_shipping_method,
        api_add} from '../../../api/publish-rules';
    import {validators} from '../order-rule/validators'
    export default {
        data() {
            return {
                urlObject: {},
                showSelect: false,
                showContext: false,
                show: false,
                autoActions: [],
                title: '',
                isSetup: false,
                platform: 1,
                configs: {},
                pricing_configs: {
                    data: []
                },
                rules: [],
                selected: [],
                panelWith: 0,
                panelStatus: 1,
                isChange: false,
                start_time: '',
                end_time: '',
//                shipping: [],
                warehouse: [],
                currency: 'USD',
                currency_list: [],
                exchange_rate: '1',
                priceVisible: false,//价格测算是否可见
                platformInformation: {
                    platform: this.platform,
                    platform_name: ''
                },//价格计算的平台
                dataList: {
                    label: '',
                    child: []
                },
                actionValue: [],
                channelList:[
                    {label:'ebay',value:1},
                    {label:'wish',value:3},
                    {label:'aliExpress',value:4},
                    {label:'Amazon',value:2},
                ],
                is_submit:false,
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.end_time){
                            return  time.getTime() > this.end_time.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.start_time){
                            return time.getTime() < this.start_time.getTime()
                        }else {
                            return false
                        }
                    }
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            calc_item_context,
            validators,
            change_country(){
                let warehouse = this.get_select_warehouse();
                console.log(warehouse,'warehouse');
                if(!warehouse||warehouse.length<=0)return;
                this.get_shipping_methods(warehouse);
            },
            get_select_warehouse(){
                let node = this.selected.find(row => row.code === 'warehouse');
                if (!node) return [];
                let warehouse = [];
                for (let attr in node.data.child) {
                    if (node.data.child.hasOwnProperty(attr)) {
                        node.data.child[attr].value && warehouse.push(Number(attr));
                    }
                }
                return warehouse;
            },
            get_shipping_methods(warehouse){
                let find = this.priceingConfigs.child.find(row=>row.code==='pricingShippingCountry');//获取平邮运输方式选择
                let findCountry = {};
                if(find&&find.resources&&find.resources.data){
                    findCountry = find.resources.data.find(res=>res.title==='发送国家：');
                    if(!findCountry||!findCountry.operator)return;
                    let data = {
                        warehouse_id:warehouse,
                        country_code:findCountry.operator
                    };
                    this.$http(api_get_shipping_method,data).then(res => {
                        if(find&&find.resources){
                            let findData = find.resources.data.find(res=>res.title==='运输方式：');
                            if(findData){
                                this.$set(findData,'condition',{});
                                res.forEach(item=>{
                                    findData.condition[item.id] = item.shortname
                                });
                            }
                        }
                    }).catch(code => {
                        console.log(code);
                    })
                }
            },
            get_shipping_methods_eub(warehouse){
                let find = this.priceingConfigs.child.find(row=>row.code==='pricingShippingEUB');//获取平邮运输方式选择
                console.log(find,'find');
                console.log(find.resources);
                console.log(find.resources.data,'find.resources.data');
                if(find&&find.resources&&find.resources.data){
                    console.log('触发选择');
                    let data = {
                        warehouse_id:warehouse,
                        country_code:'US'
                    };
                    this.$http(api_get_shipping_method,data).then(res => {
                        console.log(res,'执行到了吗');
                        if(find&&find.resources){
                            let findData = find.resources.data.find(res=>res.title==='运输方式：');
                            console.log(findData,'findData');
                            if(findData){
                                this.$set(findData,'condition',{});
                                res.forEach(item=>{
                                    findData.condition[item.id] = item.shortname
                                });
                            }
                        }
                    }).catch(code => {
                        console.log(code);
                    })
                }
            },
            disable(item) {
                return item.rule_type === 1;
            },
            init() {
                this.$http(api_get_pricing_items).then(res => {
                    this.rules = [res];
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
                this.$http(api_get_currency).then(res => {
                    this.currency_list = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            clear() {
                this.actionValue = [];
                this.selected = [];
                this.title = '';
                this.platform = 1;
                this.autoContent = '';
                this.showSelect = false;
                this.showContext = false;
                this.panelWith = 0;
                this.panelStatus = 1;
            },
            init_config(code) {
                if (!this.configs[code]) {
                    this.$http(api_get_resource, {code: code}).then(res => {
                        this.$set(this.configs, code, res);
                    })
                }
            },
            init_pricing() {
                const val_get = (key, childs) =>{
                    return childs.find(row=>row.key === key);
                };
                const item_set = (data, choose) =>{
                    data = data.map((child) =>{
                        let val = val_get(child.key, choose);
                        let value
                        if(!!val){
                            value= val.value;
                        if([2,6].includes(val.type)){
                            if(val.value){
                                value = val.key;
                            }else{
                                value = false;
                            }
                        }
                        }else {
                            value = false;
                            val={
                                other:"",
                                operator:'',
                                child:[],
                                group:''
                            }
                        }
                        this.$set(child, 'value', value);
                        this.$set(child, 'other', val.other);
                        this.$set(child, 'operator', val.operator);
                        child.child = item_set(child.child,val.child);
                        return child;
                    });
                    return data;
                };
                const choose = (item) => {
                    const find = this.actionValue.find(val=>{
                        return val.item_code === item.code
                    });
                    if(find){
                        item.resources.data = item_set(item.resources.data, find.choose);
                        return item;
                    }else{
                        return item;
                    }
                };
                this.$http(api_get_pricing_default).then(res => {
                    res.child.forEach(row => {
                        row.resources = {};
                        this.$http(api_get_resource, {code: row.code}).then(resource => {
                            this.$set(row, 'resources', resource);
                            choose(row);
                        })
                    });
                    this.dataList = res;
                })
            },
            click_item(item) {
                if (this.disable(item)) {
                    return
                }
                this.showContext = true;
                this.panelWith = item;
                let result = this.get_item(item.code);
                if (!result) {
                    this.selected.push({id: item.id, code: item.code, status: false, data: {child: {}}});
                }
            },
            item_context(item) {
                let node = this.selected.find(row => row.code === item.code);
                if (!node) return '';

                //  为仓库时 请求接口
                if (node && node.code === "warehouse") {
                    let warehouse = [];
                    for (let attr in node.data.child) {
                        if (node.data.child.hasOwnProperty(attr)) {
                            node.data.child[attr].value && warehouse.push(Number(attr));
                        }
                    }
                    if (warehouse.length !== this.warehouse.length) {
                        this.warehouse = warehouse;
                        this.get_shipping_methods(warehouse);
                        this.get_shipping_methods_eub(warehouse)//ebay平台EUB
                    } else {
                        if (warehouse.length !== 0) {
                            const houseFlag = !warehouse.find((row, index) => {
                                return row !== this.warehouse[index]
                            });
                            if (!houseFlag) {
                                this.warehouse = warehouse;
                                this.get_shipping_methods(warehouse);
                                this.get_shipping_methods_eub(warehouse)//ebay平台EUB
                            }
                        }
                    }
                }

                let strs = [];
                if (this.configs[node.code]) {
                    strs = this.calc_item_context(this.configs[node.code].type, this.configs[node.code].data, node.data.child);
                }
                node.status=!!strs.length;
                return strs.join(', ');
            },
            subItemStatus(item) {
                let result = this.get_item(item.code || false);
                return result && result.status;
            },
            get_item(value) {
                return this.selected.find(row => row.code === value);
            },
            set_item(code, item){
                const index = this.selected.indexOfFun(r=>r.code === code);
                if(index >= 0){
                    this.selected.splice(index, item);
                    return true;
                }else{
                    return false;
                }
            },
            get_rule_item(id) {
                for (let i = 0; i < this.rules.length; i++) {
                    let childs = this.rules[i].child;
                    for (let j = 0; j < childs.length; j++) {
                        if (childs[j].id === id) {
                            return childs[j];
                        }
                    }
                }
            },
            change(item) {
                let result = this.get_item(item.code);
                if (result) {
                    let index = this.selected.indexOfFun(row => row.code === item.code);
                    this.selected.splice(index, 1, result);
                } else {
                    this.selected.push({id: item.id, code: item.code, status: true, data: {child: {}}});
                }
            },
            submit() {
                this.is_submit = true;
                let selected = this.selected.filter(row => row.status);
                selected = selected.map(row => {
                    let rowgetdata = (data) => {
                        let ret = [];
                        for (let item in data) {
                            if (data.hasOwnProperty(item) && data[item].value) {
                                ret.push({
                                    operator: data[item].operator.sel || data[item].operator || "",
                                    key: item,
                                    value: data[item].value,
                                    other: data[item].other||'',
                                    group: data[item].group,
                                    child: rowgetdata(data[item].child)
                                });
                            }
                        }
                        return ret;
                    };
                    let value = rowgetdata(row.data.child);
                    return {
                        item_id: row.code,
                        item_source: row.code,
                        item_value: value
                    }
                });
                const item_value = (item) =>{
                    let value = item.value;
                    if([2,6].includes(item.type) && item.value){
                        value = true;
                    }
                    return {
                        key:item.key,
                        group:item.group,
                        operator:item.operator,
                        other:item.other,
                        value:value,
                        child:item.child.map(item_value)
                    }
                };
                let action_value = this.priceingConfigs.child.map(row =>{
                    return {
                        item_source:row.code,
                        item_value:row.resources.data.map(item_value)
                    }
                });
                let sites = [];
                selected.forEach(row =>{
                    if('source' === row.item_source){
                        row.item_value.forEach(item => {
                            if(true === item.value){
                                item.child.forEach(child=>{
                                    if(true === child.value && child.group === 'site'){
                                        sites.push(child.key);
                                    }
                                })
                            }
                        })
                    }
                });
                let params = {
                    action_value,
                    title: this.title,
                    channel_id: this.platform,
                    status: this.isSetup ? 0 : 1,
                    rules: selected,
                    sites,
                };
                if (this.start_time) {
                    params.start_time = parseInt(new Date(this.start_time).getTime() / 1000);
                }
                if (this.end_time) {
                    params.end_time = parseInt(new Date(this.end_time).getTime() / 1000);
                }

                //TODO:这里打补丁用来判断物流挂号费设置是否合理 fixed：4263
                for(let i = 0; i <  params.action_value.length; i++){
                    if(params.action_value[i].item_source === "pricingLogisticsRegistrationFeeSetting"){
                        if(params.action_value[i].item_value[3].value !== ''){
                            if(params.action_value[i].item_value[1].value > params.action_value[i].item_value[3].value){
                                this.$reqKey('ruleDialog',false);
                                this.$message({type:"error",message:'物流挂号费设置不符合业务需求'});
                                return false;
                            }
                        }
                    }
                }
                if (this.mdfid > 0) {
                    this.$http(api_modify, this.mdfid, params).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.show = false;
                        this.clear();
                        this.$emit('reload');
                    }).catch(code => {
                        this.is_submit = false;
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('ruleDialog', false);
                        }, 300)
                    });
                }else{
                    this.$http(api_add, params).then(res => {
                        this.is_submit = false;
                        this.$message({type: "success", message: res.message || res});
                        this.show = false;
                        this.clear();
                        this.$emit('reload');
                    }).catch(code => {
                        this.is_submit = false;
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('ruleDialog', false);
                        }, 300)
                    });
                }
            },
            current(item) {
                return item === this.panelWith ? 'current' : '';
            },
            channel_remote() {
                return this.$http(api_getchannel).then(res => {
                    return Promise.resolve(res.map(cate => {
                        return {label: cate.name, value: cate.id};
                    }));
                });
            },
            makesure_rule_item() {
                return new Promise((succ, fail) => {
                    let make = () => {
                        if (this.rules.length > 0) {
                            succ();
                        } else {
                            setTimeout(make, 500);
                        }
                    };
                    setTimeout(make, 0);
                })
            },
            change_dialog(val) {
                if (!val) {
                    this.showSelect=false;
                    this.showContext=false;
                    this.panelStatus = 1
                } else {
                    this.click_item(this.rules[0].child[0])
                }
            },
            //价格测算
            price_calculation() {
                this.priceVisible = true;
                this.platformInformation.platform = this.platform;
                if (this.platform === 1) {
                    this.platformInformation.platform_name = '（eBay）';
                } else if (this.platform === 3 || this.platform === 4) {
                    this.platformInformation.platform_name = '（AliExpress/Wish）';
                }
            },
        },
        computed: {
            priceingConfigs:{
                get(){
                    return {
                        label: this.dataList.label,
                        child: this.dataList.child.filter(row => {
                            if(row.channel && (row.channel !== this.platform)){
                                return false;
                            }else{
                                return true;
                            }
                        })
                    };
                },
                set(val){
                    console.log(val,'valpriceingConfigs');
                },
            },
            showRules() {
                let classifys = [];
                this.rules.forEach(classify => {
                    let classifyChild = classify.child.filter(row => {
                        if (this.showSelect) {
                            let node = this.selected.find(old => old.code === row.code);
                            if (!node || !node.status) {
                                return false;
                            }
                            return true;
                        } else {
                            return true;
                        }
                    });
                    classifys.push({label: classify.label, child: classifyChild});
                });
                return classifys;
            },
            warehouse_remote() {
                this.autoContent = '';
                return function () {
                    return this.$http(api_getwarehouse).then(res => {
                        return Promise.resolve(res.map(row => {
                            return {
                                label: row.name,
                                value: row.id
                            }
                        }));
                    })
                };
            },

            leftSpan() {
                switch (this.panelStatus) {
                    case 1:
                        return 24;
                    case 2:
                        return 12;
                    case 3:
                        return 0;
                }
            },
            rightSpan() {
                return 24 - this.leftSpan;
            },
            ruleData: {
                get() {
                    try {
                        let item = this.get_item(this.ruleCode);
                        if (item) {
                            return item.data || {};
                        } else {
                            return {};
                        }
                    } catch ($exp) {
                        return {};
                    }
                }
            },
            ruleCode() {
                if (this.panelWith) {
                    let code = this.panelWith.code;
                    this.init_config(code);
                    return code;
                } else {
                    return "";
                }
            },
            ruleConfig() {
                return this.configs[this.ruleCode] || {};
            },
            ruleTitle() {
                if (this.panelWith) {
                    return this.panelWith.statement;
                } else {
                    return "";
                }
            },
            pricingData: {
                get() {
                    try {
                        let item = {
                            code: "",
                            status: false,
                            data: this.pricing_configs.data,
                            id: ""
                        };
                        console.log("pitem", item.data);
                        return item.data || {};
                    } catch ($exp) {
                        return {};
                    }
                }
            },
            pricingCode() {
                return "";
            },
            pricingConfig() {
                console.log("pconfig", this.pricing_configs);
                return this.pricing_configs;
            },
            pricingTitle() {
                return "";
            },

        },
        props: {
            value: {},
            mdfid: {},
            pageTitle:{}
        },
        watch: {
           value(val) {
                if(val){
                    this.is_submit = false;
                    this.show = val;
                    this.init();
                    this.init_pricing();
                    if (this.mdfid) {
                        this.$http(api_lookup, this.mdfid).then(res => {
                            while (this.selected.shift()) {
                            }
                            this.title = res.title;
                            this.platform = res.channel_id;
                            this.actionValue = res.action_value;
                            this.isSetup = res.status === 0;//--0启用1停用
                            if (res.start_time) {
                                this.start_time = new Date(res.start_time * 1000);
                            }
                            if (res.end_time) {
                                this.end_time = new Date(res.end_time * 1000);
                            }
                            this.makesure_rule_item().then(() => {
                                res.rules.forEach(row => {
    //                                let item = this.get_rule_item(row.item_id);
                                    this.init_config(row.item_code);
                                    let chooses = (rows) => {
                                        let obj = {};
                                        rows.forEach(row => {
                                            row.sel = row.operator;
                                            obj[row.key] = choose(row);
                                        });
                                        return obj;
                                    };
                                    let choose = (row) => {
                                        row.child = chooses(row.child);
                                        return row;
                                    };
                                    let select = {
                                        status: true,
                                        id: row.item_id,
                                        code: row.item_code,
                                        data: {
                                            value: true,
                                            child: chooses(row.choose)
                                        }
                                    };
                                    this.selected.push(select);
                                });
                                if(res.channel_id===1||res.channel_id===2){
                                    this.change_country();
                                }
                                console.log(res.channel_id,'res.channel_id');
                                if(res.channel_id===1){
                                    let warehouse = this.get_select_warehouse();
                                    console.log(warehouse,'warehouse');
                                    if(warehouse.length<=0)return;
                                    this.$nextTick(()=>{
                                        this.get_shipping_methods_eub(warehouse);
                                    })
                                }
                            });
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            });
                        })
                    } else {
                        this.clear();
                    }
                }
            },
            show(val) {
                this.$emit('input', val);
            },
            showContext(val) {
                if (val) {
                    this.panelStatus = 2
                } else {
                    this.panelStatus = 1
                }
            },
            platform(val){
                let item = this.get_item('source');
                if(item){
                    for(let c in item.data.child){
                        if(item.data.child.hasOwnProperty(c)){
                            console.log(c);
                            if(c !== val){
                                delete item.data.child[c];
                            }
                        }
                    }
                    this.set_item('source', item);
                }

            }
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            selectRemote: require('../../../components/select-remote.vue').default,
            labelItems: require('../../../components/label-items.vue').default,
            uimuiSelect: require('../../../components/uimui-select.vue').default,
            tree: require('../order-rule/tree.vue').default,
            ruleCond: require('../order-rule/rule-cond.vue').default,
            priceCalculation: require('./price-calculation.vue').default,
            pricingCond: require('./pricing-cond.vue').default,
            uiSelect: require('../../../components/ui-select.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }

</script>
