<template>
    <page-dialog v-model="show" :title="title" size="large" @change="change_dialog" :close-on-click-modal="false"
                 class="class-seting">
        <label-panel label="基本信息">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item required label="公司：">
                            <ui-select
                                    placeholder="请选择公司..."
                                    ref="company_id"
                                    v-mouse-side.mousewheel="()=>{$refs.company_id.visible=false}"
                                    v-model="devData.company_id">
                                <el-option v-for="company in companys"
                                           :label="company.name"
                                           :value="company.id"
                                           :key="company.id"
                                ></el-option>
                            </ui-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required label="分组名称：">
                            <el-input v-model="devData.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item required label="开发员：">
                            <ui-select v-model="devData.developer_id"
                                       ref="developer_id"
                                       v-mouse-side.mousewheel="()=>{$refs.developer_id.visible=false}">
                                <el-option v-for="dev in devOption"
                                           :label="dev.realname"
                                           :value="dev.id"
                                           :key="dev.id"
                                ></el-option>
                            </ui-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item required label="所属类别：">
                            <ui-select v-model="devData.category_id"
                                       filterable placeholder="请选择类别..."
                                       ref="category_id"
                                       v-mouse-side.mousewheel="()=>{$refs.category_id.visible=false}"
                                       @change="change_category"
                                       :disabled="isEditStatus"
                                       style="width:200px">
                                <el-option
                                        v-for="item in categories"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        @click.native="devData.subclass = []"
                                >
                                </el-option>
                            </ui-select>
                            <span v-if="isEditStatus" class="warning">不可更改类别</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item required label="平台：">
                            <ui-select v-model="devData.channel_id"
                                       ref="channel_id"
                                       v-mouse-side.mousewheel="()=>{$refs.channel_id.visible=false}">
                                <el-option v-for="channel in channels"
                                           :label="channel.label"
                                           :value="channel.value"
                                           :key="channel.value"
                                           @click.native="devData.detail = []"
                                >
                                </el-option>
                            </ui-select>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </label-panel>
        <label-panel label="采购员列表">
            <div>
                <el-button size="mini" :disabled="isSelectParentClassify"
                           type="primary" class="mb-sm"
                           @click.native="add_purchase">{{isSelectParentClassify ? '请先选择分类' : '添加'}}</el-button>
            </div>
            <el-table :data="devData.subclass" height="200" class="scroll-bar">
                <el-table-column inline-template label="负责的子类">
                    <div>
                        {{row.category_name}}
                    </div>
                </el-table-column>
                <el-table-column label="采购员" inline-template>
                    <div>
                        {{row.purchase_name}}
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                    <div>
                        <span class="operate" @click="del_purchase(row)">删除</span>
                    </div>
                </el-table-column>
            </el-table>
        </label-panel>
        <add-member v-model="memberVisable" :channel="devData.channel_id" @selected="members_add"></add-member>
        <label-panel label="成员列表" class="member">
            <div>
                <div class="mb-sm">
                    <el-button size="mini" :disabled="!devData.channel_id" type="primary" @click.native="add_member">添加</el-button>
                    <el-button size="mini" :disabled="memberSelect.length <= 0" type="primary" @click.native="rem_member">删除</el-button>
                </div>
                <el-table
                        :data="devData.detail"
                        class="scroll-bar"
                        @selection-change="select_change"
                        height="200"
                        style="width: 100%"
                >
                    <el-table-column
                            type="selection"
                            width="35">
                    </el-table-column>
                    <el-table-column
                            prop="channel_id"
                            label="平台"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="account_id"
                            label="渠道账号"
                    >
                    </el-table-column>
                    <el-table-column
                            inline-template
                            label="销售员"
                    >
                        <div>
                            <div class="boder" v-for="item in row.info">{{item.seller_id}}</div>
                        </div>
                    </el-table-column>

                    <el-table-column
                            inline-template
                            label="仓库类型"
                    >
                        <div>
                            <div class="boder" v-for="item in row.info">{{item.warehouse_type | typeFilter}}</div>
                        </div>
                    </el-table-column>
                    <el-table-column
                            prop="customer_id"
                            label="客服">
                    </el-table-column>
                    <el-table-column
                            inline-template
                            label="操作">
                        <span class="operate" @click="del_one(row)">删除</span>
                    </el-table-column>
                </el-table>
                <purchase-list v-model="showPurchase"
                               @selected="selectPurchase"
                               :category="devData.category_id"
                ></purchase-list>
            </div>
        </label-panel>
        <span slot="footer">
            <permission tag="request-button" :route="apis.url_product_add"
                        req-key="productAdd"
                        v-if="devData.id===0" @click="add_save">确定</permission>
            <permission tag="request-button" :route="apis.url_product_update"
                        req-key="productUpdate"
                        v-else @click="save">确定</permission>
            <el-button size="mini" @click.native="cancel">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .class-seting {
        .member {
            .boder + .boder {
                border-top: 1px solid sandybrown;

            }
        }

    }
