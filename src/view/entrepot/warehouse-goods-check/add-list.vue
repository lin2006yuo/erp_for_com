<template>
    <page-dialog :title="action.title"
                 size="large"
                 class="p-inventory-check"
                 v-model="visible"
                 :close-on-click-modal="false">
        <label-item label="盘点仓库：">
            <el-select v-model="addData.warehouse_id" class="width-sm" disabled>
                <el-option v-for="(item, index) in warehouse"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>


        <label-item label="指定盘点人：" class="ml-sm">
            <el-select v-model="addData.checker_id"
                       placeholder="请选择/输入..."
                       filterable clearable
                       class="width-sm">
                <el-option v-for="(item, index) in peopleList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="盘点类型：" class="ml-sm">
            <el-select v-model="addData.type" class="width-sm">
                <el-option v-for="(item, index) in typeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <div class="mt-sm mb-sm ml-sm">
            <el-button type="primary" size="mini" @click="addAllocation">添加货位</el-button>
            <el-button type="primary" size="mini" class="ml-sm" @click="deleteList">删除</el-button>
        </div>

        <el-table
                :data="addData.list"
                height="550"
                v-loading="loading"
                @selection-change="select"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    width="40"
                    type="selection">
            </el-table-column>
            <el-table-column
                    width="120"
                    inline-template
                    label="货位">
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                width="100"
                inline-template
                label="分区功能">
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="150"
                    inline-template
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
                    width="120"
                    label="数量">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>

        <div slot="footer">
            <request-button req-key="queryAdd" @click="query" :disabled="isQuery">确定盘点</request-button>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_warehouse_user, api_warehouse_goods_check_create} from '@/api/warehouse-goods-check'
    export default {
        data(){
            return {
                visible: false,
                loading: false,
                peopleList:[],
                addData:{
                    type:0,
                    list:[]
                },
                selectList:[],
                typeList:[
                    {label:'动态盘点', value:0},
                    {label:'静态盘点', value:1}
                ]
            }
        },
        mounted(){
            this.init_user();
        },
        methods: {
            init_user(){
                this.$http(api_get_warehouse_user).then(res=>{
                    this.peopleList = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id
                        }
                    })
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            addAllocation(){
                this.$emit('add-allocation', 'add');
            },
            query(){
                let details = this.addData.list.map(row=>{
                    return {
                        warehouse_cargo_id:row.warehouse_cargo_id,
                        warehouse_cargo_code:row.code,
                        warehouse_area_id:row.warehouse_area_id,
                        warehouse_area_code:row.warehouse_area,
                        warehouse_area_type:row.warehouse_area_type_value,
                        sku_id:row.sku_id,
                        sku:row.sku
                    }
                });
                let data = {
                    warehouse_id:this.addData.warehouse_id,
                    checker_id:this.addData.checker_id,
                    type:this.addData.type,
                    details:details
                };
                this.$http(api_warehouse_goods_check_create, data).then(res=>{
                    this.$emit('new-data', res.data);
                    this.$message({type:"success",message:res.message || res});
                    this.visible = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`queryAdd`, false);
                    },200);
                });
            },
            select(selection, currow){
                this.selectList = selection;
            },
            deleteList(){
                this.selectList.forEach(item=>{
                    this.addData.list.forEach((row, index)=>{
                        if(row.id === item.id){
                            this.addData.list.splice(index, 1);
                        }
                    })
                })
            }
        },
        computed: {
            isQuery(){
                if(!this.addData.checker_id){
                    return true;
                }
                if(this.addData.list.length === 0){
                    return true;
                }
                if(this.addData.type === ''){
                    return true
                }
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(!val){
                    this.addData = {list:[], type:0};
                }
                this.visible = val;
            },
            addList(val) {
                val.forEach(row=>{
                    let flag = this.addData.list.findIndex(item=>{
                        return row.id === item.id;
                    });
                    if(flag !== -1){

                    } else {
                        this.addData.list.push(row);
                    }
                })
            }
        },
        props: {
            value:{},
            action:{},
            addList:{},
            warehouse:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,

        },
    }
</script>
