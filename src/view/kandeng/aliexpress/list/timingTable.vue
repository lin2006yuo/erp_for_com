<template>
    <el-row class="aliexpress-has-published">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" class="mb-sm">
            <el-select v-sf.snType v-model="searchData.snType" class="inline s-width-small">
                <el-option
                    :key="item.value"
                    v-for="item in goods"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..."
                      v-sf.snText
                      v-model="searchData.snText"
                      class="inline mr-md enter-result"></el-input>
            <label>账号简码：</label>
            <param-account  v-sf.account_id  v-model="searchData.account_id"
                            type="smtPublishAccount"
                            url="get|aliexpress-accounts"
                            :fixResult="fixAccount"
                            placeholder="输入可搜索更多..."
                            class="inline mr-md">
            </param-account>
            <label>更新时间：</label>
            <el-date-picker class="inline date" v-sf.start v-model="searchData.start" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            -
            <el-date-picker class="inline date" v-sf.end v-model="searchData.end" type="date" placeholder="结束时间" :picker-options="pickerend"></el-date-picker>
        </search-card>
        <el-row class="mb-sm mt-sm ml-sm">
            <permission
                tag="request-button"
                :mintime="200"
                req-key="url_aliexpress_batch_del1"
                @click="batchdel"
                :route="apis.url_aliexpress_batch_del">批量删除</permission>
            <permission
                tag="request-button"
                :mintime="200"
                req-key="url_publish_express_batch_add_fail_publish"
                @click="batch_publish"
                :route="apis.url_publish_express_batch_add_fail_publish">批量提交刊登</permission>
        </el-row>
        <!--table数据-->
        <ui-table
                ref="table"
                v-loading="loading"  element-loading-text="玩命加载中..."
                :has-data="tableData.length>0" v-model="checkAll"   :body-height="38"  @check="head_check"
                :heads="[
                        {isCheck:true,width:2,},
                        {label:'产品图片',size:75},
                        {label:'本地SPU',width:10},
                        {label:'刊登标题',width:20},
                        {label:'账号简码',width:8},
                        {label:'运费模板',width:12},
                        {label:'服务模板',width:12},
                        {label:'异常描述',width:10},
                        {label:'错误消息',width:10},
                        {label:'更新时间',width:8},
                        {label:'操作',width:8},
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',]" @click="addClass(index)" :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"  ></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="small_img(data.main_img,'_250x250.')"  @click="search_img(data.main_img,'')" width="200px" height="200px">
                            <span slot="reference">
                              <img v-lazy="small_img(data.main_img,'_120x120.')" height="60px" width="60px" @click="search_img(data.main_img)" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']" title="点击展开菜单"></i>
                        <ui-tips :content="data.goods_spu" ></ui-tips>
                    </td>
                    <td><ui-tips :content="data.subject" ></ui-tips></td>
                    <td><ui-tips :content="data.account_code "></ui-tips></td>
                    <td><ui-tips :content="data.freight_template_name"></ui-tips></td>
                    <td><ui-tips :content="data.promise_template_name"></ui-tips></td>
                    <td>
                        <el-popover placement="left"
                                    title="失败原因："
                                    width="400"
                                    v-if="data.error"
                                    trigger="hover">
                            <div>{{data.error.error_message}}</div>
                            <span slot="reference">
                                <el-button type="text">刊登失败</el-button>
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <el-popover placement="left"
                                    title="错误原因："
                                    width="400"
                                    v-if="data.error_description"
                                    trigger="hover">
                            <div>{{data.error_description}}</div>
                            <span slot="reference">
                                <el-button type="text">错误原因</el-button>
                            </span>
                        </el-popover>
                    </td>
                    <td><times :time="data.update_time"></times></td>
                    <td>
                        <trends-select  class="inline" @trigger="check(data,$event)" :selects="operateList" type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" class="variant">
                        <td  colspan="2"  :rowspan="`${data.product_sku.length+1}`" class="variant"></td>
                        <td>sku图片</td>
                        <td>本地sku</td>
                        <td v-for="attr in data.used_attr">{{attr}}</td>
                        <td>销售价</td>
                        <td>可售数量</td>
                        <td>发货期</td>
                        <td :colspan="`${6-data.used_attr.length}`" :rowspan="`${data.product_sku.length+1}`"></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.product_sku" v-if="data.product_sku" :key="`${item.id}${item_i}`" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="product_img(item,'_250x250.')"  @click="search_img_sku(item)" width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="product_img(item,'_120x120.')" height="60px" width="60px" @click="search_img_sku(item)" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td><ui-tips :content="item.sku_code" ></ui-tips></td>
                        <td v-for="(attr,attr_i) in  data.used_attr">{{data.listing_attr_val[attr_i][item_i]}}</td>
                        <td>$ {{item.sku_price}} </td>
                        <td>{{item.ipm_sku_stock}}</td>
                        <td>{{data.delivery_time}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </el-row>
</template>
<style lang="stylus">
    .aliexpress-has-published{
    }
</style>
<script>
    import {
        api_aliexpress_list_fail,
        api_aliexpress_account,
        api_aliexpress_product_status,
        api_aliexpress_expire_search,
        api_aliexpress_batch_del,api_aliexpress_sale_list,
        api_publish_express_batch_add_fail_publish,
        url_publish_express_batch_add_fail_publish,
        url_aliexpress_edit_product,
        url_aliexpress_batch_del} from "../../../../api/publish-smt"
    import {operateList} from './action';//------操作按钮引入
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        permission: {
            url_aliexpress_edit_product,
            url_aliexpress_batch_del,
            url_publish_express_batch_add_fail_publish
        },
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end){
                            return  time.getTime() > this.searchData.end.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start){
                            return time.getTime() < this.searchData.start.getTime()
                        }else {
                            return false
                        }

                    }
                },
                page:1,
                pageSize:50,
                total:0,
                checkAll:false,
                loading:true,
                option:"",
                tableData:[],
                expires:[],
                searchData:{
                    account_id: "",
                    status: "",
                    snType:"sku",
                    snText: "",
                    start: "",
                    expire_day:"",
                    end: "",
                },
                clears:{
                    snType:"sku",
                    status: "",
                    expire_day:"",
                },
                goods:[
                    {
                        value: 'sku',
                        label: '本地SKU'
                    }, {
                        value: 'spu',
                        label: '本地SPU'
                    }, {
                        value: 'product_id',
                        label: '商品平台ID'
                    }, {
                        value: 'title',
                        label: '刊登标题'
                    },
                ],
                idList:[],
                statusList:[],
                baseUrl:"",
                imgDialog: false,
                imgPath:""
            }
        },
        created(){
            this.init()
        },
        computed:{
            operateList(){
                let list=operateList.filter(row=>{
                    return row.status.includes(3)
                })
                return list.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            }
        },
        methods:{
            callback(){
                this.init();
            },
            get_path,
            small_img(path,size){
                if(path.includes('http')){
                    return size ? `${path}${size}jpg` : path;
                }else{
                    let newSize = size ? size : '_500x500.';
                    return this.get_path(path,newSize,this.baseUrl);
                }
            },
            search_img(path,size){
                this.imgPath = this.small_img(path,size,this.baseUrl);
                this.imgDialog = true;
            },
            search_img_sku(item){
                let data = this.product_img(item);
                this.search_img(data);
            },
            //子sku图片
            product_img(item,size){
                let img = "";
                if(item.sku_attr&&item.sku_attr.length){
                    img = item.sku_attr[0].skuImage;
                }
                if(img){
                    return this.small_img(img,size,this.baseUrl);
                }
                return img;
            },
            fixAccount(res){
                return res.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id
                    }
                });
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
            },
            head_check(val){
                console.log("val",val)
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                })
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            show_detail(data){
                data.show =!data.show;
            },
            //初始化
            init(){
                this.loading=true;
                let data = window.clone(this.searchData);
                if (this.searchData.start) {
                    data.start =datef("YYYY-MM-dd",this.searchData.start/1000);
                }else {
                    data.start="";
                }
                if (this.searchData.end) {
                    data.end =datef("YYYY-MM-dd",this.searchData.end/1000)
                }else {
                    data.end="";
                }
                data.snText=data.snText.trim();
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.$http(api_aliexpress_list_fail,data).then(res=>{
                    res.data.forEach(row=>{
                        row.num="";
                        row.show=false;
                        row.isCheck=false;
                        row.heighLight=false;
                    })
                    this.tableData=res.data;
                    this.baseUrl=res.base_url;
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //获取销售账号
            get_seller(){
                this.$http(api_aliexpress_sale_list).then(res=> {
                    this.idList = res.account;
                }).catch(code=> {
                    console.log(code)
                })
            },
            //获取产品状态
            get_status(){
                this.$http(api_aliexpress_product_status).then(res=> {
                    this.statusList = res;
                    this.searchData.status=res[0].id;
                }).catch(code=> {
                    console.log(code)
                })
            },
            get_expires(){
                this.$http(api_aliexpress_expire_search).then(res=> {
                    this.expires = res;
                    this.searchData.expire_day=res[0].id;
                }).catch(code=> {
                    console.log(code)
                })
            },
            check(row,num){//---------------------查看按钮
                /* let operate = operateList.find(operate=>{return operate.value === num});*/
                let operate = operateList.find(function (operate) {
                    return operate.value === num.value
                });
                operate.action.call(this, row,3);
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.init()
            },
            handleCurrentChange(val){
                this.page=val;
                this.init()
            },
            search(){
                this.init();
            },
            batch_publish(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$reqKey('url_publish_express_batch_add_fail_publish',false);
                    this.$message({type:"warning",message:"请选择需要刊登的数据"});
                    return ;
                }
                this.$http(api_publish_express_batch_add_fail_publish,{ids:data.map(row=>row.id).join(",")}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.init();
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_publish_express_batch_add_fail_publish',false);
                    },300);
                })
            },
            batchdel(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$reqKey('url_aliexpress_batch_del1',false);
                    this.$message({type:"warning",message:"请选择要删除的数据"});
                    return ;
                }
                let ids=data.map(row=>row.id).join(",");
                this.$confirm(`您将要对已选Listing执行批量删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_aliexpress_batch_del,{ids:ids}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.operate_del(ids,data)
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_aliexpress_batch_del1',false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_aliexpress_batch_del1',false);
                    },200);
                });
            },
            operate_del(ids,datas){
                if(datas instanceof Array){
                    datas.forEach(row=>{
                        let index=this.tableData.indexOfFun(row,function (old,row) {
                            return old.id===row.id;
                        });
                        this.tableData.splice(index,1);
                        this.total-=1;
                    })
                } else if(datas instanceof Object){
                    let i = this.tableData.indexOfFun(datas,function (old,datas) {
                        return old.id===datas.id;
                    });
                    this.tableData.splice(i,1);
                    this.total-=1;
                }
            },
        },
        filters:{
        },
        props:{

        },
        components: {
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTips:require("../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            paramAccount:require("../../../../api-components/param-account.vue").default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
        }
    }
</script>
