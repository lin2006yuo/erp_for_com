<template>
    <div class="c-small-component">
        <div class="title">
            {{`${small.number}_${index+1}`}}
            <span v-if="index!==0" class="fr close" @click="close_box(index)">X</span>
        </div>
        <div class="small-box">
            <el-table :data="small.detail">
                <el-table-column label="销售号" prop="sku_id">
                </el-table-column>
                <el-table-column label="SKU" prop="sku">
                </el-table-column>
                <el-table-column label="库存数" inline-template>
                    <span>{{stockQuantity(row)}}</span>
                </el-table-column>
                <el-table-column label="发货数" inline-template>

                    <el-input :value="sends(row)" @input="(val) => {changeSend(row, val)}" :min="0"
                              :disabled="disabled_sku_input(row)" type="number"></el-input>
                </el-table-column>
            </el-table>
            <el-row>
                <label-item label="发货仓库：">
                    <el-select v-model="small.warehouse_id" @change="warehouse_change">
                        <el-option
                            v-for="item in warehouseList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="邮寄方式：">
                    <el-cascader
                        clearable
                        filterable
                        :placeholder="shippingPlaceholder"
                        class="inline s-width-large"
                        :change-on-select="false"
                        v-model="shippingSelected"
                        expand-trigger="hover"
                        :options="resShipping"
                    ></el-cascader>
                </label-item>
            </el-row>
            <label for="">限重: {{limit_weight}}</label>
            <label for="">重量: {{weight}}</label>
            <label for="">折合成本: {{cost_price}}</label>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-small-component {
        border: 1px solid #A2B8CE;
        background: #fff;
        margin-bottom: 10px;
        .title {
            height: 26px;
            line-height: 26px;
            background: #ACCDED;
            padding: 0 10px;
            .close {
                display: inline-block;
                height: 26px;
                line-height: 26px;
                cursor: pointer;
            }
        }
        .small-box {
            padding: 10px;
        }
    }
</style>
<script>
    import {api_warehouse_goods,api_get_shipping} from "../../../../api/order-local"
    export default{
        data(){
            return {
                resShipping:[],
                shippingSelected:[],
                shippingList: [],
                stockQuantitys: {}
            }
        },
        methods: {
            warehouse_change(){
                this.get_shipping();
            },
            get_send(i){
                let sku_ids = this.orderData.detail.map(row => {
                    return row.sku_id
                })
                let option = {
                    warehouse_id: i || this.orderData.warehouse_id,
                    sku_ids
                }
                this.$http(api_warehouse_goods, option).then(res => {
                    this.stockQuantitys = res;
                }).catch(code => {
                    console.log(code);
                });
            },
            stockQuantity(row){
                return this.stockQuantitys[row.sku_id] || 0;
            },
            close_box(i){
                this.$emit("child_close", i)
            },
            sends(row){
                return row.sends;
            },
            changeSend(row, val){
                val = Number(val);
                const usable = this.packageUsabledSend[row.sku_id] - row.sends;
                const check = (val + usable) <= row.sku_quantity;
                if (check) {
                    let oldSends = row.sends;
                    row.sends = val;
                    if(row.sends === 0 || (oldSends===0 && row.sends > 0)) {
                        this.get_shipping();
                    }
                } else {
                    const oldSends = row.sends;
                    row.sends = -1;
                    this.$nextTick(() => {
                        row.sends = oldSends;
                    })
                }
            },
            disabled_sku_input(row){
                if ((row.sends === 0) && (this.packageUsabledSend[row.sku_id] === row.sku_quantity)) {
                    return true;
                } else {
                    return false;
                }
            },
            get_shipping(){
                let skuList = [];
                this.small.detail.forEach(row => {
                    if(row.sends > 0) {
                        skuList.push(row.sku_id)
                    }
                })
                let params = {
                    warehouse_id:this.small.warehouse_id,
                    country_code:this.small.country_code,
                    sku:skuList,
                };
                this.$http(api_get_shipping, params).then(res => {
                    this.shippingList = res;
                    let find = this.shippingList.find(row=>row.shipping_id===this.small.shipping_id);
                    if(!!find){
                        this.shippingSelected[0] = find.carrier_id;
                        this.shippingSelected[1] = find.shipping_id;
                    }
                    if(res.length<=0){
                        this.resShipping = [];
                        return
                    }
                    let list = res.map(row=>{
                        return row.carrier_id
                    });
                    list = this.carrier_unique(list).map(carrier_id=>{
                        let label = res.find(row=>row.carrier_id===carrier_id);
                        return {
                            label:label.carrier_name,
                            value:carrier_id
                        }
                    });
                    this.resShipping = list.map(row=>{
                        row.children = this.get_children(row,res);
                        return row
                    });
                }).catch(code => {
                    console.log(code);
                })
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
                            label:item.shipping_method_name,
                            value:item.shipping_id
                        })
                    }
                });
                return child
            },
        },
        mounted(){
            this.get_send();
            this.get_shipping();
        },
        computed: {
            shippingPlaceholder(){
                if(this.small.warehouse_id==='') {
                    return "请先选择发货仓库";
                }else if(this.small.warehouse_id>0&&this.shippingList.length===0){
                    return "该发货仓下暂无运输方式";
                }else{
                    return '请选择/输入运输方式';
                }
            },
            weight(){
                let weight = 0;
                if (this.small.detail) {
                    this.small.detail.forEach(row => {
                        weight += Number(row.weight) * Number(row.sends)
                    })
                }
                if(weight){
                    this.$emit('disabled-btn',{index:this.index,btn:false})
                }else{
                    this.$emit('disabled-btn',{index:this.index,btn:true})
                }
                return weight
            },
            cost_price(){
                let price = 0;
                this.small.detail.forEach(row => {
                    price += Number(row.cost_price) * Number(row.sends)
                })
                return price.toFixed(4)
            },
            limit_weight(){
                let limit = 0;
                if(this.small.shipping_name){
                    this.shippingList.forEach(row => {
                        if (row.shipping_method_name===this.small.shipping_name){
                            limit = row.max_weight || 0
                        }
                    })
                }
                return limit
            }
        },
        watch: {
            'small.warehouse_id'(val){
                this.get_send(val)
            },
            'small.shipping_id'(val){
                let shipping_name = ""
                this.shippingList.forEach(x=>{
                    if(x.shipping_id===val){
                        shipping_name = x.shipping_method_name
                    }
                })
                this.$set(this.small,"shipping_name",shipping_name)
            },
            shippingSelected(val){
                if(val.length>1){
                    if(val[1]===this.small.shipping_id){
                        return
                    }else{
                        this.small.shipping_id = val[1];
                    }
                }
            }
        },
        props: {
            warehouseList: {},
            packageUsabledSend: {},
            orderData: {},
            small: {
                required:true,
            },
            index: {}
        },
        components: {
            labelItem: require('../../../../components/label-item.vue').default,
        }
    }
</script>
