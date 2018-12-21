<template>
    <div class="p-weighing-packages relative">
        <div class="table_head">
            <el-row>
                <request-button size="mini" type="default" :request="finish" class="ml-sm"
                                :disabled="packages.length === 0">集结完成
                </request-button>
                <label-item label="集结包号：" width="60px">
                    <span class="min-width">{{collection.code}}</span>
                </label-item>
                <label-item label="邮寄方式：" width="60px">
                    <span class="min-width max-width">{{collection.shipping_name}}</span>
                </label-item>
                <label-item label="集包袋类型：">
                    <el-select v-model="collect_type" @change="set_collect_type" class="width-xs">
                        <el-option v-for="(item, index) in collectTypes" :key="index" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="包裹数量：">
                    <span>{{packageCount}}</span>
                </label-item>
                <label-item label="包裹重量(g)：">
                    <span>{{packageWeight}}</span>
                </label-item>
            </el-row>
        </div>
        <el-table :data="curData"
                  v-resize="{height:38}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  :row-key="row_key"
                  highlight-current-row>
            <el-table-column
                    inline-template
                    label="面单号">
                <div>
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="包裹号">
                <div>
                    <ui-tip :content="row.package_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="重量(g)">
                <div>
                    <ui-tip :content="row.package_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="包装人">
                <div>
                    <ui-tip :content="row.packager_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="包装时间">
                <div>
                    <ui-tip :content="row.packing_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作">
                <div>
                    <span class="operate" @click="remove_package(row)">移除</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page_absolute"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="page"
                :page-sizes="[1, 20, 50, 100, 200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .p-weighing-packages {
        .table_head {
            height: 40px;
            line-height: 40px;
            border: 1px solid #e0e6ed;
            background-color: #6295E9;
            color: white;

            .c-label-item {
                margin-left: 10px;
            }

            .max-width {
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                white-space: nowrap;
            }
            .min-width {
                min-width: 80px;
            }
        }

        .el-table__body-wrapper {
            overflow-x: hidden !important;
            overflow-y: scroll !important;
        }
        .page_absolute {
            position: relative;
            box-sizing: border-box;
            z-index: 999;
            background: #fff;
            text-align: right;
            padding-bottom: 3px;
            margin-top: 10px;
            margin-bottom: 5px;
        }
    }

    @media all and (max-width: 1366px) {
        .p-weighing-packages {
            .table_head {
                .c-label-item {
                    margin: 0;
                }
                .max-width {
                    max-width: 40px;
                }
                .min-width {
                    min-width: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>
<script>
    import {api_package_collection, api_delete_package} from '@/api/weighing-packages'

    export default {
        data() {
            return {
                loading: false,
                collect_type: this.collection.collect_type,
                curData: [],
                page: 1,
                pageSize: 50,
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            async finish() { //集结完成，传递打印信息，基本来自本地数据，
                let id = this.collection.id;
                try {
                    let result = await this.$http(api_package_collection, id);
                    this.$message({type: 'success', message: '集结完成...'});
                    this.$emit('show-printdata', {
                        title: `集结完成${this.collection.code}`,
                        id: this.collection.id,
                        collector_name: result.collector_name,
                        shipping_name: result.shipping_name,
                        collect_type: result.collect_type,
                        collect_weight: result.collect_weight,
                        collect_label: result.collect_label,
                        package_weight: result.package_weight,
                        quantity: result.quantity,
                        creator: result.creator,
                        packing_time: datef("YYYY-MM-dd HH:mm:ss", new Date().getTime() / 1000),
                    }, {
                        collect_type: this.collection.collect_type,
                        code: this.collection.code,
                    });
                } catch (code) {
                    this.collect.collect_type = value;
                }
            },
            remove_package(item) {
                this.$http(api_delete_package, item.id).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit('remove-package', item)
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            set_collect_type(val) {
                this.$emit('change-collect-type', val);
            },
            autoCollectType(nth) {
                if (this.collectTypes.length >= (nth + 1)) {
                    return this.collectTypes[nth].value;
                } else {
                    return 0;
                }
            },
            handle_size_change(val) {
                this.pageSize = val;
                let maxPage = Math.ceil(this.packages.length / this.pageSize) - 1;
                this.page = this.page > maxPage ? maxPage : this.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.page = val;
                this.paging_handle();
            },
            paging_handle() {
                this.curData = this.pagingData[this.page - 1];
            },
            row_key(row) {//优化表格渲染
                return row && row.package_number;
            }
        },
        computed: {
            packages() {
                return this.collection.packages || [];
            },
            pagingData() { // 分页
                let pagingData = [];
                if (this.packages.length === 0) {
                    return pagingData;
                }
                let length = Math.ceil(this.packages.length / this.pageSize);
                for (let i = 0; i < length; i++) {
                    let start = i * this.pageSize;
                    pagingData.push(this.packages.slice(start, start + this.pageSize));
                }
                return pagingData;
            },
            packageWeight() {
                return this.packages.reduce((sum, pack) => sum + parseInt(pack.package_weight), 0);
            },
            packageCount() {
                return this.packages.length;
            },
            total() {
                return this.packages.length || 0;
            }

        },
        watch: { // 只获取一次，因此只有一次改变
            collectTypes() {
                this.collect_type = this.autoCollectType(0);
            },
            pagingData() {
                this.paging_handle();
            },
            collection() {
                this.collection.collect_type = this.collect_type;
            }
        },
        props: {
            collection: {},
            shippingId: {},
            collectTypes: {}
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item.vue').default
        },
    }
</script>
