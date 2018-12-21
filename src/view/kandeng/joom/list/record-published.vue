<template>
    <div class="wish-wishPublish-list">
        <search ref="search"
                :param-list="paramList"
                :account-list="accountList"
                :user-list="userList"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <!--<el-button class="inline mb-mini" size="mini" type="primary"-->
                       <!--v-for="(item,index) in btnslist" :key="index"-->
                       <!--:disabled="item.canUse"-->
                       <!--@click.native='clicked(item)'>{{item.name}}</el-button>-->
            <permission tag="ElButton"
                        type="primary"
                        @click.native="publish"
                        :route="apis.url_joom_listing_publish">提交刊登</permission>
            <permission tag="ElButton"
                        type="primary"
                        :disabled="isDel"
                        @click.native="bantch_del"
                        :route="apis.url_joom_listing_delrecord">批量删除</permission>
        </div>
        <ui-table
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @check="head_check"
            :heads="[
                        {isCheck:true,width:2},
                        {label:'主图',size:75},
                        {label:'平台SPU',width:12},
                        {label:'本地SPU',width:10},
                        {label:'刊登标题',width:22},
                        {label:'平台账号',width:9},
                        {label:'平台店铺',width:9},
                        {label:'销售员',width:9},
                        {label:'上传状态',width:9},
//                        {label:'异常描述',width:9},
                        {label:'创建时间',width:9},
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
                    <td><ui-tip :content="data.local_parent_sku" :width="88"></ui-tip></td>
                    <td><ui-tip :content="data.name" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.account_name" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.shop_name" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.sellor" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.status_text" :width="80"></ui-tip></td>
                    <!--<td><ui-tip :content="data.review_note" :width="80"></ui-tip></td>-->
                    <td><ui-tip :content="data.create_time" :width="80"></ui-tip></td>
                    <td>
                        <div v-if="data.status===2">
                            <permission tag="span" :route="apis.url_joom_edit" class="operate" @click="curChange(data)">编辑</permission>
                            <permission tag="span" :route="apis.url_joom_edit">|</permission>
                            <permission tag="span" :route="apis.url_joom_listing_delrecord" class="operate" @click="curDelete(data)">删除</permission>
                        </div>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td :rowspan="`${(data.variant.length)+1}`"></td>
                        <td>SKU图片</td>
                        <td>平台SKU</td>
                        <td>本地SKU</td>
                        <td>颜色</td>
                        <td>尺寸</td>
                        <td>销售价</td>
                        <td>运费</td>
                        <td>可售量</td>
                        <td>发货期</td>
                        <td>异常描述</td>
                    </tr>
                    <tr v-for="(item, item_i) in data.variant" :key="item_i" class="variant">
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
                        <td>{{item.shipping_time}}</td>
                        <td>{{item.message}}</td>
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
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .wish-wishPublish-list{
        .variant{
            background:#f0edd1;
        }
    }
</style>
<script>
    import {
        api_joom_listing_record,
        api_joom_listing_publish,
        api_joom_listing_delrecord,
        url_joom_listing_delrecord,
        url_joom_listing_publish
    } from "../../../../api/publish-joom";
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {api_joom_edit, url_joom_edit} from '../../../../api/publish-joom-info'
    export default{
        permission: {
            url_joom_listing_delrecord,
            url_joom_listing_publish,
            url_joom_edit
        },
        data(){
            return{
                btnList:[//----------------------------------------------操作按钮
                    {
                    	name:'提交刊登',
                        clickName:'',
                        status:1,
                        canUse:false,
                        api:"url_joom_listing_publish"},
                    {
                    	name:'批量删除',
                        clickName:'',
                        status:2,
                        canUse:true,
                        api:"url_joom_listing_delrecord"},
                ],
                tableData:[],
                loading:false,
                page:1,
                pageSize:50,
                total:0,
                paramList:{
                    account_id:"",
                    shop_id:"",
                    create_id:"",
                    status:"",
                    min_time:"",
                    max_time:"",
                    snType:"local_spu",
                    snText:"",
                },
                checkAll:false,
                imgDialog:false,
                imgPath:"",
                logVisable:false,
                productId:"",
                selectList:[],
                baseUrl:""
            }
        },
        mounted(){
        	this.init();
        },
        methods:{
            init(){
                let data = window.clone(this.paramList);
                data.page = this.page;
                data.pageSize = this.pageSize;
                if(data.max_time) {
                    data.max_time = datef("YYYY-MM-dd",data.max_time/1000)
                }else {
                    data.max_time="";
                }
                if(data.min_time) {
                    data.min_time = datef("YYYY-MM-dd",data.min_time/1000)
                }else {
                    data.min_time="";
                }
                Object.assign(data,this.order);
                this.loading = true;
                this.$http(api_joom_listing_record,data).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
//                        this.$set(row,"varians",[]);
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.baseUrl = res.base_url;
                    this.loading = false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            //编辑
            curChange(row){
                this.$http(api_joom_edit, row.id, 'edit').then(res => {
                    let params = {
                        goods_id: row.goods_id,
                        isEdit: true,
                        item: res,
//                        title: '刊登'
                    };
//                    this.$open(`/publish/joom/getData/${row.goods_id}`, params)
                    this.$open(`/publish/joom/getData`, params)
                });
            },
            search(data){
                this.searchData = data;
                this.init();
            },
            //获取sku
            show_detail(data){
                data.show =!data.show;
            },
            //删除
            bantch_del(){
            	let data = this.selectList.filter(row=>row.status===2);
                let obj = {
                    ids:data.map(row=>row.id).join(","),
                };
                this.$confirm(`您将要对已选Listing记录执行批量删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_del(data,obj);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //单个删除
            curDelete(data){
                this.$confirm(`您将要对已选Listing记录执行删除操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_del(data,{ids:data.id+''});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //操作数据
            operate_del(datas,obj){
                this.$http(api_joom_listing_delrecord,obj).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    if(datas instanceof Array){
                        datas.forEach(row=>{
                            let index=this.tableData.indexOfFun(old => {
                                return old.id===row.id;
                            });
                            this.tableData.splice(index,1);
                            this.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.tableData.indexOfFun(old => {
                            return old.id===datas.id;
                        });
                        this.tableData.splice(i,1);
                        this.total-=1;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            //提交刊登
            publish(){
                let obj = {
                    ids:this.selectList.map(row=>row.id).join(","),
                };
                this.$confirm(`您将要对已选Listing进行刊登, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_joom_listing_publish,obj).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            operate(data,options){
                options.action.call(this,data);
            },
            handleSizeChange(size){
                this.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
            // 单行选择
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectList = this.tableData.filter(row=>row.isCheck);
            },
            // 全选||非全选
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
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
        computed:{
        	// 批量操作按钮权限
            btnslist(){
                return this.btnList.filter(row=>{
                    if(row.api){
                        return this.$hasPermission(row.api);
                    }else {
                        return true;
                    }
                });
            },
            // 批量删除按钮状态
            isDel(){
            	let arr = this.selectList.filter(row=>row.status===2);
            	if(arr.length){
            		return false;
                }
                return true;
            }
        },
        props:{
            accountList:{
                required: true,
                type: Array
            },
            userList:{
                required: true,
                type: Array
            }
        },
        components:{
            search:require('./search.vue').default,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
        }
    }
</script>
