<template>
    <page>
        <el-row>
            <el-col :span="12" class="ship-padding">
                <ui-card>
                    <div slot="header" class="ui-card-header">
                        <span class="title">仓库</span>
                        <title-list label="url_store_add" @search="search_key" @add="add_entrepot"></title-list>
                    </div>
                    <data-table ref="dataTable"
                                :loading="loading"
                                :tableData="tableData"
                                :params="params"
                                :entrepot-id="entrepotID"
                                @store_check="store_check"
                                @size-change="handle_size_change"
                                @cur-change="handle_current_change"
                                @del="del"></data-table>
                </ui-card>
            </el-col>
            <el-col :span="12">
                <right-box ref="rightBox"
                           :entrepot-id="entrepotID"
                           @cancelCreate="cancel_create"
                           @save='save'
                           @update='update'></right-box>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus" scoped>
    .ship-padding {
        padding-right: 10px;
        height: 100%;
    }
</style>
<script>
    import titleList from '../setLogistics/title-list.vue';
    import rightBox from './right-box.vue';
    import dataTable from './data-table.vue';
    import {store_list, store_update, store_del} from '@/api/storeManagement';

    export default {
        page: {
            multiple: true,
            devinfo: {
                frontEnd: '徐梦娇;黎宏珍',
                backEnd: '翟斌',
                createTime: '2016-11-30',
                updateTime: '2017-9-26'
            },
            beforeClose() {
                let show = this.$refs.rightBox.isEdit;
                if (!show) {
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
            this.init();
        },
        created() {
            this.init();//-------list列表
        },
        data() {
            return {
                loading: true,
                entrepotID: 0,
                tableData: {
                    tableList: [],
                    total: 0
                },
                params: {
                    page: 1,
                    pageSize: 50,
                    snText: '',
                    type: 0
                },
            }
        },
        refresh() {//---------F5刷新
            this.init(this.params);
        },
        methods: {
            init() {//-------------list列表函数
                this.tableData.tableList = [];
                this.loading = true;
                this.$http(store_list, this.params).then(res => {
                    this.loading = false;
                    this.tableData.tableList = res.data;
                    this.tableData.total = res.count;
                    this.$nextTick(() => {
                        this.$refs.dataTable.store_check(this.tableData.tableList[0]);
                    })
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            search_key(key, type) {//-----------------------搜索
                this.params.snText = key;
                this.params.type = type;
                this.tableData.tableList = [];
                this.loading = true;
                this.$http(store_list, this.params).then(res => {
                    if (res.count === 0) {
                        this.tableData.tableList = "";
                        this.entrepotID = 0;
                    }
                    this.loading = false;
                    this.tableData.tableList = res.data;
                    this.tableData.total = res.count;
                    if (res.data[0]) {
                        this.check_fun(res.data[0].id)//--首次加载页面查看第一个列表的数据
                    }
                })
            },
            check_fun(dataId) {//--------------------------------查看函数
                this.entrepotID = dataId;
            },
            store_check(row) {//------------------------查看
                this.check_fun(row.id);
            },
            add_entrepot() {//----------------------------添加
                this.entrepotID = 0;
            },
            cancel_create(isEdit) {//-------取消
                this.init();
            },
            save(data) {//--------------保存
                this.tableData.tableList.push(data);
                this.$set(this.tableData, 'total', this.tableData.total + 1)
                this.check_fun(this.tableData.tableList[this.tableData.tableList.length - 1].id)
            },
            update(form) {//--------------------更新
                let params = {
                        id: form.id,
                        code: form.code,
                        name: form.name,
                        type: form.type,
                        state_or_provice: form.state_or_provice,
                        country_code: form.country_code,
                        status: form.status,
                        city: form.city,
                        area: form.area,
                        address: form.address,
                        zip: form.zip,
                        contact_name: form.contact_name,
                        phone: form.phone,
                        entrepot: form.entrepot,
                        operation_mode: form.operation_mode || 11,
                        is_virtual_transit: form.is_virtual_transit ? 1 : 0,
                        transit_warehouse_id: form.transit_warehouse_id ? form.transit_warehouse_id : '',
                        parent_warehouse_id: form.parent_warehouse_id || '',
                    }
                ;
                this.$http(store_update, params).then(res => {
                    this.$message({
                        showClose: true,
                        type: "success",
                        message: res.message || res
                    });
                    let index = this.tableData.tableList.indexOfFun(form.id, function (old, id) {
                        return old.id === form.id
                    });
                    for (let key in params) {
                        this.tableData.tableList[index][key] = params[key]
                    }
                    let update_time = Date.parse(new Date);
                    update_time = update_time / 1000;
                    this.$set(this.tableData.tableList[index], 'update_time', update_time);
                }).catch(code => {
                    this.$refs.rightBox.quote_fun()
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            handle_size_change(val) {//---------------分页每页显示条数
                this.params.pageSize = val;
                const new_max_page = Math.ceil(this.tableData.total / this.params.pageSize);
                this.params.page = this.params.page > new_max_page ? new_max_page : this.params.page;
                this.init();
            },
            handle_current_change(val) {//------------分页当前页
                this.params.page = val;
                this.init();
            },
            del(row) {
                this.$confirm('您将删除' + row.name + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(store_del, row.id).then(res => {
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message || res
                        });
                        let i = this.tableData.tableList.findIndex(data => {
                            return data.id === row.id
                        });
                        this.tableData.tableList.splice(i, 1)
                        this.$set(this.tableData, 'total', this.tableData.total - 1)
                        this.$nextTick(() => {
                            const next = Math.max(i - 1, this.tableData.tableList.length - 1);
                            if (next >= 0) {
                                this.$refs.dataTable.store_check(this.tableData.tableList[next]);
                            } else {
                                this.entrepotID = 0
                            }
                        })
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            }
        },
        components: {
            rightBox,
            dataTable,
            titleList,
            uiCard: require('@/components/ui-card').default,
        }
    }
</script>
