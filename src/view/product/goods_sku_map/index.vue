<template>
    <page class="p-index-goods_map">
        <search-card @search="search_list" @enter="search_list" :params="params" :clears="clears">
            <el-select v-sf.snType v-model="params.snType" placeholder="请选择" class="inline" style="width:100px">
                <el-option
                    :key="item.value"
                    v-for="item in skuMenu"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input :placeholder="`请输入${changeLabel}...`" v-sf.snText v-model="params.snText" class="inline enter-result" ></el-input>
            <label class="ml-sm">更新人：</label>
            <scroll v-sf.update_user_id v-model="params.update_user_id" style="width:150px" class="inline" textAlign="left" :remote="urluser" :fix-params="fix_params_user" :fixResult="fix_result_user"></scroll>
            <label class="ml-sm">平台：</label>
            <el-select v-sf.channel_id v-model="params.channel_id"
                       @change="change_channelid" placeholder="请选择平台"
                       class="inline s-width-default" clearable>
                <el-option
                    :key="item.value"
                    v-for="item in channelList"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <label class="ml-sm">账号：</label>
            <scroll ref="accounts" v-sf.account_id v-model="params.account_id"
                    class="inline s-width-default" textAlign="left" :remote="urlaccount" :fix-params="fix_params_account" :fixResult="fix_result_account"  placeholder="请先选择平台" :disable="isDisable"></scroll>
            <label class="ml-sm">更新时间：</label>
            <el-date-picker
                type="date"
                placeholder="开始时间"
                v-sf.date_b
                v-model="params.date_b"
                class="inline date"
                :picker-options="pickerStart"
            ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
            type="date"
            placeholder="结束时间"
            v-sf.date_e
            v-model="params.date_e"
            class="inline date mr-sm"
            :picker-options="pickerEnd"
            ></el-date-picker>
        </search-card>
        <goods-classify ref="classifyPart">
            <!-- 按钮 -->
            <div slot="button-list">
                <el-button size="mini" @click.native="add_gsMap" type="primary">添加</el-button>
                <el-button size="mini" @click.native="showImport=true" type="primary">导入</el-button>
                <permission class="inline ml-xs mr-xs"
                            tag="trendsSelect"
                            type="primary"
                            size="mini"
                            :route="apis.url_sku_export"
                            :selects="partAllOptions"
                            @trigger="export_excel"></permission>
                <permission size="mini" tag="ElButton" :route="apis.url_del_select" @click.native="delall">批量删除</permission>
                <!--<el-button size="mini" @click.native="editDeliver" type="primary" :disabled="tempList.length <= 0">批量设置虚拟仓发货</el-button>-->
            </div>
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                @hidden-left="$refs.classifyPart.showLeft(true)"
                @change-category="change_category">
            </goods-tree>
            <!-- 数据表格 -->
            <el-table
                slot="goods-tabel"
                class="scroll-bar mt-xs"
                :data="tableList"
                border
                v-resize="{height:41}"
                highlight-current-row v-loading="loading"
                element-loading-text="玩命加载中..."
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="35"></el-table-column>
                <el-table-column label="渠道SKU"align="center" inline-template width="200px">
                    <div >{{row.channel_sku}}</div>
                </el-table-column>
                <el-table-column  label="本地SKU及数量" align="center" width="250px" inline-template>
                    <div >{{get_skus(row)}}</div>
                </el-table-column>
                <!--<el-table-column property="quantity" label="数量" align="center" width="80px"></el-table-column>-->
                <el-table-column property="channel" label="平台" align="center"></el-table-column>
                <el-table-column property="account" label="账号" show-overflow-tooltip align="center"></el-table-column>
                <!--<el-table-column inline-template label="系统状态" align="center">-->
                    <!--<div>-->
                        <!--<el-switch :key="row.code"-->
                                   <!--v-model="row.status"-->
                                   <!--:on-text="status[0]"-->
                                   <!--on-color="#20a0ff"-->
                                   <!--:off-text="status[1]"-->
                                   <!--off-color="#C0CCDA"-->
                                   <!--@change="changStatus(row)">-->
                        <!--</el-switch>-->
                    <!--</div>-->
                <!--</el-table-column>-->
                <el-table-column property="update_user" label="更新人"  show-overflow-tooltip align="center"></el-table-column>
                <el-table-column  label="更新时间"  align="center"  inline-template   >
                    <times :time="row.update_time"></times>
                </el-table-column>
                <el-table-column property="handle" label="操作" inline-template align="center" width="180">
                    <div>
                        <span class="operate" @click="curCheck(row)" >查看</span>
                        |
                        <span class="operate" @click="cur_modify(row)">修改</span>
                        |
                        <span class="operate" @click="cur_delete(row)">删除</span>
                    </div>
                </el-table-column>
            </el-table>
        </goods-classify>
        <add-gsMap
            ref="gsMap"
            @reload="reload"
            @update="update"
            v-model="add_dialog"
            :markId="markId"
            :gsMapForm="gsMapForm"
            :isEdit="isEdit"
            :is-load="isLoad"
            :titleName="titleName"
            :isAdd="isAdd" ></add-gsMap>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <import-excel v-model="showImport" @files-success="init"></import-excel>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .p-index-goods_map{
        .el-card__header{
            padding: 0;
        }
        .el-card{
            overflow: visible;
        }
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
            display:inline-block;
            background:#6495ED;
            border:1px solid #6495ED;
            border-top-left-radius:4px;
            border-top-right-radius:4px;
            border-bottom:1px solid transparent;
        }
        .el-row.p-add-gsMap{
            position: static;
        }

    }


