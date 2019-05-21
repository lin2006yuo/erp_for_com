<template>
    <page-dialog
        v-model="show"
        width="835px"
        :title="title">
        <el-table
            :data="tableData"
            v-loading="loading"
            style="width:100%">
            <el-table-column
                prop="channel"
                label="平台">
            </el-table-column>
            <el-table-column
                prop="site_code"
                label="站点">
            </el-table-column>
            <el-table-column
                prop="account_name"
                label="账号">
            </el-table-column>
            <el-table-column
                width="105"
                label="侵权时间">
                <template slot-scope="scope">
                    {{ scope.row.tort_time | timeFilter }}
                </template>
            </el-table-column>
            <el-table-column
                label="侵权类型">
                <template slot-scope="{row}">
                    {{row.tort_type}}
                </template>
            </el-table-column>
            <el-table-column
                prop="remark"
                label="描述"
                width="300">
            </el-table-column>
            <el-table-column
                prop="realname"
                label="添加人">
            </el-table-column>
        </el-table>

        <div slot="footer" >
            <template v-if="footerBtnShow">
                <span>该spu存在侵权记录，是否继续？ </span>
                <el-button type="primary" @click="tort_submit">确定</el-button>
                <el-button @click="tort_close">取消</el-button>
            </template>
        </div>
    </page-dialog>
</template>

<script>
    import {api_publish_express_goods_tort_info} from "@/api/publish-smt"
    export default {
        name: "tort-record",
        data(){
            return{
                show:this.value,
                tableData:[],
                loading:false
            }
        },

        methods:{
            getTortInfo(id){
                this.loading = true;
                this.$http(api_publish_express_goods_tort_info,{goods_id:id}).then(res=>{
                    this.tableData = res;
                    this.loading = false;
                }).catch(error=>{
                    this.$message({type:"error",message:error.massage||error});
                })
            },
            tort_submit(){
                this.$emit("tort_submit");
            },
            tort_close(){
                this.show = false;
                this.$emit("tort_close");
            }
        },
        filters:{
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            },
            tortTypeFilter(val){
                switch(val){
                    case 1:
                        return "图片侵权";
                        break;
                    case 2:
                        return "商标侵权";
                        break;
                    case 3:
                        return "著作权侵权";
                        break;
                    case 4:
                        return "外观设计侵权";
                        break;
                    case 5:
                        return "禁限售产品";
                        break;
                    case 6:
                        return "其他知识产权侵权";
                        break;
                    default:
                        return "--"

                }

            }
        },
        props:{
            value:{
                type:Boolean,
                require:true
            },
            title:{
                type:String,
                require:true
            },
            tortInfo:{
                type:Object,
                require:true
            },
            footerBtnShow:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            value(val,oldVal){
                this.show = val;
            },
            show(val,oldVal){
                this.$emit("input",val);
            },
            "tortInfo.id":{
                deep:true,
                handler(val,oldVal){
                    this.getTortInfo(val);
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>

