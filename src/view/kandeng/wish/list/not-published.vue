<template>
    <div class="wish-wishPublish-list">
        <search-card @search="search" @enter="search" :params="listParams" :clears="clears" :is-search="isSearch">
            <label> 账号简称：</label>
            <!--<param-account v-sf.accountVal v-model="listParams.accountVal"
                           type="wishPublishAccount"
                           url="get|publish/wish/getSellers"
                           clearabled
                           :fixResult="fixAccount"
                           placeholder="全部"
                           class="mr-sm s-width-default">
            </param-account>-->
            <div class="inline width-sm">
                <super-select v-model="listParams.accountVal"
                              v-sf.accountVal
                              storageKey="wish-account-id"
                              :adjustStructure="adjustStructureAccountId"
                              :remoteRequestHttp="httpWishAccount">
                </super-select>
            </div>
            <el-select class="inline s-width-small" v-sf.snType v-model="listParams.snType">
                <el-option v-for="item in options"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <order-input v-if="isMultiRow" v-model="listParams.snText"
                         class="inline mr-sm s-width-large"
                         v-sf.snText
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input  v-else class="inline mr-sm enter-result" placeholder="请输入内容..." v-sf.snText
                      v-model="listParams.snText"></el-input>
            <label class="ml-sm">产品分类：</label>
            <!--<ui-groups class="inline mr-sm" v-model="listParams.category_id" v-sf.category_id-->
                       <!--:parent-click="parentClick"-->
                       <!--:option="categoryTree">-->
            <!--</ui-groups>-->
            <el-cascader
                class="inline mr-sm"
                clearable
                filterable
                change-on-select
                expand-trigger="hover"
                v-model="listParams.category_id"
                v-sf.category_id
                :options="categoryTree">
            </el-cascader>
            <label>开发员:</label>
            <!--<ui-select v-model="listParams.developer_id"
                       filterable
                       class="inline s-width-small mr-sm"
                       clearable
                       placeholder="选择/输入..."
                       default-first-option>
                <el-option v-for="option in developerList"
                           :key="option.id"
                           :label="option.realname"
                           :value="option.id">
                </el-option>
            </ui-select>-->
            <div class="inline width-sm">
                <super-select v-model="listParams.developer_id"
                              v-sf.developer_id
                              storageKey="wish-developer-id"
                              :options="developerList">
                </super-select>
            </div>
        </search-card>
        <!--table数据-->
        <ui-table
            ref="table" class="mt-sm"
            v-loading="loading" element-loading-text="玩命加载中..." :body-height="38" :first-loading="firstLoading"
            :has-data="products&&products.length>0"
            :heads="[
                        {label:'图片',width:10},
                        {label:'本地SPU',width:10},
                        {label:'产品中文名称',width:25},
                        {label:'产品英文名称',width:25},
                        {label:'本地分类',width:10},
                        {label:'创建时间',width:10},
                        {label:'操作',width:10},
                       ]">
            <tbody>
            <tr v-for="(row, index) in products" :key="row.goods_id">
                <td>
                    <el-popover
                        placement="right"
                        trigger="hover">
                        <img v-lazy="middle_img(row.thumb,'_60x60.')" @click="large_img(row.thumb)" width="200px"
                             height="200px">
                        <span slot="reference">
                              <img v-lazy="row.thumb" height="60px" width="60px" @click="large_img(row.thumb)"
                                   style="border:none">
                            </span>
                    </el-popover>
                </td>
                <td style="position:relative">
                    <div class="icon-wrap">
                        <i v-if="row.tort_flag===1" class="pointer tort-icon" @click="showTort(row)">侵权</i>
                    </div>
                    <i v-if="row.is_discounting===1" :class="getclass(row)" @click="showPrice(row)">跌价</i>
                    <ui-tip :is-operate="true" :content="row.spu" :width="98"
                            @cur-click="distribution(row)"></ui-tip>
                </td>
                <td>
                    <div style="word-break: normal;" :title="row.name">{{row.name}}</div>
                </td>
                <td>
                    <div style="word-break: normal;" :title="row.packing_en_name">{{row.packing_en_name}}</div>
                </td>
                <td>
                    <ui-tip :content="row.category" :width="90"></ui-tip>
                </td>
                <td>
                    <times :time="row.publish_time"></times>
                </td>
                <td>
                    <permission tag="ElButton" size="mini" @click="publish(row)" type="primary"
                                :route="apis.url_wish_add">刊登
                    </permission>
                </td>
            </tr>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=page
            :page-sizes="[20, 50, 100, 200]"
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName"
                   @reflash="reflash"
                   :edit-able="editAble"
                   @change-data="change_data"></look-edit>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <tort-record
            v-model="tortShow"
            :title="tortTitle"
            :tortInfo="tortInfo">
        </tort-record>
        <subsidy-diaog
            :datavalue="datavalue"
            :title="title"
            v-model="subDisplay"
        ></subsidy-diaog>
    </div>
