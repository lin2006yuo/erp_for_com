<template>
    <page-dialog v-model="show" size="large" :title="title"
                 @open="open"
                 @close="close"
                 :close-on-click-modal="false">
        <el-card
            v-loading="ruleLoading"
            class="rule-dialog-header">
            <el-form label-width="125px" :model="formData" :refs="formData" ref="form-data" :rules="ruleVerify">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="name" label="规则名称：">
                            <el-col :span="24">
                                <el-input v-model="formData.name" style="width:300px"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="channel_id" label="平台：">
                            <el-select v-model="formData.channel_id"
                                       class="s-width-small inline ml-sm">
                                <el-option
                                    v-for="res in channelList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="action_value" label="是否自动审批：">
                                <el-radio-group v-model="formData.action_value">
                                    <el-radio :label="0">是</el-radio>
                                    <el-radio :label="1">否</el-radio>
                                </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否启用：" required>
                            <el-switch class="fl" v-model="formData.status"
                                       on-text="启用"
                                       off-text="停用"
                                       on-color="#20a0ff"
                                       off-color="#C0CCDA">
                            </el-switch>
                        </el-form-item>
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
                            <div class="rules" v-for="item in showRules">
                                <label>{{item.label}}</label>
                                <ul>
                                    <li v-for="subItem in item.child" :class="current(subItem)">
                                        <el-checkbox :value="subItemStatus(subItem)"
                                                     @change.native="change(subItem)"
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
                                   :data="ruleData"
                                   :code="ruleCode"
                                   :title="ruleTitle"
                                   :channel="formData.channel_id"
                        >
                        </rule-cond>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="orderRuleDialog" @click="submit">提交/保存</request-button>
            <el-button @click.native="show=false" size="mini">取消</el-button>
        </div>
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

    .rule-box {
        border:1px solid #d1d1d1;
        border-radius :2px;
        padding:5px;
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
            &:hover {
                color: #bb7829;
            }
        }
        .content-select {

        }

    }
