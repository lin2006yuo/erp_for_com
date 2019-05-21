<template>
    <ui-card class="c-collector-list">
        <div slot="header" class="ui-card-header">
            <span class="title">Wish物流商</span>
            <div class="inline">
                <el-input class="inline width-super" v-model="snText" placeholder="请输入名称/代码..."
                          @keyup.native.enter="init"></el-input>
                <el-button class="ml-sm" type="primary" @click.native="init" size="mini" icon="search">搜索</el-button>

                <permission tag="ElButton" type="primary" @click.stop.prevent.native="add" size="mini"
                            :route="apis.url_add_wish_carrier" icon="plus">添加
                </permission>
            </div>
        </div>
        <el-table
                :data="wishList"
                highlight-current-row
                @row-click="check_wish"
                :current-row-key="wishId"
                row-key="id"
                v-resize="{height:41}"
                v-loading="loading" element-loading-text="玩命加载中..." border>
            <el-table-column inline-template label="物流名称" align="center" show-overflow-tooltip>
                <ui-tip :content="row.name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column property="code" label="物流代码" align="center"></el-table-column>
            <el-table-column property="company_name" label="申请公司" align="center"></el-table-column>
            <el-table-column inline-template label="状态" align="center" width="60">
                <div>
                    {{row.status|statusFilter}}
                </div>
            </el-table-column>
            <el-table-column inline-template label="添加/修改时间"  align="center" width="180" show-overflow-tooltip>
                <div class="t-left">
                    {{row.create_time|timeFilter}}/
                    {{row.update_time|timeFilter}}
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="pagination.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=pagination.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total
                class="t-right mt-sm">
        </el-pagination>
    </ui-card>
</template>

<style lang="stylus">
    .c-collector-list {
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
    }
</style>

<script>
    import {api_wish_carrier, url_wish_carrier, url_add_wish_carrier} from "@/api/wish-carrier";

    export default {
        permission: {
            url_add_wish_carrier,
            url_wish_carrier,
        },
        data() {
            return {
                wishId: '',
                wishList: [],
                pagination: {
                    page: 1,
                    pageSize: 50,
                },
                snText: '',
                total: 0,
                loading: false,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.snText = this.snText.trim();
                this.loading = true;
                let params = Object.assign({}, this.pagination, {snText: this.snText});
                this.$http(api_wish_carrier, params).then(res => {
                    this.total = res.count;
                    this.wishList = res.data;
                    this.loading = false;
                    if (this.total === 0) {//若物流商，则自动转换为添加物流商
                        this.$emit('add');
                    } else {
                        this.check_wish(this.wishList[0]);
                    }
                }).catch(code => {
                    this.loading = false;
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    });
                }).finally(()=> {
                    this.snText = '';
                })
            },
            check_wish(row) {
                this.wishId = row.id;
                this.$emit('get-wish-info', this.wishId);
            },
            add() {
                this.$emit('add');
            },
            // 更新编辑后的信息，本地更新不重新获取数据
            /*update(info) {
                let wish = this.wishList.findIndex(row => row.id === this.wishId);
                this.$set(this.wishList, wish, info);
            },*/
            handle_size_change(val) {
                this.pagination.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.pagination.page = val;
                this.init();
            }
        },
        filters: {
            timeFilter(val){
                return datef('YYYY-MM-dd',val);
            },
            statusFilter(val){
                return val == 1 ? '启用' : '停用';
            }
        },
        watch: {
            wishId(val) {
            }
        },
        props: {},
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            uiCard: require('@/components/ui-card.vue').default,
            titleList: require('../setLogistics/title-list.vue').default,
        }
    }
</script>
