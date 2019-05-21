<template>
    <page class="wrap">
        <search
            :searchData="searchData"
            :clear = "clearData"
            @search = "init"
        ></search>
        <el-row class="mt-sm mb-sm">
            <el-button size="mini" type="primary" @click="add">添加</el-button>
            <el-button size="mini" type="primary" @click="batch_add">批量添加 </el-button>
        </el-row>
        <el-row class="table-data">
            <el-table
                class="scroll-bar"
                v-resize="{height:41}"
                border
                element-loading-text="玩命加载中..."
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                    label="ID"
                    prop="developer_id"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="developer"
                    label="开发员">
                </el-table-column>
                <el-table-column
                    prop="grapher_txt"
                    label="摄影师">
                </el-table-column>
                <el-table-column
                    prop="translator_txt"
                    label="翻译员">
                </el-table-column>
                <el-table-column
                    prop="designer_master_txt"
                    label="美工组长">
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time|fmsdatetime}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="read_data(scope.row)">查看</el-button>
                        <span >|</span>
                        <el-button type="text" size="mini" @click="edit_data_func(scope.row)">编辑</el-button>
                        <span >|</span>
                        <el-button type="text" size="mini" @click="delete_data(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="searchData.page"
                :page-size="searchData.page_size"
                :total="count"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[20,50,100,200]">
            </el-pagination>
        </el-row>
        <dialog-info
            v-model="dialogShow"
            :title="title"
            :flag = "flag"
            :edit_info = "edit_info"
            :parent_data = "tableData"
            @refresh = "init">
        </dialog-info>
    </page>
</template>

<script>
    import {api_developer_list,api_id_developer,api_developer_delete,api_lang} from "@/api/developer-correspondence-matrix.js"
    export default {
        data(){
            return{
                title:"",
                flag:0, // 0 添加  1 查看 2 编辑 3 批量添加
                searchData:{
                    developer_id:"",
                    grapher:"",
                    translator:"",
                    designer_master:"",
                    create_time_st:"",
                    create_time_nd:"",
                    page:1,
                    page_size:50
                },
                count:0,
                clearData:{
                    developer_id:"",
                    grapher:"",
                    translator:"",
                    designer_master:"",
                    create_time_st:"",
                    create_time_nd:"",
                    page:1,
                    page_size:50,
                },
                tableData:[],
                dialogShow:false,
                edit_info:[
                    {
                        developer_id:"",
                        grapher:"",
                        designer_master:"",
                        translator:[
                            {
                                lang:"",
                                translator:""
                            }
                        ],
                        langOptions:[],
                        isCheck:false
                    }
                ],
                langOptions:[]

            }
        },
        created(){
            this.getLangList();
            this.init();
        },
        methods:{
            size_change(val){
                this.searchData.page_size = val;
                this.init();
            },
            current_change(val){
                this.searchData.page = val;
                this.init();
            },
            batch_add(){
                this.dialogShow = true;
                this.flag = 3;
                this.title = '批量添加开发员对应矩阵';
                this.edit_info = [
                    {
                        developer_id:"",
                        grapher:"",
                        designer_master:"",
                        translator:[
                            {
                                lang:"",
                                translator:""
                            }
                        ],
                        langOptions:window.clone(this.langOptions),
                        isCheck:false
                    }
                ];
            },
            add(){
                this.dialogShow = true;
                this.flag = 0;
                this.title = "添加开发员对应矩阵";
                this.edit_info = [
                    {
                        developer_id:"",
                        grapher:"",
                        designer_master:"",
                        translator:[
                            {
                                lang:"",
                                translator:""
                            }
                        ],
                        langOptions:window.clone(this.langOptions)
                    }
                ];

            },
            read_data(row){
                this.flag = 1;
                this.dialogShow = true;
                this.title = `查看开发员 :  ${row.developer} 对应矩阵`;
                this.read_developer_data(row.developer_id);
            },
            edit_data_func(row){
                this.flag = 2;
                this.dialogShow = true;
                this.title = `修改开发员 :  ${row.developer} 对应矩阵`;
                this.read_developer_data(row.developer_id);
            },
            read_developer_data(id){
                this.$http(api_id_developer,id).then(res=>{
                    let data = window.clone(res);
                    data.langOptions = this.langOptions;
                    this.$set(this.edit_info,0,data);
                }).catch(err=>{
                    this.$message({type:"error",message:err.message||err});
                })
            },
            delete_data(row){
                this.$confirm("此操作将删除该条数据，是否继续？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    trye:"warning"
                }).then(()=>{
                    this.$http(api_developer_delete,row.developer_id).then(res => {
                        this.$message({type:"success",message:res.message});
                        this.init();
                    }).catch(error => {
                        this.$message({type: "error", message: error.message || error});
                    });
                }).catch(()=>{
                    this.$message({type:"info",message:"已取消删除"});
                });
            },
            init(){
                let data = window.clone(this.searchData);
                if(data.create_time_st){
                    data.create_time_st = window.datef('YYYY-MM-dd',(new Date(this.searchData.create_time_st))/1000);
                }else{
                    data.create_time_st = "";
                }
                if(data.create_time_nd){
                    data.create_time_nd = window.datef("YYYY-MM-dd",(new Date(this.searchData.create_time_nd))/1000);
                }else{
                    data.create_time_nd = "";
                }
                this.$http(api_developer_list,data).then(res=>{
                    this.$set(this,"tableData",res.list);
                    this.$set(this,"count",res.count);
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },
            getLangList(){
                this.$http(api_lang).then(res=>{
                    let options = res.map(val=>{
                        return {
                            value:val.code,
                            label:val.name,
                            disabled:false
                        }
                    });
                    this.langOptions = options;
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },

        },
        watch:{
            "tableData":{
                deep:true,
                handler(val,oldVal){}
            }
        },
        components:{
            "search":require("./search.vue").default,
            "dialog-info":require('./dialog-info.vue').default,

        }
    }
</script>

<style lang="stylus" scoped>

</style>
