<template>
    <el-row class="wish-stay-published">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select class="inline width-sm" v-sf.nType v-model="searchData.nType">
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in optionsss"></el-option>
            </el-select>
            <el-input class="inline mr-sm" placeholder="请输入搜索内容..." v-sf.nContent v-model="searchData.nContent"></el-input>
            <label>账号简称：</label>
            <param-account v-sf.accountVal v-model="searchData.accountVal"
                           type="wishPublishAccount"
                           url="get|publish/wish/getSellers"
                           :fixResult="fixAccount"
                           placeholder="全部"
                           class="has-inline mr-md s-width-default">
            </param-account>
            <div class="has-inline">
                <label class="has-inline">是否定时刊登：</label>
                <el-select v-sf.cron_time v-model="searchData.cron_time" clearable class="inline mr-sm s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in cron"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <label>更新时间：</label>
            <el-date-picker class="inline date" v-sf.start_time v-model="searchData.start_time" type="date" :picker-options="pickerstart" placeholder="开始时间">
            </el-date-picker>&nbsp;--&nbsp;<el-date-picker class="inline  mr-sm date" :picker-options="pickerend" v-sf.end_time v-model="searchData.end_time" type="date" placeholder="结束时间"></el-date-picker>
        </search-card>
        <div class="mt-sm ml-sm mb-sm">
            <permission tag="request-button" :mintime="200" req-key="url_wish_del" @click.native='clicked' :route="apis.url_wish_del">批量删除</permission>
        </div>
        <!--table数据-->
        <ui-table :has-data="publishList.length>0"    v-model="checkAll"   :body-height="38"   @check="check_all" ref="table"
                  v-loading="loading"  element-loading-text="玩命加载中..."
                  :heads="[
                        {isCheck:true,width:2},
                        {label:'产品图片',size:75},
                        {label:'本地SPU',width:15},
                        {label:'刊登标题',width:12},
                        {label:'产品标签',width:10},
                        {label:'账号简码',width:10},
                        {label:'定时刊登时间',width:8},
                        {label:'刊登人',width:6},
                        {label:'销售价',width:8},
                        {label:'运费',width:6},
                        {label:'可售量',width:6},
                        {label:'更新时间',width:5},
                        {label:'操作'},
                       ]">
            <tbody>
            <template v-for="(data, index) in publishList">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']" @click="addClass(index)" :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img  v-lazy="main_img(data.main_image,'medium')"
                                  @click="search_img(data.main_image)"
                                  width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="main_img(data.main_image,'small')"
                                       @click="search_img(data.main_image)"
                                       height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                      </td>
                    <td><i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']" title="点击展开菜单"></i><ui-tips :content="data.parent_sku"></ui-tips></td>
                    <td><ui-tips :content="data.name"></ui-tips></td>
                    <td> <ui-tips :content="data.tags"></ui-tips></td>
                    <td> <ui-tips :content="data.account_code"></ui-tips></td>
                    <td><times :time="data.cron_time"></times></td>
                    <td><ui-tips :content="data.username"></ui-tips></td>
                    <!--<td> $ {{data.price}}</td>-->
                    <!--<td> $ {{data.shipping}}</td>-->
                    <td>${{data.lowest_price}}<span v-if="data.highest_price">-</span>${{data.highest_price}}</td>
                    <!--运费-->
                    <td>${{data.lowest_shipping}}<span v-if="data.highest_shipping">-</span>${{data.highest_shipping}}</td>
                    <td>{{data.inventory}}</td>
                    <td> <times :time="data.last_updated"></times></td>
                    <td>
                        <trends-select  class="inline" @trigger="check(data,$event)" :selects="optionList" type="primary"></trends-select>
                        <!--<permission tag="span"  class="operate" @click="del_single(data)" :route="apis.url_wish_del">删除</permission>-->
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold"  class="variant">
                        <td colspan="2" :rowspan="`${data.skus.length+1}`"></td>
                        <td>SKU图片</td>
                        <td>本地SKU</td>
                        <td>颜色</td>
                        <td>尺寸</td>
                        <td>销售价</td>
                        <td>运费</td>
                        <td>可售量</td>
                        <td>发货期</td>
                        <td colspan="2">本地状态</td>
                        <td :rowspan="`${data.skus.length+1}`"></td>
                    </tr>
                    <tr v-for="item in data.skus" :key="item.sku" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="main_img(item.main_image,'medium')"
                                     @click="search_img(item.main_image)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="main_img(item.main_image,'small')"
                                       @click="search_img(item.main_image)"
                                       height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td><ui-tips :content="item.sku" ></ui-tips></td>
                        <td>{{item.color}}</td>
                        <td>{{item.size}}</td>
                        <td> $ {{item.price}}</td>
                        <td> $ {{item.shipping}}</td>
                        <td>{{item.inventory}}</td>
                        <td>{{item.shipping_time}}</td>
                        <td colspan="2">
                            <span v-if="item.skumap&&item.skumap.sku">{{item.skumap.sku.status | localStatus}}</span>
                        </td>
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
    .wish-stay-published{
        .minus, .plus{
            margin-right: 0;
        }
    }
