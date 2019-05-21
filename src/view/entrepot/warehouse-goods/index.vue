<template>
    <page class="p-overseas-index">
        <search-card @search="search" :params="params" :clears="clears">
            <el-row>
                <div class="fl" style="margin-right:20px;">
                    <label-buttons label="仓库类型：" @select="select" :buttons="classifyButtons"></label-buttons>
                </div>
                <div v-show="isShow">
                    <label class="fl" style="line-height:26px;">{{warehouse}}：</label>
                    <el-select class="fl" style="height:26px;line-height:26px;" v-model="selectEntrepot" @change="select_entrepot">
                        <el-option v-for="item in entrepotLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </el-row>
                <div class="inline">
                    <span>库存状态：</span>
                    <el-select class="inline width-sm" v-sf.selectStatus v-model="params.selectStatus">
                        <el-option v-for="item in statusLists" :key="item.value" :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
                <div class="inline ml-sm">
                    <span>产品状态：</span>
                    <el-tooltip effect="dark" content="该功能后台暂未确定" placement="top">
                            <el-select class="inline width-sm" v-sf.selectProductStatus v-model="params.selectProductStatus" :disabled="true">
                            <el-option v-for="item in selectProductStatuss" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-tooltip>
                </div>
                <div class="inline ml-sm">
                    <span class="inline">搜索方式：</span>
                    <el-select class="inline width-md" v-sf.snType v-model="params.snType">
                        <el-option v-for="item in selectQuerys" :label="item.label" :key="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input class="inline mr-sm" v-sf.snText v-model="params.snText" :placeholder="`请输入${changeLabel}...`"></el-input>
                </div>
        </search-card>
            <el-row class="mb-xs mt-xs">
                <el-col :span="4">
                    <el-button class="ml-sm" size="mini" :type="showHiddenClassify ? 'default': 'primary'" @click.native="showHiddenClassify = !showHiddenClassify">
                        {{showHIddenClassifyName}}
                    </el-button>
                </el-col>
                <el-col :span="20">
                    <permission tag="ElButton" :route="apis.url_export" :disabled="this.tables.lists.length===0" size="mini" class="inline" type="primary" @click.native="export_data">导出</permission>
                    <box-area class="inline">
                        <permission tag="ElButton" size="mini" class="inline" :type="selectedItems.length > 0 ? 'primary' : 'default'" @click.native="platfrom_mdf" :route="apis.url_mdf_alert">批量修改平台预警数</permission>
                        <permission tag="integerInput"
                                    class="inline"
                                    :min="1"
                                    v-model="platformMdfValue"
                                    placeholder="输入预警值"
                                    :route="apis.url_mdf_alert"></permission>
                    </box-area>
                    <el-checkbox v-show="comparesShow" label="对比库存" v-model="isCompare" class="fr mr-sm mt-sm"></el-checkbox>
                </el-col>
            </el-row>
            <el-row :gutter="8">
                <el-col v-if="showHiddenClassify" :span="4">
                    <el-card  v-resize="{height:65}">
                        <div slot="header">
                            <span class="color-white">所有分类</span>
                        </div>
                        <tree class="oversea-tree" ref="tree" :tree="categoriesTempl" @node-click="categories_click"   ></tree>
                    </el-card>
                </el-col>
                <el-col :span="classifyBoxSpan">
                    <el-table
                            v-loading="isLoading"
                            element-loading-text="玩命加载中......"
                            class="scroll-bar"
                            highlight-current-row
                            v-resize="{height:65}"
                            :data="tables.lists"
                            @selection-change="select_items"
                    >
                        <el-table-column
                                align="center"
                                type="selection"
                                width="35">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                inline-template
                                width="50"
                                label="图片">
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(row.thumb)"  width="200px" height="200px">
                                <span slot="reference">
                                    <img v-lazy="row.thumb"  v-if="row.thumb" height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </el-table-column>
                        <el-table-column
                                width="80"
                                inline-template
                                label="仓库">
                            <div>
                                <ui-tip :content="row.warehouse_name" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                label="SKU">
                            <div>
                                <ui-tip :content="row.sku" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                width="90"
                                inline-template
                                label="平均成本(￥)" v-if="clientWidth">
                            <div>{{row.per_cost|filterable}}</div>
                        </el-table-column>
                        <el-table-column
                                show-tooltip-when-overflow
                                width="120"
                                inline-template
                                label="货品总值(￥)" v-if="clientWidth">
                            <div>{{row.retail_price|filterable}}</div>
                        </el-table-column>
                        <el-table-column
                                width="90"
                                inline-template
                                label="头程费用(￥)" v-if="clientWidth">
                            <div>{{row.first_shippingfee_unit|filterable}}</div>
                        </el-table-column>
                        <el-table-column
                                width="60"
                                prop="alert_quantity"
                                label="预警数">
                        </el-table-column>
                        <el-table-column
                                width="80"
                                :label="isDisplayCompare?'在途库存/第三方':'在途库存'" inline-template>
                            <div>
                                <span v-if="isDisplayCompare">
                                    <span>{{row.instransit_quantity}}</span>
                                    <span style="padding:0 5px">|</span>
                                    <span>{{row.third_instransit_quantity}}</span>
                                </span>
                                <span v-else>
                                    {{row.instransit_quantity}}
                                </span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                width="80"
                                :label="isDisplayCompare?'当前库存/第三方':'当前库存'" inline-template>
                            <div>
                                <span v-if="isDisplayCompare">
                                    <span>{{row.quantity}}</span>
                                    <span style="padding:0 5px">|</span>
                                    <span>{{row.third_avaliable_quantity}}</span>
                                </span>
                                <span v-else>
                                    {{row.quantity}}
                                </span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                width="80"
                                prop="available_quantity"
                                label="可用库存">
                        </el-table-column>
                        <el-table-column
                                show-tooltip-when-overflow
                                width="80"
                                prop="waiting_shipping_quantity"
                                label="待发货数">
                        </el-table-column>
                        <el-table-column
                                show-tooltip-when-overflow
                                width="80"
                                label="缺货数" inline-template>
                            <span title="查看sku缺货明细"
                                  @click="look_oos_detail(row)">
                                {{row.oos_quantity}}
                            </span>
                        </el-table-column>
                        <el-table-column
                                show-tooltip-when-overflow
                                width="100"
                                :label="isDisplayCompare?'故障品库存/第三方':'故障品库存'" inline-template
                                v-if="clientWidth">
                            <div>
                                <span v-if="isDisplayCompare">
                                    <span>{{row.defects_quantity}}</span>
                                    <span style="padding:0 5px">|</span>
                                    <span>{{row.third_defects_quantity}}</span>
                                </span>
                                <span v-else>{{row.third_defects_quantity}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                show-tooltip-when-overflow
                                label="更新时间" inline-template>
                            <span>{{row.updated_time}}</span>
                        </el-table-column>
                        <el-table-column
                                show-tooltip-when-overflow
                                inline-template
                                label="出入库明细">
                            <span class="operate" @click="outPut_dialog(row)" v-permission.in_out_detail="'entrepotOverseas'">出入库明细</span>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            class="page-fixed"
                            @size-change="change_size"
                            @current-change="change_page"
                            :current-page="tables.page"
                            :page-sizes="[20, 50, 100, 200,500]"
                            :page-size="tables.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tables.count">
                    </el-pagination>
                </el-col>
            </el-row>
        <detail v-model="outPutDialog" :row="outPutDialogRow"></detail>
    </page>
</template>
<style lang="stylus">
    .p-overseas-index{
        .category-title{
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
        .oversea-border{
            height:642px;
            border:1px solid #ddd;
        }
        .oversea-tree{
            max-height:630px;
            overflow-y: auto;
        }
        .fixed-right{
            float:right;
        }
        .el-card__header {
            box-sizing: border-box;
            display: inline-block;
            color: #333;
            width: 100%;
            height: 32px;
            padding: 0 5px;
            line-height: 32px;
            font-size: 1.2rem;
            background: #6495ed;
            border: 1px solid #6495ed;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }

    }

</style>
<script>

    import labelButtons from '../../../components/label-buttons.vue';
    import {downloadFile} from '../../../lib/http';
    import {api_get,
        api_mdf_alert,
        api_get_warehouses,
        api_oos_details,
        api_export,
        url_mdf_alert,url_export} from '../../../api/entrepot-overseas';
    import {api_get_categories} from '../../../api/categories';
    import detail from './detail.vue';
    export default{
        permission:{
            url_mdf_alert,
            url_export
        },
        page:{},
        refresh(){
            this.params = {
                snType:'sku',
                snText:'',
                selectProductStatus:0,
                selectStatus:0,
            };
            this.platformMdfValue = '';
            this.init_status_btn();
            this.init();
        },
        data(){
            return{
                isLoading:false,
                warehouse:"",
                showHiddenClassify:true,
                platformMdfValue:'',
                mdfValue:'',
                classifyButtons:[
                    //仓库类型（1为本地仓 2为海外仓 3为4px 4为winit 5为fba)
                    {name:'全部',value:''},
                    {name:'本地仓',value:'1'},
                    {name:'海外仓', value:'2'},
                    {name:'第三方仓库',value:'third'},
                    {name:'FBA仓库',value:'5'},
                ],
                selectClassify:'',
                selectEntrepot:'',
                entrepotListsAll:{},
                entrepotLocation:[
                    {label:"全部",value:0},
                    {label:"不占位",value:1},
                    {label:"占位",value:2},
                ],
                selectLocation:0,
                statusLists:[
                    {label:"全部",value:0},
                    {label:"正常",value:1},
                    {label:"低库存",value:2},
                ],
                selectProductStatuss:[
                    {label:"全部",value:0},
                    {label:"上架",value:1},
                    {label:"下架",value:1}
                ],
                params:{
                    snType:'sku',
                    snText:'',
                    selectProductStatus:0,
                    selectStatus:0,
                },
                clears:{
                    snType:'sku',
                    selectProductStatus:0,
                    selectStatus:0,
                },
                selectQuerys:[
                    {label:'SKU',value:'sku'},
                ],
                selectedItems:[],
                tables:{
                    page:1,
                    pageSize:50,
                    count:0,
                    lists:[]
                },
                showDetail:false,
                showDetailID:0,
                allDetailTables:[],
                categoriesTempl:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                selectCategories:0,
                query:"",
                isCompare:false,
                outPutDialog:false,
                outPutDialogRow:{
                },
                oosDetails:[],
                oosDetailsShow:false,
            }
        },
        created(){
            this.init();
            this.categories_init();
        },
        filters:{
            filterable(val){
                if(val)return parseFloat(val).toFixed(2);
            }
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            init_status_btn(){
                let curBtn = this.classifyButtons;
                this.classifyButtons = [];
                this.$nextTick(()=>{
                    this.classifyButtons = curBtn;
                });
            },
            init(){
                this.refresh_data();
            },
            look_oos_detail(row){
                this.$http(api_oos_details, row.id).then(res =>{
                    this.oosDetails = res;
                    this.oosDetailsShow = true;
                }).catch(code =>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            categories_init(){
                this.$http(api_get_categories,{}).then(res=>{
                    this.categoriesTempl = [{label:'全部分类',id:0,children:[]}];
                    for(var i in res){
                        let treeObj = {}
                        if(res[i].hasOwnProperty("child_ids")&&(res[i].child_ids.length>0)){
                            treeObj.label =res[i].title;
                            treeObj.id = res[i].id;
                            treeObj.children = res[i].child_ids.map(row=>{
                                return {
                                    id:res[row].id,
                                    label:res[row].title
                                }
                            })
                            this.categoriesTempl.push(treeObj);
                        }
                    }

                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            refresh_data(){
                this.isLoading=true;
                let data = {
                    page:this.tables.page,
                    pageSize:this.tables.pageSize,
                };
                this.params.selectStatus && (data.status = this.params.selectStatus);
                this.selectClassify && (data.warehouse_type = this.selectClassify);
                data.warehouse_id = this.selectEntrepot;
                if(this.selectLocation > 0){
                    data.cargo_space = this.selectLocation;
                }
                if(this.params.snType && this.params.snText !== ''){
                    data.snType = this.params.snType;
                    data.snText = this.params.snText.trim();
                }
                data.category_id = this.selectCategories;
                this.tables.lists = [];
                this.$http(api_get, data).then(res=>{
                    this.tables.lists = res.data;
                    this.tables.count = res.count;
                    this.isLoading=false;
                }).catch(code=>{
                    this.isLoading=false;
                });
            },
            select_entrepot(){
                this.refresh_data();
            },
            select(index, select){
                this.selectClassify = select.value;
                console.log(this.selectClassify);
                this.selectEntrepot = '';
                this.warehouse=select.name;
                this.refresh_data();

            },
            search(){
                this.refresh_data();
            },
            all(){
                this.$refs.tree.current = '';
                this.selectCategories = 0;
                this.refresh_data();
            },
            advanced_search(){
                console.log("高级搜索");
            },
            select_items(items){
                this.selectedItems = items;
            },
            change_size(size){
                this.tables.pageSize = size;
                this.refresh_data();
            },
            change_page(page){
                this.tables.page = page;
                this.refresh_data();
            },
            export_data(){
                let paramsData = {};
                if(this.selectedItems.length){
                    let ids=[];
                    this.selectedItems.forEach(row=>{
                        ids.push(row.id)
                    });
                    paramsData = {
                        ids: ids,
                        export_type:2
                    }
                }else{
                    paramsData = {
                        ids:'',
                        export_type:1,
                        snType:this.params.snType,
                        snText:this.params.snText.trim(),
                        status:this.params.selectStatus,
                        selectProductStatus:this.params.selectProductStatus,
                        warehouse_id: this.selectEntrepot,
                    };
                }
                this.$http(api_export,paramsData).then(res=>{
                    if(res.status === 1){
                        let params = {
                            file_code:res.file_code
                        };
                        let url= config.apiHost+'downloadFile/downExportFile';
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.file_name,
                            suffix:'.xls',
                        })
                    }else{
                        this.$message({type:'error',message:res.message || res});
                    }
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
            },
            platfrom_mdf(){
                if(this.selectedItems.length <= 0){
                    this.$message({
                        type:'warning',
                        message:'请至少选择一条要修改的数据'
                    });
                    return;
                }
                if(!this.platformMdfValue){
                    this.$message({
                        type:'warning',
                        message:'预警数不能为空或为0'
                    });
                    return;
                }
                this.$http(api_mdf_alert, this.selectedItems.map(data=>data.id),this.platformMdfValue).then(res=>{
                    this.$message({
                      type:'success',
                      message:res.message || res
                    });
                    this.selectedItems.forEach(res=>{
                        this.tables.lists.forEach(row=>{
                        	if(res.id===row.id){
                                row.alert_quantity = this.platformMdfValue;
                                row.updated_time = datef("YYYY-MM-dd",Date.parse(new Date)/1000);
                                console.log(row);
                            }
                        });
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
            },
            mdf(){
                if(this.selectedItems.length <= 0){
                    this.$message({
                        type:'error',
                        message:'请至少选择一条要修改的数据'
                    });
                }
            },
            show_detail(id){
                console.log(`show_detail ${id}`);
                this.showDetail = true;
                this.showDetailID = id;
            },
            categories_click(node){
                if(node.id !== undefined){
                    this.selectCategories = node.id;
                    this.init();
                }
            },
            outPut_dialog(row){
                this.outPutDialogRow = row;
                this.outPutDialog=true;
            }

        },
        watch:{
            showDetailID(id){
                if(id > 0 && !this.allDetailTables[id]){
                    this.$http(api_detail, id).then(res=>{
                        this.allDetailTables[id] = res;
                    }).catch(code=>{
                      this.$message({
                        type:'error',
                        message:code
                      })
                    });
                }
            },
            selectCategories(id){
                this.refresh_data();
            },
            selectClassify(val){
                this.$http(api_get_warehouses, val).then(res=>{
                    this.$set(this.entrepotListsAll, val,res);
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code
                    })
                })
            }
        },
        computed:{
            classifyBoxSpan(){
                return this.showHiddenClassify ? 20 : 24;
            },
            showHIddenClassifyName(){
                return this.showHiddenClassify ? "隐藏产品分类检索" : "显示产品分类检索";
            },
            detailTables(){
                return {
                    lists:[],
                    page:1,
                    pageSize:20,
                    count:100
                }
            },
            entrepotLists(){
                return this.entrepotListsAll[this.selectClassify] || [];
            },
            isShow(){
                return !!this.selectClassify;
            },
            comparesShow(){
                if(this.selectClassify.indexOf("third") >= 0){
                    return true;
                }else{
                    return false;
                }
            },
            isDisplayCompare(){
                return this.comparesShow && this.isCompare;
            },
            warehouseName(){
                let find = this.entrepotLists.find(row=>row.value === this.selectEntrepot);
                if(find){
                    return find.label;
                }else{
                    return '';
                }
            },
            goodsName(){
                return this.outPutDialogRow.sku || "";
            },
            clientWidth(){
                if(document.body.clientWidth>1366){
                  return true;
                }else{
                  return false;
                }
            },
            changeLabel(){
                let find = this.selectQuerys.find(res=>{
                	return res.value === this.params.snType;
                });
            	if(!!find){
            		return find.label;
                }
            }
        },
        components:{
            labelButtons,detail,
            tree:require('../../../components/tree.vue').default,
            boxArea:require('../../../components/box-area.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            integerInput: require('../../../components/integer-input.vue').default,
            uiLimitNuber:require('../../../components/ui-limit-number.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
        }
    }
</script>
