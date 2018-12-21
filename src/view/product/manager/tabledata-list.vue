<template>
    <el-row class="c-tabledata-list" :gutter="10">
        <el-col>
            <ui-table v-model="checkAll" class="manager"
                      :body-height="41" @check="check"
                      :has-data="tableObj.lists.length>0"
                      v-loading="isLoading" element-loading-text="玩命加载中..."
                      :heads="[
                        {isCheck:true,width:2},
                        {label:'产品图片',width:6},
                        {label:'SPU',width:7},
                        {label:'中英文报关名',width:8},
                        {label:'产品中文名称',width:10},
                        {label:'分类',width:10},
                        {label:'物流属性',width:6},
                        {label:'海关编码',width:6},
                        {label:'开发员',width:6},
                        {label:'所属平台',width:6},
                        {label:'产品状态',width:6},
                        {label:'出售时间/停售时间',width:12},
                        {label:'采购员',width:6},
                        {label:'操作',width:9}]">
                <tbody >
                <template v-for="(data, index) in tableObj.lists">
                    <tr class="line" :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']"
                        :key="data.id"
                        @click="addClass(data)">
                        <!--isCheck-->
                        <td>
                            <el-checkbox v-model="data.isCheck" @change="changeOne"></el-checkbox>
                        </td>
                        <!--产品图片-->
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img  v-lazy="get_path(data.thumb,'_200x200.')"
                                      @click="show_big(data)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                          <img  v-lazy="get_path(data.thumb,'_60x60.')"
                                               @click="show_big(data)"
                                               height="60px" width="60px" style="border:none">
                                    </span>
                            </el-popover>
                        </td>
                        <!--SPU-->
                        <td class="t-left">
                            <plus-minus @show-detail="show_detail(data,index)" :show="data.show" :title="tipTitle" ></plus-minus>
                            <span>{{data.spu}}</span>
                        </td>
                        <!--中英文报关名-->
                        <td>
                            <ui-tip :content="data.declare_name" :width="98"></ui-tip>
                            <ui-tip :content="data.declare_en_name" :width="98"></ui-tip>
                        </td>
                        <!--产品中文名称-->
                        <td v-copy>{{data.name}}
                            <!--<ui-tip :content="data.name" :width="95"></ui-tip>-->
                        </td>
                        <!--分类-->
                        <td>
                            <ui-tip :content="data.category" :width="98"></ui-tip>
                        </td>
                        <!--物流属性-->
                        <td>{{data.transport_property}} </td>
                        <!--海关编码-->
                        <td>{{data.hs_code}}</td>
                        <!--开发员-->
                        <td>{{data.developer}}</td>
                        <!--所属平台-->
                        <td>{{data.channel_name}}</td>
                        <!--产品状态-->
                        <td>{{data.status|statusFilter}}</td>
                        <!--出售时间 /停售时间-->
                        <td>
                            <ui-tip :content="data.publish_time" :width="98"></ui-tip>
                            <ui-tip  v-if="data.status!==1" :content="data.stop_selling_time" :width="98"></ui-tip>
                        </td>
                        <td>
                            <ui-tip :content="data.purchaser" :width="98"></ui-tip>
                        </td>
                        <td>
                            <trends-select :selects="get_operation(data.status)"  @trigger="change_operation(data,$event)" type="primary"></trends-select>
                        </td>
                    </tr>
                    <template v-if="data.show">
                        <tr class="subset_of_tags" style="font-weight:bold;">
                            <td :rowspan="`${data.skulist.length+1}`">&nbsp;</td>
                            <td>图片</td>
                            <td>SKU</td>
                            <td>SKU别名</td>
                            <td>产品属性</td>
                            <td>状态</td>
                            <td>成本价(￥)</td>
                            <td>零售价(＄)</td>
                            <td>重量(g)</td>
                            <td>长/宽/高(cm)</td>
                            <td>日均销量</td>
                            <td :colspan="2">操作</td>
                            <!--<td :rowspan="`${data.skulist.length+1}`"></td>-->
                        </tr>
                        <tr class="subset_of_tags" v-for="item in data.skulist">
                            <!--图片-->
                            <td>
                                <el-popover placement="right" trigger="hover">
                                    <img  v-lazy="sku_image(item.thumb)"
                                          @click="show_big(item)"
                                          width="200px" height="200px">
                                    <span slot="reference">
                                          <img  v-lazy="get_path(item.thumb)"
                                                @click="show_big(item)"
                                                height="60px" width="60px" style="border:none">
                                    </span>
                                </el-popover>

                            </td>
                            <!--SKU-->
                            <td>
                                <ui-tip :content="item.sku"></ui-tip>
                            </td>
                            <!--SKU别名-->
                            <td>
                                <template v-for="it in item.alias">
                                    <div>{{it}}</div>
                                </template>
                            </td>
                            <!--产品属性-->
                            <td>{{item.attributes}}</td>
                            <!--状态-->
                            <td>
                                {{item.status === "上架" ? "出售":item.status === "下架" ? "停售":item.status}}
                            </td>
                            <!--成本价(￥)-->
                            <td>{{item.cost_price | filterPrice}}</td>
                            <!--零售价(＄)-->
                            <td>{{item.retail_price | filterPrice}}</td>
                            <!--重量(g)-->
                            <td>{{item.weight}}</td>
                            <!--长/宽/高(cm)-->
                            <td>{{item.length}}/{{item.width}}/{{item.height}}</td>
                            <!--日均销量-->
                            <td>
                                <span v-if="item.daily_mean_sales"
                                      title="点击可查看图表详情"
                                      class="operate"
                                      @click="analyze(item)">
                                    {{item.daily_mean_sales|filterDailySale}}
                                </span>
                                <span class="daily_sale"
                                      v-else title="无销售量">{{item.daily_mean_sales}}
                                </span>
                            </td>
                            <!--操作-->
                            <td :colspan="2">
                                <permission tag="span" :route="apis.url_change_sku_status">
                                       <span  v-for="(operate, index) in operationList(item)" :key="index">
                                            <span :class="[operate.status? 'status' : '','operates']"
                                                  @click="change_sku_status(item,index,operate)">
                                                {{operate.name}}
                                            </span>
                                            <span v-if="index < `${operationList3.length-1}`">|</span>
                                        </span>
                                </permission>
                                <!--<span>|</span>-->
                                <div>
                                    <span class="operate" @click="print(item)">打印标签</span>
                                    <permission tag="span" :route="apis.url_batch_delete">|</permission>
                                    <permission tag="span" class="operate" :route="apis.url_batch_delete"
                                                @click="delete_sku(item)">删除</permission>
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
                </tbody>
            </ui-table>
            <!--分页-->
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="tableObj.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="tableObj.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableObj.total">
            </el-pagination>
        </el-col>
        <look-edit v-model="lookVisable"
                   :edit-able="editAble"
                   :goodsId="goodsId"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName"
                   @reflash="reflash"
                   @change-data="change_data"></look-edit>
        <blowup-image v-model="showBigDailog"
                      :title="blowUpTitle"
                      :imgPath="curImgPath"></blowup-image>
        <publish v-model="publishVisible"
                 :id="productInfo.id"></publish>
        <preview v-model="printVisable"
                 :canRelevance="true"
                 :print-id="printId"
                 :batch-data="batchData"
                 ref="preview">
        </preview>
        <goods-tort v-model="tortDialog"
                    :title="curSpu"
                    :id="goodsId"
                    :channel-data="channelData"></goods-tort>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
    </el-row>
