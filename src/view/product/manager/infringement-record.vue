<template>
    <div class="c-Infringement-record">
        <p>
            <el-button v-if="editAble" type="primary" @click="add_tort">新增侵权记录</el-button>
            <el-button v-else type="primary" @click.native="edit">编辑</el-button>
        </p>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="channel_name"
                label="平台"
            >
            </el-table-column>
            <el-table-column
                prop="site_code"
                label="站点"
            >
            </el-table-column>
            <el-table-column
                prop="account_name"
                label="账号">
            </el-table-column>
            <el-table-column
                label="时间">
                <template slot-scope="scope">
                    {{new Date(scope.row.tort_time).getTime()|dateFilter}}
                </template>
            </el-table-column>
            <el-table-column
                prop="tort_type"
                label="侵权类型">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="侵权描述">
            </el-table-column>
            <el-table-column
                v-if="editAble"
                label="操作">
                <template slot-scope="scope">
                    <span style="color:dodgerblue;cursor: pointer;" @click="show_dialog(scope.row)">编辑</span>
                    <span>|</span>
                    <span style="color:dodgerblue;cursor: pointer;" @click="delete_Infringement(scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <!--新增侵权记录弹窗-->
        <add-diaog v-model="tort_dialog"
                   :title="title"
                   :public="public"
                   :platform="platform"
                   @close="close"
                   @onchange="onchange"
                   @addCheck="add_check"
                   @edit="edit_check"
                   :edit='edit_bool'
                   :look="edit_look"
        ></add-diaog>
    </div>
</template>

<script>
    import {
        api_get_channel,
    } from '../../../api/order-local';
    import {
        api_get_goods_description,
        api_delete_Infringement,
        api_edit_Infringement
    } from "../../../api/product-library";
    import {api_tort_add,api_tort_edit} from '../../../api/product';
    import { url_edit_Infringement, url_delete_Infringement} from "../../../api/product-library";
    export default {
        data() {
            return {
                tableData: [],
                tort_dialog:false,
                title:'',
                platform:[],
                edit_bool:false,
                edit_look:true,
                public:{
                    id:'',
                    spu:this.spu,
                    channel_id:'',
                    site_code:'',
                    account_id:'',
                    tort_time:'',
                    tort_type:'',
                    remark:'',
                    email_content:'',
                },
            }
        },
        methods: {
            add_check(val,img){
                let obj=clone(val);
                obj.email_img=img.length>0?img:'';
                if(obj.tort_time instanceof Date){
                    obj.tort_time = datef("YYYY-MM-dd HH:mm:ss", obj.tort_time.getTime()/1000);
                }
                this.$http(api_tort_add,obj).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.tort_dialog=false;
                    this.get_description_message()
                }).catch(e=>{
                    this.$message({type:"error",message:e.message||e||'添加有误'})
                })
            },
            close(){
                this.public={
                    spu:this.spu,
                    channel_id:'',
                    site_code:'',
                    account_id:'',
                    tort_time:'',
                    tort_type:'',
                    remark:'',
                    email_content:'',
                }
            },
            onchange(val){
                this.public.email_content=val;
            },
            edit_check(val,img){
                let obj=clone(val);
                obj.email_img=img.length>0?img:'';
                obj.tort_time = datef("YYYY-MM-dd HH:mm:ss", obj.tort_time/1000);
                console.log(val);
                this.$http(api_tort_edit,val.id,obj).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.tort_dialog=false;
                    this.get_description_message()
                }).catch(e=>{
                    this.$message({type:"error",message:e.message||e||'编辑有误'})
                })
            },
            show_dialog(val){
                if (this.$hasPermission(url_edit_Infringement)) {
                    this.public.id=val.id;
                    this.title=`编辑${this.spu}侵权纪录`;
                    this.edit_bool=true;
                    this.$http(api_edit_Infringement,val.id).then(res=>{
                        this.public.channel_id=res.channel_id;
                        this.public.site_code=res.site_code;
                        this.public.account_id=res.account_id;
                        this.public.tort_time=res.tort_time*1000;
                        this.public.tort_type=res.tort_type;
                        this.public.remark=res.remark;
                        this.public.email_content=res.email_content;
                        this.tort_dialog=true;
                    })
                }else{
                    this.$message({
                        type: "error",
                        message: "没有编辑侵权记录的权限"
                    })
                }
                console.log(val);
            },
            add_tort(){
                this.title=`新增${this.spu}侵权纪录`;
                this.edit_bool=false;
                this.tort_dialog=true;
            },
            //获取侵权信息
            get_description_message() {
                this.$http(api_get_goods_description, this.goodsId, {page: 1, page_size: 50})
                    .then(res => {
                        this.tableData = [...res.list];
                    })
                    .catch(err => {
                        this.$message({type: "error", message: error.message});
                    })
            },
            edit(){
                this.$emit("edit");
            },
            delete_Infringement(obj) {
                if (this.$hasPermission(url_delete_Infringement)) {
                    let {id} = obj;
                    this.$confirm('是否删除该侵权记录', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_delete_Infringement, id)
                            .then(res => {
                                console.log(res);
                                this.get_description_message();
                            })
                            .catch(err => {
                                this.$message({
                                    type: 'error',
                                    message: '未知错误!'
                                });
                            })
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message({
                        type: "error",
                        message: "没有删除侵权记录的权限",
                    })
                }
            },
            get_channel(){
                this.$http(api_get_channel)
                    .then(res=>{
                        console.log(res);
                        this.platform = [...res];
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
            }
        },
        mounted() {
            this.get_channel();
            this.get_description_message();
        },
        filters:{
            dateFilter(val){
                return datef('YYYY-MM-dd', val);
            }
        },
        props: {
            spu:{},
            goodsId: {
                required: true,
                type: Number
            },
            editAble: {},
        },
        components: {
            "page-dialog": require("../../../components/page-dialog").default,
            selectRemote: require('../../../components/select-remote.vue').default,
            addDiaog:require('../infringement/add-diaog.vue').default,
        }
    }
</script>

