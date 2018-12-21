<template>
    <page>
        <page-dialog :title="`查看SKU：${missionDetailsList.sku}刷单任务`" v-model="viewDialogShow" size="large" :close-on-click-modal="false" @close="close">
            <el-table :data="tableData_.list1" :show-header="showHeader">
                <el-table-column prop="first" width="200" class-name="third"></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <img :src="scope.row.second | filterImage">
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="tableData_.list2" :show-header="showHeader">
                <el-table-column width="200" prop="first">
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <span>{{ scope.row.second | dataFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" prop="third">
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <span>{{ scope.row.fourth | dataFilter }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="viewDialogShow = false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style scoped lang="stylus">

</style>
<script>
    export default {
        name: "view-dialog",
        data() {
            return {
                showHeader: false,
                title:'',
                viewDialogShow: this.value,
                tableData_:{
                    list1:[
                        {
                            first:"SKU图片",
                            second:'',
                            type: 'thumb'
                        }
                    ],
                    list2:[
                        {
                            first: '平台',
                            second: '',
                            type1:'channel_id',
                            third: '站点',
                            fourth: '',
                            type2:'site'
                        },
                        {
                            first: 'SKU',
                            second: '',
                            type1:'sku',
                            third: 'ASIN',
                            fourth: '',
                            type2:'asin'
                        },{
                            first: '店铺账号简称',
                            second: '',
                            type1:'account_id',
                            third: '店铺名称',
                            fourth: '',
                            type2:'account_name'
                        },{
                            first: '销售员',
                            second: '',
                            type1:'seller_id_name',
                            third: '刷单员',
                            fourth: '',
                            type2:'task_id_name'
                        },{
                            first: '关键词',
                            second: '',
                            type1:'keyword',
                            third: '产品位置',
                            fourth: '',
                            type2:'product_location'
                        },{
                            first: '产品链接',
                            second: '',
                            type1:'product_link',
                            third: '备注',
                            fourth: '',
                            type2:'remark'
                        },{
                            first: '费用预估',
                            second: '',
                            type1:'estimate_cost',
                            third: '币种',
                            fourth: '',
                            type2:'order_currency'
                        },
                        {
                            first: '计划下单时间',
                            second: '',
                            type1:'task_time',
                            third: '计划留评日期',
                            fourth: '',
                            type2:'msg_time'
                        },
                        {
                            first: '交易订单总费用',
                            second: '',
                            type1:'order_cost',
                            third: 'SKU数量',
                            fourth: '',
                            type2:'quantity'
                        },
                        {
                            first: '销售单价',
                            second: '',
                            type1:'seller_cost',
                            third: '交易订单号',
                            fourth: '',
                            type2:'order_number'
                        },
                        {
                            first: '实际下单时间',
                            second: '',
                            type1:'order_time',
                            third: '实际留评时间',
                            fourth: '',
                            type2:'msg_true_time'
                        }
                    ]
                },
            }
        },
        filters:{
           dataFilter(val){
               if(val === ''){
                   return '--'
               }else{
                   return val
               }
           },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            }
        },
        methods: {
            close(){
                if(!this.viewDialogShow) {
                    for(let key in this.tableData_){
                        this.tableData_[key].forEach(row => {
                            row.second = '';
                            row.fourth = ''
                        })
                    }
                }
            }
        },
        watch: {
            value(val){
                this.viewDialogShow = val;
            },
            viewDialogShow(val){
                this.$emit('input',val);
            },
            missionDetailsList(val){
                this.$nextTick(()=>{
                    this.tableData_.list1.forEach(row=>{if(val[row.type]){
                        row.second = val[row.type];
                    }});
                    this.tableData_.list2.forEach(row=>{if(val[row.type1]||val[row.type2]){
                        row.second = val[row.type1];
                        row.fourth = val[row.type2];
                    }});
                })
            }
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            missionDetailsList:{
                type:Object
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>