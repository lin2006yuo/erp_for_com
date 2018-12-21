<template>
    <page class="ship-padding">
        <div class="left-box">
            <ui-card>
                <div slot="header" class="ui-card-header">
                    <span class="title">物流商</span>
                    <title-list ref="search" label="url_logistics_add"
                                @search="search"
                                @add="add"></title-list>
                </div>
                <data-table ref="dataTable"
                            :loading="loading"
                            :tableData="tableData"
                            :params="params"
                            :activeID='activeID'
                            @size-change="size_change"
                            @cur-change="cur_change"
                            @check-ship="check_ship"></data-table>
            </ui-card>
        </div>
        <div class="right-box">
            <card-list-copy :loading="loading2"
                            :shipForm="shipForm"
                            :shipList="shipList"
                            :sequenceNumList="sequenceNumList"
                            :fullnameId="fullnameId"
                            :isEdit="isEdit"
                            :butMark="butMark"
                            :params="shipListParams"
                            ref="cardList"
                            @search="get_logistic_detail"
                            @size-change="logistic_size_change"
                            @cur-change="logistic_cur_change"
                            @save="save" @edit="edit"
                            @update="update" @cancel="cancel"
                            @update-cancel='update_cancel'></card-list-copy>
        </div>
    </page>
</template>
<style lang="stylus">
    .ship-padding {
        /*padding-right: 10px;*/
        .left-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            bottom: 0;
            overflow-y: hidden;
        }
        .right-box {
            margin-top: 15px;
            position: absolute;
            top: 0;
            left: 50%;
            right: 0;
            bottom: 0;
            overflow-x: auto;
        }
    }
