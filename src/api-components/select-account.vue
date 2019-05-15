<!--
    说明:   封装super-select组件，提供获取数据的能力，你不需要在主页面写请求数据的方法，因为组件都帮你封装好了，
            根据传入类型type，获取不同的数据，可缓存数据。
            目前可获取的类型请查看switch语句。
    props:
        type: 数据类型，对应switch语句中的case，类型详细查看switch语句定义，必填
        param: 请求的参数
        all: 是否添加【全部】选项
    使用：
        1.  静态数据，例：获取销售员
            <select-account
                class="width-sm"
                v-model="searchData.seller_id"
                type="seller"
            ></select-account>
        2.  动态数据，例：获取账号简称
            <select-account
                class="width-sm"
                ref="selectAccount"
                v-model="searchData.account_id"
                type="account"
                :param="{channel_id: searchData.channel_id, site_code: searchData.site_code}" //传递的参数
            ></select-account>

            //监听channel_id变化，调用组件get_list方法重新调用api
            watch: {
                'searchData.channel_id'(val) {
                    this.$nextTick(() => {        //注意：必须在nextTick中调用，防止视图未更新，调用api传入的参数仍为上次未修改的参数
                        this.$refs.selectAccount.get_list()
                    })
                },
            }
      扩展：
          在switch语句中新增一条case即可（注意：后端接口返回的数据必须为一个数组，否则修改get_list方法），
          case返回一个对象
            {
                api: 调用数据的接口
                handle: 数据处理函数，回调参数为数组的每一项
                key: storage-key值
            }


-->
<template>
    <super-select
        class="super-select"
        :storage-key="server.key"
        :options="options"
        :value.sync="value"
        :placeholder="placeholder"
        @input="handle_input"
        @change="handle_change"
        :disabled="disabled"
        :clearable="true"
    ></super-select>
</template>


