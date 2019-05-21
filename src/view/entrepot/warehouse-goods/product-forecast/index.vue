<template>
    <page class="p-index">
        <search-module @search="init_data"
                       v-model="warehouse_type"
                       @clear="clear_pagination"
                       @warehouse-change="warehouse_type_change"></search-module>
        <table-module :table-data="tableData"
                      v-model="paramsData.category_id"
                      :loading="loading"
                      :pagination="pagination"
                      :total="total"
                      @change-category="categories_click"
                      @add-forecast="add_forecast"
                      @size-change="handle_size_change"
                      @relate="relate_sku"
                      @look="look"
                      @current-change="handle_current_change"></table-module>
        <add-forecast v-model="visible"
                      :warehouse_type="warehouse_type"
                      @upload-forecast="upload"
                      :forecast-category="options"></add-forecast>
        <look-forecast v-model="lookVisible" :forecast-detail="forecastDetail"></look-forecast>
        <add-goods v-model="goodsDialog"
                   @relate="relate"
                   :warehouse="warehouse_type"
                   :relate="goodsDialog"
                   :thirdSku="third_sku"
                   :is_multi_warehouse="0"></add-goods>
    </page>
</template>
<style lang="stylus">
    @media screen and (min-width: 1366px) {
        .el-table th {
            width: 60px;
        }
    }
</style>
<script>
    import {
        api_forecast_list, //预报列表
        api_relate_sku, //关联sku
        api_forecast_category, //获取预报品类
        api_forecast_detail //预报品类详情
    } from '../../../../api/warehouse-goods-forecast.js';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '赖永凤',
                createTime: '2018-5-22',
                updateTime: '2018-5-30'
            }
        },
        permission: {},
        data() {
            return {
                pagination: {
                    page: 1,
                    pageSize: 20,
                },
                total: 0,
                warehouse_type: 1,
                paramsData: {
                    category_id: ''
                },
                tableData: [],
                categoryThree: [],//第三级预报品类缓存
                options: [],//预报品类
                forecastDetail: {},
                third_sku: '',
                visible: false,
                loading: false,
                lookVisible: false,
                goodsDialog: false
            }
        },
        mounted() {
            if (this.options.length === 0) {
                this.init_forecast_category();
            }
        },
        methods: {
            init_data(searchData) {
                this.clear_pagination();
                Object.assign(this.paramsData, this.pagination, searchData);// 组合最终的查询参数
                this.search();
            },

            init_forecast_category() {
                this.options = []; // 每次获取产品分类前先清空
                this.$http(api_forecast_category, {warehouse_type: this.paramsData.warehouse_type || this.warehouse_type}).then(res => {
                    this.generate_category_list(res);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            // 生成品类级联列表
            generate_category_list(res) {
                let categoryOne = [];
                let categoryTwo = [];
                let categoryThree = [];
                res.forEach(category => {// 遍历数据，分成三个等级
                    switch (category.category_level) {
                        case 0:
                            categoryOne.push(category);
                            break;
                        case 1:
                            categoryTwo.push(category);
                            break;
                        case 2:
                            categoryThree.push(category);
                            break;
                        case 3: //有的仓库可能有level===3的情况，将该品类直接方法到第三级品类缓存中
                            categoryThree.push(category);
                            break;
                    }
                });
                this.categoryThree = categoryThree;
                categoryOne.forEach(res => {
                    let option = {};
                    option.label = res.category_name;
                    option.value = res.id;
                    option.children = this.get_option_children(res.child_ids, categoryTwo);
                    this.options.push(option);
                });
                this.options.push({label: '同上', value: -1});
            },
            get_option_children(childIds, categoryList) {//获取options，只考虑了三级递归，超过三级需要categoryList参数为对象或数组结构
                let children = [];
                try {
                    childIds.forEach(id => {
                        let category = categoryList.find(res => res.id === id);
                        let option = {};
                        option.label = category.category_name;
                        option.value = category.id;
                        if (category.child_ids.length > 0) {
                            option.children = this.get_option_children(category.child_ids, this.categoryThree)
                        }
                        children.push(option);
                    });
                } catch (e) {
                    this.$message({type: 'error', message: e.message || e});
                }
                return children;
            },

            search() {
                this.loading = true;
                this.$http(api_forecast_list, this.paramsData).then(res => {
                    this.loading = false;
                    this.total = res.count;
                    this.tableData = res.data;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: 'error', message: code.message || code});
                });
            },

            add_forecast() {//点击添加预报
                this.visible = true;
            },
            upload() { //上传预报成功后重新加载数据，默认为第一页
                this.handle_current_change(1);
            },

            warehouse_type_change(searchData) {// 仓库变动后重新搜索和获取预报品类
                this.clear_pagination();
                this.init_data(searchData);
                this.init_forecast_category();
            },
            categories_click(node) {
                if (typeof node === 'number') {
                    this.paramsData.category_id = node;
                    this.clear_pagination();
                    this.search();
                }
            },
            handle_size_change(val) {
                this.pagination.pageSize = val;
                const new_max_page = Math.ceil(this.total / this.pagination.pageSize);
                this.pagination.page = this.pagination.page > new_max_page ? new_max_page : this.pagination.page;
                Object.assign(this.paramsData, this.pagination);
                this.search();
            },
            handle_current_change(val) {
                this.pagination.page = val;
                Object.assign(this.paramsData, this.pagination);
                this.search();
            },

            look(row) {
                this.get_forecast_detail(row.id);
            },
            get_forecast_detail(id) {
                this.$http(api_forecast_detail, id).then(res => {
                    this.forecastDetail = res;
                    this.lookVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },

            relate_sku(row) {//点击关联
                this.third_sku = row.third_sku;
                this.goodsDialog = true;
            },
            relate(params) {
                this.$http(api_relate_sku, params).then(res => {// 关联完成后重新获取数据
                    console.log('relate sku', res);
                    this.$message({type: 'success', message: res});
                    this.goodsDialog = false;
                    this.handle_current_change(1);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },

            clear_pagination() {// 清空条件分页信息回到初始值
                this.pagination = {
                    page: 1,
                    pageSize: 20,
                }
            },
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            addForecast: require('./add-forecast').default,
            lookForecast: require('./look-forecast.vue').default,
            addGoods: require('./add-goods.vue').default
        }
    }
</script>
