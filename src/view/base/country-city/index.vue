<template>
    <page>
        <search-card @search="search"
                     @enter="search"
                     :params="searchData"
                     :clears="clears">
            <label-item label="国家：" class="mr-sm">
                <el-select class="width-md"
                           v-model="searchData.country"
                           filterable
                           clearable
                           placeholder="请选择">
                    <el-option
                        v-for="item in indexCountryList"
                        :key="item.country_cn_name"
                        :label="item.country_cn_name"
                        :value="item.country_code">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>

        <el-row class="mt-xs mb-xs">
            <el-button size="mini"
                       type="primary"
                       @click.native="add">添加
            </el-button>
        </el-row>

        <add v-model="dialogShow"
             title="新增"
             :base-data="form"
             :country-list="countryList"
             @search="init">
        </add>
        <el-row>
            <el-col :span="leftSpan">
                <table-list :loading="loading"
                            :table-data="tableData"
                            @row-click="rowClick"
                            @search="search"
                >
                </table-list>
                <el-pagination class="text-align-right"
                               @size-change="size_change"
                               @current-change="page_change"
                               :current-page="tableData.page-0"
                               :page-sizes="[20, 50,100, 200, 500]"
                               :page-size="tableData.pageSize-0"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="tableData.count-0">
                </el-pagination>
            </el-col>
            <el-col v-if="rightShow" class="ml-sm" :span="rightSpan">
                <table-city
                    :loading="loading1"
                    @search="init"
                    :table-data="tableCity"
                >
                </table-city>
            </el-col>
        </el-row>
    </page>
</template>

<script>
    import {
        api_country_list,
        api_country_area,
        api_list_country,
        api_country_index
    } from '../../../api/global-countries';

    export default {
        name: "index",
        data() {
            return {
                countryList: [],  // 所有的国家列表城市
                indexCountryList: [],
                searchData: {
                    country: "",
                },
                clears: {
                    country: "",
                },
                loading: false,
                loading1: false,
                tableCity: {
                    page: 1,
                    pageSize: 20,
                    data: [],
                    count: 0
                },
                tableData: {
                    page: 1,
                    pageSize: 20,
                    data: [],
                    count: 0
                },
                dialogShow: false,
                form: {},
                addDialog: {
                    country: "",
                    list: [
                        {english_name: "", name: "",}
                    ]
                },
                page: 1,
                pageSize: 20,
                leftSpan: 24,
                rightSpan: 0,
            }
        },
        mounted() {
            // 先获取一次弹框国家列表。
            this.getCountryList();
            // 获取index页面的国家列表下拉框的数据。
            this.init(1);
        },
        methods: {
            search() {
                // 按请求完成后台的请求。
                this.init();
            },
            add() {
                this.dialogShow = true;
                this.form = clone(this.addDialog);
            },
            page_change(val) {
                this.tableData.page = val;
                this.init();
            },
            size_change(val) {
                this.tableData.pageSize = val;
                this.init();
            },
            //  打开对话框，获取国家list列表。
            getCountryList() {
                let params = {
                    zone_code: "all",
                    snText: "",
                };
                this.$http(api_country_list, params).then(res => {
                    this.countryList = res;
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.message || err
                    });
                });
            },
            // 获取有城市的国家。
            init(flag) {
                let params = {
                    page: this.tableData.page - 0,
                    pageSize: this.tableData.pageSize - 0,
                    country_code: this.searchData.country
                };
                this.loading = true;
                this.$http(api_list_country, params).then(res => {
                    // 只有两种情况 1种新增的话，是数据量增多，另一种是单个搜索,量只有一个。
                    if (res.data.length > this.indexCountryList.length) {
                        this.indexCountryList = clone(res.data);
                        this.indexCountryList.unshift({country_cn_name: '全部', country_code: ""});
                    }
                    this.tableData = res;
                //  需要默认进来看到城市，完成搜索的话，看城市list的数据为不为空，如果为空的话，就给第一个国家的城市信息。
                    if (!this.tableCity.data.length) {
                       //  如果长度为0的话，就去请求tableData的第一个国家的数据。
                       this.rowClick(this.tableData.data[0]);
                    }
                //  每次搜索完成后置空城市。
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.message || err
                    });
                }).finally(() => {
                    this.loading = false;
                });
            },
            //  点击当前国家列表行。
            rowClick(row) {
                let params = {
                    country_code: row.country_code,
                };
                this.loading1 = true;
                this.$http(api_country_index, params).then(res => {
                    this.tableCity = res;
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.message || err
                    });
                }).finally(() => {
                    this.loading1 = false;
                });
            },
        },
        computed: {
            rightShow() {
                if (this.tableCity.data.length) {
                    this.leftSpan = 11;
                    this.rightSpan = 12;
                    return true;
                } else {
                    this.leftSpan = 24;
                    this.rightSpan = 0;
                    return false;
                }
            }
        },
        components: {
            tableList: require("./table-list").default,
            tableCity: require("./city-table").default,
            labelItem: require('../../../components/label-item').default,
            add: require('./add').default
        }
    }
</script>

<style lang="stylus" scoped>
    .text-align-right {
        text-align right
    }
</style>
