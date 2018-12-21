<template>
    <page-dialog :title="previewAction.title"
                 size="full"
                 @open="open"
                 class="p-inventory-check"
                 v-model="visible"
                 :close-on-click-modal="false">
        <div class="print">
            <p class="print-title">
                请使用本界面的打印按钮直接打印，不要用浏览器打印功能
                <el-button @click="print">打印</el-button>
                <span class="fr mr-sm">
                    <span>打印机：</span>
                    <select-printer v-model="printer" class="inline width-lg"></select-printer>
                </span>
            </p>
        </div>
        <el-card>
            <el-table
                :data="tableData"
                :height="500"
                v-loading="loading"
                ref="tableData"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
                <el-table-column
                    inline-template
                    width="120"
                    label="SKU">
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="名称">
                    <div>
                        <ui-tip :content="row.sku_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                    inline-template
                    width="150"
                    label="分区">
                    <div>
                        <ui-tip :content="row.warehouse_area_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="货位">
                    <div>
                        <ui-tip :content="row.warehouse_cargo_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </el-table>
            <el-pagination
                class="fr mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <div style="visibility: hidden">
            <form ref="printForm"
                  method="POST"
                  action="http://localhost:10093/print"
                  target="printResultFrame">
                <input type="hidden" name="Type" value="html"/>
                <input type="hidden" name="Token" :value="token"/>
                <input type="hidden" name="Width" :value="210"/>
                <input type="hidden" name="Height" :value="297"/>
                <input type="hidden" name="Top" :value="10"/>
                <input type="hidden" name="PrintName" :value="printer"/>
                <textarea name="Url"
                          style="display:none;"
                          ref="url">
                </textarea>
                <textarea name="NumberList"
                          style="display:none;"
                          ref="numberList">
                </textarea>
                <textarea name="content"
                          style="display:none;"
                          ref="textarea">
                </textarea>
            </form>
            <iframe ref="printResultFrame"
                    name="printResultFrame"
                    frameborder="0" style="width:0;height:0;">
            </iframe>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-inventory-check{
        .border-box{
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            border-right:1px solid #d3dce6;
        }
        .right-table{
            width: 100%;
            border:1px solid #d3dce6;
            td{
                text-align: center;
                border-top: 1px solid #d3dce6;
                border-right:1px solid #d3dce6;
                height:26px;
            }
            td:nth-child(2n+1){
                background-color: #f5f7fa;
            }
        }
        .category_title {
            box-sizing: border-box;
            display: block;
            width: 100%;
            height: 30px;
            line-height: 28px;
            padding-left: 10px;
            background: #008BCE;
            border: 1px solid #008BCE;
            color: #fff;
            -moz-user-select: none;
            user-select: none;
            &:hover {
                background: rgb(51, 162, 216);
                cursor: pointer;
            }
        }
        .add-goods-tree {
            max-height: 550px;
            overflow-y: auto;
        }
        .checkAll{
            height:30px;
            line-height:30px;
            background-color: #33a2d8;
        }
        .print{
            text-align: center;
            margin-bottom: 10px;
            color: #ff4949;
            height: 40px;
            line-height:40px;
            .print-title{
                width: 60%;
                border: 3px solid black;
                font-size: 2rem;
                background-color: yellow;
                margin: 0 auto;
            }
        }
        .warningborder{
            input{
                border-color: #ff4949 !important;
            }
        }
        .blue{
            color: #1D8CE0;
            line-height:26px;
        }
    }
</style>
<script>
    import {print} from "./preview"
    export default {
        data(){
            return {
                visible: this.value,
                searchData:{
                    page:1,
                    pageSize:20
                },
                tableData:[],
                loading: false,
                addList:[],
                total:0,
                totalData:[], //全部全选的数据
                arr:[], //分页显示的数据
                copyData:[], //拷贝获取的所有数据
                print_html:'',
                print_number:1,
                print_list:[],
                printer:'',
                token:'',
                numberList:[]
            }
        },
        mounted(){},
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            open(){//弹框关闭时
                this.copyData = clone(this.selectData);
                this.total = this.copyData.length;
                this.tabData();
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.tabData();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.tabData();
            },
            //前端分页
            tabData(){
                this.arr = [];
                this.tableData = [];
                this.copyData.forEach((row, index)=>{
                    if(index < this.searchData.page * this.searchData.pageSize && index >= (this.searchData.page - 1) * this.searchData.pageSize){
                        this.arr.push(row);
                    }
                });
                this.tableData = this.arr;
            },
            //打印
            print(){
                if(this.printer === ''){
                    this.$message({type:"error",message:'当前PC未启动打印服务'});
                    return false;
                }
                let pageSize = 35;//打印的每页的数量
                let flag = false;//是否发送表单确定打印
                this.print_html = '';//打印的内容
                this.print_number = 1;//打印的页码
                //循环打印的页数
                for(let i = 0; i < Math.ceil(this.copyData.length/pageSize);i++){
                    this.print_list = [];
                    //循环的次数为最后一页时可以进行打印
                    if(i === Math.ceil(this.copyData.length/pageSize)-1){
                        flag = true;
                    }
                    this.copyData.forEach((row, index)=>{
                        if(index < this.print_number * pageSize && index >= (this.print_number - 1) * pageSize){
                            this.print_list.push(row);
                        }
                    });
                    print.call(this,true, flag);
                    this.print_number++;
                }
            },
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                // if(val){
                //     this.copyData = clone(this.selectData);
                //     this.total = this.copyData.length;
                //     this.tabData();
                // }
                this.visible = val;
            },
        },
        props: {
            value:{
                default(){
                    return false;
                },
            },
            previewAction:{},
            selectData:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            selectPrinter:require('../../../components/select-printer.vue').default,
        },
    }
</script>
