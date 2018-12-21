<template>
    <page-dialog :title="action.title"
                 size="large"
                 @open="open"
                 class="p-putaway-order"
                 v-model="visible"
                 :close-on-click-modal="false">
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">上架单号</td>
                <td width="150" colspan="3">{{lookData.id}}</td>
                <td width="150">状态</td>
                <td width="150">{{lookData.status}}</td>
            </tr>
            <tr>
                <td width="150">上架区</td>
                <td width="150">{{lookData.warehouse_area_id}}</td>
                <td width="150">总上架数量</td>
                <td width="150">{{lookData.num_all}}</td>
                <td width="150">实际上架数量</td>
                <td width="150">{{lookData.num_update}}</td>
            </tr>
        </table>
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="200">创建人</td>
                <td width="200">{{lookData.creator_id}}</td>
                <td width="200">创建时间</td>
                <td width="200">{{lookData.create_time | filterTime}}</td>
            </tr>
        </table>
        <div class="border-box mt-sm">
            <div class="mt-sm ml-sm mb-sm">
                <label-item label="批号：">
                    <el-input v-model="searchData.batch_id"></el-input>
                </label-item>
                <label-item label="货位：" class="ml-sm">
                    <el-input v-model="searchData.warehouse_cargo_id"></el-input>
                </label-item>
                <label-item label="SKU：" class="ml-sm">
                    <el-input v-model="searchData.sku"></el-input>
                </label-item>
                <el-button type="primary"
                           size="mini"
                           class="ml-sm"
                           @click="search">搜索
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    height="450"
                    v-loading="loading"
                    class="scroll-bar"
                    element-loading-text="玩命加载中"
                    highlightCurrentRow>
                <el-table-column
                        inline-template
                        label="上架编号">
                    <div>
                        <ui-tip :content="row.sequence_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="150"
                        label="批号">
                    <div>
                        <ui-tip :content="row.batch_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="货位">
                    <div>
                        <ui-tip :content="row.warehouse_cargo_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="上架数量">
                    <div>
                        <ui-tip :content="row.quantity" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="SKU">
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="商品名称">
                    <div>
                        <ui-tip :content="row.sku_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer">
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-putaway-order{
        .border-box{
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            border-right:1px solid #d3dce6;
        }
        .right-table{
            width: 100%;
            border:1px solid #d3dce6;
            td{
                text-align: center;
                border-bottom:1px solid #d3dce6;
                border-right:1px solid #d3dce6;
                height:26px;
            }
            td:nth-child(2n+1){
                background-color: #f5f7fa;
            }
        }
    }
</style>
<script>
    export default {
        data(){
            return {
                visible: false,
                loading: false,
                searchData:{
                    batch_id:'',
                    putaway_order_id:'',
                    warehouse_cargo_id:'',
                    sku:''
                },
                tableData:[]
            }
        },
        mounted(){
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            open(){
                this.tableData = this.lookData.details;
                this.clearSearch(this.searchData);
            },
            search(){
                Object.keys(this.searchData).forEach(key => {
                    if(typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.tableData = [];
                this.lookData.details.forEach(row=>{
                    console.log(String(row.warehouse_cargo_id), this.searchData.warehouse_cargo_id)
                    if(String(row.batch_id).indexOf(this.searchData.batch_id) !== -1){
                        if(String(row.warehouse_cargo_id).indexOf(this.searchData.warehouse_cargo_id) !== -1){
                            if(row.sku.indexOf(this.searchData.sku) !== -1){
                                this.tableData.push(row);
                            }
                        }
                    }
                });
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                // if(val){
                //     this.tableData = this.lookData.details;
                //     this.clearSearch(this.searchData);
                // }
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{},
            lookData:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default
        },
    }
</script>
