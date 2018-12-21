<template>
    <page>
        <search-card :params="form" :clears="clears" @search="search" @enter="search">
            <!--TODO 后台暂无接口  2017/7/7-->
            <label-buttons label="开发状态："
                           v-sf.currentStatus
                           :buttons="processBtn"
                           @select="select_status"
                           :max="40"></label-buttons>
            <div class="inline">
                <span>筛选条件：</span>
                <el-select v-model="form.snType" class="inline width-md"
                           v-sf.snType>
                    <el-option v-for="item in selectList1"
                               :value="item.value"
                               :key="item.value"
                               :label="item.label"
                               :disabled="item.disabled"></el-option>
                </el-select>
                <el-input v-model="form.snText"
                          v-sf.snText
                          class="inline"></el-input>
                <el-tooltip effect="dark" content="该搜索功能暂未启用" placement="top-start">
                    <el-select v-model="form.select2"
                               v-sf.select2
                               class="inline width-sm ml-sm" :disabled="true">
                        <el-option v-for="item in selectList2"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                    <el-select v-model="form.account"
                               v-sf.account
                               class="inline" :disabled="true">
                        <el-option v-for="item in accountList" :value="item.value" :key="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                </el-tooltip>
                <span class="inline ml-sm">创建日期：</span>
                <el-date-picker
                        v-sf.startT
                        type="date"
                        placeholder="开始时间"
                        v-model="form.startT"
                        class="inline date"
                        :picker-options="pickerStart"
                ></el-date-picker>&nbsp;--&nbsp;
                <el-date-picker
                        v-sf.endT
                        type="date"
                        placeholder="结束时间"
                        v-model="form.endT"
                        class="inline date mr-sm"
                        :picker-options="pickerEnd"
                ></el-date-picker>
            </div>
        </search-card>
        <body-content @skip="skip">
            <!--TODO 暂时未做-->
            <trends-select v-if="form.currentStatus>0&&handleList.length>0" class="trends-sel" @trigger="next_handle"
                           :selects="handleList" type="warning"></trends-select>
            <el-table
                    class="template scroll-bar"
                    border
                    v-resize="{height:41}"
                    :data="table.productList"
                    @selection-change="selection_change"
                    highlight-current-row
                    style="width:100%"
                    v-loading="isLoading"
                    element-loading-text="玩命加载中..."
            >
                <el-table-column type="selection" align="center" width="35px"></el-table-column>
                <el-table-column show-tooltip-when-overflow prop="spu" label="新产品编号" align="center" width="100px"
                                 row-key="spu"></el-table-column>
                <el-table-column show-tooltip-when-overflow prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column show-tooltip-when-overflow prop="category" label="分类" align="center"></el-table-column>
                <el-table-column show-tooltip-when-overflow prop="developer" label="创建人" align="center"
                                 width="120px"></el-table-column>
                <el-table-column show-tooltip-when-overflow prop="do" label="开发执行" align="center"
                                 width="120px"></el-table-column>
                <el-table-column show-tooltip-when-overflow inline-template label="创建时间" align="center">
                    <times :time="row.create_time"></times>
                </el-table-column>
                <el-table-column show-tooltip-when-overflow prop="process" label="状态" align="center"
                                 width="160px"></el-table-column>
                <el-table-column show-tooltip-when-overflow inline-template label="操作" align="center" width="110px">
                    <div>
                        <permission
                                tag="span"
                                :route="apis.url_product_base"
                                class="operate"
                                @click="lookup(row)">查看</permission>
                        <permission
                                tag="span"
                                :route="apis.url_product_base">|</permission>
                        <permission
                                tag="span"
                                :route="apis.url_update_base"
                                class="operate"
                                @click="process(row)">处理</permission>
                    </div>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination
                        class="page-fixed"
                        @size-change="change_size"
                        @current-change="change_page"
                        :current-page="table.page"
                        :page-sizes="[20, 50, 100,200,500]"
                        :page-size="table.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="table.totalSize">
                </el-pagination>
            </el-row>
        </body-content>
        <!--产品创建-->
        <new-intro
                ref="newIntro"
                v-model="newIntroDialog"
                @update="update_new_intro"
                :public="publicForm"
        ></new-intro>
        <new-detail v-model="dialogDetail"
                    :spuTitle="spuTitle"
                    :edit-able="editAble"
                    :child-active-name="activeName"
                    :id="id"
                    :current-status="form.currentStatus"
                    :process-id="processId"
                    @save-desc="save_desc"
                    @edit-desc="edit_desc"
                    @edit="edit"
                    @save="save"
                    @close="close"
                    @process-handle="process_handle"
        ></new-detail>
    </page>