</style>
<script>
    import addGsMap from './add-gsMap.vue';
    import labelItems from "../../../components/label-items.vue"
    import tree from "./tree.vue"
    //    import  scroll from  "../../../components/scroll-select.vue"
    import scroll from  "./scroll.vue"
    import {mapGetters} from 'vuex';
    import {api_gsMap_data,api_edit,api_get_channel,api_look,api_del_sigle,api_del_select,url_del_select,url_sku_export,api_sku_export} from '../../../api/goods-sku-map';
    export default{
        permission:{
            url_del_select,
            url_sku_export
        },
        page:{
            devinfo:{
                frontEnd:'张兵根',
                backEnd:'翟斌',
                createTime:'2016-12-28',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                return true;
            }
        },
        refresh(){
            this.init();
        },
        created(){
            this.channel_init();
            this.init();
        },
        data(){
            return {
                isLoad:false,
                urluser:config.apiHost+'sku-map/employee',
                urlaccount:config.apiHost+'sku-map/account',
                searchData:{
                    snType:"sku",
                    snText:"",
                    channel_id:"",
                    account_id:"",
                    category_id:"",
                    update_user_id:"",
                    date_b:"",
                    date_e:"",
                    page:1,
                    pageSize:50,
                },
                params:{
                    snType:"sku",
                    snText:"",
                    channel_id:"",
                    account_id:"",
                    category_id:"",
                    update_user_id:"",
                    date_b:"",
                    date_e:"",
                },
                clears:{
                    snType:"sku",
                },
                total:0,
                skuMenu:[
                    {label:"本地SKU",value:"sku"},
                    {label:"渠道SKU",value:"channel_sku"},
                ],
                channelList:[],
                titleName:'',
                add_dialog:false,
                showImport:false,
                isEdit:false,
                markId:0,//--标示id
                gsMapForm:{},
                tableList:[],
                loading:true,
                isHidden:false,
                tempList:[],
                isAdd:false,
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.params.date_e){
                            return time.getTime() > this.params.date_e;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.params.date_b){
                            return time.getTime() < this.params.date_b;
                        }else{
                            return false;
                        }
                    }
                },
                export_type:'',
                partAllOptions:[
                    {name:"部分导出",value:2,action:function(){
                            if(this.tempList.length<=0)return this.$message({type:"warning",message:"请先选择需要导出的数据"});
                            let params = {
                                ids: JSON.stringify(this.tempList.map(row => {
                                    if (typeof row === 'object') {
                                        return row.id
                                    } else {
                                        return row
                                    }
                                })),
                                export_type: 0,
                            };
                            this.batch_export(params);
                        }},
                    {name:"全部导出",value:1,action:function(){
                            if(this.tableList.length === 0)return this.$message({type:"warning",message:"列表无数据"});
                            let params = {
                                ids:'',
                                export_type: 1,
                            };
                            this.batch_export(params);
                        }},
                ],
                visible:false,

            }
        },
        computed:{
            ...mapGetters({currentUser:'user/info'}),
            btn(){
                if(this.isHidden){
                    return "显示分类"
                }else {
                    return "隐藏分类"
                }
            },
            isDisable(){
                if(this.params.channel_id){
                    return false
                }else {
                    return true
                }
            },
            changeLabel(){
                if(this.params.snType === 'sku'){
                    return `本地SKU`;
                }else{
                    return `渠道SKU`;
                }
            }
        },
        methods:{
            editDeliver(){

            },
            // changStatus(){//-----------------------修改是或否事件
            //     let statusTitle = this.tableList.status ? '否' : '是';
            //     this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //         closeOnClickModal:false,
            //     }).catch((code) => {
            //         this.tableList.status = !this.tableList.status;
            //     });
            // },
            export_excel(val){
                this.export_type = val.value;
                val.action.call(this,val);
            },
            batch_export(data){
                return this.$http(api_sku_export, data).then(res=>{
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            get_skus(row){
                let length=row.sku.length;
                let name=row.sku.map((item,i)=>{
                    if(i===length-1){
                        return item.sku_code+"*"+item.quantity
                    }else {
                        return item.sku_code+"*"+item.quantity+"/"
                    }
                })
                return name.join("")
            },
            //搜索
            search_list(){
                Object.assign(this.searchData,this.params);
                this.init();
            },
            //隐藏分类
            hidden(){
                this.isHidden=!this.isHidden
            },
            //点击分类树形
            change_category(id){
                if(id){
//                    this.params.category_id="";
                    this.searchData.category_id=id;
                    this.init()
                }
            },
            change_cateall(){
//                this.params.category_id="";
                this.searchData.category_id="";
                this.init();
            },
            //平台获取
            channel_init(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //过滤更新人
            fix_params_user({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword,
                };
            },
            //更新人数据
            fix_result_user(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            //过滤 账户
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword,
                    channel_id:this.params.channel_id,
                }
            },
            //账户数据
            fix_result_account(res){
                return  {
                    options: res.data.map(row => {
                        return {
                            label: row.account_name,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            add_gsMap(){//-----------添加
                this.titleName='添加商品产品映射';
                this.markId=0;
                this.isEdit=true;
                this.isAdd=true;
                this.gsMapForm={channel_id:'',account_id:'', channel_sku:'',quantity:1,sku_code:"",sku:[]};//--清空
                this.add_dialog=true;
            },
            init(){//---------list接口
                if(this.searchData.date_b){
                    this.searchData.date_b=datef("YYYY-MM-dd",this.searchData.date_b/1000)
                }else {
                    this.searchData.date_b='';
                }
                if(this.searchData.date_e){
                    this.searchData.date_e=datef("YYYY-MM-dd",this.searchData.date_e/1000)
                }else {
                    this.searchData.date_e='';
                }
                this.searchData.snText=this.searchData.snText.trim();
                this.tableList=[];
                this.loading=true;
                this.$http(api_gsMap_data,this.searchData).then(res=>{
                    this.tableList = res.data;
                    this.total=res.count;
                    this.loading=false;
                }).catch(channel_id=>{
                    console.log(`channel_id:${channel_id}`);
                })
            },
            curCheck(row){//--------------查看
                this.titleName=`查看SKU：${row.sku_code}信息`;
                this.isEdit=false;
                this.add_dialog=true;
                this.isAdd=false;
                this.gsMapForm = {};
                this.isLoad = true;
                this.$http(api_look,row.id).then(res=>{
                    this.gsMapForm=res;
                }).catch(channel_id=>{
                    this.$message({type:'error',message:channel_id.message||channel_id})
                }).finally(()=>{
                    this.isLoad = false;
                })
            },
            //浏览
            browseGoods(id){
                console.log('浏览id',id);
            },
            //删除
            cur_delete(row){
                this.$confirm(`您将删除：${row.channel_sku}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_del_sigle,row.id).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message || res
                        })
                        let index = this.tableList.findIndex(data=>{
                            return data.id===row.id;
                        });
                        this.tableList.splice(index,1);
                        this.total--;
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
//            ------------------------------------------ 修改
            cur_modify(row){
                this.gsMapForm.account='';
                this.gsMapForm.account_id='';
                this.gsMapForm = {};
                this.isLoad = true;
                this.$http(api_edit,row.id).then(res=>{
                    this.gsMapForm=res;
                    this.$nextTick(()=>{
                        this.$refs.gsMap.accountParam.channel_id=res.channel_id;
                        this.$nextTick(()=>{
                            this.$refs.gsMap.$refs.paramAccount.init();
                        })
                    })
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.isLoad = false;
                })
                this.titleName=`修改SKU：${row.sku_code}信息`;
                this.markId = row.id;
                this.isEdit=true;
                this.isAdd=false;
                this.add_dialog=true;
            },
            //删除选中
            delall(){
                let data=[];
                let ids=[];
                if(this.tempList.length==0){
                    this.$message({
                        type:'warning',
                        message:"请选择要删除的项"
                    })
                    return ;
                }
                this.tempList.forEach(item=>{
                    ids.push(item.channel_sku);
                    data.push(item.id);
                });
                this.$confirm(`您将删除:${ids.join(",")}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_del_select,{data}).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message || res
                        })
                        this.tempList.forEach(item=>{
                            let index = this.tableList.findIndex(data=>{
                                return data.id===item.id;
                            });
                            this.tableList.splice(index,1);
                            this.total--;
                        });
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleSelectionChange(val){
                this.tempList=val;
                console.log('this.tempList',this.tempList);
            },
            /* ------------分页*/
            handleSizeChange(size){
                this.searchData.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.searchData.page=page;
                this.init();
            },
            /*-----------分页end*/
            reload(id,val){
                let data = {
                    id:id,
                    account:val.account_name,
                    channel:val.channel_id,
                    channel_sku:val.channel_sku,
                    sku:val.sku,
                };
                this.tableList.unshift(data);
                this.total++;
            },
            change_channelid(){
                this.searchData.account_id="",
                    this.$refs.accounts.refresh_remote();
            },
            update(id,val){
                let update_time = Date.parse(new Date);
                update_time= update_time/1000;
                this.tableList.forEach(res=>{
                    if(res.id===id){
                        res.account = val.account_name;
                        res.channel = val.channel_id;
                        res.channel_sku = val.channel_sku;
                        res.sku = val.sku;
                        res.update_time = update_time;
                        res.update_user = this.currentUser.realname;
                    }
                })
            }
        },
        watch:{
        },
        filters:{
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss',val)
            }
        },
        components: {
            addGsMap,
            labelItems,
            tree,
            scroll,
            uiTips:require("../../../components/ui-tip.vue").default,
            importExcel: require('./import-excel.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            goodsClassify: require('../../../components/goods-classify.vue').default,
            goodsTree: require('../../../components/goods-tree.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            exportDialog:require('./export-dialog.vue').default,
        }
    }
</script>
