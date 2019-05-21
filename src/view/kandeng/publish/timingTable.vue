<template>
    <el-row class="wish-time-published">
        <el-card>
            <el-select v-model="searchData.nType"  style="width:120px" >
                <el-option :label="item.label"  :value="item.value" :key="item.value"  v-for="item in  optionsss"></el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..." v-model="searchData.nContent" class="has-inline mr-sm"></el-input>
            <el-select v-model="searchData.accountType"  style="width:80px" >
                <el-option :label="item.label"  :value="item.value" :key="item.value" v-for="item in  accountOption"></el-option>
            </el-select>
            <el-select v-model="searchData.accountVal" placeholder="全部"  v-if="searchData.accountType==='full'"
                       clearable class="has-inline mr-sm" filterable
                       style="width:150px">
                <el-option
                        v-for="item in idList"
                        :label="item.account_name"
                        :value="item.id"
                        :key="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchData.accountVal" placeholder="全部"  v-if="searchData.accountType==='short'"
                       clearable class="has-inline mr-sm" filterable
                       style="width:150px">
                <el-option
                        v-for="item in idList"
                        :label="item.code"
                        :value="item.id"
                        :key="item.id">
                </el-option>
            </el-select>
            <label>是否定时刊登：</label>
            <el-select v-model="searchData.cron_time"  clearable class="has-inline mr-sm"
                       style="width:100px">
                <el-option
                        v-for="item in cron"
                        :label="item.label"
                        :value="item.value"
                        :key="item.id">
                </el-option>
            </el-select>
            <label>更新时间：</label>
            <el-date-picker class="has-inline  date"  v-model="searchData.start_time" type="date" placeholder="开始时间"></el-date-picker>
            -
            <el-date-picker class="has-inline  mr-sm date"  v-model="searchData.end_time" type="date" placeholder="结束时间"></el-date-picker>
            <el-button size="mini" type="primary" @click.native="search">搜索</el-button>
            <!--<el-button size="mini" type="primary" @click.native="clear">清空搜索</el-button>-->
        </el-card>
        <div class="mt-sm mb-sm">
            <el-button size="mini" type="primary"  @click.native='clicked'>批量删除</el-button>
        </div>
        <!--table数据-->
        <ui-table     v-model="checkAll"   :body-height="70"   @check="check_all"
                      :heads="[
                        {isCheck:true,width:2,},
                        {label:'产品图片',width:5},
                        {label:'内部SPU',width:10},
                        {label:'刊登标题',width:12},
                        {label:'产品标签',width:13},
                        {label:'账号',width:10},
                        {label:'定时刊登时间',width:11},
                        {label:'销售员',width:6},
                        {label:'销售价',width:8},
                        {label:'运费',width:6},
                        {label:'可售量',width:6},
                        {label:'更新时间',width:5},
                        {label:'操作',width:6},
                       ]">
            <tbody   v-loading="loading"  element-loading-text="玩命加载中...">
            <template v-for="(data, index) in publishList"  >
                <tr   :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']"    @click="addClass(index)"  :key="data.order_number"  >
                    <td><el-checkbox v-model="data.isCheck"  ></el-checkbox></td>
                    <td> <img :src="data.main_image" style="vertical-align: middle;height:26px;width:26px;"/></td>
                    <td><i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']"></i>  <ui-tips :content="data.parent_sku" ></ui-tips> </td>
                    <td><ui-tips :content="data.name" ></ui-tips></td>
                    <td> <ui-tips :content="data.tags" ></ui-tips></td>
                    <td> <ui-tips :content="data.account_name" ></ui-tips></td>
                    <td>定时刊登时间</td>
                    <td><ui-tips :content="data.username" ></ui-tips></td>
                    <td>{{data.price}}</td>
                    <td>{{data.shipping}}</td>
                    <td>{{data.inventory}}</td>
                    <td> <times :time="data.last_updated"></times></td>
                    <td>
                        <el-select v-model="data.num" @input="check(data,data.num)" placeholder="操作" >
                            <el-option
                                    v-for="item in operateList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr  style="font-weight:bold" >
                        <td   colspan="2"  :rowspan="`${data.skus.length+1}`"></td>
                        <td>sku图片</td>

                        <td>内部sku</td>
                        <td>颜色</td>
                        <td>尺寸</td>
                        <td>销售价</td>
                        <td>运费</td>
                        <td>可售量</td>
                        <td>发货期</td>
                        <td colspan="2">产品内部状态</td>
                        <td    :rowspan="`${data.skus.length+1}`"></td>
                    </tr>
                    <tr v-for="item in data.skus" >
                        <td><img :src="item.main_image" style="vertical-align: middle;height:26px;width:26px;"/></td>
                        <td  >  <ui-tips :content="item.sku" ></ui-tips></td>
                        <td >{{item.color}}</td>
                        <td>{{item.size}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.shipping}}</td>
                        <td>{{item.inventory}}</td>
                        <td>{{item.shipping_time}}</td>
                        <td colspan="2">{{item.enabled}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
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
    </el-row>
</template>
<style lang="stylus">
    .wish-time-published{
        .minus, .plus{
            margin-right: 0;
        }
    }
</style>
<script>
    import {api_wish_channel, api__wish_all_list,api_wish_enable_batch,api_wish_disable_batch,api_wish_del} from "../../../../api/kandeng"
    import {operateList} from './action';//------操作按钮引入
    export default{
        data(){
            return {
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
                    status:3,
                    page:1,
                    pageSize:50,
                    nType:"product_id",
                    nContent:"",
                    accountType:"full",
                    accountVal:"",
                    cron_time:"",
                    ntime:"last_updatede",
                    start_time:"",
                    end_time:"",
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
                    {label:"简码",value:"short"},
                ],
                optionsss:[
                    {label:"内部sku",value:"sku"},
                    {label:"内部spu",value:"spu"},
                    {label:"刊登标题",value:"name"},
                ],
                operateList:operateList,
                btnList:[//----------------------------------------------操作按钮
//                   {name:'批量编辑',clickName:'',status:1},
                    {name:'批量删除',clickName:'',status:2},
                ],
            }
        },

        mounted(){
            this.get_seller();
            this.init()
        },
        methods:{
            //初始化
            init(){
                this.publishList = [];
                this.loading=true;
                let data = window.clone(this.searchData)
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
                this.$http(api__wish_all_list,data).then(res=>{

                    res.data&&res.data.forEach(row=>{
                        row.show=false;
                        row.isCheck=false;
                        row.heighLight=false;
                        row.num="";
                    })
                    this.publishList=res.data;
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
            // 点击全部
            check_all(){
                this.publishList.forEach(row=>{
                    row.isCheck=!this.checkAll
                })
            },
            // 点击行 高亮
            addClass(index){
                this.publishList.forEach(row=>{
                    row.heighLight=false;
                });
                this.publishList[index].heighLight=true
            },
            //获取销售账号
            get_seller(){
                this.$http(api_wish_channel).then(res=> {
                    this.idList = res.data;
                }).catch(code=> {
                    console.log(code)
                })
            },
            clicked(){//------------------------------------批量删除
                let arr =[];
                this.publishList.forEach(row=>{
                    if( row.isCheck){arr.push(row.id)}
                })
                if(arr.length===0){
                    this.$message({
                        message: '请选择删除的商品',
                        type: 'warning'
                    });
                    return;
                };
                let ids=arr.join(",")
                this.$confirm(`此操作将批量删除ID:${ids}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_del,{id:ids}).then(res=>{
                        this.$message({type:"success",message:res.message||res})
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
            del_single(data){
                this.$confirm(`您将删除ID:${data.id}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_del,{id:data.id}).then(res=>{
                        this.$message({type:"success",message:res.message||res})
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
            process(option){//--------------操作更多按钮的事件处理
                let arr =[];
                this.publishList.forEach(row=>{
                    if( row.isCheck){
                        arr.push( window.clone(row))
                    }
                })
                if(arr.length===0){
                    this.$message({
                        message: '请选择批量修改的商品',
                        type: 'warning'
                    });
                    return;
                };
                this.flag=option.status;
                this.mdfVisable=true;
                if(option.status===1){
                    let table=[];
                    arr.forEach(rows=>{
                        table.push({product_id:rows.product_id,name:rows.name})
                    })
                    this.$refs.batchedit.tableData=table;
                }else {
                    let table=[];
                    arr.forEach(rows=>{
                        table=table.concat(rows.skus)
                    })
                    this.$refs.batchedit.tableData=table;
                }
            },
            check(row,num){//---------------------查看按钮
                let operate = operateList.find(function (operate) {
                    return operate.value === num
                });
                operate.action.call(this, row);

            },
            handleSizeChange(val){
                this.searchData.pageSize=val;
                this.init()
            },
            handleCurrentChange(val){
                this.searchData.page=val;
                this.init()
            },
            search(){
                this.init();
            },
            clear(){
                this.searchData={
                    status:3,
                    page:1,
                    pageSize:10,
                    nType:"product_id",
                    nContent:"",
                    accountType:"full",
                    accountVal:"",
                    cron_time:"",
                    ntime:"last_updatede",
                    start_time:"",
                    end_time:"",
                }
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
            }
        },
        props:{

        },
        components: {
            express:require("./express.vue").default,
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTips:require("../../../../components/ui-tip.vue").default,
            batchPublish:require("./batch-publish.vue").default,
            batchEdit:require("./batch-edit.vue")
        }
    }
</script>
