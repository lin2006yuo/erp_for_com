<template>
    <div class="p-publish-queue">
        <published-queue-search-card :total="total"
                                     :search-data="searchData"
                                     :clears="clears"
                                     :siteList="siteList"
                                     @search="search"></published-queue-search-card>
        <permission tag="ElButton"
                    :route="apis.url_publish_del"
                    class="mt-sm mb-sm ml-sm"
                    type="primary" size="mini"
                    @click.native="batch_delete">{{$t('ymx-list.batchDel')}}</permission>
        <permission tag="ElButton"
                    :route="apis.url_amazon_error_export"
                    class="mt-sm mb-sm ml-sm"
                    type="primary" size="mini"
                    @click.native="batch_export">{{$t('ymx-list.bExport')}}</permission>
        <permission tag="ElButton"
                    :route="apis.url_batch_copy"
                    type="primary" size="mini"
                    @click="batch_copy">{{$t('ymx-list.bCopy')}}</permission>
        <permission tag="ElButton"
                    type="primary" size="mini"
                    @click.native="adjusted_price"
                    :route="apis.url_adjusted_price">{{$t('ymx-list.mdfPrice')}}</permission>

        <permission tag="ElButton" class="mt-sm mr-sm fr"
                    type="primary" size="mini"
                    @click.native="generate_upc"
                    :route="apis.url_get_upc">{{$t('ymx-list.createUPC')}}</permission>

        <ui-table v-loading="loading" :element-loading-text="$t('ymx-list.playLoad')"
                  :body-height="41" :first-loading="firstLoading"
                  :has-data="tableData.length>0"
                  v-model="checkAll"
                  :heads="[
            {isCheck:true,width:2},
            {label:$t('ymx-list.mImage'),width:5},
            {label:$t('ymx-list.localspu'),width:8},
            {label:$t('ymx-list.upTitle'),width:17},
            {label:$t('ymx-list.acc'),width:8},
            {label:$t('ymx-list.site'),width:7},
            {label:$t('ymx-list.upS'),width:7},
            {label:$t('ymx-list.pubResult'),width:22},
            {label:$t('ymx-list.regularPub'),width:9},
            {label:$t('ymx-list.cTime'),width:9},
            {label:$t('ymx-list.operat'),width:6}]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :key="data.id">
                    <td>
                        <el-checkbox v-model="data.isChecked"
                                     :disabled="is_disabled(data)"></el-checkbox>
                    </td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="get_path(data.main_image,'_200x200.',data.base_url)" width="200px" height="200px">
                            <span slot="reference" @click="view_large_img(data.main_image,data.base_url)">
                                  <img v-lazy="get_path(data.main_image,'_60x60.',data.base_url)" height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <i v-if="!!data.children" @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']"
                           :title="cur_title(data)"></i>
                        <ui-tip :content="data.spu" :width="75"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.title"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.account_name"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.site_text"></ui-tip>
                    </td>
                    <td>{{show_status(data.publish_status)}}</td>
                    <td>
                        <!--0未上传  1成功  2失败-->
                        <published-result :rowData="data"
                                          :label="$t('ymx-list.product')"
                                          rowKey="upload_product"></published-result>
                        <published-result :rowData="data"
                                          :label="$t('ymx-list.rela')"
                                          rowKey="upload_relation"></published-result>
                        <published-result :rowData="data"
                                          :label="$t('ymx-list.price')"
                                          rowKey="upload_price"></published-result>
                        <published-result :rowData="data"
                                          :label="$t('ymx-list.quan')"
                                          rowKey="upload_quantity"></published-result>
                        <published-result :rowData="data"
                                          :label="$t('ymx-list.image')"
                                          :show-separate="false"
                                          rowKey="upload_image"></published-result>
                        <span class="icon-refresh mr-sm"
                              :title="$t('ymx-list.refResult')"
                              @click="refresh_result(data)"></span>
                    </td>
                    <td>
                        <ui-tip :content="data.timer"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.create_time"></ui-tip>
                    </td>
                    <td>
                        <trends-select class="inline" @trigger="check(data,$event)" :selects="optionList"
                                       type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show" class="variant">
                    <tr style="font-weight:bold;" class="variant">
                        <td colspan="2" :rowspan="`${data.children && data.children.length+1}`"></td>
                        <td>{{$t('ymx-list.skuImg')}}</td>
                        <td>{{$t('ymx-list.platsku')}}</td>
                        <td>{{$t('ymx-list.localsku')}}</td>
                        <td colspan='2'>
                            {{data.children|filterName}}
                        </td>
                        <td>{{$t('ymx-list.pubResult')}}</td>
                        <td>{{$t('ymx-list.costprice')}}</td>
                        <td>{{$t('ymx-list.sellPrice')}}</td>
                        <td>{{$t('ymx-list.quantity')}}</td>
                        <!--<td :rowspan="`${data.children && data.children.length+1}`"></td>-->
                    </tr>
                    <tr v-for="(item, i) in data.children" :key="index+'-'+i" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="get_path(item.main_image,'_200x200.',data.base_url)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                      <img v-lazy="get_path(item.main_image,'_60x60.',data.base_url)"  height="60px" width="60px" style="border:none">
                                    </span>
                            </el-popover>
                        </td>
                        <td>
                            <ui-tip :content="item.publish_sku"></ui-tip>
                        </td>
                        <td>
                            <ui-tip :content="item.sku"></ui-tip>
                        </td>
                        <td :colspan="2">
                            <ui-tip :content="get_attrValue(item.variant)"></ui-tip>
                        </td>
                        <td>
                            <published-result :rowData="item"
                                              :label="$t('ymx-list.product')"
                                              rowKey="upload_product"></published-result>
                            <published-result :rowData="item"
                                              :label="$t('ymx-list.rela')"
                                              rowKey="upload_relation"></published-result>
                            <published-result :rowData="item"
                                              :label="$t('ymx-list.price')"
                                              rowKey="upload_price"></published-result>
                            <published-result :rowData="item"
                                              :label="$t('ymx-list.quan')"
                                              rowKey="upload_quantity"></published-result>
                            <published-result :rowData="item"
                                              :label="$t('ymx-list.image')"
                                              :show-separate="false"
                                              rowKey="upload_image"></published-result>
                        </td>
                        <td>
                            {{item.pre_cost}}
                            <price-tip :row-data="item" v-if="item.adjusted_price!==3"></price-tip>
                        </td>
                        <td>
                            <ui-tip :content="item.sale_price"></ui-tip>
                        </td>
                        <td>
                            <ui-tip :content="item.quantity"></ui-tip>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
        <account-copy v-model="accountVisible"
                      :siteList="copySite"
                      @selected="submit_account"></account-copy>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <!--生成upc-->
        <generate-upc v-model="upcDialog"></generate-upc>
    </div>
