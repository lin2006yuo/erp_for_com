<template>
    <page class="p-single-box">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id" class="inline width-sm" @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <el-card>
            <label-item label="扫描/录入拣货单号或者周转箱号开始包装作业：" class="mt-lg mb-lg">
                <el-input ref="number" @keyup.enter.native="submit" @focus="focus_input" v-model="number"></el-input>
                <div v-if="message">
                    <span class="message red"><i class="el-icon-circle-close inline"
                                                 style="font-size:25px;color:red;margin: 0 5px 6px;"></i>{{message}}</span>
                </div>
            </label-item>
        </el-card>
        <div class="box mt-xs">
            <p class="box-title t-left" style="padding-left:10px">正在进行包装作业</p>
            <el-table :data="tableData" v-resize="{height:40}">
                <el-table-column label="排序" type="index">
                </el-table-column>
                <el-table-column label="拣货单号" prop="number"></el-table-column>
                <el-table-column label="拣货单类型" prop="type"></el-table-column>
                <el-table-column label="作业开始时间" inline-template>
                    <span>{{row.packing_start_time | timeFilter}}</span>
                </el-table-column>
                <el-table-column label="时长" inline-template>
                    <span>{{row.duration}}</span>
                </el-table-column>
                <el-table-column label="小组成员" inline-template>
                    <span>{{row.packager_id}}</span>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                    <permission type="primary"
                                tag="ElButton"
                                :route="apis.url_get_watch_cache"
                                class="mt-xs mb-xs"
                                size="mini"
                                @click.native="clear_cache(row)"
                                :disabled="row.type === '单品单件'">
                        清除缓存
                    </permission>
                </el-table-column>
            </el-table>
        </div>
        <clear-cache v-model="cacheVisible" :cache-data="cacheData" :cache-info="cacheInfo"></clear-cache>
    </page>
</template>
<style lang="stylus">
    .p-single-box {
        .c-label-item {
            height: 30px;
            line-height: 30px;
        }

        .message {
            margin-left: 20px;
            font-size: 30px;
        }

        .box {
            border: 1px solid #D3DCE6;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
            .box-title {
                border: 1px solid #D3DCE6;
                text-align: center;
                margin: 0;
                background-color: #6495ed;
                font-size: 1.2rem;
                line-height: 32px;
                height: 32px;
                color: #ffffff;
            }
        }
    }
</style>
<script>
    import {api_single_box, api_pickings_packing, api_get_watch_cache, url_get_watch_cache} from '@/api/delivery-check';
    import {entrepot_picking} from '@/api/entrepot-picking';
    import {mapGetters} from 'vuex';

    export default {
        permission: {
            url_get_watch_cache
        },
        page: {
            devinfo: {
                frontEnd: '黎宏珍',
                backEnd: '詹熏欣',
                createTime: '2017-11-21',
                updateTime: '2017-12-13'
            }
        },
        refresh() {
            this.get_pickings_packing();
            this.$refs.number.$refs.input.select();
        },
        data() {
            return {
                number: '',
                message: '',
                warehouse_id: 2,
                warehouses: [],
                tableData: [],
                numberData: {},
                cacheData: [],
                cacheInfo: {},
                cacheVisible: false,
            }
        },
        mounted() {
            this.$refs.number.$refs.input.select();
            this.warehouses_init();
            this.get_pickings_packing();
        },
        methods: {
            focus_input() {
                this.$refs.number.$refs.input.select();
            },
            warehouses_init() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            select_warehouse() {
                this.get_pickings_packing();
            },
            get_pickings_packing() {
                let data = {
                    warehouse_id: this.warehouse_id,
                    type: 1
                };
                this.$http(api_pickings_packing, data).then(res => {
                    this.tableData = res;
                    this.tableData.forEach(row => {
                        if (row.duration) {
                            row.duration = '';
                        }
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            submit() {
                this.number = this.number.trim();
                this.$refs.number.$refs.input.select();
                let data = {
                    number: this.number,
                    warehouse_id: this.warehouse_id
                };
                this.$http(api_single_box, data).then(res => {
                    if (res.is_continue && this.number !== res.picking_number) {
                        this.$confirm(`您正在进行${res.picking_number}单品复核，确认继续此操作？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.numberData = data;
                            this.$set(this.numberData, 'user', this.currentUser.realname);
                            this.$router.push({
                                path: "/delivery-check/single-box/single-sku",
                                query: this.numberData
                            });
                        }).catch(code => {
                            this.$message({type: 'info', message: `已取消操作`});
                        });
                    } else {
                        this.numberData = data;
                        this.$set(this.numberData, 'user', this.currentUser.realname);
                        this.$router.push({
                            path: "/delivery-check/single-box/single-sku",
                            query: this.numberData
                        });
                    }
                }).catch(code => {
                    if (code.message === 'Undefined index: status') {
                        this.message = `请扫描/录入正确的拣货单号或者周转箱号!`;
                        return;
                    } else if (code.message === '拣货单ID值不合法') {
                        this.message = `请扫描/录入正确的拣货单号或者周转箱号!`;
                        return;
                    }
                    this.message = code.message;
                });
            },
            clear_cache(row) {
                this.$http(api_get_watch_cache, row.id).then(res => {
                    this.cacheData = res;
                    this.cacheInfo = {
                        title: `拣货单（${row.number}）清除缓存`
                    };
                    this.cacheVisible=true;
                })
            },
        },
        filters: {
            timeFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        computed: {
            ...mapGetters({currentUser: 'user/info'})
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            clearCache: require('./clear-cache.vue').default,
        }
    }
</script>
