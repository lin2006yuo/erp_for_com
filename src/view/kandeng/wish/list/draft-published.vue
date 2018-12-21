<template>
    <el-row class="wish-stay-published">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select class="inline width-sm" v-sf.type v-model="searchData.type">
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in optionsss"></el-option>
            </el-select>
            <el-input class="inline mr-sm" placeholder="请输入搜索内容..." v-sf.content v-model="searchData.content"></el-input>
            <label>账号简称：</label>
            <param-account v-sf.account_id v-model="searchData.account_id"
                           type="wishPublishAccount"
                           url="get|publish/wish/getSellers"
                           :fixResult="fixAccount"
                           placeholder="全部"
                           class="has-inline mr-sm s-width-default">
            </param-account>
            <label>时间：</label>
            <el-date-picker class="inline date" v-sf.start_time v-model="searchData.start_time" type="date" :picker-options="pickerstart" placeholder="开始时间">
            </el-date-picker>&nbsp;--&nbsp;<el-date-picker class="inline  mr-sm date" :picker-options="pickerend" v-sf.end_time v-model="searchData.end_time" type="date" placeholder="结束时间"></el-date-picker>
        </search-card>
        <div class="mt-sm ml-sm mb-sm">
            <permission tag="request-button" :mintime="200" req-key="url_wish_del_draft2" @click.native='clicked' :route="apis.url_wish_del_draft">批量删除</permission>
        </div>
        <!--table数据-->
        <ui-table :has-data="publishList.length>0"
                  v-model="checkAll"   :body-height="38"
                  @check="check_all"  ref="table"
                  v-loading="loading"  element-loading-text="玩命加载中..."
                  :heads="[
                        {isCheck:true,width:2},
                        {label:'产品图片',width:10},
                        {label:'本地SPU',width:15},
                        {label:'刊登标题',width:22},
                        {label:'账号简码',width:15},
                        {label:'刊登人',width:14},
                        {label:'创建时间',width:15},
                        {label:'操作',width:7},
                       ]">
            <tbody>
            <template v-for="(data, index) in publishList">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']" @click="addClass(index)" :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img  v-lazy="data.thumb"
                                  @click="search_img(data.thumb)"
                                  width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="data.thumb"
                                       @click="search_img(data.thumb)"
                                       height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                      </td>
                    <td><ui-tips :content="data.spu"></ui-tips></td>
                    <td><ui-tips :content="data.name"></ui-tips></td>
                    <td> <ui-tips :content="data.account.code"></ui-tips></td>
                    <td><ui-tips :content="data.user.realname"></ui-tips></td>
                    <td> <times :time="data.create_time"></times></td>
                    <td>
                        <trends-select  class="inline" @trigger="check(data,$event)" :selects="optionList" type="primary"></trends-select>
                    </td>
                </tr>
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
<style lang="stylus" scoped>
    .wish-stay-published{
        .minus, .plus{
            margin-right: 0;
        }
    }
</style>
<script>
    import {api_wish_channel, api_wish_list_draft,api_wish_enable_batch,api_wish_disable_batch,api_wish_del_draft,url_wish_del_draft} from "../../../../api/kandeng"
    import {operateList} from './action';
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        permission: {
            url_wish_del_draft
        },
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return time.getTime() < this.searchData.start_time.getTime()
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
                    type:"spu",
                    content:"",
                    account_id:"",
                    start_time:"",
                    end_time:"",
                },
                clears:{
                    type:"spu",
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
                accountOption:[
                    {label:"账号",value:"full"},
                    {label:"简称",value:"short"},
                ],
                optionsss:[
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
                    return this.$hasPermission(row.api)&&row.stauts.includes(5)
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
            search_img(image){
                this.imgPath = this.get_path(image,'_500x500.');
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
                operate.action.call(this, row,5);
            },
            //初始化
            init(){
                this.loading=true;
                let data = window.clone(this.searchData);
                if (this.searchData.start_time) {
                    data.start_time =datef("YYYY-MM-dd",this.searchData.start_time/1000);
                }else {
                    data.start_time="";
                }
                if (this.searchData.end_time) {
                    data.end_time =datef("YYYY-MM-dd",this.searchData.end_time/1000);
                }else {
                    data.end_time="";
                }
                data.content=data.content.trim();
                data.page=this.page;
                data.pageSize=this.pageSize;
                this.$http(api_wish_list_draft,data).then(res=>{
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
                })
                if(arr.length===0){
                    this.$reqKey('url_wish_del_draft2',false);
                    this.$message({
                        message: '请选择删除的商品',
                        type: 'warning'
                    });
                    return;
                };
                let ids=arr.join(";")
                this.$confirm(`您将对已选Listing执行批量删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_del_draft,{id:ids}).then(res=>{
                        this.$message({type:"success",message:res.message||res})
                        this.operate_del(arr);
                    }).catch(code=>{
                        this.$message(code.message||code)
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_wish_del_draft2',false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_wish_del_draft2',false);
                    },200);
                });
            },
            operate_del(datas){
                if(datas instanceof Array){
                    datas.forEach(row=>{
                        let index=this.publishList.indexOfFun(row,function (old,row) {
                            return old.id===row
                        });
                        this.publishList.splice(index,1);
                        this.total-=1;
                    })
                } else if(datas instanceof Object){
                    let i = this.publishList.findIndex(row=>{
                        return row.id===datas.id;
                    })
                    this.publishList.splice(i,1)
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
