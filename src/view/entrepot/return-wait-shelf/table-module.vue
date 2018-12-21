<template>
    <div class="c-return-back-list">
        <ui-table v-model="checkAll"
                  @check="check"
                  class="manager"
                  :body-height="41"
                  :has-data="tableData.length>0"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :heads="heads">
            <tbody >
            <template v-for="(data, index) in tableData">
                <tr class="line" :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']"
                    :key="data.id"
                    @click="addClass(data)">
                    <td>
                        <el-checkbox v-model="data.checked" @input="changeOne"></el-checkbox>
                    </td>
                    <td>
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img :src="data.thumb | filterImage" width="200px" height="200px">
                            <span slot="reference">
                                    <img :src="data.thumb" v-if="data.thumb" height="60px" width="60px" style="border:none;vertical-align: middle">
                                </span>
                        </el-popover>
                        <!--<el-popover placement="right" trigger="hover">-->
                        <!--<img  v-lazy="get_path(data.thumb,'_200x200.')"-->
                        <!--@click="show_big(data)"-->
                        <!--width="200px" height="200px">-->
                        <!--<span slot="reference">-->
                        <!--<img  v-lazy="get_path(data.thumb,'_60x60.')"-->
                        <!--@click="show_big(data)"-->
                        <!--height="60px" width="60px" style="border:none">-->
                        <!--</span>-->
                        <!--</el-popover>-->
                    </td>
                    <td >
                        <plus-minus @show-detail="show_detail(data,index)" :show="data.show" :title="tipTitle" ></plus-minus>
                        <span>{{data.sku}}</span>
                    </td>
                    <td>
                        <ui-tip :content="data.spu_name"></ui-tip>
                    </td>
                    <td >
                        <el-input-number v-model="data.quantity" :controls="false"
                                         class="width-sm" :max="data.quantity"></el-input-number>
                    </td>
                    <td>
                        <ui-tip :content="data.warehouse_area_id" :width="98"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.warehouse_cargo" :width="98"></ui-tip>
                    </td>
                    <td>
                        {{data.marking_storage_time|fmsdatetime}}
                    </td>
                    <td>
                        {{data.marking_new_storage_time|fmsdatetime}}
                    </td>
                </tr>
                <template v-if="data.show">
                    <template v-if="data.skuList&&data.skuList.length">
                        <tr class="subset_of_tags" style="font-weight:bold;" >
                            <td></td>
                            <td>包裹号</td>
                            <td>创建人</td>
                            <td>数量</td>
                            <td>标记待入库时间</td>
                            <td :colspan="4"></td>
                        </tr>
                        <tr class="subset_of_tags"
                            v-for="item in data.skuList">
                            <td></td>
                            <td>
                                {{item.package_number}}
                            </td>
                            <td>
                                {{item.creator}}
                            </td>
                            <td>
                                {{item.quantity}}
                            </td>
                            <td>
                                {{item.marking_storage_time|fmsdatetime}}
                            </td>
                            <td :colspan="4">

                            </td>
                        </tr>
                    </template>
                    <template v-if="!data.skuList||!data.skuList.length">
                        <tr>
                            <td :colspan="heads.length" style=" text-align: center">
                                暂无详情
                            </td>
                        </tr>
                    </template>
                </template>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .c-return-back-list{
        .manager {
            border-radius :3px;
            .ui-table-body {
                .template.secTable {
                    table-layout: fixed;
                    .over {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 180px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .oversku {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 90px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .el-tooltip {
                        width: 100%;
                    }
                    .el-tooltip__rel {
                        width: 100%;
                    }
                    .el-button--warning {
                        background: #008BCE;
                        border-color: #008BCE;
                    }
                    .el-button.el-button--mini.el-button--warning.el-dropdown__caret-button {
                        height: 23px;
                    }
                    .el-button .el-button--warning .el-button--mini {
                        height: 23px;
                    }
                    .trend {
                        height: 23px;
                        margin: 0
                    }
                }
            }
        }
    }
</style>
<script>
    import {api_reback_shelves,api_get_single_detail} from '../../../api/reback-shelves';
    import {get_path}from '@/view/kandeng/ebay/kandeng-list/add-edit-listing/get-path';
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
                total:0,
                trendAction:{},
                lookVisible:false,
                checkData:[],
                heads:[
                    {isCheck:true,width:3},
                    {label:'图片',width:8},
                    {label:'SKU',width:11},
                    {label:'商品名称（规格）',width:22},
                    {label:'数量',width:12},
                    {label:'分区',width:10},
                    {label:'货位',width:10},
                    {label:'最早标记待入库时间',width:12},
                    {label:'最近标记待入库时间',width:12}
                ],
                tipTitle:'点击查看包裹号、创建人、数量和标记入库时间等信息',
                tempArr:[],
            }
        },
        filters:{
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            get_path,
            init(){
                this.tableData = [];
                this.loading = true;
                let data = window.clone(this.searchData);
                this.$http(api_reback_shelves, data).then(res=>{
                    res.data.forEach(row=>{
                        this.$set(row,'checked',false);
                        this.$set(row,'show',false);
                        this.$set(row,'quantity',Number(row.quantity));
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            selectCheck(select){
                this.checkData = select.map(row=>{
                    return {id:row.id,quantity:row.quantity};
                });
                this.$emit('select-check', this.checkData, select);//row
            },
            delete_goods(data){
                data.forEach(row=>{
                    if(row.quantity === 0){
                        let index = this.tableData.findIndex(item=>{
                            return row.id === item.cargo_goods_id;
                        });
                        this.tableData.splice(index, 1);
                    } else {
                        let index = this.tableData.findIndex(item=>{
                            return row.id === item.cargo_goods_id;
                        });
                        this.tableData[index].quantity = row.quantity;
                    }
                })
            },
            changeOne(val){
                let filter =this.tableData.filter(row=>row.checked);
                this.tempArr=[];
                if(filter.length){
                    this.tempArr=filter;
                }
                this.$emit('select-check',this.tempArr);
            },
            check(val){
                this.checkAll =val;
                this.tempArr=[];
                if(val){
                    this.tempArr=this.tableData;
                }
                this.$emit('select-check',this.tempArr);
            },
            addClass(data){
                this.tableData.forEach(row=>{
                    this.$set(row,'heighLight',false);
                });
                this.$set(data,'heighLight',true);
            },
            show_big(row){
                // if(!row.thumb) return this.$message({type:"warning",message:"暂无图片"});
                // if(row.thumb.includes('_60x60.'))row.thumb = row.thumb.replace('_60x60.','_500x500.');
                // this.showBigDailog = true;
                // this.curImgPath = this.get_path(row.thumb,'_500x500.');
                // this.blowUpTitle = '';
            },

            show_detail(row,index){
                this.$set(row,'show',!row.show);
                if(row.skuList&&row.skuList.length){
                    return;
                }
                this.$http(api_get_single_detail,row.id,{
                    page:1,
                    pageSize:20,
                    date_start:this.searchData.date_start,
                    date_end:this.searchData.date_end
                }).then(res=>{
                    this.$set(row,'skuList',res.data);
                }).catch( error =>{
                   error&&this.$message({message:error.message||error,type:'error'});
                });
            }
        },
        watch: {
            tempArr: {
                deep: true,
                handler(val) {
                    if (val && val.length) {
                        val.forEach(row => {
                            this.tableData.forEach(table => {
                                if (row.id === table.id) {
                                    this.$set(row, 'quantity', table.quantity)
                                }
                            })
                        })
                    }
                }
            }
        },
        computed: {
            checkAll:{
                get(){
                    return !this.tableData.find(row=>!row.checked);
                },
                set(val){
                    this.tableData.forEach(row=>{
                        row.checked=val;
                    })
                }
            }
        },
        props: {
            searchData:{},
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,
            plusMinus:require('@/components/plus-minus.vue').default,
        },
    }
</script>
