    <template>
        <page-dialog title="选择指定商品" v-model="addGoods" @open="open" @close="close"
                     size="full" :close-on-click-modal="false">
            <el-row>
                <el-select v-model="snType" class="inline width-xs">
                    <el-option v-for="item in searchList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <order-input v-if="snType==='title'||snType==='sku'" v-model="snText" class="inline width-super" @keydown="search"></order-input>
                <el-input v-else class="inline width-super"  placeholder="请搜索..."  v-model="snText" @keydown.native="search"></el-input>
                <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search">搜索</el-button>
                <el-button class="inline ml-sm" size="mini" @click.native="clear">清空</el-button>
            </el-row>
            <el-row :gutter="8" class="mt-xs">
                <el-col :span="5">
                    <label class="category_title" @click="all">全部分类</label>
                    <div class="add-border">
                        <tree :tree="treeData" @node-click="handle_node_click" class="add-goods-tree"></tree>
                    </div>
                </el-col>
                <el-col :span="19">
                    <el-table
                        @selection-change="select"
                        border
                        class="scroll-bar"
                        :data="goods.dataList"
                        v-loading="isLoading"
                        height="548"
                        highlight-current-row
                        element-loading-text="玩命加载中...">
                        <el-table-column type="selection" width="35" row-key="id"></el-table-column>
                        <el-table-column label="产品图片" inline-template width="100">
                            <div>
                                <el-popover
                                        placement="right"
                                        width="150"
                                        trigger="hover">
                                    <img :src="row.thumb|filterImg" width="150px" height="150px">
                                    <span slot="reference">
                                         <img :src="row.thumb" width="50px" height="50px" style="vertical-align: middle;">
                                    </span>
                                </el-popover>
                            </div>
                        </el-table-column>
                        <el-table-column label="本地SPU" prop="spu"show-overflow-tooltip></el-table-column>
                        <el-table-column label="产品中文名称" prop="name" show-overflow-tooltip></el-table-column>
                        <el-table-column label="产品英文名称" prop="title" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <el-pagination
                            class="fr"
                            @size-change="size_change"
                            @current-change="current_change"
                            :current-page="goods.page"
                            :page-sizes="[20, 50, 100, 200,500]"
                            :page-size="goods.pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="goods.totalSize">
                    </el-pagination>
                </el-col>
            </el-row>
            <div slot="footer">
                <el-button :disabled="isDisabled" size="mini" type="primary" @click.native="add">确定</el-button>
                <el-button size="mini"  @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </template>
    <style lang="stylus">
        .add-goods-tree{
            max-height: 550px;
            overflow-y: auto;
        }
        .add-border{
            height:550px;
            border:1px solid #ddd;
        }
        .category_title{
            box-sizing: border-box;
            display: block;
            width:100%;
            height:30px;
            line-height: 28px;
            padding-left:10px;
            background:#008BCE;
            border:1px solid #008BCE;
            color:#fff;
            &:hover{
                background:rgb(51, 162, 216);
                cursor: pointer;
            }
        }
    </style>
    <script>
        import tree from "../../../../components/tree.vue";
        import pageDialog from '../../../../components/page-dialog.vue';
        import {api_get_categories} from  "../../../../api/supplier-quote";
        import {api_wish_goodsToSpu} from '../../../../api/kandeng'

        export default{
            data(){
                return{
                    addGoods:false,
                    treeData:[],
                    goods:{
                        dataList:[],
                        page:1,
                        pageSize:50,
                        totalSize:0,
                    },
                    searchList:[
                        {label:"全部",value:""},
                        {label:"本地SPU",value:"title"},
                        {label:"本地SKU",value:"sku"},
                        {label:"中文名称",value:"cn_name"},
                        {label:"英文名称",value:"en_name"}
                    ],
                    snType:"sku",
                    snText:"",
                    category_id:0,
                    isLoading:true,
                    addForm:[]
                }
            },
            created(){
                // todo 暂时注释
                this.get_categories();
            },
            mounted(){
                this.addGoods = this.value;
            },
            computed:{
                isDisabled(){
                    return this.addForm.length<=0?true:false;
                }
            },
            watch:{
                addGoods(val){
                    this.$emit("input",val);
                },
                value(val){
                    this.addGoods = val;
                }
            },
            methods: {
                open(){
                    this.get_goods();
                },
                close(){
                    this.addForm=[];
                },
//                table多选
                select(selection,currow){
                    selection.map(row=>{
                        this.$set(row,"selectable",true)
                    })
                    this.addForm = selection;
                },
//                搜索
                search(){
                    this.get_goods();
                },
//              清空
                clear(){
                    this.snType = 'sku';
                    this.snText = '';
                    this.get_goods();
                },
//              获取分类列表
                get_categories(){
                    this.treeData=[];
                    this.$http(api_get_categories).then(res=>{
                        for(var i in res){
                            let treeObj = {};
                            if(res[i].hasOwnProperty("child_ids")&&(res[i].child_ids.length>0)){
                                treeObj.label =res[i].title;
                                treeObj.id = res[i].id;
                                treeObj.children = res[i].child_ids.map(row=>{
                                    return {
                                        id:res[row].id,
                                        label:res[row].title
                                    }
                                });
                                this.treeData.push(treeObj);
                            }
                        }
                    }).catch(code=>{
                        console.log(code);
                    })
                },
//                获取商品
                get_goods(){
                    this.isLoading = true;
                    let params = {
                        page:this.goods.page,
                        pageSize:this.goods.pageSize,
                    };
                    this.category_id && (params.category_id = this.category_id);
                    if(this.snType&&this.snText){
                        params.snType = this.snType;
                        params.snText = this.snText;
                        if(this.snType==='title'||this.snType==='sku'){
                            let curText = this.snText.replace(new RegExp(' ','gm'),'\n');
                            params.snText = curText.split('\n').filter(row=>!!row).map(row=>row.trim());
                        }else{
                            params.snText = this.snText.trim();
                        }
                    }
                    return this.$http(api_wish_goodsToSpu,params).then(res=>{
                        this.goods.dataList = res.data;
                        this.goods.totalSize = res.count;
                        this.isLoading = false;
                        return Promise.resolve();
                    }).catch(code=>{
                        console.log(code);
                    })
                },

//                点击节点
                handle_node_click(data) {
                        this.category_id = data.id;
                        this.get_goods();
                },
//                点击全部分类
                all(){
                    this.category_id = 0;
                    this.get_goods();
                },
//                分页
                size_change(size){
                    this.goods.pageSize = size;
                    this.get_goods();
                },
                current_change(page){
                    this.goods.page = page;
                    this.get_goods();
                },
//                保存
                add(){
                    this.$emit("selected",this.addForm);
                    this.addGoods = false;
                },
                cancel(){
                    this.addGoods = false;
                }
            },
            filters:{
                filterImg(val){
                    return !!val?val.replace('_60x60','_200x200'):'';
                }
            },
            props:{
                value:{}
            },
            components:{
                pageDialog,
                tree,
                orderInput:require('../../../../components/order-input.vue').default,
            }
        }
    </script>