<script>
    import {mapGetters} from 'vuex'
    import {api_development} from '@/api/assert-sup' //获取开发员   李倩霞 张洪 肖冬冬
    import {api_user_warehouse} from '@/api/search-parcel' //获取操作人 戴怡青 王称意 李金山
    import {api_get_channel} from '@/api/delivery-list' //获取平台 ebay --- walmart
    import {api_get_warehouse} from '@/api/delivery-list' //获取仓库 中山仓 --- 冠通W0058
    import {api_warehouse_get} from '@/api/stock-control' //获取仓库 中山仓 --- jumia香港代发仓
    import {api_all_warehousre} from '@/api/inventory-summary' //获取所有仓库
    import {api_get_seller} from '@/api/platform-statistics' //获取销售员 李牧远 戴怡青 黄延 李倩霞
    import {api_account_list} from '@/api/report-channel' //获取账号简称
    import {api_get_carrier} from '@/api/delivery-list' //获取物流商
    import {api_pack_getSupplier} from '@/api/pack'; //获取供应商
    import {api_get_publish} from '@/api/procurement-plan'; //获取采购员
    import {api_get_currency} from '@/api/stock-control' ///获取币种
    export default {
        data() {
            return {
                options: []
            }
        },
        mounted() {
            this.get_list()
        },
        methods: {
            get_list() {
                let account
                try {
                //vuex/storage getAllOptions方法reduce没有给初始化值，trycatch包裹防止报错不执行后面代码
                    account = this.getAllOptions(this.server.key)
                } catch (e) {

                }
                //如果vuex存在数据, 且不为accoun,site(account,site需要实时调用api)，则从vuex取值
                if(account && account.length &&
                    this.server.key !== 'ra-account' && this.server.key !== 'ra-site'
                ) {
                    const hasAll = account.slice(0,1)[0].label === '全部'
                    this.options = this.all && !hasAll ? [{label: '全部', value: ''}, ...account]
                        : account
                } else {
                //不存在则调用api
                    this.$http(this.server.api, this.param).then(res => {
                        //账号简称的数据在res.account中
                        if(this.type === 'account') {
                            account = res.account.map(this.server.handle)
                        } else if(this.type === 'site') {
                            account = res.site.map(this.server.handle)
                        }else {
                            account = res.map(this.server.handle)
                        }
                        this.options = this.all ? [{label: '全部', value: ''}, ... account]
                            : account
                    })
                }
            },
            handle_input(val) {
                this.$emit('input', val)
            },
            handle_change(val) {
                let account = this.getAllOptions(this.server.key)
                const item = account.find(item => {
                    return item.value === val
                })
                this.$emit('change', item)
            }
        },
        computed: {
           server() {
               switch(this.type) {
                   //开发员
                   case 'developer':
                       return {
                           api: api_development,
                           handle: (i) => ({
                               label: i.realname,
                               value: i.id
                           }),
                           key: 'ra-developer',
                       }
                   //操作人
                   case 'operator':
                       return {
                           api: api_user_warehouse,
                           handle: (i) => ({
                               label: i.realname,
                               value: i.id
                           }),
                           key: 'ra-operator',
                       }
                   //获取平台
                   case 'platform':
                       return {
                           api: api_get_channel,
                           handle: (i) => ({
                               label: i.label,
                               value: i.value
                           }),
                           key: 'ra-platform',
                       }
                   // 获取仓库 中山仓 --- 冠通W0058
                   case 'warehouse':
                       return {
                           api: api_get_warehouse,
                           handle: (i) => ({
                               label: i.label,
                               value: i.value
                           }),
                           key: 'ra-warehouse',
                       }
                   // 获取仓库 中山仓 --- jumia香港代发仓
                   case 'warehouse2':
                       return {
                           api: api_warehouse_get,
                           handle: (i) => ({
                               label: i.label,
                               value: i.value
                           }),
                           key: 'ra-warehouse2',
                       }
                   //获取所有仓库
                   case 'warehouse_all':
                       return {
                           api: api_all_warehousre,
                           handle: (i) => ({
                               value: i.id,
                               label: i.name
                           }),
                           key: 'ra-warehouse-all',
                       }
                       //销售员
                   case 'seller':
                       return {
                           api: api_get_seller,
                           handle: (i) => ({
                               value: i.id,
                               label: i.realname
                           }),
                           key: 'ra-seller',
                       }
                       //获取账号简称，需要传param
                   case 'account':
                       return {
                           api: api_account_list,
                           handle: (i) => ({
                               value: i.id,
                               label: i.label
                           }),
                           key: 'ra-account',
                       }
                       //获取站点
                   case 'site':
                       return {
                           api: api_account_list,
                           handle: (i) => ({
                               value: i.value,
                               label: i.label
                           }),
                           key: 'ra-site',
                       }
                       //物流商
                   case 'delivery':
                       return {
                           api: api_get_carrier,
                           handle: (i) => ({
                               value: i.id,
                               label: i.fullname
                           }),
                           key: 'ra-delivery',
                       }
                       //获取供应商
                   case 'supplier':
                       return {
                           api: api_pack_getSupplier,
                           handle: (i) => ({
                               value: i.id,
                               label: i.company_name
                           }),
                           key: 'ra-supplier',
                       }
                   //获取采购员
                   case 'purchaser':
                       return {
                           api: api_get_publish,
                           handle: (i) => ({
                               value: i.id,
                               label: i.realname
                           }),
                           key: 'ra-purchaser',
                       }
                   //获取币种
                   case 'currency':
                       return {
                           api: api_get_currency,
                           handle: (i) => ({
                               value: i.code,
                               label: i.code
                           }),
                           key: 'ra-currency',
                       }

               }
           },
            disabled() {
                switch (this.type) {
                    case 'account':
                        if(this.options && this.options.length) return false
                        else return true
                    case 'site':
                        if(this.options && this.options.length) return false
                        else return true
                    default:
                        return false
                }
            },
            placeholder() {
                switch (this.type) {
                    case 'account':
                        if(this.options && this.options.length) return '输入搜索更多'
                        else return '请先选择平台'
                    case 'site':
                        if(this.options && this.options.length) return '输入搜索更多'
                        else return '请先选择平台'
                    default:
                        return '输入搜索更多'
                }
            },
            ...mapGetters('storage',[
                'getAllOptions'
            ])
        },
        components: {
            // superSelect: require('@/components/super-select').default
        },
        props: {
            type: {
                type: String,
                required: true
            },
            value: {},
            all: {
                type: Boolean
            },
            param: {
                type: Object,
                default: () => {}
            }
        },
    }
</script>

<style scoped>
.super-select {
    display: inline-block;
    vertical-align: middle;
}
</style>
