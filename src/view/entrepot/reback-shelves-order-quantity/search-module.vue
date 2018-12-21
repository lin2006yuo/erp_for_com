<template>
    <ui-card class="p-return-shelves">
        <div slot="header" class="ui-card-header">
            <span class="ml-sm fl table_title title">扫描SKU分拣</span>
            <label-item label="请选择仓库：" class="fr mr-sm" style="line-height: 32px;">
                <el-select v-model="searchData.warehouse_id" @change="changeWarehouse" class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <table class="right-table">
            <tr style="height: 85px;">
                <td colspan="2" style="width: 200px;height: 150px;border-top:none;">
                    <label-item label="扫描SKU：" :labelWidth="115">
                        <el-input v-model="searchData.search_sku"
                                  clearable
                                  ref="search_sku"
                                  @focus="select"
                                  @change="change_sku"
                                  @keyup.enter.native="init"></el-input>
                        <span class="red ml-sm" v-if="warning.message">
                            <i class="delete-icon" v-if="warning.type === 0"></i>
                            <span style="vertical-align: middle;font-size:20px" v-html="warning.message"></span>
                        </span>
                    </label-item>
                </td>
                <td rowspan="5" class="img_td">
                    <img :src="searchData.thumb | filterImage" style="width: 100%;">
                </td>
            </tr>
            <tr>
                <td class="label_td">SKU：</td>
                <td>
                    {{searchData.sku}}
                </td>
            </tr>
            <tr>
                <td class="label_td">名称（规格）：</td>
                <td>
                    {{searchData.spu_name}}
                </td>
            </tr>
            <tr>
                <td class="label_td">货位：</td>
                <td>
                    {{searchData.warehouse_cargo_code}}
                </td>
            </tr>
            <tr>
                <td class="label_td">分区：</td>
                <td>
                    {{searchData.warehouse_area_type}}
                </td>
            </tr>
        </table>
    </ui-card>
</template>
<style lang="stylus">
    .p-return-shelves{
        .table_head{
            height:32px;
            line-height: 28px;
            border:1px solid #e0e6ed;
            background-color: #6295E9;
            color:white;
        }
        .table_title{
            vertical-align: middle;
            line-height: 32px;
        }
        .right-table{
            width: 100%;
            border:1px solid #d3dce6;
            td{
                border-top: 1px solid #d3dce6;
                border-right:1px solid #d3dce6;
                height:26px;
            }
            .label_td{
                width: 100px;
                text-align: right;
            }
            .c-label-item{
                display: flex !important;
                flex-wrap: nowrap;
                align-items: center;
            }
            >span{
                display: flex !important;
                align-items: center;
            }

        }
        .prompt{
            font-size: 90px;
            vertical-align: middle;
            background-color:darkgrey;
        }
        .img_td{
            border: none !important;
            width:200px !important;
        }
    }
</style>
<script>
    import {entrepot_picking, api_get_area} from '../../../api/return-shelves'
    export default {
        data(){
            return {
                searchData:{
                    warehouse_id:2,
                    search_sku:'',
                    sku:'',
                    thumb:'',
                    spu_name:'',
                    warehouse_cargo_code:'',
                    warehouse_area_type:''
                },
                warehouses: [],
                typeList:[
                    {label:'SKU',value:'sku'},
                    {label:'商品名称',value:'name'}
                ],
                statusList:[
                    {label:'待上架', value:'>0'},
                    {label:'已上架', value:'=0'}
                ],
            }
        },
        filters:{
            filterImage(val){
                if(window.screen.width > 1366){
                    return !!val ? val.replace("_200x200","_500x500"):'';
                } else {
                    return !!val ? val.replace("_200x200","_200x200"):'';
                }
            },
        },
        mounted(){
            this.select();
            this.init_warehouse();
        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            select(){
                this.$refs.search_sku.$refs.input.select();
            },
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    sessionStorage.setItem('reback_warehouse_id', this.searchData.warehouse_id);
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            changeWarehouse(){
                this.searchData.search_sku = '';
                this.searchData.sku = '';
                this.searchData.thumb = '';
                this.searchData.spu_name = '';
                this.searchData.warehouse_cargo_code = '';
                this.searchData.warehouse_area_type = '';
                sessionStorage.setItem('reback_warehouse_id', this.searchData.warehouse_id);
                this.select();
            },
            clearData(data){
                Object.keys(data).forEach(item=>{
                    data[item] = '';
                })
            },
            change_sku(){
                this.$emit('change-sku');
            }
        },
        computed: {},
        watch: {},
        props: {
            warning:{}
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            uiCard: require('@/components/ui-card').default,
        }
    }
</script>
