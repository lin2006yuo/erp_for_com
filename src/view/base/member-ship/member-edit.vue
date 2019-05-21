<template>
    <div class="p-member-edit">
        <page-dialog v-model='show'   size="large" @open="open"
                     :close-on-click-modal="false" :title="title">
            <div v-loading="loading"
                 element-loading-text="拼命加载中">
                <div class="mb-sm" v-if="isAdd">
                    <el-button size="mini" type="primary" @click.native="add_member">添加</el-button>
                    <el-button size="mini" type="primary" @click.native="rem_member">删除</el-button>
                </div>
                <!-- 批量编辑 -->
                <div v-if="batchEdit" style="height: 500px">
                    <table class="template">
                        <tr>
                            <th width="35px"></th>
                            <th width="120px">平台</th>
                            <th width="120px">账号</th>
                            <th width="120px">销售员与仓库类型</th>
                            <th width="120px">客服</th>
                        </tr>
                        <tbody>
                        <tr v-for="(row,index) in devData" :key="index">
                            <td>
                                <el-checkbox v-model="row.isCheck"></el-checkbox>
                            </td>
                            <td>
                                <!--<ui-select :value="row.channel_id" placeholder="请选择"-->
                                <!--@input="(val)=>{change_channel(row,val)}">-->
                                <!--<el-option-->
                                <!--:key="item.id"-->
                                <!--v-for="item in channel"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                                <!--</el-option>-->
                                <!--</ui-select>-->
                                <super-select v-model="row.channel_id"
                                              class="inline"
                                              backfill=true
                                              :options="channel"
                                              :disabled="batchEdit"
                                              :storageKey="`memberShipChannelPlatform${row.id}`">
                                </super-select>
                            </td>
                            <td>
                                <!--<ui-params  v-model="row.account_id"-->
                                <!--:type="row.type"-->
                                <!--:options="row.param">-->
                                <!--</ui-params>-->
                                <super-select v-model="row.account_id"
                                              class="inline"
                                              backfill=true
                                              :options="row.param"
                                              :show-option-map="showOptionMap"
                                              :data-index="`memberShipChannelAccount${row.id}`"
                                              :storageKey="`memberShipChannelAccount${row.id}`">
                                </super-select>
                            </td>
                            <td>
                                <div v-for='(it,index) in row.info' :key='index'>

                                    <!--<ui-params-->
                                    <!--class="inline"-->
                                    <!--style="width: 100px"-->
                                    <!--v-model="it.seller_id"-->
                                    <!--:type="`salesName${row.seller_id}`"-->
                                    <!--:options="salesList"-->
                                    <!--&gt;-->
                                    <!--</ui-params>-->
                                    <super-select v-model="it.seller_id"
                                                  style="width: 100px"
                                                  class="inline"
                                                  backfill=true
                                                  :options="salesList"
                                                  :storageKey="`memberShipChannelSales${row.id}`">
                                    </super-select>

                                    <ui-select v-model="it.warehouse_type"
                                               style="width:150px"
                                               placeholder="请选择"
                                               @change="change_house(row)"
                                               class="inline">
                                        <el-option
                                            :key="item.value"
                                            v-for="item in row.warehouse"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.isCheck">
                                        </el-option>
                                    </ui-select>

                                    <i class="el-icon-close" v-if="row.info.length>1"
                                       @click="del_house(row,index)"> </i>
                                    <i class="el-icon-plus" v-if="show_add_icon(row) && !listEdit"
                                       @click="add_house(row,index)"> </i>
                                </div>
                            </td>
                            <td>
                                <!--<param-account-->
                                <!--ref="paramCustomer"-->
                                <!--v-model="row.customer_id"-->
                                <!--:param="{type:'customer',data:{content:''}}"-->
                                <!--:fixUrl="true"-->
                                <!--:fixResult="sale_fix_result"-->
                                <!--type="memberShipCustomer"-->
                                <!--url="get|user/:type/staffs">-->
                                <!--</param-account>-->
                                <super-select
                                    :backfill=true
                                    v-model="row.customer_id"
                                    :options="customerOptions"
                                    :storageKey="`memberShipChannelServer${row.id}`">
                                </super-select>


                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>


                <!-- 新增和编辑部分 -->
                <el-table
                    v-if="!batchEdit"
                    class="scroll-bar"
                    :data="devData"
                    @selection-change="select_change"
                    height="200">
                    <el-table-column
                        type="selection"
                        width="35">
                    </el-table-column>
                    <el-table-column label="平台" inline-template>
                        <div>
                            <!--<ui-select  :value="row.channel_id"-->
                            <!--placeholder="请选择"-->
                            <!--@input="(val)=>{change_channel(row,val)}"-->
                            <!--&gt;-->
                            <!--<el-option  :key="item.id"-->
                            <!--v-for="item in channel"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                            <!--</el-option>-->
                            <!--</ui-select>-->
                            <super-select v-model="row.channel_id"
                                          class="inline"
                                          :options="channel"
                                          backfill=true
                                          :disabled="!isAdd&&!batchEdit"
                                          @change="(val)=>{change_channel(row,val)}"
                                          :storageKey="`memberShipChannelPlatform${row.id}`">
                            </super-select>
                        </div>
                    </el-table-column>
                    <el-table-column label="账号" inline-template>
                        <div>
                            <!--<ui-params  v-model="row.account_id"-->
                            <!--:type="row.type"-->
                            <!--:options="row.param"-->
                            <!--@input="(val)=>{changeShop(row, val)}"-->
                            <!--&gt;-->
                            <!--</ui-params>-->
                            <super-select v-model="row.account_id"
                                          class="inline"
                                          :options="row.param"
                                          backfill=true
                                          @change="(val)=>{changeShop(row,val)}"
                                          :storageKey="`memberShipChannelAccount${row.id}`">
                            </super-select>
                        </div>
                    </el-table-column>
                    <el-table-column label="店铺" inline-template>
                        <!--<el-select  v-model="row.shop_id"-->
                        <!--clearable-->
                        <!--filterable-->
                        <!--:disabled="!(row.isJoom && row.choseAccount)"-->
                        <!--:placeholder="shop_placeholder(row)"-->
                        <!--&gt;-->
                        <!--<el-option  v-for="option of shopOptions"-->
                        <!--:label="option.label"-->
                        <!--:value="option.value"-->
                        <!--:key="option.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <super-select v-model="row.shop_id"
                                      :disabled="!(row.isJoom && row.choseAccount)"
                                      :placeholder="shop_placeholder(row)"
                                      class="inline"
                                      backfill=true
                                      :options="shopOptions"
                                      :storageKey="`memberShipChannelShop${row.id}`">
                        </super-select>
                    </el-table-column>

                    <el-table-column label="销售员与仓库类型" inline-template width="300">
                        <div>

                            <div v-for='(item,index) in row.info' :key='index'>
                                <!--<param-account-->
                                <!--class="inline"-->
                                <!--style="width: 100px"-->
                                <!--ref="paramSale"-->
                                <!--v-model="row.info[index].seller_id"-->
                                <!--:param="{type:'sales',data:{content:''}}"-->
                                <!--:fixUrl="true"-->
                                <!--:fixResult="sale_fix_result"-->
                                <!--type="memberShipSales"-->
                                <!--url="get|user/:type/staffs">-->
                                <!--</param-account>-->
                                <super-select v-model="item.seller_id"
                                              style="width: 100px"
                                              class="inline"
                                              backfill=true
                                              :options="sellerOptions"
                                              :storageKey="`memberShipChannelSales${row.id}`">
                                </super-select>

                                <ui-select v-model="item.warehouse_type"
                                           style="width:150px"
                                           placeholder="请选择"
                                           @change="change_house(row)"
                                           class="inline">
                                    <el-option
                                        :key="item.value"
                                        v-for="item in row.warehouse"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.isCheck">
                                    </el-option>
                                </ui-select>

                                <i class="el-icon-close" v-if="row.info.length>1" @click="del_house(row,index)"> </i>
                                <i class="el-icon-plus" v-if="show_add_icon(row)" @click="add_house(row, $index)"> </i>
                            </div>
                        </div>
                    </el-table-column>
                    <el-table-column label="客服" inline-template>
                        <div>
                            <!--<param-account-->
                            <!--ref="paramCustomer"-->
                            <!--v-model="row.customer_id"-->
                            <!--:param="{type:'customer',data:{content:''}}"-->
                            <!--:fixUrl="true"-->
                            <!--:fixResult="sale_fix_result"-->
                            <!--type="memberShipCustomer"-->
                            <!--url="get|user/:type/staffs">-->
                            <!--</param-account>-->
                            <super-select
                                v-model="row.customer_id"
                                backfill=true
                                :options="customerOptions"
                                :storageKey="`memberShipChannelServer${row.id}`">
                            </super-select>
                        </div>
                    </el-table-column>
                    <el-table-column label="操作" inline-template v-if="isAdd">
                        <span class="operate" @click="delete_single(row)">删除</span>
                    </el-table-column>
                </el-table>

            </div>
            <span slot="footer">
                <permission tag="request-button" :route="apis.url_member_add" reqKey="memberEdit"
                            :mintime='300' v-if="isAdd" @click="add_save">确定</permission>
                <permission tag="requestButton" :route="apis.url_member_update" reqKey="updateMember"
                            v-if="!isAdd&&!batchEdit" @click="save">确定</permission>
                <permission tag="requestButton" :route="apis.url_member_batch_update" reqKey="batchUpdate"
                            v-if="batchEdit" @click="batch_save">确定</permission>
                <el-button size="mini" @click.native="canel">取消</el-button>
            </span>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import {api_product_person} from "../../../api/product-class"
    import {
        api_member_add, api_customer_list,
        api_member_update, api_product_account,
        api_platform_account,
        api_sales_list,
        api_joom_shop,
        api_member_batch_update, url_member_batch_update, url_member_add, url_member_update, api_get_shop
    } from "../../../api/member"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        permission: {
            url_member_add,
            url_member_update,
            url_member_batch_update
        },
        data() {
            return {
                show: false,
                selected: [],
                sellerData: [],
                customerData: [],
                auto_warehouse_type: '',
                auto_seller_id: '',
                auto_customer_id: '',
                auto_warehouse: [
                    {label: "全部", value: 0, isCheck: false},
                    {label: "本地", value: 1, isCheck: false},
                    {label: "海外", value: 2, isCheck: false},
                ],
                shopOptions: [],
                sellerOptions: [],
                customerOptions: []
            }
        },
        created() {
        },
        mounted() {
            this.get_customers();
            this.get_sales();
            console.log('这里是测试在次打开有没有执行');
        },
        computed: {
            ...mapGetters({accounts: 'params/channelAccount'}),
            ...mapGetters({getParamAccount: 'api/getParamAccount'}),
            selectAll: {
                get() {
                    let cur = this.devData.find(row => !row.isCheck);
                    return !cur;
                },
                set(val) {
                    this.devData.forEach(row => {
                        row.isCheck = !!val;
                    })
                }
            },

        },
        methods: {
            ...mapActions({load: 'params/setChannelAccount'}),
            showOptionMap(option){
                this.$set(option, 'disabled', true);
                return option;
            },
            blur_change(name, val) {
                if (val === '') return;
                this.devData.forEach(row => {
                    if (row.isCheck) {
                        switch (name) {
                            case 'mdf-seller':
                                row.info.forEach(item => {
                                    this.$set(item, 'seller_id', '');
                                    this.$nextTick(() => {
                                        this.$set(item, 'seller_id', val);
                                    });
                                });
                                break;
                            case 'mdf-warehouse-type':
                                row.info.forEach(item => {
                                    item.warehouse_type = val
                                });
                                break;
                            case 'mdf-customer':
                                this.$set(row, 'customer_id', '');
                                this.$nextTick(() => {
                                    this.$set(row, 'customer_id', val);
                                });
                                break;
                        }
                    }
                });
            },
            open() {
                this.auto_seller_id = '';
                this.auto_customer_id = '';
                this.auto_warehouse_type = '';
                /** 下面是获取joom平台下店铺的数据。 */
                if (!this.isAdd && !this.batchEdit) {
                    this.$http(api_get_shop, {channel_id: 7, account_id: this.devData[0].account_id})
                        .then(res => {
                            this.shopOptions = [{value: 0, label: "全部"}, ...res];
                        })
                        .catch(code => {
                            console.log(code.message || code)
                        });
                }
            },
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            /** 得到销售人员与仓库类型 */
            get_sales() {
                this.$http(api_sales_list, {data: {content: ''}})
                    .then(res => {
                        res = res.map(item => {
                            return {label: item.realname, value: item.id};
                        });
                        this.sellerOptions = res;
                    })
            },
            /** 得到客服人员 */
            get_customers() {
                this.$http(api_customer_list, {data: {content: ''}})
                    .then(res => {
                        this.customerOptions = res.map(item => {
                            return {label: item.realname, value: item.id};
                        })
                    })
            },
            callback(row) {
                return function () {
                    if (!row.channel_id) {
                        return true
                    } else {
                        return false
                    }
                }
            },
            /** 添加一行的数据。 */
            add_member() {
                let obj = {
                    channel_id: "",
                    account_id: "",
                    info: [{seller_id: "", warehouse_type: ""}],
                    customer_id: "",
                    id: Date.now(),
                    type: '',
                    param: [],
                    warehouse: [
                        {label: "全部", value: 0, isCheck: false},
                        {label: "本地", value: 1, isCheck: false},
                        {label: "海外", value: 2, isCheck: false},
                    ]
                };
                this.devData.push(obj);
            },
            select_change(sels) {
                this.selected = sels;
            },
            isChannel(row) {
                if (row.channel_id) {
                    return false;
                }
                return true;
            },
            show_add_icon(row) {
                if (row.info.length >= 2) {
                    return false;
                } else {
                    let flag = true;
                    row.info.forEach(item => {
                        if (item.warehouse_type == 0) {
                            flag = false;
                        }
                    });
                    return flag;
                }
            },
            /** 更改渠道 --- 获取对应渠道下的账号。 */
            change_channel(row, val) {
                // if(row.channel_id===val){
                //     return ;
                // }
                this.platform_change(val, row);
                row.channel_id = val;
                row.account_id = '';
                let find = this.channel.find(item => {
                    return item.value === val
                });
                // 每一次请求的数据都在变化。每次的减一个或多个账号
                this.$http(api_platform_account, {channel_id: row.channel_id}).then(res => {
                    let account = res.data.map(item => {
                        return {label: item.code, value: item.id};
                    });
                    this.$set(row, 'param', account);
                    row.type = `channel${find.value}`;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //多个删除
            rem_member() {
                this.selected.forEach(row => {
                    this.delete_single(row)
                })
            },
            //单个删除
            delete_single(row) {
                let index = this.devData.indexOfFun(row, function (old, row) {
                    return old.id === row.id;
                });
                this.devData.splice(index, 1)
            },
            //改变仓库类型
            change_house(row) {
                row.warehouse.forEach(item => {
                    item.isCheck = false
                });
                let warehouse = row.info.map(item => {
                    return item.warehouse_type
                });
                if (warehouse.indexOf(0) !== -1) {
                    let index = warehouse.indexOf(0);
                    if (index === 0) {
                        row.info.splice(1, 1)
                    } else {
                        row.info.splice(0, 1)
                    }
                } else {
                    warehouse.forEach(item => {
                        let index = row.warehouse.indexOfFun(old => {
                            return old.value === item
                        });
                        if (index !== -1) {
                            row.warehouse[index].isCheck = true;
                        }
                    })
                }
            },
            //删除仓库
            del_house(row, index) {
                let house = row.info[index].warehouse_type;
                let i = row.warehouse.indexOfFun(house, function (old, house) {
                    return old.value === house;
                });
                if (i !== -1) {
                    row.warehouse[i].isCheck = false;
                }
                row.info.splice(index, 1)
            },
            //添加仓库类型
            add_house(row, index) {
                if (this.isAdd) {
                    let rowId = row.id;
                    row.info.push({warehouse_type: "", seller_id: "", id: rowId});
                } else {
                    row.info.push({warehouse_type: "", seller_id: ""});
                }
                this.devData[index].warehouse.forEach(item => {
                    //item.value
                    let find = this.devData[index].info.find(row => {
                        return row.warehouse_type === item.value;
                    });
                    if (!!find) {
                        item.isCheck = true;
                    }
                })
            },
            add_save() {
                if (this.devData.length === 0) {
                    this.$message({type: "info", message: "请添加账号"});
                    return this.$reqKey('memberEdit', false);
                }

                let data = clone(this.devData);

                for (let i = 0; i < data.length; i++) {

                    for (let j = i + 1; j < data.length; j++) {

                        if (data[i].shop_id === data[j].shop_id) {
                            //判断店铺选择框是否处于禁用状态,禁用状态下不触发重复提示
                            //isJoom && choseAccount为false时触发禁用
                            if ((data[i].isJoom && data[i].choseAccount) && (data[j].isJoom && data[j].choseAccount)) {
                                this.$message({type: 'warning', message: '店铺不能重复!'});
                                return this.$reqKey('memberEdit', false);
                            }
                        }
                        if (data[i].channel_id === data[j].channel_id) {

                            if (data[i].account_id === data[j].account_id) {

                                if (!data[i].isJoom) {
                                    this.$message({type: "info", message: "同平台请勿添加相同账号"});
                                    return this.$reqKey('memberEdit', false);
                                }
                            }
                        }
                    }

                    if (data[i].shop_id) {
                        data[i].account_id = data[i].shop_id;
                    }
                    Reflect.deleteProperty(data[i], 'shop_id');
                    Reflect.deleteProperty(data[i], 'isJoom');
                    Reflect.deleteProperty(data[i], 'choseAccount');

                    let info = data[i].info;
                    for (let j = 0; j < info.length; j++) {
                        if (info[j].seller_id === "" || info[j].warehouse_type === "") {
                            this.$message({type: 'warning', message: '销售员与仓库类型不能为空!'});
                            this.$reqKey('memberEdit', false);
                            return;
                        }
                    }
                }
                data.forEach(row => {
                    delete row.warehouse;
                    delete row.param;
                    delete row.type;
                });
                this.$http(api_member_add, {detail: data}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.show = false;
                    this.$emit("batch-update", data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    this.$reqKey('memberEdit', false);
                })
            },
            //批量更新
            batch_save() {
                let flag = false;
                let data = window.clone(this.devData);
                for (let i = 0; i < data.length; i++) {
                    Reflect.deleteProperty(data[i], 'choseAccount');
                    let info = data[i].info;
                    if (data[i].account_id === "") {
                        this.$message({type: 'warning', message: '账号不能为空!'});
                        this.$reqKey('updateMember', false);
                        return;
                    }
                    for (let j = 0; j < info.length; j++) {
                        if (info[j].seller_id === "" || info[j].warehouse_type === "") {
                            this.$message({type: 'warning', message: '销售员与仓库类型不能为空!'});
                            this.$reqKey('batchUpdate', false);
                            return;
                        }
                    }
                }
                data.forEach(row => {
                    if (row.info.length > 1) {
                        if (row.info[0].seller_id === row.info[1].seller_id || row.info[0].warehouse_type === row.info[1].warehouse_type) {
                            flag = true;
                        }
                    }
                });
                if (!flag) {
                    data.forEach(row => {
                        delete row.warehouse;
                        delete row.param;
                        delete row.type;
                        delete row.isCheck;
                    })
                } else {
                    this.$message({type: 'warning', message: '同一账号内的两个销售员或仓库类型不能相同'});
                    this.$reqKey('batchUpdate', false);
                    return
                }
                this.$http(api_member_batch_update, {data: data}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.show = false;
                    this.$emit('batch-update')
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    this.$reqKey('batchUpdate', false);
                })
            },
            save() {
                let flag = false;
                let data = window.clone(this.devData[0]);

                if (data.shop_id) {
                    data.account_id = data.shop_id;
                }
                Reflect.deleteProperty(data, 'shop_id');
                Reflect.deleteProperty(data, 'isJoom');
                Reflect.deleteProperty(data, 'choseAccount');

                if (data.account_id === "") {
                    this.$message({type: 'warning', message: '账号不能为空!'});
                    this.$reqKey('updateMember', false);
                    return;
                }
                for (let i = 0; i < data.info.length; i++) {
                    if (data.info[i].seller_id === "" || data.info[i].warehouse_type === "") {
                        this.$message({type: 'warning', message: '销售员与仓库类型不能为空!'});
                        this.$reqKey('updateMember', false);
                        return;
                    }
                }
                if (data.info.length > 1) {
                    if (data.info[0].seller_id === data.info[1].seller_id || data.info[0].warehouse_type === data.info[1].warehouse_type) {
                        flag = true
                    }
                }
                if (!flag) {
                    delete data.warehouse;
                    delete data.id;
                    delete data.code;
                    delete data.type;
                    delete data.param;
                } else {
                    this.$message({type: 'warning', message: '同一账号内的两个销售员或仓库类型不能相同'});
                    this.$reqKey('updateMember', false);
                    return
                }
                this.$http(api_member_update, this.devData[0].id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.show = false;
                    this.$emit("batch-update", data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    this.$reqKey('updateMember', false);
                })
            },
            canel() {
                this.show = false
            },
            platform_change(val, row) {
                // this.get_account(row);
                /** 如果是joom的平台的话就是7*/
                if (val === 7) {
                    row.isJoom = true;
                    row.warehouse = [{isCheck: false, label: '全部', value: 0}];
                    //  如果是joom平台的话，还需要清空仓库的id数据。
                } else {
                    row.isJoom = false;
                    row.warehouse = [
                        {isCheck: false, label: '全部', value: 0},
                        {isCheck: false, label: '本地', value: 1},
                        {isCheck: false, label: '海外', value: 2}
                    ];
                }
            },
            //获取账号
            get_account(row) {
                return this.$http(api_product_account, {channel_id: row.channel_id}).then(res => {
                    let account = res.account.map(item => {
                        return {label: item.label, value: item.value};
                    })
                    let find = this.devData.find(item => {
                        return item.account_id === row.account_id;
                    })
                    find.param = account;

                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            shop_placeholder(row) {
                if (row.isJoom) {

                    if (row.choseAccount) {
                        return '请选择';
                    } else {
                        return '请选择账号';
                    }
                } else {
                    return 'joom平台可用';
                }
            },
            /** 当切换joom平台下的账号信息后, 取回这个账号下对应新的店铺信息。 */
            changeShop(row, val) {
                this.$set(row, 'shop_id', '');
                if (row.channel_id === 7 && !!val) {
                    // 在取数据之前先清空销售员这个。
                    this.shopOptions = [];
                    this.$http(api_joom_shop, {joom_account_id: val})
                        .then(res => {
                            this.shopOptions = res.data.map(item => {
                                return {label: item.code, value: item.id}
                            });
                        })
                        .catch(code => {
                            console.log(code.message || code)
                        });
                }
            }
        },
        filters: {},
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit("input", val)
            },
            devData: {
                handler(val) {
                    val.forEach((row) => {
                        if (row.customer_id === 0) {
                            row.customer_id = '';
                        }
                        if (row.account_id) {
                            row.choseAccount = true;
                        } else {
                            row.choseAccount = false;
                        }
                        row.info.forEach(item => {
                            if (item.seller_id === 0) {
                                item.seller_id = '';
                            }
                        })
                    })
                },
                deep: true
            }
        },
        props: {
            value: {},
            isAdd: {
                required: true,
                type: Boolean
            },
            batchEdit: {
                required: true,
                type: Boolean
            },
            title: {
                required: true,
                type: String
            },
            devData: {
                required: true,
                type: Array
            },
            listEdit: {
                required: true,
                type: Boolean
            },
            channel: {
                type: Array,
                required: true,
            },
            salesList: {},
            loading:{}
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            paramAccount: require("../../../api-components/param-account.vue").default,
            uiParams: require("../../../components/ui-params.vue").default,
            uiSelect: require('../../../components/ui-select.vue').default,
            requestButton: require('../../../global-components/request-button').default
        }
    }
</script>