</style>
<script>
    import {api_wish_channel, api__wish_all_list,api_wish_enable_batch,api_wish_disable_batch,api_wish_del,url_wish_del} from "../../../../api/kandeng"
    import {operateList} from './action';
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        permission: {
            url_wish_del
        },
        data(){
            return {
                baseUrl:"",
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return time.getTime() < this.searchData.start_time
                        }else {
                            return false
                        }

                    }
                },
                page:1,
                pageSize:50,
                total:0,
                loading:true,
                option:"",
                expressVisable:false,
                mdfVisable:false,
                publishList:[],
                checkAll:false,
                batchVisable:false,
                flag:0,
                searchData:{
                    status:0,
                    nType:"spu",
                    nContent:"",
                    accountType:"short",
                    accountVal:"",
                    cron_time:"",
                    ntime:"last_updatede",
                    start_time:"",
                    end_time:"",
                },
                clears:{
                    status:0,
                    nType:'spu',
                    accountType:"short",
                    ntime:"last_updatede",
                },
                goods:[
                    {label:"全部",value:""},
                    {label:"已批准",value:1},
                    {label:"被拒绝",value:2},
                    {label:"待审核",value:3},
                ],
                stautess:[
                    {label:"全部",value:""},
                    {label:"上架",value:1},
                    {label:"下架",value:0},
                ],
                idList:[],
                cron:[
                    {value: '', label: '全部'},
                    {value: 1, label: '是'},
                    {value: 0, label: '否'},
                ],
                accountOption:[
                    {label:"账号",value:"full"},
                    {label:"简称",value:"short"},
                ],
                optionsss:[
                    {label:"本地SKU",value:"sku"},
                    {label:"本地SPU",value:"spu"},
                    {label:"刊登标题",value:"name"},
                ],
                btnList:[//----------------------------------------------操作按钮
                    {name:'批量删除',clickName:'',status:2},
                ],
                imgDialog: false,
                imgPath:""
            }
        },
        created(){
            this.init();
        }  ,
        computed:{
            optionList(){
                return  operateList.filter(row=>{
                    return this.$hasPermission(row.api)&&row.stauts.includes(2)
                })
            },
        },
        watch:{
            "searchData.accountType"(val){
                this.searchData.accountVal = "";
            }
        },
        methods:{
            get_path,
            main_img(image,size){
                if(image.includes('http')){
                    if(image.includes('original')){
                        return image.replace('original',size);
                    }
                    if(image.includes('small')){
                        return image.replace('small',size);
                    }
                    if(image.includes('medium')){
                        return image.replace('medium',size);
                    }
                    if(image.includes('large')){
                        return image.replace('large',size);
                    }
                }
                switch (size){
                    case 'small':
                        return this.get_path(image,'_60x60.',this.baseUrl);
                        break;
                    case 'medium':
                        return this.get_path(image,'_200x200.',this.baseUrl);
                        break;
                    case 'large':
                        return this.get_path(image,'_500x500.',this.baseUrl);
                        break;
                    default:
                        break;

                }
            },
            search_img(image){
                this.imgPath = this.main_img(image,'large');
                this.imgDialog = true;
            },
            fixAccount(res){
                return res.data.map(row=>{
                    return {
                        label:row.code,
                        value:row.id,
                    }
                })
            },
            check(row,num){//---------------------查看按钮
                let operate = operateList.find(function (operate) {
                    return operate.value === num.value
                });
                operate.action.call(this,row,2);
            },
            //初始化
            init(){
                this.loading=true;
                let data = window.clone(this.searchData);
                if (this.searchData.start_time) {
                    data.start_time =datef("YYYY-MM-dd",this.searchData.start_time/1000)
                }else {
                    data.start_time="";
                }
                if (this.searchData.end_time) {
                    data.end_time =datef("YYYY-MM-dd",this.searchData.end_time/1000)
                }else {
                    data.end_time="";
                }
                data.nContent=data.nContent.trim();
                data.page=this.page;
                data.pageSize = this.pageSize;
                this.$http(api__wish_all_list,data).then(res=>{
                    this.baseUrl = res.base_url;
                    console.log(this.baseUrl,'this.baseUrl');
                    res.data&&res.data.forEach(row=>{
                        row.show=false;
                        row.isCheck=false;
                        row.heighLight=false;
                        row.num="";
                    })
                    this.publishList=res.data||[];
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(code)
                })
            },

            //查看下拉
            show_detail(data){
                data.show =!data.show;
            },
            check_row(){
                this.checkAll=!this.publishList.find(row=>!row.isCheck);
            },
            // 点击全部
            check_all(val){
                this.publishList.forEach(row=>{
                    row.isCheck=val;
                })
            },
            // 点击行 高亮
            addClass(index){
                this.publishList.forEach(row=>{
                    row.heighLight=false;
                });
                this.publishList[index].heighLight=true
            },
            clicked(){//------------------------------------批量删除
                let arr =[];
                this.publishList.forEach(row=>{
                    if( row.isCheck){arr.push(row.id)}
                });
                if(arr.length===0){
                    this.$reqKey('url_wish_del',false);
                    this.$message({
                        message: '请选择删除的商品',
                        type: 'warning'
                    });
                    return;
                }
                let ids=arr.join(",");
                this.$confirm(`您将对已选Listing执行批量删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_del,{id:ids}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.operate_del(arr);
                    }).catch(code=>{
                        this.$message(code.message||code)
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_wish_del',false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_wish_del',false);
                    },200);
                });
            },
            del_single(data){
                this.$confirm(`您将删除:${data.parent_sku}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_del,{id:data.id}).then(res=>{
                        this.$message({type:"success",message:res.message||res})
                        this.operate_del(data)
                    }).catch(code=>{
                        this.$message(code.message||code)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            operate_del(datas){
                if(datas instanceof Array){
                    datas.forEach(row=>{
                        let index=this.publishList.findIndex(old=>{
                            return old.id===row;
                        });
                        if(index!==-1){
                            this.publishList.splice(index,1);
                            this.total-=1;
                        }
                    })
                } else if(datas instanceof Object){
                    let i = this.publishList.findIndex(old=>{
                        return old.id===datas.id;
                    });
                    this.publishList.splice(i,1);
                    this.total-=1;
                }
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
        },
        filters:{
            updateFilter(val){
                if(val===1){
                    return "已修改"
                }else {
                    return "未修改"
                }
            },
            localStatus(val){
            	switch (val){
                    case 0:
                    	return "未上架";
                    	break;
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
                    default:
                        break;
                }
            }
        },
        props:{

        },
        components: {
            express:require("./express.vue").default,
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTips:require("../../../../components/ui-tip.vue").default,
            batchPublish:require("./batch-publish.vue").default,
            batchEdit:require("./batch-edit.vue").default,
            paramAccount:require("../../../../api-components/param-account.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
        }
    }
</script>
