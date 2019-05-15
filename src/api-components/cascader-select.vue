<!-- 
    说明： 封装运输方式、邮寄方式的组件
    props: 
        value：              v-model绑定值，必填
        warehouseId：        仓库id，组件根据仓库id获取对应的运输方式，必填
        {String} valueType:  v-model绑定的类型，默认为'int',后端需要返回最后一个地址的id号，则传'int'，后端需要返回数组，则传'array'(或随便填)
 -->
<template>
    <el-cascader
            clearable
            filterable
            change-on-select
            :disabled="cascaderData.length<=0"
            :placeholder="comHolderShipping"
            class="inline s-width-large"
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
        comHolderShipping() {
            if (!this.warehouseId) {
                return "请先选择发货仓库"
            } else if (!!this.warehouseId && this.cascaderData.length <= 0) {
                return "该发货仓库下暂无运输方式"
            } else {
                return "请选择运输方式";
            }
        },
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
        }
    },
    methods: {
        initData() {
            this.$http(this.server.api, this.server.params).then(res => {
                this.cascaderData = [];
                if (res.length > 0) {
                    this.cascaderData = this.server.handle(res)
                }
            }).catch(code => {
                this.$message({type: 'error', message: code.message || code});
            })
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
            return res.map(row => {
                return {
                    value: row.id,
                    label: row.title,
                    children: row.childs.map(ch => {
                        return {
                            value: ch.id,
                            label: ch.title,
                        }
                    })
                }.unshift({label: '全部', value: ''})
            })
        }
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
            if (!warehouseId) return this.cascaderData = [];
            this.initData()
        }
    }
}
</script>