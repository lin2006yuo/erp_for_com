<template>
    <el-row class="p-add-supplier">
        <page-dialog title="选择备货计划申请单" v-model="selectBox" size="large" @change="closeDialog" :close-on-click-modal="false">
            <div style="height: 300px;overflow-y: auto;">
                <table class="template">
                    <tr class="line" style="font-weight:bold">
                        <th width="44px"></th>
                        <th>申请单号</th>
                        <th>总品类数/商品数</th>
                        <th>申请数量</th>
                        <th>备货数量</th>
                        <th>分配数量</th>
                        <th>创建时间</th>
                    </tr>
                    <tbody>
                    <tr v-if="planData.length==0">
                        <td :colspan="7">暂无数据！</td>
                    </tr>
                    <tr v-for="(data, index) in planData" @click="select_radio(data)">
                        <td>
                            <el-radio class="radio" v-model="radio" :label="data.id">
                                <span></span>
                            </el-radio>
                        </td>
                        <td>
                            <ui-tips :content="data.code"></ui-tips>
                        </td>
                        <td><span>{{data.sku_count}}/{{data.goods_count}}</span></td>
                        <td><span>{{data.quantity}}</span></td>
                        <td>
                            <span>{{data.stock_qty}}</span>
                        </td>
                        <td>
                            <span>{{data.assigned_qty}}</span>
                        </td>
                        <td>
                            <span>{{data.create_time | timeFilter}}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <el-pagination
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="page"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submit">确定</el-button>
                <el-button size="mini" @click.native="selectBox=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-add-supplier{
        .search-box{
            position: relative;
            margin-bottom: 5px;
            .el-icon-search{
                position: absolute;
                top:8px;
                left: 5px;
                z-index: 1999;
            }
            .el-input__inner{
                width: 300px;
                padding: 3px 16px;
            }
        }
    }
</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue'
    import {api_choose_list,url_choose_list} from '../../../../api/overseas-stock';
    export default{
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'赖永凤',
                createTime:'2017-12-14',
                updateTime:'2017-12-14'
            }
        },
        data(){
            return {
                snText:'',
                selectBox:false,
                checkId:[],
                newPriceData:[],
                radio:'',
                showPrice:false,
                rowIndex:'',
                total:0,
                pageSize:20,
                page:1,
                planData:[]
            }
        },
        created(){
        },
        mounted(){

        },
        methods: {
            init(){
                let data ={
                    warehouse_id :this.selsetId.warehouse_id,
                    pageSize :this.pageSize,
                    page :this.page,
                };
                this.$http(api_choose_list,this.selsetId.id,data).then(res=>{
                    this.planData = res.list;
                    this.total = res.count;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            select_radio(data){
                console.log('111',data);
                this.radio = data.id;
            },
            handle_size_change(val){
                this.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.page = val;
                this.init();
            },
            submit(){
                if (this.checkId.length > 0) {
                    this.$emit('update-id',this.checkId);
                    this.selectBox = false;
                }
            },
            closeDialog(val){
                if (val) {
                    this.checkId = [];
                    this.snText = '';
                    this.radio = '';
                }
            }
        },
        filters: {
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            }
        },
        watch: {
            value(val){
                this.selectBox = val;
            },
            selectBox(val){
                this.$emit('input',val)
            },
            radio(val){
                this.checkId = [];
                this.checkId.push(this.planData.find(data => data.id === val));
            },
            selsetId(val){
            	if(val){
            		this.init();
                }
            }
        },
        computed: {},
        props: {
            value:{},
            selsetId:{},
        },
        components: {
            pageDialog,
            uiTips:require('../../../../components/ui-tips.vue').default,
        }
    }
</script>
