<template>
    <div class="p-amazon-unpublished">
        <not-published-search-card :total="total"
                                   ref="search"
                                   :siteList="siteList"
                                   @search="search"></not-published-search-card>
        <ui-table v-loading="loading"  :element-loading-text="$t('ymx-list.playLoad')" style="margin-top: 10px"
                  :body-height="41" :first-loading="firstLoading"
                  :has-data="tableData.length>0" v-model="checkAll" @check="head_check" @sort-click="sort_click"
                  :heads="[
                        {label:$t('ymx-list.image'),width:5},
                        {label:$t('ymx-list.langSup'),width:9},
                        {label:$t('ymx-list.localspu'),width:8},
                        {label:$t('ymx-list.zhName'),width:21},
                        {label:$t('ymx-list.enName'),width:21},
                        {label:$t('ymx-list.localClass'),width:10},
                        {label:$t('ymx-list.productLabel'),width:8},
                        {label:$t('ymx-list.cTime'),width:8},
                        {label:$t('ymx-list.operat'),width:10}]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :key="data.id" :class="{'high-light': data.highLight}" @click="row_click(index)">
                    <!--图片-->
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="data.thumb" @click="search_img(data.thumb)" width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="mdf_img_size(data.thumb,'_200x200.', '_60x60.')" height="60px" width="60px" style="border:none" @click="search_img(data.thumb)">
                            </span>
                        </el-popover>
                    </td>
                    <!--支持语种-->
                    <td>
                        <el-tag v-if='data.langs&&data.langs.length>0' type="success" v-for="items in data.langs" :key="items"
                                class="ml-xs">{{items}}</el-tag>
                        <span v-else>暂无支持语言</span>
                    </td>
                    <!--本地SPU-->
                    <td style="position:relative;">
                        <span style="cursor:pointer;">
                            <div class="icon-list" >
                                <div  class="infringement-icon" v-if="data.is_goods_tort" @click="show_infringement(data.goods_id,data.spu)" >侵权</div>
                                <div class="price-down-icon" v-if="data.is_goods_discount" @click="show_price_down(data.goods_id,data.spu)">跌价</div>
                            </div>
                            <div class="localhost-spu">
                                <ui-tip :is-operate="true" :content="data.spu" @cur-click="distribution(data)"></ui-tip>
                            </div>
                        </span>
                    </td>
                    <!--产品中文名称-->
                    <td>
                        <ui-tip :width="98" :content="data.name"></ui-tip>
                    </td>
                    <!--产品英文名称-->
                    <td>
                        <ui-tip :width="98" :content="data.packing_en_name"></ui-tip>
                    </td>
                    <!--本地分类-->
                    <td><ui-tip :content="data.category_name" :width="90"></ui-tip></td>
                    <!--产品标签-->
                    <td>
                        <ui-tip :content="data.tag" ></ui-tip>
                    </td>
                    <!--创建时间-->
                    <td>
                        <times :time="data.publish_time"></times>
                    </td>
                    <!--操作-->
                    <td>
                        <!--$t('p-ebay.publish')-->
                        <permission tag="ElButton"
                                    :route="apis.url_amazon_field"
                                    type="primary" size="mini"
                                    @click="go_publish(data)">{{$t('ymx-list.up')}}</permission>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :edit-able="editAble"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName">
        </look-edit>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <infringement-dialog
            :value="infringementShow"
            @change-show="change_show"
            :tableData="infringementData"
            :title="title"
        >
        </infringement-dialog>
        <price-down-dialog
            :value="priceDownShow"
            @change-show="change_price_down_show"
            :tableData="priceDownData"
            :title="priceDownTitle"
        ></price-down-dialog>
    </div>
</template>

<style lang="stylus">
    .p-amazon-unpublished{
        .high-light{
            background-color: rgba(173,227,255, 0.5);
        }
        .icon-list {
            position:absolute;
            top:0;
            left:0;
            max-height:40px;
            .infringement-icon,.price-down-icon{
                  font-size:12px;
                  line-height:normal;
                  cursor:pointer;
                  padding:1px 3px;
            }
            .infringement-icon{
                color:red;
                border:1px solid red;
            }
            .price-down-icon{
                color:#660033;
                border:1px solid #660033;
            }

        }
        .localhost-spu{
            box-sizing:border-box;
            padding-left:35px;
        }
    }
