<template>
    <el-row class="p-add-supplier">
        <page-dialog title="选择供应商" v-model="supplierBox" size="large" @change="closeDialog" :close-on-click-modal="false">
            <div style="height: 300px;overflow-y: auto;">
                <table class="template">
                    <tr class="line" style="font-weight:bold">
                        <th width="44px"></th>
                        <th>供应商名称</th>
                        <th>结算方式</th>
                        <th>最新报价</th>
                        <th>报价区间</th>
                    </tr>
                    <tbody>
                    <tr v-if="supplierData.length==0">
                        <td :colspan="5">暂无数据！</td>
                    </tr>
                    <tr v-for="(data, index) in supplierData" @click="select_radio(data)">
                        <td>
                            <el-radio class="radio" v-model="radio" :label="data.id">
                                <span></span>
                            </el-radio>
                        </td>
                        <td>
                            <ui-tips :content="data.company_name"></ui-tips>
                        </td>
                        <td><span>{{data.balance_type_text}}</span></td>
                        <td><span>{{data.price}}</span></td>
                        <td @click="newPrice(index)">
                    <span v-for="item in data.section" v-if="data.section.length>0" style="display: block">
                      {{item.min_quantity}}-{{item.max_quantity}}/{{item.price}}
                    </span>

                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submit">确定</el-button>
                <el-button size="mini" @click.native="supplierBox=false">取 消</el-button>
            </div>
            <add-price v-model="showPrice" :supplierData="newPriceData" @confirm="addPrice"></add-price>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-add-supplier{
        .search-box{
            position: relative;
            margin-bottom: 5px;
            .el-icon-search{
                position: absolute;
                top:8px;
                left: 5px;
                z-index: 1999;
            }
            .el-input__inner{
                width: 300px;
                padding: 3px 16px;
            }
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import {getSupplier} from '../../../api/purchasing'
    import {
        api_get_sku
    } from '../../../api/purchase';
    import {
        api_get_goods_sku,
        api_get_goods_supp
    } from "../../../api/supplier-quote";
    export default{
        page:{
            devinfo:{
                frontEnd:'徐梦娇;黎宏珍',
                backEnd:'杨伟权;谭斌',
                createTime:'2017-3-29',
                updateTime:'2017-8-22'
            }
        },
        data(){
            return {
                snText:'',
                supplierBox:false,
                checkSupplier:[],
                newPriceData:[],
                radio:'',
                showPrice:false,
                rowIndex:''
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            select_radio(data){
            	this.radio = data.id;
            },
            addPrice(data){
                this.supplierData[this.rowIndex].section = data.section;
            },
            newPrice(index){
                this.rowIndex = index;
                this.newPriceData = [];
                let newData = this.supplierData[index];
                let searchData={
                    snType:'sku_id',
                    snText:newData.sku_id
                }
                let skuList = [];
                this.$http(api_get_sku,searchData).then(res => {
                    let row = res.data[0];
                    skuList = {
                        id:Date.now(),
                        goods_id: row.goods_id,
                        sku_id: row.sku_id,
                        sku: row.sku,
                        thumb: row.thumb,
                        name: row.spu_name,
                        supplier_id: newData.supplier_id,
                        cycle: [{warehouse_id: "", delivery_days: ""}],
                        section: [{min_quantity: '1', max_quantity: '', price: ""}],
                        currency_code:'cny',
                        link: "",
                        price: ""
                    };
                    this.$http(api_get_goods_supp,{supplier_id:newData.supplier_id,sku_id:newData.sku_id}).then(res=>{
                        let row = res.list[0];
                        skuList.cycle = row.cycle.length>0?row.cycle:[{warehouse_id: "", delivery_days: ""}];
                        skuList.link = row.link;
                        skuList.price = row.price;
                        skuList.section = row.section.length>0?row.section:[{min_quantity: '1', max_quantity: '', price: ""}];
                        this.showPrice = true;
                        this.newPriceData.push(skuList);
                    }).catch(code=>{
                        console.log(code);
                    });
                }).catch(code => {
                    console.log(code);
                })


            },
            submit(){
                if (this.checkSupplier.length > 0) {
                    this.$emit('update_supplier',this.checkSupplier);
                    this.supplierBox = false;
                }
            },
            closeDialog(val){
                if (val) {
                    this.checkSupplier = [];
                    this.snText = '';
                    this.radio = ''
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.supplierBox = val;
            },
            supplierBox(val){
                this.$emit('input',val)
            },
            radio(val){
                this.checkSupplier = [];
                this.checkSupplier.push(this.supplierData.find(data => data.id === val))
            },
        },
        computed: {},
        props: {
            value:{},
            supplierData:{},
        },
        components: {
            pageDialog,
            uiTips:require('../../../components/ui-tips.vue').default,
            addPrice:require('./add-price.vue').default
        }
    }
</script>