</template>
<style lang="stylus">
    .c-tabledata-list{
        margin-top :0;
        .simulate{
            cursor: pointer;
            box-sizing:border-box;
            display:inline-block;
            color:#fff;
            width:100%;
            height:32px;
            padding:0 5px;
            line-height:32px;
            font-size:1.2rem;
            background:#6495ED;
            border:1px solid #6495ED;
            border-top-left-radius:4px;
            border-top-right-radius:4px;
            border-bottom:1px solid transparent;
        }
        .manager {
            border-radius :3px;
            .clickccolor {

            }
            .operates {
                color: cornflowerblue;
                cursor: pointer;
                &.status {
                    background-color: #cccccc;
                    color: #fff;
                    cursor: not-allowed;
                }
            }
            .ui-table-body {
                .template.secTable {
                    table-layout: fixed;
                    .over {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 180px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .oversku {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 90px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .el-tooltip {
                        width: 100%;
                    }
                    .el-tooltip__rel {
                        width: 100%;
                    }
                    .el-button--warning {
                        background: #008BCE;
                        border-color: #008BCE;
                    }
                    .el-button.el-button--mini.el-button--warning.el-dropdown__caret-button {
                        height: 23px;
                    }
                    .el-button .el-button--warning .el-button--mini {
                        height: 23px;
                    }
                    .trend {
                        height: 23px;
                        margin: 0
                    }
                }
            }
        }
    }
</style>
<script>
    import {publish_status, publish_sku, api_change_sku_status,api_get_label,api_batch_delete,api_get_goods_tort,
        url_batch_delete,url_publish_updata_baseinfo,url_change_sku_status,url_get_goods_tort} from  "../../../api/product-library"
    import {date1 as date} from './actions';
    import {operate_list3,operate_list} from './actions';
    import  trendsSelect  from "../../../components/trends-select.vue";
    import lookEdit from  "./look-edit.vue"
    import uiTable from "../../../components/ui-table.vue";
    import {get_path}from '../../kandeng/ebay/kandeng-list/add-edit-listing/get-path';
    import analyze from '../../../view/procurement/purchasing/add-analyze';
    export default{
        permission:{
            url_publish_updata_baseinfo,
            url_change_sku_status,
            url_batch_delete,
            url_get_goods_tort
        },
        filters: {
            filterPrice(val){
                return val===""?'0.00':parseFloat(val).toFixed(2);
            },
            dateFilter(val){
                return datef("YYYY-MM-dd HH:mm:ss", val)
            },
            statusFilter(val){
                switch (val) {
                    case 1:
                        return "在售";
                    case 2:
                        return "停售";
                    case 3:
                        return "待发布";
                    case 4:
                        return "卖完下架";
                    case 5:
                        return "缺货";
                    case 6:
                        return "部分在售";
                }
            },
            filterDailySale(val){
                if(val){
                    return Number(val).toFixed(3);
                }
            }
        },
        mounted(){

        },
        data(){
            return {
                curSpu:'',
                channelData:{},
                curImgPath:'',
                blowUpTitle:'',
                showBigDailog:false,
                activeName:'',
                checkAll: false,
                operationList3: operate_list3,
                select_status: 1,
                lookVisable: false,
                editAble: false,
                goodsId: 0,
                spu:'',
                tipTitle:"点击可查看 SKU，状态，出售时间/停售时间，成本价，市场价 等信息",
                publishVisible:false,
                productInfo:'',
                batchData:{},
                printVisable:false,
                printId:[],
                tortDialog:false,
                analyzeDialog:false,
                analyzeData:{}
            }
        },
        computed:{
            operating(){
                return operate_list.filter(row=>{
                    return  this.$hasPermission(row.api)
                })
            },
            idsData(){
                let cur = [];
                if(this.tableObj.lists&&this.tableObj.lists.length>0){
                    cur = this.tableObj.lists.filter(row=>row.isCheck).map(row=>{return row.id});
                }
                return cur;
            },
        },
        methods: {
            handleSizeChange(size){
                this.$emit('size-change',size);
            },
            handleCurrentChange(page){
                this.$emit('current-change',page);
            },
            delete_sku(item){
                this.$confirm('您将删除此产品SKU的状态，确认此操作吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.$http(api_batch_delete,{ids:[item.id]}).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        let find = this.tableObj.lists.find(row=>row.id===item.goods_id);
                        if(find&&find.skulist){
                            let findIndex = find.skulist.findIndex(row=>row.id===item.id);
                            if(findIndex>-1)find.skulist.splice(findIndex,1);
                        }
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                });
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
            get_path,
            show_big(row){
                if(!row.thumb) return this.$message({type:"warning",message:"暂无图片"});
                if(row.thumb.includes('_60x60.'))row.thumb = row.thumb.replace('_60x60.','_500x500.');
                this.showBigDailog = true;
                this.curImgPath = this.get_path(row.thumb,'_500x500.');
                this.blowUpTitle = '';
            },
            amazon_publish(data){
                this.productInfo = data;
                this.publishVisible = true;
            },
            get_goods_tort(data){
                this.curSpu = data.spu;
                this.goodsId = data.id;
                this.channelData = {};
                this.$http(api_get_goods_tort,data.id).then(res => {
                    if(res instanceof Array||Object.keys(res).length<=0){
                        res = {}
//                        res = {channel_data:[{"goods_id":252941,"channel_id":1,"channel_name":"ebay","shops":[{"shop_id":"1"},{"shop_id":"2"}]},{"goods_id":252941,"channel_id":3,"channel_name":"wish","shops":[{"shop_id":"1"},{"shop_id":"2"}]}],"reason":"测试","notice_channel":[{"channel_id":"2","channel_name":"amazon"}]}
                    }else{
                        if(res.channel_data&&res.channel_data.length>0){
                            this.$set(res,'isShow',true);
                        }else{
                            this.$set(res,'isShow',false);
                        }
                        res.channel_data.forEach(item=>{
                            if(item.shops&&item.shops.length>0){
                                this.$set(item,'isShow',true);
                            }else{
                                this.$set(item,'isShow',false);
                            }
                        });
                        res.notice_channel = res.channel_data.map(item=>Number(item.channel_id));
                    }
                    this.tortDialog = true;
                    this.channelData = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                });
            },
            change_cateall(){
                this.change_category('')
            },
            change_category(val){
                this.$emit('change-category',val)
            },
            get_status(val){
                switch (val) {
                    case 1:
                        return "在售";
                        break;
                    case 2:
                        return "停售";
                        break;
                    case 3:
                        return "待发布";
                        break;
                    case 4:
                        return "卖完下架";
                        break;
                    case 5:
                        return "缺货";
                        break;
                }
            },
            get_operation(statu){
                return this.operating.filter(row=>{
                    return row.status.includes(statu)
                })
            },
            change_data(val){
                this.$emit("change-data",val)
            },
            reflash(){

            },
            addClass(data){
                this.tableObj.lists.forEach(row => {
                    row.heighLight = false;
                });
                data.heighLight = true;
            },
            operationList(item){
                return this.operationList3.map(row => {
                    row.status = row.name === item.status;
                    return row;
                });
            },
            //表格中的 操作
            change_operation(data, option){
                switch (data.channel_id){
                    case 0:
                        this.activeName = "自定义图片";
                        break;
                    case 1:
                        this.activeName = 'ebay平台';
                        break;
                    case 2:
                        this.activeName = '亚马逊平台';
                        break;
                    case 3:
                        this.activeName = 'wish平台';
                        break;
                    case 4:
                        this.activeName = '速卖通平台';
                        break;
                }
                this.goodsId = data.id;
                this.spu = data.spu;
                option.action.apply(this,[data,option])
            },
//            更改sku状态
            change_sku_status(item,index,operate){
                let list = this.operationList(item);//需要存在 勿删
                if (operate.status) {
                    return;
                }
                if(operate.name === item.status){
                    return ;
                }
                let params = {
                    sku_id: item.id,
                    status: operate.value,
                };
                this.$confirm(`您将更改此产品sku的状态，确认此操作吗?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http(api_change_sku_status, params).then(res => {
                        this.$message({type:"success",message:res.message || res});
                        item.status = operate.name;
                    }).catch(code => {
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                })
            },

            //表头的 全选框
            check(val){
                this.tableObj.lists.forEach(data => {
                    data.isCheck = val
                });
            },
            changeOne(){
                if (this.tableObj.lists.length > 0) {
                    this.checkAll = !this.tableObj.lists.find(data => !data.isCheck);
                }
            },
            // 点击每行的 加号 显示数据
            show_detail(data, index){
                if (data.show) {
                    data.show = false;
                    return;
                }
                if (!data.show && (!data.skulist || data.skulist.length === 0)) {
                    this.$http(publish_sku, data.id).then(res => {
                        this.$set(data, "skulist", res);
                        data.show = true;
                    }).catch(code => {
                        console.log(code)
                    })
                } else {
                    data.show = true;
                }
            },
            //点击出售 停售时  更改状态值
            change_single(data,old,news){
                let changobj = {
                    status: news,
                    goods_id: data.id
                };
                this.$confirm(`此操作将${this.get_status(changobj.status)}该产品, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(publish_status, changobj).then(res => {
                        data.status=news;
                        this.$nextTick(() => {
                            this.$set(data, "publish_time", res.publish_time);
                            this.$set(data, "stop_selling_time", res.stop_selling_time);
                        });
                        this.$message({
                            type: 'success',
                            message: '更新成功'
                        });
                    }).catch(code => {
                        this.$message({type:"error",message:code.message || code});
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            print(row){
                this.printId.length = 0;
                this.printId.push(row.id);
                this.$http(api_get_label,{ids:this.printId}).then(res=>{
                    this.batchData = res;
                    this.batchData.print_data.forEach(row=>{
                        row.print_num = 1;
                    });
                    this.printVisable=true;
                    this.$refs.preview.get_template(1);
                    if(this.batchData.default_temp_id){
                        this.$nextTick(()=>{
                            this.$refs.preview.change_print();
                        })
                    }
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            analyze(row){
                this.analyzeData ={sku:row.sku, sku_id:row.id,warehouse_id:row.warehouse_id};
                this.analyzeDialog=true;
            }
        },
        watch: {},
        props: {
            tableObj:{
                required: true,
                type: Object
            },
            isLoading: {
                required: true,
                type: Boolean
            },
        },
        components: {
            trendsSelect,
            lookEdit,
            uiTable,
            uiTip:require("../../../components/ui-tip.vue").default,
            plusMinus:require('../../../components/plus-minus.vue').default,
//            tree:require("../goods_sku_map/tree.vue").default,
            publish: require('../../kandeng/amazon/amazon-plan-publish/publish.vue').default,
            preview:require('../../entrepot/warehouse-cargo/preview.vue').default,
            blowupImage:require('../../../components/blowup-image.vue').default,
            goodsTort:require('./goods-tort.vue').default,
            analyze
        }

    }
</script>

