<template>
    <div class="p-stay-published" :model="seekList">
        <el-card>
            <label>账号：</label>
            <el-select v-model="searchData.account" placeholder="全部"
                       clearable class="has-inline mr-md" filterable
                       style="width:150px">
                <el-option
                        v-for="item in idList"
                        :label="item.account_name"
                        :value="item.id"
                        :key="item.id">
                </el-option>
            </el-select>
            <label>产品状态：</label>
            <el-select v-model="searchData.status" placeholder="全部" clearable class="has-inline mr-md"
                       style="width:100px">
                <el-option
                        v-for="item in statusList"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value">
                </el-option>
            </el-select>
            <el-select v-model="searchData.nType" clearable class="has-inline" style="width:100px">
                <el-option
                        v-for="item in goods"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value">
                </el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..." v-model="searchData.nContent" class="has-inline mr-md"></el-input>
            <el-select v-model="searchData.ntime" placeholder="更新时间" clearable class="has-inline">
                <el-option label="更新时间" value="add_time"></el-option>
                <el-option label="定时刊登" value="run_time"></el-option>
            </el-select>
            <el-date-picker class="has-inline" v-model="searchData.start_time" type="date" placeholder="start"></el-date-picker>
            -
            <el-date-picker class="has-inline" v-model="searchData.end_time" type="date" placeholder="end"></el-date-picker>
            <el-button size="mini" type="primary" @click.native="search">搜索</el-button>
        </el-card>
        <div style="margin:5px">
            <el-button size="mini" type="primary" class="p-handle" @click.native="putaway">批量上架</el-button>
            <el-select placeholder="请选择更多操作"    v-model="option" clearable class="has-inline">
                <el-option v-for="item in opt" :label="item.label" :value="item.value" :key="item.value"
                           @click.native="handle(item)"></el-option>
            </el-select>
        </div>
        <!--table数据-->
        <el-table :data="publishList"   v-resize="{height:65}" style="width:100%;" border
                  v-loading="loading"  element-loading-text="玩命加载中..." highlight-current-row>
            <el-table-column type="selection" width="35" align="center"></el-table-column>
            <el-table-column  inline-template  label="图片" width="100" align="center">
                <img :src="row.main_image" style="vertical-align: middle;height:26px;width:26px"/>
            </el-table-column>
            <el-table-column property="sku" label="SKU"  align="center"
                             show-tooltip-when-overflow></el-table-column>
            <el-table-column property="zh_name" label="商品名称" align="center"
                             show-tooltip-when-overflow></el-table-column>
            <el-table-column inline-template label="更新时间" width="150" align="center">
                <times :time="row.add_time"></times>
            </el-table-column>
            <el-table-column property="account_name" label="店铺账号"  align="center"></el-table-column>
            <el-table-column property="price" label="价格" width="90" align="center" sortable></el-table-column>
            <el-table-column property="inventory" label="可销量" width="90" align="center" sortable></el-table-column>
            <el-table-column  inline-template label="是否促销" width="100" align="center" >
                <span>{{row.is_promoted|promoFilter}}</span>
            </el-table-column>
            <el-table-column inline-template label="操作" align="center"  width="90">
                <el-select v-model="row.num" @input="check(row,row.num)" placeholder="操作">
                    <el-option
                            v-for="item in operateList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                    </el-option>
                </el-select>
            </el-table-column>
        </el-table>
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
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_wish_channel, api__wish_wait_list} from "../../../api/kandeng"
    import {operateList} from './action';
    export default{
        data(){
            return {
                operateList:operateList,
                option:"",
                publishList: [],
                total:0,
                loading:true,
                searchData: {//--待刊登
                    page:1,
                    pageSize:50,
                    account: "",
                    status: "",
                    nType: "parent_sku",
                    nContent: "",
                    ntime: "add_time",
                    start_time: "",
                    end_time: "",
                },
                goods: [
                    {
                        value: 'parent_sku',
                        label: '系统SKU'
                    }, {
                        value: 'sku',
                        label: '渠道Sku'
                    }, {
                        value: 'name',
                        label: '刊登标题'
                    }, {
                        value: 'zh_name',
                        label: '商品名称'
                    },
                ],
                idList: [],
                statusList: [
                    {
                        value: 0,
                        label: '未刊登'
                    }, {
                        value: 1,
                        label: '刊登成功'
                    }
                ],

            }
        },
        mounted(){
            this.get_seller();
        },
        methods: {
            search(){
                this.init();
            },
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
                this.$http(api__wish_wait_list,data).then(res=>{
                    res.data.forEach(row=>{
                        row.num="";
                    })
                    this.publishList=res.data;
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(code)
                })
            },
            putaway(){//------------批量上架

            },
            handle(option){//--------------操作更多按钮的事件处理

            },
            handleSizeChange(val){
                this.searchData.pageSize=val;
                this.init()
            },
            handleCurrentChange(val){
                this.searchData.page=val;
                this.init()
            },
            //获取销售账号
            get_seller(){
                this.$http(api_wish_channel).then(res=> {
                    this.idList = res.data;
                }).catch(code=> {
                    console.log(code)
                })
            },
            check(row,num){//---------------------查看按钮
                /* let operate = operateList.find(operate=>{return operate.value === num});*/
                let operate = operateList.find(function (operate) {
                    return operate.value === num
                });
                operate.action.call(this, row);

            },
        },
        filters:{
            promoFilter(val){
                if(val===0){
                    return "不促销"
                }else {return "促销"}
            }
        },
        props: {
            opt: {},
        },
        components: {}
    }
</script>
