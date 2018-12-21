<template>
    <page class="p-index">
        <search-card :params="searchData" :clears="clears" @enter="search" @search="search">
            <label-item label="SKU：" class="mr-sm">
                <el-input v-sf.sku v-model="searchData.sku" class="enter-result" placeholder="请输入sku"></el-input>
            </label-item>
            <el-select v-sf.snDate v-model="searchData.snDate" class="inline s-width-small">
                <el-option v-for="item in searchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
            </el-select>
            <el-date-picker type="date" placeholder="开始时间"
                            v-sf.date_b
                            v-model="searchData.date_b"
                            :picker-options="pickerstart"
                            class="inline date"></el-date-picker>
            &nbsp;&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间"
                            v-sf.date_e
                            v-model="searchData.date_e"
                            :picker-options="pickerend"
                            class="inline date mr-sm"></el-date-picker>

        </search-card>
        <el-button type="primary"
                   class="inline mt-xs mb-xs ml-sm"
                   size="mini"
                   @click.native="add_new">添加</el-button>
        <add-edit v-model="addEditDialog"
                  :handleName="handleName"
                  :title="addEditTitle"
                  @edit-update="edit_update"
                  :thumb-list="thumbList"
                  :form="addEditForm"></add-edit>
        <el-table
            class="scroll-bar"
            :data="tableData.data"
            v-loading="loading"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            highlight-current-row
        >
            <el-table-column label="图片" inline-template width="70">
                <el-popover
                        placement="right"
                        trigger="hover">
                    <img width="200px" height="200px" v-lazy="sku_image(row.thumb)">
                    <span slot="reference">
                              <img height="60px" width="60px" style="border:none" :src="row.thumb">
                        </span>
                </el-popover>
            </el-table-column>
            <el-table-column label="SKU" width="140" inline-template>
                <ui-tip :is-operate="true"
                        @cur-click="sku_information(row.sku_id)" :content="row.sku" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="标题" inline-template>
                <ui-tip :content="row.title" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="描述" inline-template>
                <ui-tip :content="row.desc" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="申报价" prop="declare_price" width="100"></el-table-column>
            <el-table-column label="创建时间" inline-template width="120">
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="操作" inline-template width="140">
                <div>
                    <span class="operate" @click="look_up(row)">查看</span> |
                    <span class="operate" @click="edit_form(row)">编辑</span> |
                    <span class="operate" @click="delete_form(row)">删除</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_goods_declare,api_edit_goods_declare,api_get_image,api_delete_goods_declare} from '../../../api/goods-declare';
    export default {
        page:{
            devinfo:{
                frontEnd:'王月如',
                backEnd:'张文宇',
                createTime:'',
                updateTime:'2018/1/17'
            }
        },
        data() {
            return {
                handleName:"",
                addEditDialog:false,
                addEditTitle:"",
                searchList:[
                    {label:"新增时间",value:"create_time"}
                ],
                addEditForm:{
                    sku:"",
                    declare_price:"",
                    desc:"",
                    title:"",
                    thumb:""
                },
                loading:false,
                searchData:{
                    sku:"",
                    snDate:"create_time",
                    date_b:"",
                    date_e:"",
                },
                total:0,
                clears:{
                    snDate:"create_time",
                },
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50
                },
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b
                        }else {
                            return false
                        }

                    }
                },
                thumbList:[]
            }
        },
        created(){
            this.init();
        },
        refresh(){
            this.init();
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
            look_up(row){
                this.handleName = 'look';
                this.addEditTitle = `查看SKU:${row.sku}产品申报价`;
                this.init_edit(row);
            },
            edit_form(row){
                this.handleName = 'edit';
                this.addEditTitle = `编辑SKU:${row.sku}产品申报价`;
                this.thumbList = [];
                this.getThumb(row); //获取产品图片
                this.init_edit(row);
            },
            getThumb(row){
                let data = {
                    sku_id:[]
                };
                data.sku_id.push(row.sku_id);
                this.$http(api_get_image, data).then(res=>{
                    res.forEach(row=>{
                        if(row.is_default === 1){
                            this.thumbList.push(row);
                        }
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            add_new(){
                this.handleName = 'add';
                this.addEditDialog = true;
                this.addEditTitle = '添加新产品申报价';
                this.addEditForm = {
                    sku:"",
                    declare_price:"",
                    desc:"",
                    title:"",
                    thumb:""
                }
            },
            edit_update(cloneForm){
                let find = this.tableData.data.find(row=>{
                	return row.id === cloneForm.id;
                });
                if(find){
                    Object.assign(find,cloneForm);
                }else{
                    this.tableData.data.unshift(cloneForm);
                    this.total += 1;
                }
            },
            delete_form(row){
                this.$confirm(`您将要删除SKU ${row.sku}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_goods_declare, row.id).then(res=>{
                        let index = this.tableData.data.find((item,index)=>{
                            if(item.id = row.id)
                            return index;
                        });
                        this.tableData.data.splice(index, 1);
                        this.$message({type:"success",message:res.message});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            search(){
                this.init();
            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init();
            },
            current_change(page){
                this.tableData.page = page;
                this.init();
            },
            init(){
                this.loading = true;
                let params = {
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                    sku:this.searchData.sku,
                    snDate:this.searchData.snDate,
                };
                if(!!this.searchData.date_b){
                    let b = new Date(this.searchData.date_b).getTime()/1000;
                    params.date_b = datef('YYYY-MM-dd',b);
                }
                if(!!this.searchData.date_e){
                    let e = new Date(this.searchData.date_e).getTime()/1000;
                    params.date_e = datef('YYYY-MM-dd',e);
                }
                this.$http(api_goods_declare,params).then(res=>{
                    this.loading = false;
                    this.tableData.data = res.data;
                    this.total = res.count;
                }).catch(code=>{
                    this.loading = false;
                    console.log(code);
                })
            },
            init_edit(row){
                this.$http(api_edit_goods_declare,row.id).then(res=>{
                    this.addEditForm.id = res.id;
                    this.addEditForm.sku = res.sku;
                    this.addEditForm.declare_price = res.declare_price;
                    this.addEditForm.desc = res.desc;
                    this.addEditForm.title = res.title;
                    this.addEditForm.thumb = res.thumb;
                    if(res.thumb.split('.com/')[1]){
                        this.addEditForm.path = res.thumb.split('.com/')[1].replace('_60x60', '');
                    }else{
                        this.addEditForm.path = res.thumb;
                    }
                    this.addEditDialog = true;
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            sku_information(sku_id){
                window.open('http://172.18.8.250/detail-index.html?sku_id=' + sku_id);
            }
        },
        components: {
            searchCard:require('../../../components/search-card.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            addEdit:require('./add-edit.vue').default,
        }
    }
</script>
