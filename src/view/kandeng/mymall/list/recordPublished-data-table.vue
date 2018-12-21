<template>
    <div>
        <ui-table
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :has-data="tableData.length>0"
                v-model="checkAll"
                :first-loading="firstLoading"
                :body-height="41"
                @check="head_check"
                :heads="[
                    {isCheck:true,width:2},
                    {label:'主图',size:75},
                    {label:'平台SPU',width:12},
                    {label:'本地SPU',width:13},
                    {label:'刊登标题',width:25},
                    {label:'账号简称',width:12},
                    {label:'销售员',width:9},
                    {label:'上传状态',width:9},
                    {label:'刊登时间',width:12},
                    {label:'操作',size:120}
                    ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="main_img(data.main_image,200)"
                                 @click="search_img(data.main_image)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                <img v-lazy="main_img(data.main_image,100)"
                                     @click="search_img(data.main_image)"
                                     height="60px" width="60px" style="border:none">
                        </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']"></i>
                        <ui-tip :content="data.parent_sku"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.goods&&data.goods.spu" :width="88"></ui-tip></td>
                    <td><ui-tip :content="data.name" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.account.code" :width="80"></ui-tip></td>
                    <!--<td><ui-tip :content="data.shop_name" :width="80"></ui-tip></td>-->
                    <td><ui-tip :content="data.user&&data.user.realname" :width="80"></ui-tip></td>
                    <td>
                        <span :title="data.publish_status>-1?'':data.publish_message">{{data.publish_status|statusFilter}}</span>
                    </td>
                    <!--<td><ui-tip :content="data.review_note" :width="80"></ui-tip></td>-->
                    <td>
                        <times :time="data.create_time"></times>
                        <!--<ui-tip :content="data.date_uploaded" :width="80"></ui-tip>-->
                    </td>
                    <td>
                        <div >
                            <permission tag="span" v-if="data.publish_status<1" :route="apis.url_joom_edit" class="operate" @click="curChange(data)">编辑</permission>
                            <permission tag="span" v-if="data.publish_status<0" :route="apis.url_joom_edit">|</permission>
                            <permission tag="span" v-if="data.publish_status<0" :route="apis.url_joom_listing_delrecord" class="operate" @click="curDelete(data)">删除</permission>
                        </div>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td :rowspan="`${(data.variants.length)+1}`"></td>
                        <td>SKU图片</td>
                        <td>平台SKU</td>
                        <td>本地SKU</td>
                        <td>颜色</td>
                        <td>尺寸</td>
                        <td>销售价</td>
                        <td>运费</td>
                        <td>可售量</td>
                        <!--<td>发货期</td>-->
                        <td>异常描述</td>
                    </tr>
                    <tr v-for="(item, item_i) in data.variants" :key="item_i" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="main_img(item.main_image,'200',item.base_url)"
                                     @click="search_img(item.main_image,item.base_url)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                <img v-lazy="main_img(item.main_image,'100',item.base_url)"
                                     @click="search_img(item.main_image,item.base_url)"
                                     height="60px" width="60px" style="border:none">
                            </span>
                            </el-popover>
                        </td>
                        <td><ui-tip :content="item.sku" :width="98"></ui-tip></td>
                        <td><ui-tip :content="item.sku_id" :width="98"></ui-tip></td>
                        <td>{{item.color}}</td>
                        <td>{{item.size}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.shipping || 0}}</td>
                        <td>{{item.inventory}}</td>
                        <!--<td>{{item.shipping_time}}</td>-->
                        <td>{{item.message}}</td>
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
    import {api_edit_publish} from '@/api/publish-mymall-info'
    export default {
        permission: {
            url_joom_edit: '',
            url_joom_listing_delrecord: '',
        },
        data(){
            return {
                imgDialog:false,
                checkAll:false,
                imgPath:''
            }
        },
        methods:{
            //编辑
            curChange(row){
                this.$http(api_edit_publish,{id:row.id,status:"status"}).then(res => {
                    console.log("api_mymall_account_and_store:",res)
                    let params = {
                        goods_id: row.goods_id,
                        isEdit: true,
                        item: res,
                        // title: '刊登'
                    };
                    // this.$open(`/publish/mymall/getData/${row.goods_id}`, params)
                     this.$open(`/publish/mymall/getdata`, params)
                });
            },
            //单个删除
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
            // 全选||非全选
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
                this.selectList = this.tableData.filter(row=>row.isCheck);
            },
            // 单行选择
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectList = this.tableData.filter(row=>row.isCheck);
            },
            get_path,
            // 图片拼接处理
            main_img(image,size,base_url){
                if(image.includes('http')){
                    if(size===500){
                        return image;
                    }
                    if(image.includes('original')){
                        return image.replace('_original.',`_${size}_${size}.`);
                    }
                }
                return this.get_path(image,`_${size}x${size}.`, base_url||this.baseUrl);
            },
            show_detail(data){
                console.log(data, 'data')
                data.show =!data.show;
            },
            // 大图
            search_img(image,base_url){
                this.imgPath = this.main_img(image,500,base_url);
                this.imgDialog = true;
            },
            // 高亮
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
        },
        props:{
            tableData:{
                type: Array
            },
            loading:{
                type: Boolean,
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        filters:{
          statusFilter(val){
              if(val===0){
                  return '上传中'
              }else if(val===1){
                  return '上传成功'
              }else {
                  return '上传失败'
              }
          }
        },
        components:{
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            blowupImage:require("@/components/blowup-image.vue").default,
        }
    }
</script>

