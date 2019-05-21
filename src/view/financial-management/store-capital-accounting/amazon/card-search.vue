<template>
    <search-card @search="search" :clears="clears" :params="form">
        <label-item label="站点：" class="ml-sm">
            <!--            <el-select class="inline s-width-default"-->
            <!--                       v-model="form.site"-->
            <!--                       filterable v-sf.site clearable>-->
            <!--                <el-option v-for="(item, index) in siteList"-->
            <!--                           :value="item.value"-->
            <!--                           :label="item.label"-->
            <!--                           :key="index"></el-option>-->
            <!--            </el-select>-->
            <select-account
                class="width-sm"
                v-model="form.site"
                type="site"
                :param="{channel_id: 2}"
            ></select-account>
        </label-item>
        <label-item label="账号简称：" class="ml-sm">
            <!--<el-select v-model="form.account_id"-->
            <!--placeholder="请输入/选择..."-->
            <!--filterable clearable>-->
            <!--<el-option v-for="item in shortAccount"-->
            <!--:value="item.value"-->
            <!--:key="item.value"-->
            <!--:label="item.label"></el-option>-->
            <!--</el-select>-->
            <select-account
                class="width-sm"
                v-model="form.account_id"
                type="account"
                :param="{channel_id: 2, site_code:this.form.site}"
                ref="selectAccount"
            ></select-account>
        </label-item>
        <label-item class="ml-sm" label="销售部门：">
            <el-select
                class="inline width-super mr-sm"
                v-model="form.department_id"
                filterable clearable
                placeholder="请选择部门"
                v-sf.snText
            >
                <el-option
                    v-for="item in condition"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    <div :style="add_style(item)">{{item.name}}</div>
                </el-option>
            </el-select>
        </label-item>

        <label-item class="ml-sm" label="销售员：">
            <super-select   v-model="form.seller_id"
                            storageKey="summarySellerSelect11"
                            :options="seller_list"
                            :placeholder="'请输入/选择...'"
                            v-sf.account_creator>
            </super-select>
        </label-item>

        <label-item label="选择日期范围：" class="ml-sm">
            <el-date-picker
                class="inline date"
                v-model="form.start_time"
                :picker-options="pickerstart"
                placeholder="开始时间">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                class="inline date mr-sm"
                v-model="form.end_time"
                :picker-options="pickerend"
                placeholder="结束时间">
            </el-date-picker>
        </label-item>
    </search-card>
</template>
<style lang="stylus" scoped>
    .el-card
        overflow visible !important
</style>

<script>
    // import {api_has_publish_list, api_account_site,api_get_amazon_account} from '@/api/amazon-publish-list';
    import {api_publish_amazon_seller} from '../../../../api/amazon-publish-list';
    import {api_get_amazon_site, api_seller_list, api_get_amazon_account} from '@/api/store-captial-accounting'
    import {api_get_department} from '../../../../api/user-management'

    export default {
        data() {
            return {
                siteList: [],
                seller_list: [],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.form.end_time) {
                            return time.getTime() > this.form.end_time;
                        } else {
                            return false;
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.form.start_time && time.getTime() < this.form.start_time) {
                            return time.getTime() < this.form.start_time;
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                shortAccount: [],
                urlcreater: 'get|orders/account',
                temp: '',
                accountOptions: [],
                sellerArray: [],
                condition: '', // 销售员的部门数据。
            }
        },
        mounted() {
            this.get_seller_options();
            this.get_department();

            this.$http(api_seller_list,{channel_id:2}).then(res=>{
                this.seller_list = res.filter(row=>row.seller_id!==0);
                this.seller_list=this.seller_list.map(item=>{
                    return {label:item.username,value:item.seller_id};
                });
            }).catch(err=>{
                console.log(err)
            });
        },
        computed: {
            account_creator: {
                get() {
                    return {label: this.form.account, value: this.form.account_id}
                },
                set(val) {
                    this.form.account = val ? val.label : '';
                    this.form.account_id = val ? val.value : '';
                }
            },
        },
        methods: {
            search() {
                this.$emit('search');
            },
            /** 得到部门list. */
            get_department() {
                this.$http(api_get_department).then(res => {
                    this.muiSelects = res;
                    let data = [];

                    function pends(data, i, all) {
                        let length = data.length;
                        data[length - 1].depth = i;
                        if (data[length - 1].child_ids.length > 0) {
                            i++;
                            data[length - 1].child_ids.forEach(id => {
                                    data.push(all[id])
                                    if (all[id].child_ids.length > 0) {
                                        pends(data, i, all)
                                    }
                                }
                            )
                        }
                    }

                    res.child_ids.forEach(id => {
                        data.push(res[id]);
                        pends(data, 0, res)
                    });
                    this.condition = data;
                }).catch(code => {
                    console.log(code);
                })
            },
            /** 调整数据的样式。 */
            add_style(item) {
                let padd = item.depth * 20;
                return {
                    paddingLeft: `${padd}px`,
                }
            },
            /** 销售员的数据 */
            get_seller_options() {
                this.$http(api_publish_amazon_seller, 2)
                    .then(res => {
                        this.sellerArray = [...res];
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            // fix_params_account({page,pageSize,keyword}){
            //     this.temp=keyword||'';
            //     return {page:page?page:1,pageSize:pageSize?pageSize:10,snText:keyword||'',channel_id:2,site_code:this.form.site?this.form.site:''};
            // },
            // fix_result_account(res){//数据太多，后端添加page和pageSize字段
            //     return {
            //         options:!!this.temp?res.account.filter(row=>row.label.indexOf(this.temp)!==-1):res.account,
            //         page: res.page,
            //         count: res.count,
            //     }
            // },
            // get_account(page, pageSize, query){
            //     return api_get_amazon_account({channel_id:2,site_code:this.form.site?this.form.site:''});
            // },
            adjust_account(res) {
                console.log("account数据:", res);
                res = res.account.map(item => {
                    return {label: item.label, value: item.value};
                });
                return {data: res, count: res.length};
            }
        },
        props: {
            form: {},
            clears: {}
        },
        watch: {
            'form.site'() {
                this.$nextTick(() => {
                    this.$refs.selectAccount.get_list()
                })
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            scrollSelect: require('@/components/scroll-select').default,
            paramAccount: require('@/api-components/param-account').default,
            selectAccount: require('@/api-components/select-account').default
        }
    }
</script>
