<template>
    <el-row class="p-add-goods">
        <page-dialog title="添加货品" v-model="dialog" size="large" :close-on-click-modal="false">
            <div class="search-box">
                <i class="el-icon-search"></i>
                <el-input v-model="snText" style="display: inline-block;"></el-input>
                <el-button type="primary" size="mini" @click="fuzzy_search">模糊搜索</el-button>
                <label class="inline ml-sm">注：查询多项条件请以逗号(,)分隔</label>
            </div>
            <el-row>
                <el-col :span="5">
                    <el-card class="box-card">
                        <tree :tree="treeData" @node-click="handle_node_click"></tree>
                    </el-card>
                </el-col>
                <el-col :span="19">
                    <div class="card">
                        <el-table :data="tableData" highlight-current-row border style="width: 100%" height="502" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="35"></el-table-column>
                            <el-table-column label="商品名称" prop="name"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="code" label="商品编号" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="sku" label="SKU" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="price" label="最新采购单价(元)"></el-table-column>
                            <el-table-column prop="cost" label="平均成本(元)"></el-table-column>
                            <el-table-column prop="sales_7" label="7日销量"></el-table-column>
                            <el-table-column prop="sales_15" label="15日销量"></el-table-column>
                            <el-table-column prop="sales_30" label="30日销量"></el-table-column>
                        </el-table>
                        <div style="text-align:right;margin-top:10px">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="1"
                                    :page-sizes="[20, 50, 100, 200,500]"
                                    :page-size="50"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="400">
                            </el-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary">确定</el-button>
                <el-button size="mini" @click.native="dialog=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-add-goods{
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
                width: 400px;
                padding: 3px 16px;
            }
            label{
                color: red;
            }
        }
        .box-card{
            height: 500px;
        }
        .card{
            margin: 0 0 5px 5px;
        }
    }

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import tree from '../../../components/tree.vue'

    export default{
        data(){
            return {
                dialog:false,
                treeData:[
                    {
                        label: '一级 1',
                        children: [{
                            label: '二级 1-1'
                        }]
                    }, {
                        label: '一级 2',
                        children: [{
                            label: '二级 2-1'
                        }, {
                            label: '二级 2-2'
                        }]
                    }, {
                        label: '一级 3',
                        children: [{
                            label: '二级 3-1'
                        }, {
                            label: '二级 3-2'
                        }]
                    }

                ],
                tableData:[
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },
                    {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    },  {
                        name:'J04-017加湿器J04-017（美国代销产品',
                        code:'J04-17',
                        sku:'J04-17',
                        price:50,
                        cost:10,
                        sales_7:1000,
                        sales_15:5000,
                        sales_30:10000
                    }]
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            fuzzy_search(){

            },
            handle_node_click(data){
                console.log(data)
            },
            handleSelectionChange(val){
                console.log(val)
            },
            handleSizeChange(val){},
            handleCurrentChange(val){}
        },
        filters: {},
        watch: {
            value(val){
                this.dialog=val
            },
            dialog(val){
                this.$emit('input',val)
            }
        },
        computed: {},
        props: {
            value:{}
        },
        components: {
            pageDialog,
            tree
        }
    }
</script>
