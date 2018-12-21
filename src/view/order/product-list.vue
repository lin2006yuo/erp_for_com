<template>
    <page-dialog v-model="show" title="添加商品" size="large">
        <el-card>
            <div>
                <el-input v-model="keyword" class="inline"></el-input>
                <select-event class="inline" placeholder="搜索方式" :options="options"></select-event>
            </div>
            <el-row>
                <el-col :span="8" class="fullheight">
                    <el-card class="fullheight">
                        <el-tree class="product-list-tree" empty-text="正在加载分类列表" @node-click="categories_click" :props="defaultProps" :data="categories"></el-tree>
                    </el-card>
                </el-col>
                <el-col :span="16" class="fullheight">
                    <el-card>
                        <el-table @selection-change="select" :data="lists" style="width:100%;" height="400">
                            <el-table-column type="selection" align="center" width="35px">
                            </el-table-column>
                            <el-table-column label="商品名称" prop="spu_name" align="center">
                            </el-table-column>
                            <el-table-column label="SKU" prop="sku" align="center">
                            </el-table-column>
                            <el-table-column label="市场价(元)" prop="market_price" align="center">
                            </el-table-column>
                            <el-table-column label="平均成本(元)" prop="cost_price" align="center">
                            </el-table-column>
                        </el-table>
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="page"
                                :page-sizes="[20,50,100,200,500]"
                                :page-size="size"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="18" :span="6">
                    <el-button type="primary" @click.native="submit">确定</el-button>
                    <el-button type="primary" @click.native="cancel">取消</el-button>
                </el-col>
            </el-row>
        </el-card>
    </page-dialog>
</template>
<style lang="stylus">
    .fullheight{
        height:100%;
    }
    .product-list-tree{
        height:430px;
        overflow-y: auto;
    }
</style>
<script>

    import {api_get_shop} from '../../api/order-local';
    import {api_get_categories} from '../../api/categories';
    export default{
        data(){
            return{
                show:this.value,
                options:[
                    {labal:'搜 SKU',action:function(){

                    }},
                    {label:'搜 商品名称',action:function(){

                    }}
                ],
                lists:[],
                page:1,
                size:50,
                total:0,
                selectCategories:0,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                categoriesTempl:{},
                selected:[],
                keyword:''
            }
        },
        mounted(){
            this.categories_init();
            this.init();
        },
        methods:{
            categories_init(){
                this.$http(api_get_categories,{}).then(res=>{
                    this.categoriesTempl = res;
                }).catch(code=>{

                });
            },
            init(){
                let params = {
                    category_id:this.selectCategories,
                    page:this.page,
                    pageSize:this.size
                };
                this.$http(api_get_shop, params).then(res=>{
                    this.lists = res.data;
                    this.total = parseInt(res.count);
                    this.page = parseInt(res.page);
                    this.size = parseInt(res.pageSize);
                })
            },
            submit(){
                this.$emit('selected',this.selected);
                this.show = false;
            },
            cancel(){
                this.show = false;
            },
            select(selected){
                this.selected = selected;
            },
            categories_click(node){
                this.selectCategories = node.id;
            },
            handleSizeChange(size){
                this.size = parseInt(size);
                this.init();
            },
            handleCurrentChange(page){
                this.page = parseInt(page);
                this.init();
            }
        },
        computed:{
            categories(){
                let self = this;
                function do_node(id){
                    let children = self.categoriesTempl[id];
                    let node = {
                        id:id,
                        label:children.title,
                        children:do_children(children.child_ids)
                    };
                    return node;
                }
                function do_children(ids) {
                    return ids.map(id=>{
                        return do_node(id);
                    })
                }
                if(this.categoriesTempl.child_ids){
                    return do_children(this.categoriesTempl.child_ids);
                }else{
                    return [];
                }
            },
            selectedTitle(){
                if(this.selected.length > 0){
                    return `(${this.selected.length})`;
                }else{
                    return '';
                }
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
            selectCategories(){
                console.log(`selectCategories`);
                this.init();
            }
        },
        props:{
            value:{}
        },
        components:{
            pageDialog: require('../../components/page-dialog.vue').default,
            selectEvent: require('../../components/select-event.vue').default,
        }
    }
</script>
