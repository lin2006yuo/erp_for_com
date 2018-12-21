<template>
    <div>
        <ui-table v-loading="tableObj.loading"
                  element-loading-text="玩命加载中..."
                  :has-data="tableObj.tableData.length>0"
                  :body-height="41"
                  @check="head_check"
                  v-model="checkAll"
                  :heads="[
                    {isCheck:true,width:2,},
                    {label:'图片',width:9},
                    {label:'范本ID',width:9},
                    {label:'本地SPU',width:9},
                    {label:'站点',width:9},
                    {label:'分类模板',width:9},
                    {label:'刊登标题',width:17},
                    {label:'引用次数',width:9},
                    {label:'创建人',width:9},
                    {label:'创建时间',width:9},
                    {label:'操作',width:9}]">
                <tbody>
                <template  v-for="(row,index) in tableObj.tableData">
                    <tr :key="row.id"  @click="add_class(index)"
                        :class="[row.isShow?'active':'',clickData[index]?'active-color':'']">
                        <td>
                            <el-checkbox v-model="row.isCheck"></el-checkbox>
                        </td>
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="get_img(row,'_200x200.')" @click="search_img(row)" width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="get_img(row,'_200x200.')" @click="search_img(row)" height="60px" width="60px" style="border:none">
                            </span>
                            </el-popover>
                        </td>
                        <!--范本ID-->
                        <td>
                            <plus-minus @show-detail="show_detail(index, row)" :show="row.isShow" :title="tipTitle"></plus-minus>
                            {{row.id}}
                        </td>
                        <!--本地SPU-->
                        <td>{{row.spu}}</td>
                        <!--站点-->
                        <td>{{row.site_text}}</td>
                        <!--分类模板-->
                        <td>{{row.category_template_name}}</td>
                        <!--刊登标题-->
                        <td>{{row.title}}</td>
                        <!--引用次数-->
                        <td>{{row.use_total}}</td>
                        <!--创建人-->
                        <td>{{row.creator}}</td>
                        <!--创建时间-->
                        <td>{{row.create_time}}</td>
                        <!--操作-->
                        <td>
                            <trends-select class="inline" @trigger="action(row,$event)"
                                           :selects="triggerList" type="primary"></trends-select>
                        </td>
                    </tr>
                    <!--detail部分-->
                    <template v-if="row.isShow&&row.detail&&row.detail.length>0">
                        <tr>
                            <td :rowspan="row.detail.length+1"></td>
                            <td :rowspan="row.detail.length+1"></td>
                            <td :rowspan="row.detail.length+1"></td>
                            <td>SKU图</td>
                            <td>本地SKU</td>
                            <!--动态属性-->
                            <td>{{row.detail[0].variant_info|filterAttrName}}</td>
                            <!--销售价-->
                            <td>销售价</td>
                            <!--可售量-->
                            <td>可售量</td>
                            <td :rowspan="row.detail.length+1"></td>
                            <td :rowspan="row.detail.length+1"></td>
                            <td :rowspan="row.detail.length+1"></td>
                        </tr>
                        <tr v-for="item in row.detail">
                            <!--sku图片-->
                            <td><img :src="item.main_image" alt=""></td>
                            <!--平台SKU-->
                            <td>{{item.sku}}</td>
                            <!--动态属性-->
                            <td>{{row.detail[0].variant_info|filterAttrValue}}</td>
                            <!--销售价-->
                            <td>{{item.standard_price}}</td>
                            <!--可售量-->
                            <td>{{item.quantity}}</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableObj.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="tableObj.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableObj.total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_publish_amazon_doc_del} from '@/api/product-category-api';
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default {
        data() {
            return {
                imgPath:'',
                imgDialog:false,
                clickData:[],
                tipTitle:'',
                triggerList:[
                    {label:'编辑',value:1,action:function (val) {
                        let params = {
                            goods_id:val.goods_id,
                            id:val.id,
                            curPage:'edit'
                        };
                        this.$open(`/kandeng/amazon/model/info?id=${params.curPage}${val.id}`,params);
                    }},
                    {label:'复制',value:2,action:function (val) {
                        let params = {
                            goods_id:val.goods_id,
                            id:val.id,
                            curPage:'copy'
                        };
                        this.$open(`/kandeng/amazon/model/info?id=${params.curPage}${val.id}`,params);
                    }},
                    {label:'删除',action:function (val) {
                        this.$confirm(`此操作将删除当前范本，确认此操作吗？`,"提示",{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            closeOnClickModal:false,
                        }).then(()=>{
                            this.delete_cur(val);
                        });
                    }},
                ]
            }
        },
        filters:{
            filterAttrName(val){
                return Object.keys(val).join('/')
            },
            filterAttrValue(val){
                return Object.values(val).join('/')

            },
        },
        mounted(){
            for(let i=0;i<this.tableObj.tableData.length;i++){
                this.clickData.push(false)
            }
        },
        methods:{
            get_path,
            search_img(row){
               this.imgPath = this.get_img(row,'_500x500.');
               this.imgDialog = true;
            },
            get_img(row,size){
                if(/^http/.test(row.main_image)){
                    return  row.main_image
                }else {
                    if(/^\//.test(row.main_image)){
                        return this.get_path(row.main_image.slice(1),size,row.base_url);
                    }else {
                        return this.get_path(row.main_image,size,row.base_url);
                    }
                }
            },
            /*删除
            * */
            delete_cur(row){
                this.$http(api_publish_amazon_doc_del,{ids:row.id}).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    let index = this.tableObj.tableData.findIndex(item=>row.id===item.id);
                    if(index>-1) this.tableObj.tableData.splice(index,1);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            action(row,val){
                val.action.call(this,row)
            },
            head_check(){

            },
            add_class(index){
                this.clickData.map(row=>false);
                this.clickData[index] = true;
            },
            size_change(size){
                this.$emit('size-change',size);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
            show_detail(index,row){
                row.isShow = !row.isShow;
            },
        },
        computed:{
//            m_option(row){
//                return this.triggerList;
//            },
            checkAll:{
                get(){
                    return !this.tableObj.tableData.find(row=>!row.isCheck);
                },
                set(val){
                    this.tableObj.tableData.forEach(row=>{
                        this.$set(row,'isCheck',val);
                    })
                },
            },
        },
        props:{
            tableObj:{
                required:true,
                type:Object,
            },
        },
        components: {
            uiTable:require('@/components/ui-table.vue').default,
            plusMinus:require('@/components/plus-minus.vue').default,
            trendsSelect:require('@/components/trends-select.vue').default,
            blowupImage:require("@/components/blowup-image.vue").default,
        }
    }
</script>