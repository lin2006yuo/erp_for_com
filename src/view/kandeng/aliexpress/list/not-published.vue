<template>
    <div class="aliexpress-wishPublish-list">
        <search-card @search="search" :params="listParams" :clears="clears" :is-search="isSearch">
            <label>账号简称：</label>
            <param-account v-sf.account_id v-model="listParams.account_id"
                           @change="change_account"
                           type="smtPublishAccount"
                           url="get|aliexpress-accounts"
                           :fixResult="fixAccount"
                           placeholder="输入可搜索更多..."
                           class="inline">
            </param-account>
            <el-select v-sf.snType v-model="listParams.snType" class="ml-sm inline s-width-small">
                <el-option v-for="item in options"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <order-input v-if="isMultiRow" v-model="listParams.snText"
                         class="inline s-width-large"
                         v-sf.snText
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input placeholder="请输入内容..."
                      v-else
                      v-sf.snText
                      @keydown.enter.native="search"
                      v-model="listParams.snText"
                      style="width: 180px;"
                      class="inline mr-sm enter-result"></el-input>
            <label class="ml-sm">产品分类：</label>
            <ui-groups v-sf.category_id v-model="listParams.category_id"
                       :parent-click="parentClick"
                       class="inline width-super"
                       :option="categoryList"></ui-groups>

            <label class="ml-sm">产品品牌：</label>
            <scroll-select v-model="randInfo" style="width:140px" class="inline"
                           textAlign="left"
                           :queryClearabled="true"
                           v-sf.raiser_id
                           :remote="'get|publish/express/product-brand'"
                           :fix-params="fix_params_account"
                           :fixResult="fix_result_account">
            </scroll-select>
            <label class="ml-sm">开发员:</label>
            <ui-select v-model="listParams.developer_id"
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
            </ui-select>
        </search-card>
        <!--table数据-->
        <ui-table
            ref="table" class="mt-sm"
            v-loading="loading" element-loading-text="玩命加载中..." :body-height="41" :first-loading="firstLoading"
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
                <td>
                    <ui-tip :is-operate="true" :content="row.spu" :width="98"
                            @cur-click="distribution(row)"></ui-tip>
                </td>
                <td>
                    <ui-tip :content="row.name" :width="90"></ui-tip>
                </td>
                <td>
                    <ui-tip :content="row.packing_en_name" :width="90"></ui-tip>
                </td>
                <td>
                    <ui-tip :content="row.category" :width="85"></ui-tip>
                </td>
                <td>
                    <times :time="row.publish_time"></times>
                </td>
                <td>
                    <permission size="mini" @click="publish(row)" type="primary" tag="ElButton"
                                :route="apis.url_aliexpress_no_list">刊登
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
        <!-- 查看spu -->
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :spu="spu" ref="looks"
                   :edit-able="editAble"
                   :child-active-name="activeName"
                   @reflash="reflash"
                   @change-data="change_data"></look-edit>
        <!-- 查看大图 -->
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .aliexpress-wishPublish-list {
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import {
        api_aliexpress_no_list,
        api_aliexpress_account,
        api_aliexpress_category,
        url_aliexpress_no_list
    } from '../../../../api/publish-smt';
    import {url_publish_baseinfo} from "../../../../api/product-library"
    import {mapGetters} from "vuex"
    import {api_get_user_development_staffs} from '../../../../api/kandeng';

    export default {
        permission: {
            url_aliexpress_no_list, url_publish_baseinfo
        },
        data() {
            return {
                rand_name:'',
                listParams: {
                    snType: 'spu',
                    snText: '',
                    account_id: "",
                    category_id: "",
                    developer_id:'',
                    brand_id:''
                },
                loading: false,
                page: 1,
                pageSize: 50,
                total: 0,
                options: [
                    {
                        value: 'title',
                        label: '产品名称'
                    }, {
                        value: 'spu',
                        label: '本地SPU'
                    },
                    {
                        value: 'sku',
                        label: '本地SKU'
                    },
                ],
                products: [],
                idList: [],
                clears: {
                    snType: "spu",
                },
                firstLoading: true,
                lookVisable: false,
                showedit: false,
                activeName: '速卖通平台',
                goodsId: 0,
                spu: "",
                accountId: "",
                imgDialog: false,
                imgPath: "",
                categoryList: [],
                parentClick: true,
                editAble: false,
                developerList: []
            }
        },
        mounted(){
            this.get_developer();
        },
        methods: {
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'brand_name',
                    snText:keyword?keyword:''

                };
            },
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.brand_name,
                            value: row.brand_id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            get_developer() {
                this.$http(api_get_user_development_staffs).then(res => {
                    this.developerList = res;
                }).catch(code => {
                    console.log(code);
                });
            },
            change_data() {
            },
            reflash() {
            },
            // 切换账号
            change_account(value) {
                let arr = [];
                if (value) {
                    this.$http(api_aliexpress_category, {account_id: value}).then(res => {
                        res.forEach(row => {
                            if (row.childs.length) {
                                arr.push({
                                    value: row.id,
                                    label: row.name,
                                    children: [],
                                    childs: row.childs,
                                });
                            }
                        });
                        arr.forEach(it => {
                            it.childs.forEach(child_id => {
                                let find = res.find(row => child_id === row.id);
                                find && (it.children.push({
                                    value: find.id,
                                    label: find.name,
                                }))
                            });
                        });
                        this.categoryList = arr;
                    });
                } else {
                    this.categoryList = [];
                    this.listParams.category_id = "";
                }
            },
            // 修改图片
            middle_img(image) {
                return image.replace('_60x60.', '_200x200.');
            },
            large_img(image) {
                this.imgPath = image.replace('_60x60.', '_500x500.');
                this.imgDialog = true;
            },
            // 查看spu
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
                return res.map(row => {
                    return {
                        label: row.code,
                        value: row.account_id
                    }
                });
            },
            listFun() {
                this.products = [];
                this.loading = true;
                let data = window.clone(this.listParams);
                if(!!data.snText) {
                    if (this.isMultiRow) {
                        data.snText = data.snText.split('\n').map(row => row.trim()).filter(row => row !== '').join(',');
                    }else{
                        data.snText = data.snText.trim();
                    }
                }
                data.pageSize = this.pageSize;
                data.page = this.page;
                this.$http(api_aliexpress_no_list, data).then(res => {
                    this.products = res.data || [];
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            publish(row) {
                let params = {
                    id: row.goods_id,
                    isAdd: true,
                    isCopy: false,
                    isTime: true,
                    show: true,
                    default_account_id: this.listParams.account_id,
                };//---查看标示id为1
                this.$open(`/kandeng/aliexpress/info?id=${row.goods_id}`, params);
            },
            /*---------搜索*/
            search() {
                this.firstLoading = false;
                this.listFun();
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
        computed:{
            ...mapGetters({
                accounts: 'api/getPublishAccount',
            }),
            isSearch() {
                if (this.listParams.account_id) {
                    return false;
                } else {
                    return true;
                }
            },
            isMultiRow(){
                return this.listParams.snType==='sku'||this.listParams.snType==='spu'
            },
            randInfo:{
                get(){
                    return{
                        label:this.rand_name,
                        value:this.listParams.brand_id
                    }
                },
                set(val){
                    this.rand_name = val.label;
                    this.listParams.brand_id = val.value;
                }
            }
        },
        components: {
            pageDiolog: require("../../../../components/page-dialog.vue").default,
            searchCard: require('../../../../components/search-card.vue').default,
            paramAccount: require("../../../../api-components/param-account.vue").default,
            uiTable: require("../../../../components/ui-table.vue").default,
            uiTip: require("../../../../components/ui-tip.vue").default,
            lookEdit: require("../../../product/manager/look-edit.vue").default,
            blowupImage: require("../../../../components/blowup-image.vue").default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
            orderInput:require('@/components/order-input').default,
            scrollSelect:require('@/components/scroll-select.vue').default,
        }
    }
</script>
