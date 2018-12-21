<template>
    <div class="c-add-product">
        <page-dialog title="选择产品" v-model="dialog" size="large" :close-on-click-modal="false">
            <el-table
                ref="table"
                @row-click="row_click"
                :height="tableList&&tableList.length>=20?500:''"
                class="scroll-bar"
                :data="tableList"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row
            >
                <el-table-column width="50" label="" inline-template>
                    <el-checkbox v-model="row.isCheck" @change="check_cur(row)"></el-checkbox>
                </el-table-column>
                <el-table-column  width="75" label="图片" inline-template>
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img width="200px" height="200px" v-lazy="sku_image(row.thumb)">
                        <span slot="reference">
                              <img height="60px" width="60px" style="border:none" v-lazy="row.thumb">
                        </span>
                    </el-popover>
                </el-table-column>
                <el-table-column label="商品名称" inline-template>
                    <ui-tip :content="row.spu_name" :width="95"></ui-tip>
                </el-table-column>
                <template v-for="item in keys">
                    <el-table-column :label="item" inline-template :key="item">
                        <div>
                            <ui-tip :content="row[item]" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                </template>
                <el-table-column label="SKU" inline-template width="150">
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="平均成本(元)" inline-template width="120">
                    <ui-tip :content="fixed_price(row.cost_price)" :width="98"></ui-tip>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="fr mr-sm"
                    @current-change="current_change"
                    :current-page="table.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="table.pageSize"
                    layout="total,prev, pager, next, jumper"
                    :total="table.count">
            </el-pagination>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_goods} from '../../../../../api/supplier-quote';
    export default {
        data() {
            return {
                loading:false,
                dialog:false,
                tableList:[],
                keys:[],
                curRow:{},
                table:{
                    page:1,
                    pageSize:20,
                    count:0
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.get_goods();
                }
            }
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            row_click(val){
                val.isCheck = !val.isCheck;
                this.check_cur(val);
            },
            submit(){
                this.dialog = false;
                this.$emit('submit',this.curRow);
            },
            fixed_price(val){
                return parseFloat(val)?parseFloat(val).toFixed(2):'0.00';
            },
            check_cur(val){
                if(!!val.isCheck){
                    this.tableList.forEach(row=>{
                        row.isCheck = false;
                    });
                    val.isCheck = true;
                    this.curRow = val;
                }else{
                    this.curRow = {};
                }

            },
            current_change(val){
                this.table.page = val;
                this.get_goods();
            },
            get_goods(){
                this.loading = true;
                let parmas = {
                    snType:'spu',
                    snText:this.searchParam,
                    page:this.table.page,
                    pageSize:this.table.pageSize
                };
                this.$http(api_add_goods,parmas).then(res=>{
                    this.tableList = res.data;
                    this.table.count = res.count;
                    this.tableList.forEach(row=>{
                        this.$set(row,'isCheck',false);
                    });
                    this.keys = res.keys;
                    this.loading = false;
                }).catch(code=>{
                    console.log(code);
                    this.loading = false;
                })
            },
        },
        props:{
            searchParam:{
                required:true
            },
            value:{
                required:true,
                type:Boolean
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
        }
    }
</script>
