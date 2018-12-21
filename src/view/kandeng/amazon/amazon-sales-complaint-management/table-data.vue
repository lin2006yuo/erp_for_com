<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                v-resize="{height:41}"
                :data="tableData.lists"
                v-loading="loading"
                @selection-change="handle_selection_change"
                :element-loading-text="$t('ymx-detail.loading')"
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column :label="$t('ymx-follow.product_image')">
                <template slot-scope="scope">
                    <el-popover placement="right" trigger="hover">
                        <img v-lazy="scope.row" @click="search_img(scope.row.img)" width="200px" height="200px">
                        <span slot="reference">
                                  <img v-lazy="mdf_img_size(scope.row.img,'_200x200.', '_60x60.')" height="60px" width="60px" style="border:none" @click="search_img(scope.row.img)">
                            </span>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column label='ASIN/SKU'>
                <template slot-scope="scope">
                    <div>{{scope.row.asin===''?'--':scope.row.asin}}</div>
                    <div>{{scope.row.sku===''?'--':scope.row.sku}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-follow.acount_name')">
                <template slot-scope="scope">
                   <span>{{scope.row.account.account_name}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-follow.seller')">
                <template slot-scope="scope">
                    <span>{{scope.row.salesperson}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-follow.processing_status')">
                <template slot-scope="scope">
                    <span>{{scope.row.status===0?$t('ymx-follow.unprocessed'):$t('ymx-follow.processed')}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-follow.processing_person')" prop="create_id">

            </el-table-column>

            <el-table-column :label="$t('ymx-follow.auto_adjust')" prop="modify_price">

            </el-table-column>

            <el-table-column :label="$t('ymx-follow.lowest_price1')" prop="lowest_price">

            </el-table-column>

            <el-table-column :label="$t('ymx-follow.selling_price')" prop="price">

            </el-table-column>
            <!--<el-table-column label='跟卖时间' prop="create_time">-->

            <!--</el-table-column>-->

            <el-table-column :label="$t('ymx-follow.processing_time')" prop="update_time">

            </el-table-column>

            <el-table-column :label="$t('ymx-follow.processing_status')">
                <template slot-scope="scope">
                    <span>{{scope.row.is_heel_sale === 0 ? $t('ymx-follow.has_removed'):$t('ymx-follow.no_sale')}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('common.operating')">
                <template slot-scope="scope">
                    <el-button type="text" @click.native="deal_with(scope.row)" v-if="scope.row.status === 0">{{$t('ymx-follow.process')}}</el-button>
                    <span v-if="scope.row.status === 0"> | </span>
                    <el-button type="text" @click.native="delete_item(scope.row)">{{$t('ymx-detail.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
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

</style>
<script>

    export default {
        data() {
            return {
                imgPath: '',
                imgDialog: false
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
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
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
        }
    }
</script>