</style>
<script>
    import {api_unpublished,api_publish_amazon_infringement,api_get_amazon_account,api_publish_amazon_discount} from  '../../../../api/amazon-publish-list';
    import {url_amazon_field} from '../../../../api/amazon-publish-info'
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';

    export default{
        permission:{
            url_amazon_field
        },
        data(){
            return {
                total: 0,
                searchData: {},
                tableData: [],
                loading: false,
                firstLoading: true,
                checkAll:false,
                lookVisable: false,
                showedit:false,
                goodsId:0,
                spu:'',
                activeName:'Amazon平台',
                imgDialog: false,
                imgPath:'',
                editAble:false,
                infringementShow:false,
                infringementData:[],
                str:"",
                title:'',
                account:[],
                priceDownShow:false,
                priceDownData:[],
                priceDownTitle:'',
            }
        },
        mounted(){
            this.get_account();
        },
        methods: {
            langs(value){
                if(value=='中文'){
                    return this.$t('ymx-detail.chi');
                }else if(value=="英文"){
                    return this.$t('ymx-detail.eng');
                }else if(value==="德语"){
                    return "德语";
                }
            },
            //显示跌价弹窗
            show_price_down(goods_id,title){
                this.priceDownShow = true;
                this.priceDownTitle = title;
                this.$http(api_publish_amazon_discount,{goods_id:goods_id})
                    .then(res=>{
                        console.log(res);
                        this.priceDownData = [...res.data]
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message ||err
                        })
                    })
            },
            change_price_down_show(val){
                this.priceDownShow = val;
            },
            get_account(){
                this.$http(api_get_amazon_account).then(res => {
                    this.account = res;
                    // this.searchData.account_id = this.accounts.length>0?this.accounts[0].account_id:'';
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message:code.message || code
                    });
                    // this.account.splice(0, this.accounts.length+1);
                })
            },
            get_path,
            init(){
                this.loading = true;
                let params = window.clone(this.searchData);
                if(params.category_id.length){
                    params.category_id=params.category_id[params.category_id.length-1];
                }else{
                    params.category_id="";
                }
                if(this.searchData.lang_id.length === 0){
                    params.lang_id = ''
                }else if(this.searchData.lang_id.length === 1){
                    params.lang_id = this.searchData.lang_id[0]
                }else{
                    params.lang_id = this.searchData.lang_id.join(',')
                }
                params.snText = this.str.trim();
                this.$http(api_unpublished, params).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    this.loading = false;
                })
            },
            go_publish(data){
                let site = 0;
                // let accountList = this.$refs.search.account;
                // let find = accountList.find(row=>row.account_id===this.searchData.account);
                let find = this.account.find(row=>row.account_id===this.searchData.account);
                if(!!find) site=find.site;
                let params = {
                    spu: data.spu,
                    goods_id: data.goods_id,
                    account_id: this.searchData.account,
                    site: site,
                    add: true,
                    curPage:'not',//未刊登
                };
                this.$open(`/kandeng/amazon/info?id=${data.goods_id}`, params);
            },
            search(val,str){
                this.searchData = val;
                this.str=str;
                this.init();
            },
            head_check(){

            },
            sort_click(){

            },
            row_click(){

            },
            distribution(data){
                this.lookVisable = true;
                this.goodsId = data.goods_id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(()=>{
//                    this.$refs.looks.editAble = true;
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
            search_img(image){
                this.imgPath = image.replace('_200x200.','_500x500.');
                this.imgDialog = true;
            },
            mdf_img_size(path,oldValue, newValue){
            	return path.replace(oldValue, newValue);
            },
            show_infringement(goods_id,title){
                this.title=title;
                this.infringementShow=true;
                this.$http(api_publish_amazon_infringement,goods_id)
                    .then(res=>{
                        this.infringementData=[...res];
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            },
            change_show(val){
                this.infringementShow=val;
            }
        },
        props: {
            siteList:{
                required: true,
                type: Array,
            }
        },
        components: {
            notPublishedSearchCard: require('./not-published-search-card.vue').default,
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTip:require("../../../../components/ui-tip.vue").default,
            lookEdit:require("../../../product/manager/look-edit.vue").default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            infringementDialog:require('./infringement-dialog.vue').default,
            priceDownDialog:require('./price-down-dialog.vue').default
        }
    }
</script>

