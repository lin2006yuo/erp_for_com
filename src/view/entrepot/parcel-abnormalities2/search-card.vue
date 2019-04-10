<template>
        <search-card :params="searchData" :clears="clears" @enter="table_create" @search="table_create"
                     @init-params="init_status_btn">
            <!--获取表格的处理状态-->
            <div class="mb-mini">
                <label-buttons
                    class="inline"
                    :buttons="buttons"
                    label="处理状态："
                    @select="select_status">
                </label-buttons>
                <!-- 订单号 -->
                <el-select v-model="searchData.time_type" class="inline" style="width: 100px;margin-left: 10px;"
                        v-sf.time_type>
                    <el-option v-for="(item, index) in numberType"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-sf.shipping_number
                            ref="batchInput"
                            v-model="searchData.shipping_number"
                            class="inline width-super pt-sm"
                            @keydown="table_create"
                            placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
                
                <!-- 平台 -->
                <label-item label="平台：" class="ml-sm"></label-item>
                            
                <!-- 站点 -->
                <label-item label="站点：" class="ml-sm"></label-item>
            </div>
            
            <label-item label="运输方式：">
                <el-cascader
                        clearable
                        filterable
                        placeholder="请选择/输入运输方式"
                        class="inline shipping-width"
                        v-model="searchData.shipping"
                        expand-trigger="hover"
                        :options="shippingList"
                ></el-cascader>
            </label-item>
            <el-select v-model="searchData.identity" class="inline ml-sm width-xs"
                    v-sf.identity>
                <el-option v-for="(item, index) in roleType"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                </el-option>
            </el-select>
            <!-- <param-account
                    class="width-sm"
                    v-model="searchData.user_id"
                    :param="{data:{content:''}}"
                    :fix-url="true"
                    :fix-result="sale_fix_result"
                    type="warehouseUser"
                    placeholder="请选择/输入..."
                    url="get|user/warehouse/staffs">
            </param-account> -->
            <el-input class="inline  width-sm"></el-input>
            <el-date-picker
                    v-model="searchData.time_st"
                    type="date"
                    v-sf.time_st
                    placeholder="开始时间"
                    :picker-options="inputTimeStart"
                    class="date inline">
            </el-date-picker>
            <label>--</label>
            <el-date-picker
                    v-model="searchData.time_nd"
                    type="date"
                    v-sf.time_nd
                    placeholder="结束时间"
                    :picker-options="inputTimeEnd"
                    class="date inline mr-sm">
            </el-date-picker>
        </search-card>
</template>
<script>
    //    引入调接口地址
    import {
        api_problem_type,
    } from '@/api/parcel-abnormalities';
    import {api_shipping_list} from "@/api/setLogistics"
export default {
    data() {
        return {
            buttons: [{
                label: "待处理",
                value: 1
            }, {
                label: '已处理',
                value: 2
            }],
            numberType: [{
                label: '订单号',
                value: 'dingdanhao'
            }, {
                label: '包裹号',
                value: 'baoguohao'
            }, {
                label: '面单号',
                value: 'miandanhao'
            }],
            shippingList: [],
            roleType: [{
                label: '销售员',
                value: 'xiaoshouyuan' 
            }, {
                label: '处理人',
                value: 'chuliren' 
            }],
            inputTimeStart: {
                disabledDate: (time) => {
                    if (this.searchData.time_nd) {
                        return time.getTime() > this.searchData.time_nd;
                    } else {
                        return false
                    }
                }
            },
            inputTimeEnd: {
                disabledDate: (time) => {
                    if (this.searchData.time_st) {
                        return time.getTime() < this.searchData.time_st;
                    } else {
                        return false
                    }
                }
            },
        }
    },
    mounted() {
        this.get_shipping()
    },
    methods: {
        table_create() {},
        table_create() {},
        init_status_btn() {},
        select_status() {},
        table_create() {},
        sale_fix_result() {},

        get_shipping() {
            this.$http(api_shipping_list).then(res => {
                if (res.length <= 0) {
                    this.shippingList = [];
                    return
                }
                let list = res.map(row => {
                    return row.carrier_id
                });
                list = this.carrier_unique(list).map(carrier_id => {
                    let label = res.find(row => row.carrier_id === carrier_id);
                    return {
                        label: label.carrier_name,
                        value: carrier_id
                    }
                });
                this.shippingList = list.map(row => {
                    row.children = this.get_children(row, res);
                    return row
                });
            }).catch(code => {
                console.log(code);
            });
        },
        carrier_unique(arr){
            let res = [];
            let json = {};
            for(let i = 0; i < arr.length; i++){
                if(!json[arr[i]]){
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        },
        get_children(row,res) {
            let child = [];
            res.forEach(item=>{
                if(row.value===item.carrier_id){
                    child.push({
                        label:item.shortname,
                        value:item.shipping_method_id
                    })
                }
            });
            return child
        },
    },
    props: {
        searchData: {},
        clears: {
            default: () => ({})
        }
    },
    components: {
        labelButtons: require('@/components/label-buttons.vue').default,
        searchCard: require('@/components/search-card.vue').default,
        paramAccount: require('@/api-components/param-account').default,
        orderInput: require("@/components/order-input.vue").default,
        labelItem:require('@/components/label-item.vue').default,
    }
}
</script>