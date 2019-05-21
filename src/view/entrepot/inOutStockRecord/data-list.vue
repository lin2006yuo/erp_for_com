<template>
    <el-row class="p-data-list">
        <table class="template">
            <tr class="line" style="font-weight:bold">
                <td style="width:44px"><el-checkbox v-model="checkAll" @change="check_all"></el-checkbox></td>
                <td :colspan="2" style="width:90px">出入库单号</td>
                <td>出入库类型</td>
                <td :colspan="3">仓库</td>
                <td :colspan="2">来源单号</td>
                <td>创建人</td>
                <td>状态</td>
                <td>审核人</td>
                <td :colspan="2">创建时间</td>
                <td :colspan="2">更新时间</td>
                <td :colspan="2">操作</td>
            </tr>
            <tbody v-loading="isLoading"
                   element-loading-text="玩命加载中..."
            >
                <template v-for="(item,index) in tableData.lists">
                <tr class="line">
                    <td style="width:44px"><el-checkbox @change="check_box(item.id)"></el-checkbox></td>
                    <!--出入库单号-->
                    <td :colspan="2" style="text-align:left"><i @click="show_detail(item)" :class="[item.show?'minus':'plus']"></i>{{item.code}}</td>
                    <!--出入库类型-->
                    <td>
                        <el-tooltip placement="top">
                            <div slot="content">{{item.type}}</div>
                            <div class="hidden">{{item.type}}</div>
                        </el-tooltip>
                    </td>
                    <!--仓库-->
                    <td :colspan="3">
                        <el-tooltip placement="top">
                            <div slot="content">{{item.name}}</div>
                            <div class="hidden">{{item.name}}</div>
                        </el-tooltip>
                    </td>
                    <!--来源单号-->
                    <td :colspan="2">
                        <el-tooltip placement="top">
                            <div slot="content">{{item.original_code}}</div>
                            <div class="hidden">{{item.original_code}}</div>
                        </el-tooltip>

                    </td>
                    <!--创建人-->
                    <td>
                        <el-tooltip placement="top">
                            <div slot="content">{{item.create_name}}</div>
                            <div class="hidden">{{item.create_name}}</div>
                        </el-tooltip>
                    </td>
                    <!--状态-->
                    <td>
                        <el-tooltip placement="top">
                            <div slot="content">{{item.status}}</div>
                            <div class="hidden">{{item.status}}</div>
                        </el-tooltip>
                    </td>
                    <!--审核人-->
                    <td>
                        <el-tooltip placement="top">
                            <div slot="content">{{item.update_name}}</div>
                            <div class="hidden">{{item.update_name}}</div>
                        </el-tooltip>
                    </td>
                    <!--创建时间-->
                    <td :colspan="2">
                        <el-tooltip placement="top">
                            <div slot="content">{{item.create_time | filterDate}}</div>
                            <div class="hidden">{{item.create_time | filterDate}}</div>
                        </el-tooltip>
                    </td>
                    <!--更新时间-->
                    <td :colspan="2">
                        <el-tooltip placement="top">
                            <div slot="content">{{item.update_time | filterDate}}</div>
                            <div class="hidden">{{item.update_time | filterDate}}</div>
                        </el-tooltip>
                    </td>
                    <!--操作-->
                    <td :colspan="2">
                        <span class="operate" @click="look_up(item.id)">查看</span>
                        |
                        <span class="operate" @click="amend(item.id)">修改</span>
                        |
                        <span class="operate" @click="delete_list(index)">删除</span>
                    </td>
                </tr>
                <template v-if="item.show">
                    <tr style="font-weight:bold">
                        <td :rowspan="item.detailList.length+1"></td>
                        <td :colspan="2">SKU</td>
                        <td :colspan="4">商品名称</td>
                        <td  :colspan="2">Title</td>
                        <td>入库数量</td>
                        <td>实际出入库数量</td>
                        <td>单价</td>
                        <td :colspan="6">备注</td>
                    </tr>
                    <tr v-for="goods in item.detailList">
                        <!--SKU-->
                        <td :colspan="2">
                            <el-tooltip placement="top">
                                <div slot="content">{{goods.sku}}</div>
                                <div class="hidden">{{goods.sku}}</div>
                            </el-tooltip>
                        </td>
                        <!--商品名称-->
                        <td :colspan="4">
                            <el-tooltip placement="top">
                                <div slot="content">{{goods.name}}</div>
                                <div class="hidden">{{goods.name}}</div>
                            </el-tooltip>
                        </td>
                        <!--title-->
                        <td :colspan="2">
                            <el-tooltip placement="top">
                                <div slot="content">{{goods.title}}</div>
                                <div class="hidden">{{goods.title}}</div>
                            </el-tooltip>
                        </td>
                        <!--入库数量-->
                        <td>{{goods.quantity}}</td>
                        <!--实际出入库数量-->
                        <td>{{goods.actual_quantity}}</td>
                        <!--单价-->
                        <td>{{goods.price}}</td>
                        <!--备注-->
                        <td :colspan="6">
                            <el-tooltip placement="top">
                                <div slot="content">{{goods.remark}}</div>
                                <div class="hidden">{{goods.remark}}</div>
                            </el-tooltip>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableData.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="tableData.pageSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="tableData.count"
        >

        </el-pagination>
    </el-row>
</template>
<style lang="stylus">
</style>
<script>

    export default{
        data(){
            return {
                checkAll:false,
                isCheck:false,
                clickData:[],
            }
        },
        filters:{
            filterDate(val){
                return datef("YYYY-MM-dd",val*1000)
            }
        },
        mounted(){
            this.fixed_list();
            for(let i=0;i<this.tableData.lists.length;i++){
                this.clickData.push(false)
            }
        },
        methods:{
            fixed_list(){
                this.tableData.lists.forEach((data,i)=>{
                    this.$set(this.tableData.lists[i],'show',false);
                    this.$set(this.tableData.lists[i],'selected',false);
                })
            },
            show_detail(data){
                data.show=data.show ? false:true;
                console.log(data.show);
            },
//            -----------------------------------------------------------列表  查看/编辑/删除
            look_up(id){
                this.$emit("look-up",id);
            },
            amend(id){
                this.$emit("amend",id);
            },
            delete_list(index){
                this.$emit("delete-list",index);
            },
//            ——-------------------------------------------------子列表删除
            delete_detail(id){
                console.log(`delete_detail：${id}`)
            },
//            ----------------------------------------------------分页
            handleSizeChange(size){
                console.log("handleSizeChange");
                this.$emit("size-change",size);
            },
            handleCurrentChange(page){
                console.log("handleCurrentChange");
                this.$emit("current-change",page);
            },
//            -----------------------------------------------------全选
            check_all(){
                console.log('checkAllBox')
            },
//            ------------------------------------------------------单选
            check_box(){
                console.log('check_box');
            },
        },
        props:{
            tableData:{
                required:true,
                type:Object
            },
            isLoading:{
                required:true,
                type:Boolean
            }
        },
        components: {}
    }
</script>