</template>

<style lang="stylus" type="text/stylus">
    .p-publish-queue {
        .minus, .plus {
            margin-right: 0;
        }
        .active {
            color #1D8CE0
        }
        .icon-success, .icon-error {
            display: inline-block
            width: 26px;
            height: 26px;
        }
        .icon-success {
            background: url("../../../../assets/success.png") no-repeat center;
            background-size: 26px;
        }
        .icon-error {
            background: url("../../../../assets/error.png") no-repeat center;
            background-size: 26px;
        }
    }
</style>
<script>
    import {url_get_upc} from '@/api/amazon-publish-info';
    import {api_publish_queue, api_publish_del,api_refresh_status,api_amazon_error_export,api_batch_copy,api_adjusted_price,
        url_adjusted_price,url_publish_del,url_amazon_error_export,url_batch_copy} from '../../../../api/amazon-publish-list';
    import {publish_queue_action} from './action'
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {downloadFile} from '../../../../lib/http';
    export default{
        permission: {
            url_publish_del,
            url_amazon_error_export,
            url_batch_copy,
            url_adjusted_price,
            url_get_upc
        },
        data(){
            return {
                upcDialog:false,
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                clears: {
                    page:1,
                    pageSize:50,
                    snType: 'sku',
                    adjusted_price:0,
                },
                searchData: {
                    page:1,
                    pageSize:50,
                    snType: 'spu',
                    snText: '',
                    site: '',
                    account: '',
                    nativeState: '',
                    start: '',
                    end: '',
                    saler_id:'',
                },
                imgDialog:false,
                imgPath:'',
                accountVisible:false,
            }
        },
        created(){
            this.init();
        },
        filters: {
            filterName(val){
                if(val.length<=0)return '暂无变体';
                return val[0].variant.map(row=>{
                    return row.name
                }).join(' / ');
            },
        },
        methods: {
            publish_queue_action,
            get_path,
            handle_size_change(size){
                this.searchData.pageSize = size
                this.init();
            },
            handle_current_change(page){
                this.searchData.page = page
                this.init();
            },
            show_status(status){
                switch (status){
                    case 0: return this.$t('ymx-list.toBeUp');
                    case 1:return this.$t('ymx-list.uploading');
                    case 2:return this.$t('ymx-list.uploaded');
                    case 3:return this.$t('ymx-list.upFailed');
                    case 4:return this.$t('ymx-list.reEdit');
                    case 5:return this.$t('ymx-list.pubDrafts');
                    default: return ''
                }
            },
            adjusted_price(){
                let obj = this.tableData.filter(row=>row.isChecked);
                let ids = obj.map(row=>row.id).join(',');
                if(!ids)return this.$message({type:"warning",message:this.$t("ymx-list.pleaseSelect")});
                this.$confirm(this.$t("ymx-list.removesomething"), this.$t('common.tips'), {
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_adjusted_price,{ids:ids}).then(res => {
                        obj.forEach(row=>{
                            row.children.forEach(item=>{
                                item.pre_cost = item.current_cost;
                                item.adjusted_price = 3;
                            })
                        });
                        this.$message({type:"success",message:res.message||res})
                    }).catch(code => {
                        this.$message({type:"error",message:code.message||code})
                    })
                }).catch(code => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-list.cancelTip')
                    });
                });
            },
            batch_copy(){
                let list = this.tableData.filter(row=>row.isChecked&&row.publish_status!==2);
                if(list.length>0)return this.$message({type:'warning',message:this.$t('ymx-list.bCopyTip2')});
                if(this.copyIds.length<=0)return this.$message({type:'warning',message:this.$t('ymx-list.bCopyTip')});
                this.accountVisible = true;
            },
            submit_account(val){
                let params = {
                    account_ids:val.map(row=>row.account_id).join(','),
                    ids:this.copyIds.join(','),
                };
                this.$http(api_batch_copy,params).then(res => {
                    this.$message({type:'success',message:this.$t('ymx-list.copySuc')});
                    this.init();
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.accountVisible = false;
                    this.$reqKey('accountSave',false);
                });
            },
            cur_title(data){
                if(data){
                    return data.show?this.$t('ymx-list.closedetail'):this.$t('ymx-list.viewdetail');
                }
            },
            get_attrValue(val){
                if(val.length<=0)return '暂无变体值';
                return val.map(row=>row.value).join(' / ');
            },
            refresh_result(row){
                this.$http(api_refresh_status,{id:row.id}).then(res=>{
                    let find = this.tableData.find(row=>row.id===res.id);
                    if(!!find){
                        find.children = res.children;
                        find.error_message = res.error_message;
                        find.publish_status = res.publish_status;
                        find.status_text = res.status_text;
                        find.upload_image = res.upload_image;
                        find.upload_price = res.upload_price;
                        find.upload_product = res.upload_product;
                        find.upload_quantity = res.upload_quantity;
                        find.upload_relation = res.upload_relation;
                        find.warning_message = res.warning_message;
                    }
                    this.$message({type:'success',message:this.$t('common.refreshSucc')});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            is_disabled(row){
                /*删除只能删未刊登和刊登失败的记录
                * */
//                return row.publish_status!==0&&row.publish_status!==3
                return false;
            },
            view_large_img(path,base_url){
                this.imgPath = get_path(path, '_500x500.',base_url);
                this.imgDialog = true;
            },
            batch_export(){
                let list = this.tableData.filter(row=>row.isChecked&&row.publish_status!==0&&row.publish_status!==3);
                if(list.length>0)return this.$message({type:'warning',message:this.$t('ymx-list.ExportTip2')});
                if(this.ids.length<=0) return this.$message({type:'warning',message:this.$t('ymx-list.ExportTip')});
                this.$http(api_amazon_error_export,{ids:this.ids.join(',')}).then(res => {
                    let url= config.apiHost+'downloadFile/downExportFile';
                    let file_code = {
                        file_code:res.file_code
                    };
                    downloadFile({
                        url:url,
                        get:file_code,
                        fileName:res.file_name,
                        suffix:'.xls',
                    })
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            batch_delete(){
                let list = this.tableData.filter(row=>row.isChecked&&row.publish_status!==0&&row.publish_status!==3);
                if(list.length>0)return this.$message({type:'warning',message:this.$t('ymx-list.delNote')});
                if(this.ids.length<=0) return this.$message({type:'warning',message:this.$t('ymx-list.delTip')});
                this.$confirm(this.$t('ymx-list.confirm'),this.$t('ymx-list.tips'),{
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    this.$http(api_publish_del,{ids:this.ids}).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        this.ids.forEach(row=>{
                            let findIndex = this.tableData.findIndex(item=>Number(item.id)===Number(row));
                            if(findIndex>-1)this.tableData.splice(findIndex,1);
                        });
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        this.$reqKey('batchDelete',false);
                    })
                })
            },
            init(){
                let params = clone(this.searchData);
                if(params.snType!=='title'){
                    params.snText = params.snText.replace(new RegExp('\n','gm')," ").split(' ').filter(row=>!!row).map(row=>row.trim()).join(',')
                }
                params.start&&(params.start = datef('YYYY-MM-dd',new Date(params.start)/1000));
                params.end&&(params.end = datef('YYYY-MM-dd',new Date(params.end)/1000));
                this.loading = true;
                this.$http(api_publish_queue,params).then(res => {
                    res.data.forEach(item => {
                        item.isChecked = false;
                        item.show = false;
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                })
            },
            /*对象深度克隆*/
            clone(obj,cloneObj){
                for(let attr in cloneObj){
                    if(typeof cloneObj[attr]!=='object'){
                        obj[attr]=cloneObj[attr];
                    }else{
                        if(Object.prototype.toString.call(cloneObj[attr])==="[object Array]"){
                            obj[attr]=[];
                            clone(obj[attr],cloneObj[attr]);
                        }else if(Object.prototype.toString.call(cloneObj[attr])==="[object Object]"){
                            obj[attr]={};
                            clone(obj[attr],cloneObj[attr])
                        }
                    }
                }
                return obj;
            },
            search(){
                this.firstLoading = false;
                this.init();
            },
            show_detail(data){
                data.show = !data.show;
            },
            get_attr(val){
                if (val.length > 0) {
                    if (val[0].variant.length > 0) {
                        return val[0].variant
                    } else {
                        return []
                    }
                } else {
                    return []
                }
            },
            check(row, num){
                let operate = this.optionList.find(function (operate) {
                    return operate.value === num.value
                });
                operate.action.call(this, row);
            },
            /*生成upc*/
            generate_upc(){
                this.upcDialog = true;
            },
        },
        computed: {
            checkAll:{
                get(){
                    return !this.tableData.find(row=>!row.isChecked);
                },
                set(val){
                    this.tableData.forEach(row=>{
                        this.$set(row,'isChecked',val);
                    })
                }
            },
            optionList(){
                return this.publish_queue_action();
            },
            ids(){
                /*
                ['待上传', '上传中', '已上传', '上传失败', '重新编辑', '刊登草稿']
                改一下刊登记录状态筛选那里，对应 0，1，2，3，4，5
                删除只能删未刊登和刊登失败的记录
                * */
                return this.tableData.filter(row=>row.isChecked&&(row.publish_status===0||row.publish_status===3)).map(row=>row.id);
            },
            copyIds(){
                return this.tableData.filter(row=>row.isChecked&&row.publish_status===2).map(row=>row.id);
            },
            copySite(){
                return this.tableData.filter(row=>row.isChecked&&row.publish_status===2).map(row=>row.site);
            },
        },
        watch: {},
        props: {
            siteList:{
                required: true,
                type: Array,
            }
        },
        components: {
            publishedQueueSearchCard: require('./published-queue-search-card.vue').default,//只传入一个total和抛出一个查询字段和值的对象
            uiTable: require("../../../../components/ui-table.vue").default,
            uiTip: require("../../../../components/ui-tip.vue").default,
            trendsSelect: require('../../../../components/trends-select.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            publishedResult:require('./published-result.vue').default,
            accountCopy: require('./account-copy.vue').default,
            priceTip:require('./price-tip.vue').default,
            generateUpc:require('./generate-upc.vue').default,
        }
    }
</script>