</style>
<script>
    import {
        logistics_list,
        logistics_check,
        logistics_add,
        logistics_update,
        api_get_sequence_number
    } from '@/api/setLogistics';

    export default {
        page: {
            devinfo: {
                frontEnd: '徐梦娇;黎宏珍',
                backEnd: '翟斌',
                createTime: '2016-11-25',
                updateTime: '2017-9-26'
            },
            beforeClose() {
                if (this.isEdit) {
                    return true;
                } else {
                    return this.$confirm(`您的修改未保存,确定离开此页面吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true;
                    }).catch(code => {
                        return false;
                    })
                }
            }
        },
        refresh() {
            this.list_fun()
        },
        created() {
            this.list_fun()
        },
        data() {
            return {
                loading: true,
                loading2: true,
                tableData: {
                    data: [],
                    total: 0
                },
                params: {
                    page: 1,
                    pageSize: 50,
                    snText: ''
                },
                shipListParams: {
                    page: 1,
                    pageSize: 50,
                    snText: ''
                },
                shipForm: {},
                shipList: [],
                butMark: false,//------------按钮改变的标示
                isEdit: true,
                activeID: 0,
                fullnameId: 0,
                oldForm: {},
                sequenceNumList: [],
            }
        },
        methods: {
            list_fun() {
                this.tableData.data = [];
                this.loading = true;
                this.$http(logistics_list, this.params).then(res => {
                    this.loading = false;
                    this.tableData.data = res.data;
                    this.tableData.total = res.count;
                    this.$nextTick(() => {
                        this.$refs.dataTable.check_ship(this.tableData.data[0]);
                    });
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            get_sequence_number(id) {//添加不用传id，查看/编辑需要id获取当前 物流商面单序列号
                let params = !!id ? {carrier_id: id} : {};
                this.$http(api_get_sequence_number, params).then(res => {
                    this.sequenceNumList = res.map(row => {
                        return {
                            value: row
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            search(key, type) {//-----------搜索
                this.params.snText = key;
                this.params.type = type;
                this.tableData.data = [];
                this.loading = true;
                this.$http(logistics_list, this.params).then(res => {
                    if (res.count === 0) {
                        this.shipList = [];
                        this.shipForm = {
                            sequence_number: '',
                            shortname: '',
                            code: '',
                            fullname: '',
                            website: '',
                            contact: '',
                            telephone: '',
                            address: '',
                            status: 1,
                            type: 0,
                            index: ''
                        };
                        this.$message({
                            type: "error",
                            message: `信息不存在!`
                        });
                    }
                    this.loading = false;
                    this.tableData.data = res.data;
                    this.tableData.total = res.count;
                    this.check_fun(res.data[0].id);//----------默认查看第一个数据
                })
            },
            check_ship(row) {//-------------查看
                this.check_fun(row.id);
                this.isEdit = true;
                this.butMark = false;
            },
            add() {//----------添加)
                this.shipForm = {
                    shortname: '',
                    sequence_number: '',
                    code: '',
                    fullname: '',
                    website: '',
                    contact: '',
                    telephone: '',
                    address: '',
                    status: 1,
                    type: 0,
                    index: ''
                };
                this.shipList = [];//---清空邮寄方式
                this.isEdit = false;
                this.butMark = false;
                this.$refs.cardList.activeName = 'shipMes';
                this.get_sequence_number();
            },
            save(shipForm) {//-----新增保存
                this.$http(logistics_add, shipForm).then(res => {
                    this.$message({
                        showClose: true,
                        type: "success",
                        message: res.message || res
                    });
                    shipForm.id = parseInt(res.id);
                    let create_time = Date.parse(new Date);
                    create_time = create_time / 1000;
                    this.$set(shipForm, 'create_time', create_time);
                    this.isEdit = true;
                    this.tableData.data.push(shipForm);
                    this.check_fun(this.tableData.data[this.tableData.data.length - 1].id);
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            edit() {//----编辑
                this.butMark = true;
                this.isEdit = false;
                for (let i in this.shipForm) {
                    if (this.shipForm.hasOwnProperty(i)) {
                        this.oldForm[i] = this.shipForm[i];
                    }
                }
            },
            update(shipForm) {//-----修改
                let params = {
                    shortname: shipForm.shortname,
                    fullname: shipForm.fullname,
                    code: shipForm.code,
                    website: shipForm.website,
                    contact: shipForm.contact,
                    telephone: shipForm.telephone,
                    status: shipForm.status,
                    address: shipForm.address,
                    type: shipForm.type,
                    index: shipForm.index,
                    sequence_number: shipForm.sequence_number
                };
                shipForm.api_info.forEach(data => {
                    params[data.field] = data.value;
                })
                this.$http(logistics_update, shipForm.id, params).then(res => {
                    this.$message({
                        showClose: true,
                        type: "success",
                        message: res.message || res
                    });
                    this.isEdit = true;
                    this.butMark = false;
                    let index = this.tableData.data.indexOfFun(shipForm.id, function (old, id) {
                        return old.id === shipForm.id
                    });
                    params.id = shipForm.id;
                    for (let key in params) {
                        this.tableData.data[index][key] = params[key];
                    }
                    let update_time = Date.parse(new Date);
                    update_time = update_time / 1000;
                    this.$set(this.tableData.data[index], 'update_time', update_time);
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            cancel() {//---------------取消
                this.isEdit = true;
                this.butMark = false;
                this.list_fun();
            },
            update_cancel() {//-------修改取消
                for (let i in this.oldForm) {
                    if (this.oldForm.hasOwnProperty(i)) {
                        this.shipForm[i] = this.oldForm[i];
                    }
                }
                this.isEdit = true;
                this.butMark = false;
            },
            check_fun(data) {//----查看函数
                this.activeID = data;
                this.get_sequence_number(data);//获取 物流商面单序列号
                this.shipListParams = {
                    page: 1,
                    pageSize: 50,
                    snText: ''
                };
                this.get_logistic_detail();
            },
            get_logistic_detail() {
                this.loading2 = true;
                this.$http(logistics_check, this.activeID, this.shipListParams).then(res => {
                    this.shipForm = res;
                    this.shipList = res.shipList;
                    this.fullnameId = res.id;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                }).finally(() => {
                    this.loading2 = false;
                    this.shipListParams.snText = '';
                })
            },
            size_change(val) {//-----分页
                this.params.pageSize = val;
                this.list_fun();
            },
            cur_change(val) {//-----分页
                this.params.page = val;
                this.list_fun()
            },
            logistic_size_change(val) {//-----分页
                this.shipListParams.pageSize = val;
                this.get_logistic_detail();
            },
            logistic_cur_change(val) {//-----分页
                this.shipListParams.page = val;
                this.get_logistic_detail();
            }
        },
        components: {
            titleList: require('./title-list.vue').default,
            dataTable: require('./data-table.vue').default,
            cardListCopy: require('./card-list-copy.vue').default,
            uiCard: require('@/components/ui-card.vue').default,
        }
    }
</script>