</template>
<style lang="stylus">
    .trends-sel {
        position: absolute;
        top: 5px;
        left: 136px;
        animation: showSelect .3s;
        -webkit-animation: showSelect .3s;
    }
</style>
<script>
    import {
        product_list,
        batch_process,
        product_base,
        product_supplier,
        product_specification,
        product_attribute,
        product_log,
        producr_description,
        api_processbtn
    } from '../../../api/product';
    import {url_product_check,url_product_update} from '../../../api/product_create';
    import {url_product_base,url_update_base} from '../../../api/product';
    import labelButtons from '../../../components/label-buttons.vue';
    import bodyContent from './content.vue';
    import trendsSelect from '../../../components/trends-select.vue';
    import {findStatusName} from './product_status';
    import actions from './actions';
    import datef from 'datef';
    export default{
        permission:{
            url_product_check,
            url_product_update,
            url_product_base,
            url_update_base
        },
        name: 'product',
        page: {
            multiple: true,
            param(get, old){
                this.refreshId = get.params
            }
        },
        refresh(){
          this.init();
        },
        data(){
            return {
                spuTitle:"",
                activeName:"",
                refreshId: 0,//-----刷新id
                editAble: false,
                dialogDetail: false,
                actions: actions.actionLists,
                isLoading: true,
//                currentStatus: 0,
                form:{
                    snType: "name",
                    snText: "",
                    select2: 1,
                    account: "",
                    startT: "",
                    endT: "",
                    currentStatus:0,
                },
                clears:{
                    snType: "name",
                    currentStatus:0,
                },
                id: 0,
                processId: 0,
                title: "请选择",
                newIntroDialog: false,

                table: {
                    productList: [],
                    page: 1,
                    pageSize: 50,
                    totalSize: 0
                },
                selectList1: [
                    {label: "产品开发编号", value: "number", disabled: true},
                    {label: "产品名称", value: "name"},
                    {label: "产品编码/SKU", value: "SKU", disabled: true},
                ],
                hanStatus: [
                    {name: "全部", count: 0, status: 0},
                    {name: "我要处理的", count: 0, status: 1},
                    {name: "其他", count: 0, status: 2},
                ],
                selectList2: [
                    {label: "发起人", value: 1},
                    {label: "执行询价人员", value: 2},
                ],
                accountList: [
                    {label: "ewrwrwerwer", value: "asdd"},
                    {label: "ewrwrwerwer", value: "sad"},
                    {label: "ewrwrwerwer", value: "sdd"},
                ],
                ids: [],
                publicForm: {},
                processBtn: [],
                handleList: [],
                curHandle: {},
                productSelects: [],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.form.endT) {
                            return time.getTime() > this.form.endT;
                        } else {
                            return false;
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.startT) {
                            return time.getTime() < this.form.startT;
                        } else {
                            return false;
                        }
                    }
                },

            }
        },
        computed: {
            productListComputed(){
                return this.table.productList.filter(product => {
                    if (this.form.currentStatus === 0) {
                        return true;
                    }
                    return this.form.currentStatus === product.status;
                });
            },
        },
        created(){
            this.init();
            this.api_processbtn();
        },
        methods: {
//           产品创建
            skip(val){
                this.publicForm = {value: val};
                this.newIntroDialog = true;
                this.$nextTick(() => {
                    this.$refs.newIntro.init();
                })
            },
            update_new_intro(){
                this.init();
            },
            /*查看和处理在未提交和待审核状态下跳转至产品创建页面*/
            check_product(row){
                this.publicForm = {markId: 1, id: row.id};
                this.newIntroDialog = true;
                this.$nextTick(() => {
                    this.$refs.newIntro.init();
                })
            },
//            update_product(row){
//                this.publicForm = {markId: 2, id: row.id};
//                this.newIntroDialog = true;
//                this.$nextTick(() => {
//                    this.$refs.newIntro.init();
//                })
//            },
            /*--------end*/
//            detail/index页面的close按钮
            close(){
                this.init();
            },
            edit(val){},
            save(){ },
//            -----------------------------------------------  初始 开发产品列表
            init(){
                this.processId = 0;
                this.isLoading = true;
                let params = {
                    page: this.table.page,
                    pageSize: this.table.pageSize
                }
                this.form.currentStatus && (params.process_id = this.form.currentStatus);
                if (this.form.snType && this.form.snText) {
                    params.snType = this.form.snType;
                    params.snText = this.form.snText.trim();
                }
                if (this.form.startT) {
                    var d = new Date(this.form.startT);
                    this.form.startT = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    params.create_time_start = this.form.startT
                }
                if (this.form.endT) {
                    var d = new Date(this.form.endT);
                    this.form.endT = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    params.create_time_end = this.form.endT
                }
                this.table.productList = [];
                this.$http(product_list, params).then(res => {
                    this.handleList = res.actions.map(row => {
                        return {
                            label: row.btn_name,
                            value: row.code,
                            remark: row.remark,
                        }
                    });
                    this.table.productList = res.data;
                    this.table.totalSize = res.count;
                    this.isLoading = false;
                }).catch(code => {
                    console.log(code);
                    this.isLoading = false;
                });
            },
//            -----------------------------------------------  批量操作流程接口
            select_handle(index){
                this.curHandle = this.handleList[index];
                this.title = this.handleList[index].btn_name;
            },
            next_handle(val){
                if (this.productSelects.length <= 0) return this.$message({type:'warning',message:"请先选择所要操作的产品"});
                let params = {
                    ids: this.ids,
                    code: val.value,
                    remark: val.remark,
                }
                this.batch_process(params);
            },
//            -----------------------------------------------  单个操作流程接口  detail页面
            process_handle(){
                this.init()
            },
//            ---------------------------------------------  清空搜索
            clear(){
                this.form.select1 = "number";
                this.form.snText = "";
                this.form.select2 = 1;
                this.form.account = "";
                this.form.startT = "";
                this.form.endT = "";
                this.init();
            },
//            ---------------------------------------------  点击搜索
            search(){
                this.init();
            },
//            ---------------------------------------------  状态过滤
            status_formatter(row){
                return findStatusName(row.status);
            },
//            ---------------------------------------------  时间转换
            date_formatter(row){
                return datef(row.create_time);
            },
//            ---------------------------------------------  开发状态
            select_status(index,item){
                this.title = "请选择";
                this.curHandle = "";
                this.form.currentStatus = this.processBtn[index].value;
                this.init();
            },
//            ----------------------------------------------  列表 多选
            selection_change(muiSelect){
                this.ids = [];
                this.productSelects = muiSelect;
                this.ids = this.productSelects.map(row => {
                    return row.id;
                });
            },
//            ----------------------------------------------  列表 处理
            process(row){
                this.dialogDetail = true;
                this.editAble = true;
                this.id = row.id;
                this.processId = row.process_id;
                this.spuTitle = `处理编号：${row.spu} 数据`;
                switch (row.channel_id){
                    case 0:
                        this.activeName = "自定义图片";
                        break;
                    case 1:
                        this.activeName = 'ebay平台';
                        break;
                    case 2:
                        this.activeName = '亚马逊平台';
                        break;
                    case 3:
                        this.activeName = 'wish平台';
                        break;
                    case 4:
                        this.activeName = '速卖通平台';
                        break;
                }
            },
//            ---------------------------------------------  列表 查看
            lookup(row){
                this.dialogDetail = true;
                /*页面变为文本状态*/
                this.editAble = false;
                /*弹框级 按钮隐藏*/
                this.id = row.id;
                this.processId = row.process_id;
                this.spuTitle = `查看编号：${row.spu} 数据`;
            },
//          ---------------------------------------------- 列表 分页
            change_page(page){
                this.table.page = page;
                this.init();
            },
            change_size(size){
                this.table.pageSize = size;
                this.init();
            },
//            -----------------------------------------   产品描述
            save_desc(val){
            },
            edit_desc(val){
            },
//            -----------------------------------------   流程按钮Api
            api_processbtn(){
                this.$http(api_processbtn).then(res => {
                    this.processBtn = res.map(row => {
                        return {
                            name: row.btn_name,
                            value: row.process_id,
                            count: row.count || 0
                        }
                    })
                });
            },
//            -----------------------------------------   批量操作流程接口
            batch_process(data){
                this.$http(batch_process, data).then(res => {
                    this.$message(res.message);
                    this.init();
                }).catch(code => {
                    this.$message({message:code.message,type:'error'});
                })
            }
        },
        watch: {
            refreshId(val){
                if (val) this.init();
            },
        },
        components: {
            labelButtons,
            bodyContent,
            trendsSelect,
            searchCard:require('../../../components/search-card.vue').default,
            newDetail: require('../new-detail/index.vue').default,
            newIntro: require('../new-intro-new/index.vue').default,
        }
    }
</script>