</style>
<script>
    import {
        api_product_person,
        api_product_category,
        api_product_companys,
        api_product_channel,
        api_product_account,
        api_product_update,
        api_product_add,
        url_product_add,
        url_product_update
    } from "../../../api/product-class"
    export default{
    	  permission:{
          url_product_add,
          url_product_update
        },
        data(){
            return {
                show: false,
                showPurchase: false,
                title: "查看",
                sellerData: [],
                buyerData: [],
                customerData: [],
                devOption: [],
                categories: [],
                devsubOption: [],
                channels: [],
                memberVisable: false,
                warehouse: [
                    {label: "所有", value: 0, isCheck: false},
                    {label: "本地", value: 1, isCheck: false},
                    {label: "海外", value: 2, isCheck: false},
                ],
                accounts: {},
                memberSelect: [],
                companys: [],
            }
        },
        computed: {
            isEditStatus(){
                return this.devData.id !== 0;
            },
            isSelectParentClassify(){
                return !this.devData.category_id;
            },
            developer_name(){
            	let find = this.devOption.find(row=>{
                    return this.devData.developer_id === row.id;
                });
                if(!!find){
            		return find.realname;
                }else{
                	return this.devData.developer_id;
                }
            },
            subclass_name(){
                return this.devData.subclass.map(row=> {return row.category_name;}).join(",");
            },
            category_name(){
                let find = this.categories.find(row=>{
                    return this.devData.category_id === row.id;
                });
                if(!!find){
                    return find.name;
                }else{
                    return this.devData.category_id;
                }
            },
            update_time(){
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                return timestamp;
            }
        },
        methods: {
            init(){
                this.get_companys();
                this.get_developer();
            },
            //获取开发人员
            get_developer(){
                this.$http(api_product_person,  {type:'development',data: {content: ""}}).then(res => {
                    this.devOption = res;
                }).catch(code => {
                    console.log(code)
                })
            },
            //获取所属类别 (不带id)
            get_categories(){
                this.categories = [];
                this.$http(api_product_category, {content: ""}).then(res => {
                    this.$set(this, "categories", res)
                }).catch(code => {
                    console.log(code)
                })
            },
            //获取所属类别 (带id)
            get_id_cat(content){
                this.devsubOption = [];
                this.$http(api_product_category, {
                    id: this.devData.category_id,
                    content: content,
                    group_id: this.devData.id
                }).then(res => {
                    res.forEach(row => {
                        row.isDisable = false;
                    })
                    this.$set(this, "devsubOption", res)
                }).catch(code => {
                    console.log(code)
                })
            },

            //获取账号
            get_account(row, name){
                let data = {type: "developer", content: "", is_edit: 0}
                this.$http(api_product_account, name, data).then(res => {
                    this.$set(this.accounts, name, res);
                }).catch(code => {
                    console.log(code)
                })
            },
            //改变所属分类
            change_category(val){
                this.get_id_cat("");
            },
            change_subcate(val){
                let index = this.devsubOption.indexOfFun(val, function (old, val) {
                    return old.id === val;
                })
                this.devsubOption[index].isDisable = true;
            },
            //获取销售员
            get_seller(){
                this.sellerData = [];
                this.$http(api_product_person, "sales", {content: ""}).then(res => {
                    this.$set(this, "sellerData", res)
                }).catch(code => {
                    console.log(code)
                })
            },

            get_companys(){
                this.$http(api_product_companys).then(res => {
                    this.companys = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            selectPurchase(selected){
                selected.forEach(row => {
                    const index = this.devData.subclass.indexOfFun(val => {
                        return val.id === row.id;
                    });
                    if (index < 0) {
                        this.devData.subclass.push(row)
                    }
                })
            },
            //获取采购员
            get_buyer(){
                this.buyerData = [];
                this.$http(api_product_person, "purchase", {content: ""}).then(res => {
                    this.$set(this, "buyerData", res)
                }).catch(code => {
                    console.log(code)
                })
            },

            //获取客服
            get_customer(){
                this.customerData = [];
                this.$http(api_product_person, "customer", {content: ""}).then(res => {
                    this.$set(this, "customerData", res)
                }).catch(code => {
                    console.log(code)
                })
            },

            //获取渠道
            get_channel(){
                this.$http(api_product_channel).then(res => {
                    this.channels = res;
                }).catch(code => {
                    console.log(code)
                })
            },
            //保存
            save(){
                let data = window.clone(this.devData);
                delete data.id;
                data.detail = data.detail.map(row => {
                    return row.id;
                });
                data.subclass = data.subclass.map(row => row.id);
                this.$http(api_product_update, this.devData.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.show = false;
                    data.id = this.devData.id;
                    data.developer = this.developer_name;
                    data.subclass = this.subclass_name;
                    data.update_time = this.update_time;
                    this.$emit("update-list",data);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('productUpdate', false);
                    }, 300)
                })
            },
            add_save(){
                let data = {
                    name: this.devData.name,
                    company_id: this.devData.company_id,
                    channel_id: this.devData.channel_id,
                    category_id: this.devData.category_id,
                    subclass: this.devData.subclass.map(row=>row.id),
                    developer_id: this.devData.developer_id,
                };
                data.detail = this.devData.detail.map(row => {
                    return row.id;
                });
                this.$http(api_product_add, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.show = false;
                    data.id = res.data[0].id || 0;
                    data.category = this.category_name;
                    data.developer = this.developer_name;
                    data.subclass = this.subclass_name;
                    data.update_time = this.update_time;
                    this.$emit("add-list",data);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('productAdd', false);
                    }, 300)
                })
            },
            del_one(row){
                let index = this.devData.detail.findIndex(rows => {
                    return rows.id === row.id
                })
                this.devData.detail.splice(index, 1)
            },
            //取消
            cancel(){
                this.show = false;
            },
            members_add(val){
                val = val.filter(row=>!this.devData.detail.find(detail=>detail.id === row.id));
                this.devData.detail = this.devData.detail.concat(val);
            },
            //添加  成员列表
            add_member(){
                this.memberVisable = true;
            },
            //多个删除
            rem_member(){
                if (this.memberSelect.length === 0) {
                    this.$message({type: "warning", message: "请选择要删除的成员"})
                    return;
                }
                this.memberSelect.forEach(row => {
                    this.del_one(row)
                })
            },
            //添加采购员
            add_purchase(){
                this.showPurchase = true;
            },

            //删除采购员
            del_purchase(row){
                let index = this.devData.subclass.indexOfFun(row, function (old, row) {
                    return old.key === row.key;
                })
                console.log(index);
                this.devData.subclass.splice(index, 1)
            },

            //选择
            select_change(sels){
                this.memberSelect = sels;
            },
            change_dialog(val){
                if (val) {
                    this.get_categories();
                    this.get_channel();
//                    this.get_seller();
                    this.get_buyer();
//                    this.get_customer();
                    this.memberSelect = [];
                    if (this.devData.id !== 0) {
                        this.get_id_cat("");
                    }
                }
            }
        },

        watch: {
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(val){
                    this.init();
                }
            },

        },
        filters: {
            typeFilter(val){
                switch (val) {
                    case 0:
                        return "全部";
                    case 1:
                        return "本地";
                    case 2:
                        return "海外"
                }
            }
        },
        props: {
            value: {
                type: Boolean
            },
            isEdit: {
                required: true,
                type: Boolean
            },
            devData: {
                required: true,
                type: Object
            }
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            purchaseList: require('./purchase-list.vue').default,
            labelPanel: require('../../../components/label-panel.vue').default,
            uiTable: require('../../../components/ui-table.vue').default,
            addMember: require("./add-member.vue").default,
            uiSelect: require('../../../components/ui-select.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
