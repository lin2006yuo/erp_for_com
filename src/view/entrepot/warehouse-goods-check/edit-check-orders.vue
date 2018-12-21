<template>
    <page-dialog :title="addAction.title"
                 size="full"
                 class="p-inventory-check"
                 v-model="visible"
                 :close-on-click-modal="false">
        <div class="mb-sm">
            <label-item label="盘点仓库：">
                <el-select v-model="searchData.warehouse_id" class="width-sm" disabled>
                    <el-option v-for="(item, index) in warehouse"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <el-select v-model="searchData.snType" class="inline width-xs">
                <el-option v-for="(item, index) in typeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         class="inline width-super"
                         @keydown="init"
                         placeholder="可批量搜索，Shift+回车换行...">
            </order-input>
            <el-select v-model="searchData.areaType" class="inline width-xs" @change="changeType">
                <el-option v-for="(item, index) in areaTypeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="searchData.areaText" clearable class="inline width-lg">
                <el-option v-for="(item, index) in areaList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="init">搜索</el-button>
        </div>
        <el-row>
            <el-col :span="3">
                <label class="category_title" @click="all">全部分类</label>
                <div class="add-border">
                    <tree :tree="treeData" @node-click="handle_node_click" class="add-goods-tree"></tree>
                </div>
            </el-col>
            <el-col :span="21" style="padding-left: 8px;">
                <div class="checkAll">
                    <el-checkbox v-model="checkedAll" style="color: white;padding-left:12px">所有页全选</el-checkbox>
                </div>
                <el-table
                    @selection-change="select"
                    :data="tableData"
                    :height="500"
                    v-loading="loading"
                    ref="tableData"
                    class="scroll-bar"
                    element-loading-text="玩命加载中"
                    highlightCurrentRow>
                    <el-table-column
                        :selectable="selectable"
                        type="selection"
                        width="35">
                    </el-table-column>
                    <el-table-column
                        inline-template
                        width="120"
                        label="货位">
                        <div>
                            <ui-tip :content="row.code || row.warehouse_cargo_code" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        width="100"
                        label="分区功能">
                        <div>
                            <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        width="150"
                        label="SKU">
                        <div>
                            <ui-tip :content="row.sku" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="商品名称（规格）">
                        <div>
                            {{row.spu_name}}
                        </div>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        width="80"
                        label="数量">
                        <div>
                            <ui-tip :content="row.quantity" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="fr mt-sm"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="searchData.page"
                    :page-sizes="[20, 50, 100, 200, 500, 800, 1000]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-col>
        </el-row>
        <div slot="footer">
            <request-button req-key="addAdd" @click="add">确定</request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_categories, api_get_cargo, api_get_area_type, api_get_area_lists,
        api_update_check} from '@/api/warehouse-goods-check'
    export default {
        data() {
            return {
                visible: false,
                loading: false,
                searchData:{
                    warehouse_id:'',
                    snType:'shelf',
                    areaType:'id',
                    result:'',
                    areaText:'',
                    snText:'',
                    category_id:'',
                    page:1,
                    pageSize:500
                },
                typeList:[
                    {label:'货架',value:'shelf'},
                    {label:'货位',value:'code'},
                    {label:'SKU',value:'sku'},
                    //{label:'商品名称',value:'goods_name'}
                ],
                areaTypeList:[
                    {label:'分区',value:'id'},
                    {label:'分区功能',value:'type'}
                ],
                areaList:[],
                treeData:[],
                tableData:[],
                checkedAll: false,
                total:0,
                totalData:[], //全部全选的数据
            }
        },
        mounted(){
            this.get_categories();
        },
        methods: {
            init(){
                this.tableData = [];
                this.loading = true;
                let data = clone(this.searchData);
                data.snText = data.snText.split('\n').filter(row=>!!row).map(row => row.trim());
                this.$http(api_get_cargo, data).then(res=>{
                    this.tableData = res.data.map((row, index)=>{
                        this.$set(row, 'number', index);
                        return row;
                    });
                    this.total = res.count;
                    this.$nextTick(()=>{
                        if(this.checkedAll){
                            this.tableData.forEach(row => {
                                this.$refs.tableData.toggleRowSelection(row, this.checkedAll);
                            })
                        }
                    });
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            changeType(val){
                this.searchData.areaText = '';
                switch (val) {
                    case 'id':
                        this.$http(api_get_area_lists, {warehouse_id:this.searchData.warehouse_id}).then(res=>{
                            this.areaList = res.map(row=>{
                                return {label:row.name, value:row.id}
                            });
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message || code});
                        });
                        break;
                    case 'type':
                        this.$http(api_get_area_type).then(res=>{
                            this.areaList = res;
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message || code});
                        });
                        break;
                }
            },
            //获取分类列表
            get_categories(){
                this.treeData = [];
                this.$http(api_get_categories).then(res => {
                    for (let i in res) {
                        let treeObj = {};
                        if (res[i].hasOwnProperty("child_ids") && (res[i].child_ids.length > 0)) {
                            treeObj.label = res[i].title;
                            treeObj.id = res[i].id;
                            treeObj.children = res[i].child_ids.map(row => {
                                return {
                                    id: res[row].id,
                                    label: res[row].title
                                }
                            });
                            this.treeData.push(treeObj);
                        }
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //点击节点
            handle_node_click(data) {
                this.searchData.category_id = data.id;
                this.init();
            },
            //点击全部分类
            all(){
                this.searchData.category_id = 0;
                this.init();
            },
            //table多选
            select(selection, currow){
                this.addList = selection;
            },
            selectable(row, index) {
                return !this.checkedAll;
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            //保存
            add(){
                if(this.isAdd){
                    if(this.checkedAll){
                        this.$reqKey(`addAdd`, false);
                        this.$emit('add-goods', this.totalData);
                    } else {
                        this.$reqKey(`addAdd`, false);
                        this.$emit('add-goods', this.addList);
                    }
                } else {
                    if(this.checkedAll){
                        this.$reqKey(`addAdd`, false);
                        this.$emit('edit-goods', this.totalData);
                    } else {
                        this.$reqKey(`addAdd`, false);
                        this.$emit('edit-goods', this.addList);
                    }
                }
                this.visible = false;
            },
        },
        computed:{
            isAdd(){
                return this.addAction.value === 'add';
            },
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.init();
                    this.changeType('id');
                    this.checkedAll = false;
                    this.totalData = [];
                } else {
                    this.searchData = {
                        warehouse_id:2,
                        snType:'shelf',
                        areaType:'id',
                        areaText:'',
                        snText:'',
                        category_id:'',
                        result:'',
                        page:1,
                        pageSize:500
                    };
                }
                this.visible = val;
            },
            checkedAll(val) {
                if (val) {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, true);
                    });
                    let data = clone(this.searchData);
                    let cur = data.snText.split('\n').filter(row=>!!row);
                    data.snText = cur.map(row=>{
                        return row.trim();
                    });
                    data.pageSize = this.total;
                    this.$http(api_get_cargo, data).then(res=>{
                        this.totalData = res.data;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`addAdd`, false);
                        },200);
                    });
                } else {
                    this.$reqKey(`addAdd`, false);
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            },
        },
        props: {
            value:{},
            addAction:{},
            warehouse:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            tree:require('@/components/tree.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>
