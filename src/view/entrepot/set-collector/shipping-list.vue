<template>
    <div>
        <div class="mb-sm fr">
            <el-input class="inline width-super" placeholder="请输入名称/代码..." @keyup.enter.native="search"
                      v-model="searchText"></el-input>
            <el-button class="ml-sm" type="primary" size="mini inline" @click.native="search" icon="search">搜索
            </el-button>
            <!--<el-button type="primary" size="mini inline" @click="synchronization">同步邮寄方式</el-button>
            <el-button type="primary" size="mini inline" @click="add_logistics">添加</el-button>-->
        </div>
        <el-table :data="shippingData" class="scroll-bar" v-resize="{height: 0}" highlight-current-row>
            <el-table-column inline-template label="物流商" align="center">
                <div>{{row.carrier_name}}</div>
            </el-table-column>
            <el-table-column prop="code" label="代码" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column inline-template label="名称" align="center">
                <div>{{row.shortname}}</div>
            </el-table-column>
            <el-table-column inline-template label="状态" align="center">
                <div>
                    <permission tag="ElSwitch"
                                :key="row.shortname"
                                v-model="row.status"
                                :on-text="state[0]"
                                :off-text="state[1]"
                                on-color="#20a0ff"
                                off-color="#C0CCDA"
                                @change="change_status(row)"
                                :route="apis.url_logistics_enabled">
                    </permission>
                </div>
            </el-table-column>
            <!--<el-table-column inline-template label="操作" align="center" width="210">
                <div>
                    <span class="operate" @click="look_operate(row)">查看</span>
                    <permission tag="span" :route="apis.url_logistics_base_keep">&nbsp;|&nbsp;</permission>
                    <permission tag="span" class="operate" @click="edit_operate(row)"
                                :route="apis.url_logistics_base_keep">修改
                    </permission>
                    <permission tag="span" :route="apis.url_shipping_method_log">&nbsp;|&nbsp;</permission>
                    <permission tag="span" class="operate" @click="look_log(row)"
                                :route="apis.url_shipping_method_log">操作日志
                    </permission>
                </div>
            </el-table-column>-->
        </el-table>
        <discontinue-shipping v-model="discontinuationVisible" :action="action" @cancel="cancel_discontinue"
                              @sure="sure_discontinue"></discontinue-shipping>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {logistics_enabled, url_logistics_enabled} from "@/api/setLogistics";

    export default {
        permission: {
            url_logistics_enabled
        },
        mounted() {
            if (this.shippingList.length) {
                this.shippingData = clone(this.shippingList);
            }
        },
        data() {
            return {
                searchText: '',
                shippingData: [],
                state: ['启用', '停用'],
                discontinuationVisible: false,
                action: {},
            }
        },
        methods: {
            search() {
                let key = this.searchText.trim();
                if (key === '') {
                    this.shippingData = window.clone(this.shippingList);
                } else {
                    this.shippingData = this.shippingList.filter((res, index) => {
                        if (!res.code && !res.shortname) return false;
                        return res.code.indexOf(key) !== -1 || res.shortname.indexOf(key) !== -1
                    });
                }
                this.searchText = '';
            },
            change_status(row) {
                console.log('change status', row);
                row.status ? this.discontinue(row) : this.start_using(row);
            },
            start_using(row) {
                this.$confirm(`您将启用${row.shortname}，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let params = {
                        id: row.id,
                        status: 1,
                        stop_pickup_time: 0
                    };
                    this.$http(logistics_enabled, row.id, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                    }).catch(code => {
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: code.message || code
                        });
                        row.status = !row.status
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消启用'
                    });
                    row.status = !row.status
                });
            },
            discontinue(row) {
                this.discontinuationVisible = true;
                this.action = row;
            },
            sure_discontinue(stop_pickup_time) {
                let params = {
                    id: this.action.id,
                    status: 0,
                    stop_pickup_time: stop_pickup_time
                };
                this.$http(logistics_enabled, this.action.id, params).then(res => {
                    this.discontinuationVisible = false;
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: code.message || code
                    });
                    this.action.status = !this.action.status
                })
            },
            cancel_discontinue() {
                this.$message({
                    type: 'info',
                    message: '已取消停用'
                });
                this.discontinuationVisible = false;
                this.action.status = !this.action.status;
            },
        },
        watch: {
            shippingList(val) {
                this.shippingData = window.clone(val);
            }
        },
        props: {
            shippingList: {}
        },
        components: {
            discontinueShipping: require('../setLogistics/discontinue-shipping.vue').default,
        }
    }
</script>
