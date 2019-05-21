<template>
    <div class="infringement-search">
        <search-card @search="search" :clears="clears" :params="searchData">
            <!--SPU-->
                <label class="ml-sm">SPU：</label>
                <order-input
                    v-model="searchData.spu"
                    v-sf.spu
                    class="inline width-super"
                    :placeholder="$t('ymx-list.searchTip')"
                    @keydown="search"></order-input>
                <label-item class="ml-sm">
                    <!--侵权平台/所属平台-->
                    <el-select v-model="searchData.snType" v-sf.snType :placeholder="$t('ymx-list.pleaseChoose')">
                        <el-option
                            v-for="item in platformTypeArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <super-select
                        style="padding-left:5px;width:120px;"
                        v-model="searchData.snText"
                        @change="change"
                        :options="platform"
                        storageKey="platform"
                        :isPaging="false"
                    ></super-select>
                    <super-select
                        style="padding-left:5px;width:120px;"
                        v-model="searchData.siteCode"
                        :options="platformchildrenTypeArr"
                        :disabled="platformchildrenTypeArr.length<=1"
                        v-sf.childrensnType
                        storageKey="platformchildrenTypeArr"
                        :isPaging="false"
                    ></super-select>
                </label-item>
                <!--侵权描述-->
                <label-item class="ml-sm" label="侵权类型：">
                    <el-select v-sf.tortText v-model="searchData.tortText"
                               style="width:120px;padding-left:5px;" clearable>
                        <el-option
                            v-for="item in infringementSearchArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </label-item>
                <label-item class="ml-sm">
                    <el-select v-sf.time_type v-model="searchData.time_type">
                        <el-option
                            v-for="item in time_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </label-item>
                <el-date-picker class="inline date" v-model="searchData.start_time" v-sf.start_time type="date"
                                :picker-options="pickerstart" style="width: 120px;"
                                :placeholder="$t('ymx-list.addTaskDate')"></el-date-picker>
                --
                <el-date-picker class="inline date" v-model="searchData.end_time" v-sf.end_time type="date" style="width: 120px"
                                :picker-options="pickerend" :placeholder="$t('ymx-list.addTaskDate')"></el-date-picker>
            <label-item label="产品分类：" class="mr-sm" style="margin-left: 10px;">
                <el-cascader
                    clearable
                    filterable
                    change-on-select
                    style="margin-right: 0px"
                    v-sf.category_id
                    :disabled="categoryTree<=0"
                    class="inline mr-sm s-width-default"
                    v-model="searchData.category"
                    expand-trigger="hover"
                    :options="categoryTree"
                ></el-cascader>
            </label-item>
        </search-card>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
    </div>
</template>

<style lang="stylus">
    .infringement-search {
        .el-card {
            overflow: visible;
        }

        .el-select {
            width: 115px;
        }

        .el-date-editor {
            width: 140px !important;
        }
    }


</style>
<script>
    import {
        api_account_list
    } from '../../../api/order-local';
    import {api_mymall_category_tree} from '@/api/shopee-publish';

    export default {
        data() {
            return {
                platformTypeArr: [{label: '侵权平台', value: 'tort_channel'}, {label: '所属平台', value: 'goods_channel'}],//平台类型
                platformchildrenTypeArr: [],
                time_type: [{label: "侵权时间", value: 1}, {label: '添加时间', value: 2}],
                // platform:[],//平台列表
                pickerstart: {
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time
                        }else {
                            return false
                        }
                    },
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time;
                        } else {
                            return false;
                        }
                    }
                },
                infringementSearchArr: [{label: '全部', value: ''}, {label: '图片侵权', value: '图片侵权'}, {
                    label: '商标侵权',
                    value: '商标侵权'
                }, {label: '著作权侵权', value: '著作权侵权'}, {label: '外观设计侵权', value: '外观设计侵权'}, {
                    label: '禁限售产品',
                    value: '禁限售产品'
                }, {label: '其他知识产权侵权', value: "其他知识产权侵权"}],
                infringementSearchInput: [],
                categoryTree: []
            }
        },
        mounted() {
            this.get_category_tree()
        },
        methods: {
            change(channel_id) {
                this.$http(api_account_list, {channel_id: channel_id}).then(res => {
                    this.searchData.siteCode = '';
                    if (res.site.length === 0) {
                        this.platformchildrenTypeArr = []
                    } else {
                        this.platformchildrenTypeArr = [...res.site];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            get_category_tree() {
                this.$http(api_mymall_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                });
            },
            data_format(val) {
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            /*搜索数据*/
            search() {
                this.$emit('search-data');
            },
            /*改变页数和改变页面数据量*/
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.search();
            },
            //获取侵权平台
        },
        props: {
            searchData: {
                type: Object
            },
            clears: {},
            total: {
                required: true,
                type: Number,
                default() {
                    return 0
                }
            },
            platform: {
                required: true,
                type: Array,
            }
        },
        components: {
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default,
            orderInput: require("@/components/order-input.vue").default,
        }
    }
</script>