</template>
<style lang="stylus" scoped>
    .wish-wishPublish-list {
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .el-card {
            overflow: inherit;
        }
    }
    .icon-wrap{
        width:35px;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }
    .tort-icon{
        display:block;
        height:18px;
        line-height:18px;
        padding:0 3px;
        font-size:10px !important;
        font-style:normal;
        color:#ff0000;
        border:1px solid #ff0000;
    }
    .top{
        position absolute;
        width: 27px;
        top:20px;
        left: 0;
        border: 1px solid #660033;
        color:#660033;
    }
    .notop{
        top:0px
    }
</style>
<script>

    import {get_product_list, api_get_user_development_staffs, url_wish_add,api_goods_tort_description} from '../../../../api/kandeng';
    import {api_joom_category_tree,} from '../../../../api/joom-set-classify'
    import {mapGetters} from "vuex"
    import {api_get_discount} from '@/api/product-library';
    import {http} from "@/lib/http-plus.js"

    export default {
        permission: {
            url_wish_add
        },
        data() {
            return {
                listParams: {
                    snType: 'spu',
                    snText: '',
                    accountVal: "",
                    accountType: "short",
                    category_id: [],
                    developer_id: ''
                },
                accountOption: [
                    {label: "账号", value: "full"},
                    {label: "简称", value: "short"},
                ],
                loading: false,
                idList: [],
                page: 1,
                pageSize: 50,
                total: 0,
                options: [
                    {
                        value: 'name',
                        label: '刊登标题'
                    },
                    {
                        value: 'spu',
                        label: '本地SPU'
                    },
                    {
                        value: 'sku',
                        label: '本地SKU'
                    },
                    {
                        value: 'alias',
                        label: '商品别名'
                    },
                ],
                products: [],
                clears: {
                    snType: 'spu',
                    accountType: "short",
                },
                firstLoading: true,
                lookVisable: false,
                showedit: false,
                activeName: 'wish平台',
                goodsId: 0,
                spu: "",
                accountId: "",
                imgDialog: false,
                imgPath: "",
                parentClick: true,
                categoryTree: [],
                editAble: false,
                developerList: [],
                tortShow:false,
                tortTitle:"",
                tortInfo:{
                    id:""
                },
                subDisplay:false,
                title:"",
                datavalue:[],

            }
        },
        mounted() {
            this.get_category_tree();
            this.get_developer();
        },
        computed: {
            ...mapGetters({
                accounts: 'api/getPublishAccount',
            }),
            isSearch() {
                if (this.listParams.accountVal) {
                    return false;
                } else {
                    return true;
                }
            },
            isMultiRow(){
                return this.listParams.snType==='sku'||this.listParams.snType==='spu'
            }
        },
        methods: {
            adjustStructureAccountId(data){
                return {
                    data:data.data.map(val=>({label:val.label,value:val.id})),
                    count:data.data.length
                }
            },
            httpWishAccount(){
                return http('get|publish/wish/getSellers')
            },
            showTort(row){
                this.tortShow = true;
                this.tortTitle = `${row.spu} 侵权记录`;
                this.$set(this.tortInfo,"id",row.goods_id);
            },
            showPrice(data){
                this.$http(api_get_discount,{goods_id:data.goods_id}).then(res=>{
                    this.title=`${data.spu}补贴信息`;
                    this.datavalue=res.data.map(row=>{
                        let discount_price='',discount_scale='';
                        if(row.discount_type===1){
                            discount_price=row.discount_value
                        }
                        if(row.discount_type===2){
                            discount_scale=row.discount_value;
                        }
                        return{
                            sku:row.sku,
                            inventory_price:row.inventory_price,
                            last_purchase_price:row.last_purchase_price,
                            new_price:row.new_price,
                            discount_price,
                            discount_scale,
                            discount:row.discount_num+'/'+row.sell_num,
                            valid_time:this.dateFilter(new Date(row.valid_time).getTime()/1000)+'-'+this.dateFilter(new Date(row.over_time).getTime()/1000),
                            warehouse:row.warehouse,
                            status:row.status,
                            status_text:row.status_text,
                            remark:row.remark,
                        }
                    });
                    this.subDisplay=true;
                })
            },
            getclass(row){
                if(row.tort_flag===1){
                    return 'inline pointer tort-icon top'
                }else{
                    return 'inline pointer tort-icon top notop'
                }
            },
            dateFilter(val){
                return datef('YYYY-MM-dd', val);
            },
            get_developer() {
                this.$http(api_get_user_development_staffs).then(res => {
                    this.developerList = res.map(val=>{
                        return {
                            label:val.realname,
                            value:val.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            get_category_tree() {
                this.$http(api_joom_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                }).catch(code => {
                    console.log(code);
                });
            },
            data_format(val) {
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            change_data() {
            },
            reflash() {
            },
            middle_img(image) {
                return image.replace('_60x60.', '_200x200.');
            },
            large_img(image) {
                this.imgPath = image.replace('_60x60.', '_500x500.');
                this.imgDialog = true;
            },
            distribution(data) {
                this.lookVisable = true;
                this.goodsId = data.id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(() => {
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
            fixAccount(res) {
                return res.data.map(row => {
                    return {
                        label: row.code,
                        value: row.id,
                    }
                })
            },
            listFun() {
                if (!this.listParams.accountVal) return;
                this.loading = true;
                let data = window.clone(this.listParams);
                if(!!data.snText) {
                    if (this.isMultiRow) {
                        data.snText = data.snText.split('\n').map(row => row.trim()).filter(row => row !== '').join(',');
                    }else{
                        data.snText = data.snText.trim();
                    }
                }
                // data.snText = data.snText.trim();
                data.page = this.page;
                data.pageSize = this.pageSize;
                if(this.listParams.category_id.length){
                    this.$set(data,"category_id",this.listParams.category_id[this.listParams.category_id.length-1]);
                }else{
                    this.$set(data,"category_id","");
                }
                this.$http(get_product_list, data).then(res => {
                    this.products = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                    this.loading = false;
                })
            },
            publish(data) {
                let param = {
                    id: data.id,
                    goods_id: data.goods_id,
                    isAdd: true,
                    isCopy: false,
                    isTime: true,
                    default_account_id: this.listParams.accountVal,
                    curModel: 'notPublish',
                    spu:data.spu,
                    tort_flag:data.tort_flag
                };//---查看标示id为1
                this.$open(`/kandeng/wish/info?id=${data.id}`, param)
            },
            /*---------搜索*/
            search() {
                this.listFun()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.listFun()
            },
            handleCurrentChange(page) {
                this.page = page;
                this.listFun()
            }
        },
        components: {
            paramAccount: require("../../../../api-components/param-account.vue").default,
            searchCard: require('../../../../components/search-card.vue').default,
            uiTable: require("../../../../components/ui-table.vue").default,
            uiTip: require("../../../../components/ui-tip.vue").default,
            lookEdit: require("../../../product/manager/look-edit.vue").default,
            blowupImage: require("../../../../components/blowup-image.vue").default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
            uiSelect: require('@/components/ui-select.vue').default,
            orderInput:require('@/components/order-input').default,
            "tort-record":require("./tort-record.vue").default,
            subsidyDiaog:require("@/view/kandeng/ymx/subsidy-diaog.vue").default,
        }
    }
</script>
