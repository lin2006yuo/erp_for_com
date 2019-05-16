<!-- 
    说明： 封装级联选择组件，提供获取数据的能力，组件内部根据传入类型，调用对应接口，不需要在主页面请求接口，数据会缓存在vuex中
           目前支持的类型有：
            |name              |type           |
            |------------------|:-------------:|
            |运输方式、邮寄方式  |shipping       |
            |商品分类           |goods          |
    props: 
        value：              v-model绑定值，必填
        type:                需要获取的数据类型，必填
        warehouseId：        仓库id，组件根据仓库id获取对应的运输方式，当type为shipping时必填，组件需要根据warehouseId获取对应的运输方式
        {String} valueType:  v-model绑定的类型，默认为'int',后端需要传最后一个地址的id号，则传'int'，后端需要传数组，则传'array'(或随便填)
    使用：
        以获取运输方式为例：
        <cascader-select
            :warehouseId="searchData.warehouse_id"
            v-model="searchData.shipping"
            type="shipping"
        />
 -->
<template>
    <el-cascader
        clearable
        filterable
        change-on-select
        :disabled="cascaderData.length<=0"
        :placeholder="comHolderShipping"
        class="inline"
        :class="{'s-width-large': type === 'shipping', 'width-sm': type === 'goods'}"
        :value="innerValue"
        @input="handleInput"
        v-sf.shipping
        expand-trigger="hover"
        :options="cascaderData"
    ></el-cascader>
</template>
<script>
    import {api_get_categories} from '@/api/stock-control'
    import {api_get_shipping } from '@/api/common.js';
    import {mapActions, mapGetters} from 'vuex'
    export default {
        data() {
            return {
                cascaderData: [],
                innerValue: []
            }
        },
        mounted() {
            this.initData()
        },
        computed: {
            server() {
                switch(this.type) {
                    case 'shipping':
                        return {
                            api: api_get_shipping,
                            params: {warehouse_id: this.warehouseId},
                            handle: this.handleShppingList,
                            key: 'ra-cascader-shipping'
                        }
                    case 'goods':
                        return {
                            api: api_get_categories,
                            handle: this.handleGoodsList,
                            key: 'ra-cascader-goods'
                        }
                    default:
                        new Error('未匹配到该类型，请输入正确类型或扩展该类型')
                }
            },
            comHolderShipping() {
                switch (this.type) {
                    case 'shipping': {
                        if (!this.warehouseId) {
                            return "请先选择发货仓库"
                        } else if (!!this.warehouseId && this.cascaderData.length <= 0) {
                            return "该发货仓库下暂无运输方式"
                        } else {
                            return "请选择运输方式";
                        }
                    }
                    case 'goods': {
                        return '可以输入搜索'
                    }
                }
            },
            ...mapGetters('storage',['getAllOptions'])
        },
        methods: {
            initData() {
                // 读取vuex数据
                let vuexData = this.getAllOptions(this.server.key)
                if(vuexData && vuexData.length) {
                    this.cascaderData = vuexData
                } else {
                    this.$http(this.server.api, this.server.params).then(res => {
                        this.cascaderData = [];
                        if (res.length > 0) {
                            this.cascaderData = this.server.handle(res)
                            this.storeInVuex(this.cascaderData, this.server.key)
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }
            },
            handleInput(value) {
                if(this.valueType === 'int') {
                    if(value && value.length === 1) value = value[0];
                    else if(value && value.length === 2) value = value[1]
                    else value = ""
                }
                this.$emit('input', value)
            },
            handleShppingList(res) {
                let ret = {}, casaderList = [], i= 0
                res.forEach(row => {
                    if (ret.hasOwnProperty(row.carrier_id)) {
                        casaderList[ret[row.carrier_id]].children.push({
                            value: row.shipping_method_id,
                            label: row.shortname,
                        })
                    } else {
                        ret[row.carrier_id] = i ++
                        let shippingItem = {
                            label: row.carrier_name,
                            value: row.carrier_id,
                            children: [{
                                value: row.shipping_method_id,
                                label: row.shortname,
                            }]
                        }
                        casaderList.push(shippingItem)
                    }
                })
                return casaderList
            },
            handleGoodsList(res) {
                let goods =  res.map(row => {
                    return {
                        value: row.id,
                        label: row.title,
                        children: row.childs.map(ch => {
                            return {
                                value: ch.id,
                                label: ch.title,
                            }
                        })
                    }
                })
                goods.unshift({label: '全部', value: ''})
                return goods
            },
            storeInVuex(data,key) {
                this.storageInit({
                    key,
                    data,
                    count: data.length,
                    orceCovered: true
                })
            },
            ...mapActions('storage',['storageInit'])
        },
        props: {
            value: '',
            warehouseId: [String,Number],
            valueType: {
                default: 'int'
            },
            type: {
                require: true
            }

        },
        watch: {
            warehouseId(warehouseId) {
                this.initData()
            }
        }
    }
</script>