</style>
<script>
    import {
        api_get_after_sale_rules_rule_item,
        api_post_after_sale_rules,
        api_put_after_sale_rules_id,
        api_get_after_sale_rules_id
    } from '@/api/after-sale-rules'
    import {api_get_resource} from '@/api/order-rules';
    import {calc_item_context} from './help';
    import {validators} from './validators'

    export default {
        data() {
            return {
                showSelect: false,
                showContext: false,
                show: this.value,
                formData:{
                    name:'',
                    action_value:'',
                    channel_id:0,
                    status:false,
                    rules:[]
                },
                ruleVerify:{
                    name:[
                        {required:"true",message:"规则名称为必填项！",trigger:"blur,change"}
                    ],
                    channel_id:[
                        {required:"true",message:"适用平台为必选项！",trigger:"blur,change",type:'number'}
                    ],
                    action_value:[
                        {required:"true",message:"是否为自动审批为必选项！",trigger:"blur,change",type:'number'}
                    ]
                },
                configs: {},
                selected: [],
                panelWith: 0,
                panelStatus: 1,
                ruleLoading:false
            }
        },
        methods: {
            open(){
                this.ruleLoading = true;
                this.init();
                this.look_up();
            },
            calc_item_context,
            validators,
            disable(item) {
                return item.rule_type === 1 && this.formData.action_value === 1;
            },
            init() {
                this.$http(api_get_after_sale_rules_rule_item).then(res => {
                    this.formData.rules = res;
                    this.$nextTick(()=>{
                        setTimeout(()=>{
                            this.click_item(this.formData.rules[0].child[0])
                        },500);
                    });
                }).catch(code=>{
                    console.log(code);
                });
            },
            clear() {
                this.selected = [];
                this.formData.name = '';
                this.formData.channel_id = 0;
                this.formData.action_value = '';
                this.showSelect = false;
                this.showContext = false;
                this.panelWith = 0;
                this.panelStatus = 1;
                if(!!this.configs){
                    Object.keys(this.configs).forEach(key=>{
                        if(this.configs[key].election){
                            this.configs[key].data.forEach(row=>{
                                this.$set(row,'election',false);
                            })
                        }
                    });
                }
            },
            init_config(code) {
                if (!this.configs[code]) {
                    this.$http(api_get_resource, {code: code}).then(res => {
                        if(res.election){
                            res.data.map(row=>{
                                if(row.election===undefined) {
                                    row.election = false;
                                }
                                return row
                            })
                        }
                        this.$set(this.configs, code, res);
                    })
                }
            },
            click_item(item) {
                if (this.disable(item)) {
                    return
                }
                this.showContext = true;
                this.panelWith = item;
                let result = this.get_item(item.code);
                if (!result) {
                    this.selected.push({
                        name: item.name,
                        id: item.id,
                        election: item.election,
                        code: item.code,
                        status: false,
                        data: {child: {}}
                    });
                }
                this.ruleLoading = false;
            },
            item_context(item) {
                let node = this.selected.find(row => row.code === item.code);
                if (!node) {
                    return '';
                }
                let strs = [];
                if (this.configs[node.code]) {
                    strs = this.calc_item_context(this.configs[node.code].type, this.configs[node.code].data, node.data.child);
                }
                node.status = !!strs.length;
                return strs.join(', ');
            },
            subItemStatus(item) {
                let result = this.get_item(item.code || false);
                return result && result.status;
            },
            get_item(value) {
                return this.selected.find(row => row.code === value);
            },
            get_rule_item(id) {
                for (let i = 0; i < this.formData.rules.length; i++) {
                    let childs = this.formData.rules[i].child;
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
                    let index = this.selected.findIndex(row => row.code === item.code);
                    this.selected.splice(index, 1, result);
                } else {
                    this.selected.push({
                        name: item.name,
                        id: item.id,
                        election: item.election,
                        code: item.code,
                        status: true,
                        data: {child: {}}
                    });
                }
            },
            get_channel_name(channelId){
                const find = this.channelList.find(row =>row.value === channelId);
                if(find){
                    return find.label;
                }else{
                    return '';
                }
            },
            submit() {
                this.$refs[`form-data`].validate((bool) => {
                    if(bool) {
                        let selected = this.selected.filter(row => row.status);
                        let valid = this.validators(selected);
                        if (valid.length) {
                            let str = valid.map(row => row.name).join(',');
                            this.$reqKey('orderRuleDialog', false);
                            return this.$message({type: "info", message: `${str}不符合实际业务条件，请检查！`});
                        }
                        selected = selected.map(row => {
                            let rowgetdata = (data) => {
                                let ret = [];
                                for (let item in data) {
                                    if (data.hasOwnProperty(item) && data[item].value) {
                                        ret.push({
                                            operator: data[item].operator.sel || data[item].operator || "",
                                            key: item,
                                            value: data[item].value,
                                            other: '',
                                            title:data[item].title,
                                            group: data[item].group,
                                            child: rowgetdata(data[item].child),
                                            election:data[item].election ? 1 : 0
                                        });
                                    }
                                }
                                return ret;
                            };
                            let value = rowgetdata(row.data.child);
                            return {
                                item_id: row.id,
                                item_source: row.code,
                                item_value: value
                            }
                        });
                        if(selected.length===0){
                            this.$reqKey('orderRuleDialog',false);
                            this.$message({type:"info",message:`请至少勾选一个条件，请检查！`});
                            return false
                        }
                        let params = {
                            action_value: this.formData.action_value,
                            name: this.formData.name,
                            channel_id: this.formData.channel_id,
                            status: this.formData.status ? 0 : 1,
                            rules: selected
                        };
                        if (this.mdfid > 0) {
                            this.$http(api_put_after_sale_rules_id, this.mdfid, params).then(res => {
                                params.channel = this.get_channel_name(this.channel_id);
                                this.$message({type: "success", message: res.message || res});
                                this.show = false;
                                this.$emit('modify', res.data, params);
                                this.clear();
                            }).catch(code => {
                                this.$message({
                                    type: 'error',
                                    message: code.message || code
                                });
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey('orderRuleDialog', false);
                                }, 300)
                            });
                        }else{
                            this.$http(api_post_after_sale_rules, params).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.show = false;
                                this.$emit('create', res.data,params);
                                this.clear();
                            }).catch(code => {
                                this.$message({
                                    type: 'error',
                                    message: code.message || code
                                });
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey('orderRuleDialog', false);
                                }, 300)
                            });
                        }
                    }else{
                        this.$reqKey('orderRuleDialog', false);
                    }
                });
            },
            current(item) {
                return item == this.panelWith ? 'current' : '';
            },
            makesure_rule_item() {
                return new Promise((succ, fail) => {
                    let make = () => {
                        if (this.formData.rules.length > 0) {
                            succ();
                        } else {
                            setTimeout(make, 500);
                        }
                    };
                    setTimeout(make, 0);
                })
            },
            close() {
                this.showSelect = false;
                this.showContext = false;
                this.panelStatus = 1
            },
            look_up(){
                if (this.mdfid) {
                    this.$http(api_get_after_sale_rules_id, this.mdfid).then(res => {
                        while (this.selected.shift()) {}
                        this.formData.name = res.name;
                        this.formData.channel_id = res.channel_id;
                        this.formData.action_value = res.action_value;
                        this.formData.status = res.status === 0 ? true : false;//--0启用1停用
                        this.makesure_rule_item().then(() => {
                            res.rules.forEach(row => {
                                let item = this.get_rule_item(row.item_id);
                                this.init_config(item.code);
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
                                    name: item.name,
                                    code: item.code,
                                    election: item.election,
                                    data: {
                                        value: true,
                                        child: chooses(row.choose)
                                    }
                                };
                                this.selected.push(select);
                            });
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
            },
        },
        computed: {
            showRules() {
                let classifys = [];
                this.formData.rules.forEach(classify => {
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
            ruleConfig:{
                get(){
                    return this.configs[this.ruleCode] || {};
                },
                set(val){

                }
            },
            ruleTitle() {
                if (this.panelWith) {
                    return this.panelWith.statement;
                } else {
                    return "";
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            },
            'formData.action_type'(val) {
                switch (val) {
                    case 11:
                        let index = this.selected.indexOfFun(sel => {
                            return sel.id === 11
                        });
                        this.selected.splice(index, 1);
                        break;
                }
            },
            showContext(val) {
                if (val) {
                    this.panelStatus = 2
                } else {
                    this.panelStatus = 1
                }
            }
        },
        props: {
            value: {},
            mdfid: {},
            title: {},
            channelList:{},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
            labelItems: require('@/components/label-items.vue').default,
            uimuiSelect: require('@/components/uimui-select.vue').default,
            ruleCond: require('./rule-cond.vue').default,
            requestButton: require('@/global-components/request-button').default
        }
    }

</script>
