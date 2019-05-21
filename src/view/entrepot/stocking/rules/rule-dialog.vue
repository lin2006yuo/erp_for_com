<template>
    <page-dialog class="c-stock-rule" v-model="show" size="large" @open="open" :title="`${title}${name}`"
                 @change="change_dialog">
        <el-card class="rule-dialog-header">
            <el-form>
                <el-row>
                    <el-row>
                        <el-form-item prop="type">
                            <label class="red mr-mini inline">*</label>类型：
                            <el-radio-group v-model="warehouse_type" class="inline">
                                <el-radio :label="1" :disabled="defaultRule">海外仓备货</el-radio>
                                <el-radio :label="2" :disabled="defaultRule">活动备货</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-form-item prop="name" class="inline">
                        <label class="red mr-mini inline">*</label>规则名称：
                        <el-input v-model="name" class="inline"></el-input>
                    </el-form-item>
                    <el-form-item prop="valid_time_start" class="inline ml-sm">
                        <label class="red inline" v-if="!defaultRule">*</label>有效日期：
                        <el-date-picker v-model="start_time" type="date"
                                        :picker-options="pickerStart"
                                        class="inline width-lg"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="valid_time_end" class="inline">
                        <label class="inline">-</label>
                        <el-date-picker v-model="end_time" type="date"
                                        :picker-options="pickerEnd"
                                        class="inline width-lg"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="isSetup" class="inline ml-sm">
                        <label class="red mr-mini inline">*</label>状态：
                        <el-switch
                                v-model="isSetup"
                                on-text="启用"
                                off-text="停用"></el-switch>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-xs">
            <div class="ml-sm">
                <label class="red mr-mini inline">*</label>
                <label class="mr-mini inline">审批层级：</label>
                <el-radio-group v-model="approve_grade" @change="change_grade">
                    <el-radio :label="1">一级审批</el-radio>
                    <el-radio :label="2">二级审批</el-radio>
                    <el-radio :label="3">三级审批</el-radio>
                </el-radio-group>
            </div>
            <div v-for="(item, index) in grades" :key="index" class="mt-sm ml-sm">
                <label class="mr-mini inline">{{item.label}}</label>
                <el-radio-group v-model="item.value" @change="change_person(item)">
                    <el-radio :label="1">上级审批</el-radio>
                    <el-radio :label="2">指定人员</el-radio>
                </el-radio-group>
                <el-select v-model="item.app"
                           filterable
                           clearable
                           v-if="item.value === 2"
                           remote
                           :loading="approverLoading"
                           :remote-method="(query) => {approver_remote(query)}"
                           class="inline ml-xs">
                    <el-option
                            v-for="opt in approversArr"
                            :key="opt.id"
                            :label="opt.realname"
                            :value="opt.id">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" class="inline ml-sm" @click.native="add_person(item)" v-if="item.value === 2">添加审批人</el-button>
                <el-tag
                        v-for="(tag, i) in item.users"
                        :key="tag.id"
                        @close="close_tag(item.users, i)"
                        class="ml-sm"
                        v-if="item.value === 2"
                        :closable="true"
                        type="primary">
                    {{tag.realname}}
                </el-tag>
            </div>
        </el-card>
        <el-card class="mt-xs">
            <el-row :gutter="10">
                <el-col class="rule-dialog-body" :span="8">
                    <el-card>
                        <div v-for="item in showRules">
                            <label>{{item.label}}</label>
                            <ul>
                                <li v-for="subItem in item.child" class="mt-lg">
                                    <span>
                                        {{subItem.name}}
                                        <el-button @click.native="click_item(subItem)" size="mini" class="inline"
                                                   type="primary">添加</el-button>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
                <el-col class="rule-dialog-body" :span="16">
                    <el-card>
                        <div v-for="item in showRules">
                            <label>结果</label>
                            <ul>
                                <li v-for="subItem in item.child" class="mt-lg">
                                    <span>
                                        {{subItem.name}}
                                         <div v-if="subItem.code === 'readyInventoryWarehouse'">
                                            <el-tag
                                                    v-for="(tag, index) in warehouseTree"
                                                    :key="tag.key"
                                                    @close="close_tag(warehouseTree, index)"
                                                    class="ml-sm mt-xs"
                                                    :closable="true"
                                                    type="primary">
                                                {{tag.label}}
                                            </el-tag>
                                        </div>
                                        <div v-if="subItem.code === 'readyInventoryGoodsQty'">
                                            <el-tag
                                                    v-for="(tag, index) in quantityTree"
                                                    :key="tag.key"
                                                    @close="close_tag(quantityTree, index)"
                                                    class="ml-sm mt-xs"
                                                    :closable="true"
                                                    type="primary">
                                                {{tag.operator}}{{tag.label}}
                                            </el-tag>
                                        </div>
                                        <el-tree
                                                v-if="subItem.code === 'readyInventorySeller' && sellerTree.length > 0"
                                                :data="sellerTree"
                                                :props="defaultProps"
                                                node-key="key"
                                                default-expand-all
                                                :expand-on-click-node="false"
                                                :render-content="renderContent">
                                        </el-tree>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <div slot="footer">
            <permission tag="ElButton"
                        :route="apis.url_save_default_stock_rule"
                        type="primary"
                        class="inline"
                        @click="save_default_rule"
                        size="mini"
                        v-if="defaultRule">保存
            </permission>
            <request-button @click="submit" :mintime="200" req-key="save_stock_rule" class="inline" v-else>保存</request-button>
            <el-button @click.native="cancel" size="mini" class="inline">取消</el-button>
        </div>
        <add-data-dialog v-model="addDialog" :rule-data="ruleData" :rule-config="ruleConfig" :rule-code="ruleCode"
                         :rule-title="ruleTitle" @confirm="confirm"></add-data-dialog>
    </page-dialog>
