<template>
    <page-dialog v-model="dialog" size='full' :close-on-click-modal="false" @open='open' title="选择指定商品">
        <search-card @enter="search_data" @search="search_data" :params="searchData" :clear="clear">
            <el-select v-model="searchData.snType"
                       class="inline s-width-small"
                       default-first-option filterable clearable>
                <el-option
                        v-for="res in snTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-input v-model="searchData.snText" class="inline width-super"></el-input>
            <label-item label="开发员：" class="ml-sm">
                <param-account v-model="searchData.developer_id" class="s-width-default" v-sf.developer_id
                               :fixResult="development_fix_result"
                               type="memberShipSales"
                               placeholder="请选择/输入..."
                               url="get|user/development/staffs"></param-account>
            </label-item>
            <label-item label="上架时间：" class="ml-sm mr-sm">
            </label-item>
        </search-card>
        <el-row class="mt-sm" :gutter="8">
            <el-col :span="3">
                <label class="category_title" @click="get_all">全部分类</label>
                <div class="add-border">
                    <tree :tree="treeData" @node-click="handle_node_click" class="add-goods-tree"></tree>
                </div>
            </el-col>
            <el-col :span="21">
                <el-table
                    class="scroll-bar" 
                    :data="tableData.lists"
                    v-loading="loading"
                    @selection-change="selection_change"
                    height="580"
                    element-loading-text="玩命加载中..."
                    highlight-current-row>
                    <el-table-column type="selection" width="45"></el-table-column>
                    <el-table-column label="图片" width="80" inline-template>
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img width="200px" height="200px" :src="row.thumb">
                            <span slot="reference">
                              <img height="60px" width="60px" style="border:none" :src="row.thumb">
                        </span>
                        </el-popover>
                    </el-table-column>
                    <el-table-column label="本地SPU" inline-template>
                        <span class="operate" @click="distribution(row)">{{row.spu}}</span>
                    </el-table-column>
                    <el-table-column label="产品中文名称" inline-template>
                        <span>{{row.name}}</span>
                    </el-table-column>
                    <el-table-column label="产品英文名称" inline-template>
                        <span>{{row.title}}</span>
                    </el-table-column>
                    <el-table-column label="本地分类" inline-template>
                        <span>{{row.cagegory_name}}</span>
                    </el-table-column>
                    <el-table-column label="产品状态" inline-template>
                        <span>{{row.sales_status_text}}</span>
                    </el-table-column>
                    <el-table-column label="产品创建时间" inline-template>
                        <span>{{row.publish_time}}</span>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :edit-able="editAble"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName">
        </look-edit>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_publish_amazon_undoc} from '@/api/product-category-api';
    import {api_get_categories} from "@/api/supplier-quote";
    export default {
        data() {
            return {
                lookVisable:false,
                showedit:false,
                goodsId:0,
                editAble:false,
                spu:"",
                activeName:'Amazon平台',

                loading:false,
                dialog:this.value,
                category_id:'',
                treeData:[],
                searchData:{
                    snType:'spu',
                    snText:'',
                    developer_id:'',
                    time_start:'',
                    time_end:'',
                },
                clear:{
                    snType:'spu',
                },
                tableData:{
                    lists:[],
                    page:'',
                    pageSize:'',
                    count:'',
                },
                snTypeList:[
                    {label:'本地SPU',value:'spu'},
                    {label:'本地SKU',value:'sku'},
                    {label:'中文名称',value:'name'},
                ],
                selectList:[]
            }
        },
        methods:{
            submit(){
                if(this.selectList.length<=0)return this.$message({type:'warning',message:'请勾选数据后点击提交'});
                this.selectList.forEach(row=>{
                    let params = {
                        goods_id:row.goods_id,
                        curPage:'not'
                    };
                    this.$open(`/kandeng/amazon/model/info?id=${params.curPage}${row.goods_id}`, params);
                });
            },
            handle_node_click(val){
                this.category_id = val.id;
                this.init();
            },
            get_all(){
                this.category_id = 0;
                this.init();
            },
            search_data(){
                this.init();
            },
            open(){
                this.get_categories();
                this.init();
            },
            init(){
                let params = {};
                Object.assign(params,this.searchData);
                this.$set(params,'page',this.tableData.page);
                this.$set(params,'pageSize',this.tableData.pageSize);
                this.$set(params,'category_id',this.category_id);
                this.loading=true;
                this.$http(api_publish_amazon_undoc,params).then(res => {
                    console.log(res);
                    this.tableData.lists = res.data;
                    this.tableData.total = res.total;
                    this.loading=false;
                }).catch(code => {
                    this.loading=false;
                    this.$message({type:'error',message:code.message||code})
                })
            },
//            获取分类列表
            get_categories() {
                this.treeData = [];
                this.$http(api_get_categories).then(res => {
                    for (let i in res) {
                        let treeObj = {};
                        if (res[i].hasOwnProperty("child_ids") && (res[i].child_ids.length > 0)) {
                            treeObj.label = res[i].title;
                            treeObj.id = res[i].id;
                            treeObj.children = res[i].child_ids.map(row => {
                                return {
                                    id: res[row].id,
                                    label: res[row].title
                                }
                            });
                            this.treeData.push(treeObj);
                        }
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            development_fix_result(val){
                return val.map(row=>{
                    return {
                        label:row.realname,
                        value:row.id
                    }
                })
            },
            distribution(data){
                this.lookVisable = true;
                this.goodsId = data.goods_id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(()=>{
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
            selection_change(val){
                this.selectList = val;
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
          value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            tree:require('@/components/tree.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            lookEdit:require("../../../product/manager/look-edit.vue").default,
        }
    }
</script>