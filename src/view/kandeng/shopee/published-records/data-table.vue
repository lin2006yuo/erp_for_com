<template>
    <div class="c-data-table">
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="tableData.length>0"
                  v-model="checkAll"
                  :body-height="41"
                  :first-loading="firstLoading"
                  @check="head_check"
                  :heads="[
                    {isCheck:true,width:2},
                    {label:'主图',size:75},
                    {label:'平台SPU',width:15},
                    {label:'本地SPU',width:8},
                    {label:'刊登标题',width:25},
                    {label:'账号简称',width:6},
                    {label:'销售员',width:8},
                    {label:'上传状态',width:8},
                    {label:'定时刊登',width:9},
                    {label:'创建时间',width:9},
                    {label:'刊登异常',width:8},
                    {label:'操作',size:120}
                    ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="main_img(data.images,200,data.base_url)"
                                 @click="search_img(data.images,data.base_url)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                    <img v-lazy="main_img(data.images,100,data.base_url)"
                                         @click="search_img(data.images,data.base_url)"
                                         height="60px" width="60px" style="border:none">
                                </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']"></i>
                        <ui-tip :content="data.item_sku"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.spu"></ui-tip></td>
                    <td><ui-tip :content="data.name"></ui-tip></td>
                    <td><ui-tip v-if='data.account' :content="data.account.code"></ui-tip></td>
                    <td><ui-tip :content="data.seller_name"></ui-tip></td>
                    <td>
                        <span :title="data.publish_status>-1?'':data.publish_message"
                              :class="{red:data.publish_status===-1,'color-success':data.publish_status===3}">{{data.publish_status | statusFilter}}</span>
                    </td>
                    <td>
                        {{data.cron_time | filterTime}}
                    </td>
                    <td>
                        {{data.create_time | filterTime}}
                    </td>
                    <td><ui-tip :content="data.publish_message"></ui-tip></td>
                    <td>
                        <div>
                            <permission tag="span" v-if="data.publish_status<1" :route="apis.url_shopee_publish" class="operate" @click="curChange(data)">编辑</permission>
                            <permission tag="span" v-if="data.publish_status<0" :route="apis.url_shopee_publish">|</permission>
                            <permission tag="span" v-if="data.publish_status<0" :route="apis.url_delete_shopee" class="operate" @click="curDelete(data)">删除</permission>
                        </div>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td colspan="2" :rowspan="`${(data.variants.length)+1}`"></td>
                        <td>平台SKU</td>
                        <td>本地SKU</td>
                        <td>商品属性</td>
                        <td>售价</td>
                        <td>可售量</td>
                        <td>本地状态</td>
                        <td :colspan="`${6-data.variants.length}`" :rowspan="`${data.variants.length+1}`"></td>
                    </tr>
                    <tr v-for="(item, item_i) in data.variants" :key="item.id" class="variant">
                        <td><ui-tip :content="item.variation_sku" :width="98"></ui-tip></td>
                        <td><ui-tip :content="item.local_sku" :width="98"></ui-tip></td>
                        <td>{{item.name}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.stock}}</td>
                        <td>{{item.sku_sale_status}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {api_shopee_publish,url_shopee_publish,url_delete_shopee} from '../../../../api/shopee-publish';
    export default{
        permission:{
            url_delete_shopee,
            url_shopee_publish
        },
        data(){
            return {
                imgDialog:false,
                checkAll:false,
                imgPath:''
            }
        },
        methods:{
            // 高亮
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            // 单行选择
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
            },
            // 全选||非全选
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
            },
            // 大图
            search_img(image,base_url){
                this.imgPath = this.main_img(image,500,base_url);
                this.imgDialog = true;
            },
            get_path,
            // 图片拼接处理
            main_img(image,size,base_url){
                if(image){
                    image = JSON.parse(image);
                    let curImage = image[0];
                    if(curImage.includes('http')){
                        return curImage;
                    }else{
                        return this.get_path(curImage,`_${size}x${size}.`, base_url||this.baseUrl);
                    }
                }else{
                    return '';
                }
            },
            curChange(row){
                let params = {
                    goods_id: row.goods_id,
                    id:row.id,
                    isEdit: true,
                    curPage:'record',
                };
                this.$open(`/shopee/info-detail?id=${params.curPage}${params.goods_id}`, params)
            },
            curDelete(data){
                this.$confirm(`您将要对已选Listing记录执行删除操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('operateDel',data,{ids:data.id+''})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            show_detail(data){
                data.show =!data.show;
            },
        },
        props:{
            tableData:{
                required:true,
                type:Array
            },
            loading:{
                type: Boolean,
            },
            firstLoading:{
                type: Boolean,
                required: true
            }
        },
        filters:{
            statusFilter(val){
                switch(val){
                    case -1:
                        return '刊登失败';
                    case 0:
                        return '未刊登';
                    case 1:
                        return '刊登队列中';
                    case 2:
                        return '刊登中...';
                    case 3:
                        return '刊登成功';
                    case 4:
                        return '更新队列中';
                    case 5:
                        return '更新中...';
                    case 6:
                        return '更新失败';
                    default:
                        return '暂无状态'
                }
            },
            filterTime(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss',val);
                }
            }
        },
        components: {
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            blowupImage:require("@/components/blowup-image.vue").default,
        }
    }
</script>
