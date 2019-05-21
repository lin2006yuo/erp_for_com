<template>
    <div class="c-table-data">
        <ui-table
            :first-loading="firstLoading"
            :has-data="tableData.lists.length>0"
            v-loading="loading"
            @check="check_all"
            v-model="checkAll"
            :element-loading-text="$t('ymx-detail.loading')"
            :body-height="41"
            :heads="[
                    {isCheck:true,width:2,},
                    {label:$t('ymx-follow.product_image'),width:5},
                    {label:'ASIN/SKU',width:20},
                    {label:$t('ymx-follow.complaint_brand'),width:6},
                    {label:$t('ymx-follow.acount_name'),width:5},
                    {label:$t('ymx-follow.seller'),width:5},
                    {label:$t('ymx-follow.selling_price'),width:6},
                    {label:$t('ymx-follow.processing_status'),width:6},
                    {label:$t('ymx-follow.auto_adjust'),width:6},
                    {label:$t('ymx-follow.lowest_price1'),width:6},
                    {label:$t('ymx-follow.processing_person'),width:6},
                    {label:$t('ymx-follow.processing_time'),width:12},
                    {label:$t('ymx-follow.whether_shelf'),width:5},
                    {label:$t('common.operating'),width:10},
                    ]"

         >
            <tbody  >
                <template v-for="(row,index) in tableData.lists">
                    <tr :key="row.id">
                        <td>
                            <el-checkbox v-model="row.isCheck" @change="change_msg(row)"></el-checkbox>
                        </td>
                        <td>
                            <el-popover placement="right" trigger="hover" >
                                <img v-lazy="row" @click="search_img(row.img)">
                                <span slot="reference">
                                <img v-lazy="mdf_img_size(row.img,'_200x200.', '_60x60.')" width="50px" height="50px" style="border:none" @click="search_img(row.img)">
                                </span>
                            </el-popover>
                        </td>
                        <td>
                            <div style="text-align:left;">
                                <plus-minus @show-detail="show_detail(row)" :show="row.isShow" :title="tipTitle"></plus-minus>{{row.asin===''?'&#45;&#45;':row.asin}}--{{row.sku===''?'&#45;&#45;':row.sku}}
                            </div>
                        </td>
                        <td>
                            <div>{{row.brand}}</div>
                        </td>
                        <td>
                            <span>{{row.account.account_name}}</span>
                        </td>
                        <td>
                            <span>{{row.salesperson}}</span>
                        </td>
                        <td>
                            {{row.price}}
                        </td>
                        <td>
                            <span>{{row.status===0?$t('ymx-follow.unprocessed'):$t('ymx-follow.processed')}}</span>
                        </td>
                        <td>
                            {{row.modify_price}}
                        </td>
                        <td>
                            {{row.lowest_price}}
                        </td>
                        <td>
                            {{row.create_id}}
                        </td>
                        <td>
                            {{row.update_time}}
                        </td>
                        <td>
                            <span>{{row.is_heel_sale === 0 ? $t('ymx-follow.has_removed'):$t('ymx-follow.no_sale')}}</span>
                        </td>
                        <td>
                            <el-button type="text" @click.native="deal_with(row)" v-if="row.status === 0">{{$t('ymx-follow.process')}}</el-button>
                            <span v-if="row.status === 0"> | </span>
                            <el-button type="text" @click.native="delete_item(row)">{{$t('ymx-detail.delete')}}</el-button>
                        </td>
                    </tr>
                <!--detail部分-->
                <template v-if="row.isShow">
                    <tr>
                        <td :rowspan="1+row.seller_heel_sale.length"></td>
                        <td :rowspan="1+row.seller_heel_sale.length"></td>
                        <td class="small-table">卖家ID</td>
                        <td class="small-table" :colspan="2">卖家店铺名称</td>
                        <td class="small-table">账号简称</td>
                        <td class="small-table">销售员</td>
                        <td class="small-table" :colspan="2">购物车价格</td>
                        <td class="small-table" :colspan="2">跟卖价格</td>
                        <td class="small-table" :colspan="3">跟卖时间</td>
                    </tr>
                    <tr v-for="(item,index) in row.seller_heel_sale" :key="index" >
                        <td>{{item.seller_id}}</td>
                        <td :colspan="2">
                            {{item.seller_name}}
                            <span v-if='item.account_id>0' :class="[item.account_id>0?'red-tips-box':'']">( 内部店铺 )</span>
                        </td>
                        <td>{{item.code}}</td>
                        <td>{{item.realname}}</td>
                        <td :colspan="2">{{item.buy_box_price}}</td>
                        <td :colspan="2">{{item.heel_sale_price}}</td>
                        <td :colspan="3">{{item.heel_sale_time}}</td>
                    </tr>
                </template>
                </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=tableData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .small-table{
        background-color:rgb(248,248,248);
        font-weight:bold;
    }
    .red-tips-box{
        color:red;
        /*width:100%;
        height:100%;*/

    }
</style>
<script>

    export default {
        data() {
            return {
                imgPath: '',
                imgDialog: false,
                tipTitle:'',
                checkAll:false,
            }
        },
        methods:{
            deal_with(row){//处理
                this.$emit('deal-with', row)
            },
            delete_item(row){//删除
                this.$emit('delete-item',row)
            },
            size_change(size){
                this.$emit('size-change',size);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
            search_img(image){
                this.imgPath = image.replace('_200x200.','_500x500.');
                this.imgDialog = true;
            },
            mdf_img_size(path,oldValue, newValue){
                return path.replace(oldValue, newValue);
            },
            check_all(val){
                this.tableData.lists.forEach(item=>{
                    item.isCheck=val;
                })
                this.$emit('change-all');
            },
            show_detail(row){
                row.isShow = !row.isShow;
            },
            change_msg(row){
                let arr=this.tableData.lists.filter(item=>{
                    return item.isCheck;
                })
                if(arr.length===this.tableData.lists.length){
                    this.checkAll=true;
                }else{
                    this.checkAll=false;
                }
                this.$emit('change-msg',row);
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        filters:{
          date_filter(data){
              let arr=data.split(" ");
              return arr[0]+" "+arr[1].slice(2);
          }
        },
        props:{
            tableData:{
                type:Object,
                required:true,
            },
            loading:{
                type:Boolean,
                required:true,
            },
            firstLoading:{
                type:Boolean,
                required:true,
            }
        },
        components: {
            blowupImage:require("../../../../components/blowup-image.vue").default,
            plusMinus:require('@/components/plus-minus.vue').default,
            uiTable:require('@/components/ui-table.vue').default,
        }
    }
</script>