</template>
<style lang="stylus">
    .c-stock-rule {
        .rule-dialog-header {
            height: 20%;
            .el-card__body {
                padding: 20px;
                .el-input.inline.width-lg {
                    width: 140px;
                }
            }
        }
        .rule-dialog-body {
            height: 400px;
            max-height: 400px;
            overflow-y: auto;
        }
        .el-tree{
            color: cornflowerblue
        }
    }
</style>
<script>
    import {validators} from '@/view/base/order-rule/validators'
    import {
        api_approver
    } from '@/api/plan-rule';
    import {
        api_save_stock_rule,
        api_update_stock_rule,
        api_look_stock_rule,
        api_stock_rule_items,
        api_get_stock_resource,
        api_get_default_stock_rule,
        api_save_default_stock_rule,
        url_save_default_stock_rule
    } from "@/api/stock-rules";

    export default {
        permission: {
            url_save_default_stock_rule
        },
        data() {
            return {
                show: this.value,
                autoActions: [],
                warehouse_type: this.warehouseType,
                name: '',
                autoContent: '',
                isSetup: false,
                platform: 0,
                configs: {},
                rules: [],
                selected: [],
                panelWith: 0,
                panelStatus: 1,
                isChange: false,
                approversArr: [],
                approverLoading: false,
                test: '',
                approve_grade: 1,
                grades: [
                    {label: '一级审批人：', value: 1, key: 'level1', app: '', users: []}
                ],
                start_time: '',
                end_time: '',
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.end_time) {
                            return time.getTime() > this.end_time;
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.start_time) {
                            return time.getTime() < this.start_time;
                        } else {
                            return false
                        }
                    }
                },
                addDialog: false,
                warehouseTree: [],
                quantityTree: [],
                sellerTree: [],
                defaultProps: {
                    children: 'child',
                    label: 'label'
                },
                hasGrades: []
            }
        },
        created() {
            this.init();
        },
        methods: {
            close_tag(arr, index){
                arr.splice(index, 1)
            },
            //审批层级切换
            change_grade(val){
                if(this.hasGrades.length === 0){
                    let gradesArr = new Map()
                        .set(1,[
                            {label: '一级审批人：', value: 1, key: 'level1',app: '', users: []}
                        ])
                        .set(2,[
                            {label: '一级审批人：', value: 1, key: 'level1',app: '', users: []},
                            {label: '二级审批人：', value: 1, key: 'level2',app: '', users: []}
                        ])
                        .set(3,[
                            {label: '一级审批人：', value: 1, key: 'level1',app: '', users: []},
                            {label: '二级审批人：', value: 1, key: 'level2',app: '', users: []},
                            {label: '三级审批人：', value: 1, key: 'level3',app: '', users: []},
                        ]);
                    this.grades = gradesArr.get(val);
                }else{
                    this.grades = this.hasGrades.map(row => {
                        return {
                            label: row.label,
                            value: row.value,
                            key: row.key,
                            app: row.app,
                            users: row.users
                        }
                    });
                    this.hasGrades = [];
                }
            },
            //上级审批 / 指定人员 切换
            change_person(obj){
                obj.app = '';
                if(obj.value === 1){
                    obj.users = []
                }
            },
            //添加审批人
            add_person(obj){
                let person = this.approversArr.find(row => row.id === obj.app);
                if(!person){
                    this.$message({type: 'warning', message: '请选择审批人'});
                    return
                }
                let flag = obj.users.find(item => item.id === person.id);
                if(flag){
                    this.$message({type: 'warning', message: '已有该审批人，请重新选择'});
                    return
                }else{
                    obj.users.push(person)
                }
            },
            //销售员数据 树形渲染函数
            renderContent(h, {node, data, store}) {
                return h('span', {},
                    [
                        h('span', {}, node.label),
                        h('span', {
                                style: {
                                    float: 'right',
                                    marginRight: '20px'
                                }
                            },
                            [
                                h('i', {
                                    attrs: {
                                        class: 'el-icon-close'
                                    },
                                    on: {
                                        click: () => this.remove_tree_data(store, data)
                                    }
                                },)
                            ]
                        )
                    ]
                )
            },
            //删除树节点
            remove_tree_data(store, data) {
                store.remove(data);
                let delete_node = (arr) => {
                    arr.forEach((row, index) => {
                        if(row.key === data.key){
                            arr.splice(index, 1)
                        }else{
                            delete_node(row.child)
                        }
                    })
                };
                delete_node(this.sellerTree);
            },
            open() {
                this.clear();
                if(this.defaultRule){
                    this.get_default_rule(this.warehouse_type);
                }
            },
            //获取默认审批规则
            get_default_rule(val){
                this.$http(api_get_default_stock_rule, { warehouse_type: val}).then(res => {
                    while (this.selected.shift()) {
                    }
                    this.name = res.title;
                    this.start_time = res.start_time ? new Date(res.start_time * 1000) : '';
                    this.end_time = res.end_time ? new Date(res.end_time * 1000) : '';
                    this.approve_grade = res.approve_grade || 1;
                    let label = new Map()
                        .set('level1','一级审批人：')
                        .set('level2','二级审批人：')
                        .set('level3','三级审批人：');
                    this.grades = res.approver.map(item => {
                        return {
                            key: item.key,
                            label: label.get(item.key),
                            value: item.value,
                            users: item.users,
                            app: ''
                        }
                    });
                    this.isSetup = res.status === 0 ? true : false;
                    this.warehouse_type = res.warehouse_type;
                    this.makesure_rule_item().then(() => {
                        res.rules.forEach(row => {
                            if(row.item_id === 3){
                                this.sellerTree = row.choose
                            }else if(row.item_id === 2){
                                this.quantityTree = row.choose
                            }else if(row.item_id === 3){
                                this.warehouseTree = row.choose
                            }
                        })
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            //保存默认审批规则
            save_default_rule(){
                let selected = this.selected;
                let valid = this.validators(selected);
                if (this.name === '') {
                    this.$message({type: "warning", message: `规则名称未填写，请检查！`});
                    return false;
                }
                if (valid.length) {
                    let str = valid.map(row => row.name).join(',');
                    this.$message({type: "warning", message: `${str}不符合实际业务条件，请检查！`});
                    return false
                }
                let rules = [
                    {
                        item_id: 1,
                        item_source: 'readyInventoryWarehouse',
                        item_value: this.warehouseTree
                    },
                    {
                        item_id: 2,
                        item_source: 'readyInventoryGoodsQty',
                        item_value: this.quantityTree
                    },
                    {
                        item_id: 3,
                        item_source: 'readyInventorySeller',
                        item_value: this.sellerTree
                    }
                ];
                let approver = this.grades.map(item => {
                    return{
                        key: item.key,
                        value: item.value,
                        users: item.users
                    }
                });
                let params = {
                    title: this.name,
                    warehouse_type: this.warehouse_type,
                    approve_grade: this.approve_grade,
                    start_time: this.start_time ? this.start_time.getTime() / 1000 : '',
                    end_time: this.end_time ? this.end_time.getTime() / 1000 : '',
                    approver: approver,
                    status: this.isSetup ? 0 : 1,
                    rules: rules
                };
                this.$http(api_save_default_stock_rule, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.show = false;
                    this.clear();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            validators,
            init() {
                this.$http(api_stock_rule_items).then(res => {
                    this.rules = res;
                });
            },
            clear() {
                this.selected = [];
                this.name = '';
                this.platform = 0;
                this.autoContent = '';
                this.panelWith = 0;
                this.panelStatus = 1;
                this.start_time = '';
                this.end_time = '';
                this.approve_grade = 1;
                this.warehouse_type = this.warehouseType;
                this.sellerTree = [];
                this.quantityTree = [];
                this.warehouseTree = [];
                this.hasGrades = [];
                this.change_grade(1);
            },
            init_config(code) {
                if (!this.configs[code]) {
                    this.$http(api_get_stock_resource, {code: code}).then(res => {
                        this.$set(this.configs, code, res);
                    })
                }
            },
            auto_action(actions) {
                this.autoActions = actions;
            },
            approver_remote(query) {
                this.approverLoading = true;
                this.$http(api_approver, query).then(res => {
                    this.approversArr = res.data
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.approverLoading = false;
                })
            },
            click_item(item) {
                this.panelStatus = 2;
                this.panelWith = item;
                let result = this.get_item(item.code);
                if (!result) {
                    this.selected.push({
                        name: item.name,
                        id: item.id,
                        code: item.code,
                        data: {child: {}}
                    });
                }
                //打开弹框的时候取消所有已经勾选的选项
                let cancel_check = (data) => {
                    for(let it in data){
                        if(data.hasOwnProperty(it) && data[it].value){
                            data[it].value = item.code === 'readyInventoryGoodsQty' ? '' : false
                        }
                        cancel_check(data[it].child)
                    }
                };
                cancel_check(this.ruleData.child);
                this.addDialog = true
            },
            get_tree_data() {
                this.selected.map(row => {
                    let rowgetdata = (data) => {
                        let ret = [];
                        for (let item in data) {
                            if (data.hasOwnProperty(item) && data[item].value) {
                                let select = {
                                    operator: data[item].operator.sel || "",
                                    key: item,
                                    value: data[item].value,
                                    other: '',
                                    label: data[item].title || data[item].value,
                                    group: data[item].group,
                                    child: rowgetdata(data[item].child),
                                };
                                data[item].user && (select.user = data[item].user);
                                ret.push(select);
                            }
                        }
                        return ret;
                    };
                    let value = rowgetdata(row.data.child);
                    //选择销售员：将当前选的值与原有的树进行合并，没有的加上，有的只保留一个
                    let mergeTree = (a, b) => {
                        a.forEach(row => {
                            let data = b.find(item => item.key === row.key);
                            if(data){
                                mergeTree(row.child, data.child)
                            }else{
                                b.push(row)
                            }
                        });
                        return b
                    };
                    //选择备货仓库和备货数量时：将当前选的值与原有的数据进行合并，备货数量的时候还需要将operator和value以及label的值替换成当前选择的值
                    let mergeData = (a, b) => {
                        a.forEach(row => {
                            let data = b.find(item => item.key === row.key);
                            if(data){
                                if(data.operator){
                                    data.operator = row.operator;
                                    data.value = row.value;
                                    data.label = row.label
                                }
                            }else{
                                b.push(row)
                            }
                        });
                        return b;
                    };
                    switch(row.id){
                        case 1:
                            this.warehouseTree = mergeData(value, this.warehouseTree);
                            break;
                        case 2:
                            this.quantityTree = mergeData(value, this.quantityTree);
                            break;
                        case 3:
                            this.sellerTree = mergeTree(value, this.sellerTree)
                    }
                });
            },
            confirm() {
                this.get_tree_data();
                this.addDialog = false
            },
            get_item(value) {
                return this.selected.find(row => row.code === value);
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
            cancel() {
                this.show = false;
            },
            submit() {
                let selected = this.selected;
                let valid = this.validators(selected);
                if(this.warehouse_type === ''){
                    this.$reqKey('save_stock_rule', false);
                    this.$message({type: "info", message: `规则类型未选择，请检查！`});
                    return false;
                }
                if (this.name === '') {
                    this.$reqKey('save_stock_rule', false);
                    this.$message({type: "info", message: `规则名称未填写，请检查！`});
                    return false;
                }
                if (this.start_time.toString() === '' || this.end_time.toString() === '') {
                    this.$reqKey('save_stock_rule', false);
                    this.$message({type: "info", message: `有效日期未设置，请检查！`});
                    return false;
                }
                if (valid.length) {
                    let str = valid.map(row => row.name).join(',');
                    this.$reqKey('save_stock_rule', false);
                    this.$message({type: "info", message: `${str}不符合实际业务条件，请检查！`});
                    return false
                }
                let gradesArr = this.grades.filter(row => row.value === 2);
                if(gradesArr.some(row => row.users.length === 0)){
                    this.$reqKey('save_stock_rule', false);
                    this.$message({type: "info", message: '请添加审批人'});
                    return false
                }
                let rules = [
                    {
                        item_id: 1,
                        item_source: 'readyInventoryWarehouse',
                        item_value: this.warehouseTree
                    },
                    {
                        item_id: 2,
                        item_source: 'readyInventoryGoodsQty',
                        item_value: this.quantityTree
                    },
                    {
                        item_id: 3,
                        item_source: 'readyInventorySeller',
                        item_value: this.sellerTree
                    }
                ];
                let approver = this.grades.map(item => {
                    return{
                        key: item.key,
                        value: item.value,
                        users: item.users
                    }
                });
                let params = {
                    title: this.name,
                    warehouse_type: this.warehouse_type,
                    approve_grade: this.approve_grade,
                    start_time: this.start_time.getTime() / 1000,
                    end_time: this.end_time.getTime() / 1000,
                    approver: approver,
                    status: this.isSetup ? 0 : 1,
                    rules: rules
                };
                if (this.mdfid > 0) {
                    this.$http(api_update_stock_rule, this.mdfid, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.show = false;
                        this.clear();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('save_stock_rule', false);
                        }, 200);
                    });
                } else {
                    this.$http(api_save_stock_rule, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.show = false;
                        this.clear();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('save_stock_rule', false);
                        }, 200);
                    });
                }
            },
            current(item) {
                return item == this.panelWith ? 'current' : '';
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
                    this.panelStatus = 1
                }
            },
        },
        computed: {
            showRules() {
                let classifys = [];
                this.rules.forEach(classify => {
                    classify.child = classify.child || [];
                    let classifyChild = classify.child.filter(row => {
                        return true;
                    });
                    classifys.push({label: classify.label, child: classifyChild});
                });
                return classifys;
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
            }

        },
        watch: {
            mdfid(val) {
                this.init();
                if (val) {
                    this.$http(api_look_stock_rule, val).then(res => {
                        while (this.selected.shift()) {
                        }
                        this.name = res.title;
                        this.start_time = new Date(res.start_time * 1000);
                        this.end_time = new Date(res.end_time * 1000);
                        this.approve_grade = res.approve_grade || 1;
                        let label = new Map()
                            .set('level1','一级审批人：')
                            .set('level2','二级审批人：')
                            .set('level3','三级审批人：');
                        this.hasGrades = res.approver.map(item => {
                            return {
                                key: item.key,
                                label: label.get(item.key),
                                value: item.value,
                                users: item.users,
                                app: ''
                            }
                        });
                        if(this.approve_grade === 1){
                            this.change_grade(1)
                        }
                        this.isSetup = res.status === 0 ? true : false;
                        this.warehouse_type = res.warehouse_type;
                        this.makesure_rule_item().then(() => {
                            // res.rules.forEach(row => {
                            //     let item = this.get_rule_item(row.item_id);
                            //     this.init_config(item.code);
                            //     let chooses = (rows) => {
                            //         let obj = {};
                            //         rows.forEach(row => {
                            //             obj[row.key] = choose(row);
                            //         });
                            //         return obj;
                            //     };
                            //     let choose = (row) => {
                            //         row.child = chooses(row.child);
                            //         return row;
                            //     };
                            //     let select = {
                            //         id: row.item_id,
                            //         code: item.code,
                            //         name: item.name,
                            //         data: {
                            //             value: true,
                            //             child: chooses(row.choose),
                            //         }
                            //     };
                            //     this.selected.push(select);
                            // });
                            res.rules.forEach(row => {
                                if(row.item_id === 3){
                                    this.sellerTree = row.choose
                                }else if(row.item_id === 2){
                                    this.quantityTree = row.choose
                                }else if(row.item_id === 1){
                                    this.warehouseTree = row.choose
                                }
                            })
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
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
                if (val) {
                    this.init();
                }
            }
        },
        props: {
            value: {},
            title: {},
            mdfid: {},
            defaultRule: {},
            warehouseType: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
            labelItems: require('@/components/label-items.vue').default,
            tree: require('./tree.vue').default,
            ruleCond: require('./rule-cond.vue').default,
            addDataDialog: require('./add-data-dialog').default
        }
    }
</script>