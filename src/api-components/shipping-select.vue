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
            :disabled="shippingList.length<=0"
            :placeholder="comHolderShipping"
            class="inline s-width-large"
            :value="innerValue"
            @input="handleInput"
            v-sf.shipping
            expand-trigger="hover"
            :options="shippingList"
    ></el-cascader>
</template>
<script>
import {api_get_shipping } from '@/api/common.js';
export default {
    data() {
        return {
            shippingList: [],
            innerValue: []
        }
    },
    mounted() {
        this.get_shipping()
    },
    computed: {
        comHolderShipping() {
            if (!this.warehouseId) {
                return "请先选择发货仓库"
            } else if (!!this.warehouseId && this.shippingList.length <= 0) {
                return "该发货仓库下暂无运输方式"
            } else {
                return "请选择运输方式";
            }
        }
    },
    methods: {
        handleInput(value) {
            if(this.valueType === 'int') {
                if(value && value.length === 1) value = value[0];
                else if(value && value.length === 2) value = value[1]
                else value = ""
            }
            this.$emit('input', value)
        },
        get_shipping() {
            if (!this.warehouseId) return this.shippingList = [];
            this.$http(api_get_shipping, {warehouse_id: this.warehouseId}).then(res => {
                this.shippingList = [];
                if (res.length <= 0) return;
                this.generate_shipping_list(res);
            }).catch(code => {
                this.$message({type: 'error', message: code.message || code});
            })
        },
        generate_shipping_list(res) {
            let shippingList = {}, i = 0;
            res.forEach(row => {
                if (shippingList.hasOwnProperty(row.carrier_id)) {
                    this.shippingList[shippingList[row.carrier_id]].children.push({
                        value: row.shipping_method_id,
                        label: row.shortname,
                    })
                } else {
                    shippingList[row.carrier_id] = i++;
                    let shipping = {
                        label: row.carrier_name,
                        value: row.carrier_id,
                    };
                    this.$set(shipping, 'children', [
                        {
                            value: row.shipping_method_id,
                            label: row.shortname,
                        }
                    ]);
                    this.shippingList.push(shipping);
                }
            });
        },
    },
    props: {
        value: '',
        warehouseId: [String,Number],
        valueType: {
            default: 'int'
        }

    },
    watch: {
        warehouseId() {
            this.get_shipping()
        }
    }
}
</script>