<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="65%">
        <el-table border
                  highlight-current-row
                  :data="logData"
                  max-height="550">
            <el-table-column
                    label="操作时间"
                    width="150"
                    inline-template>
                <div>{{row.create_time|fmsdatetime}}</div>
            </el-table-column>
            <el-table-column
                    width="90"
                    label="操作人"
                    inline-template>
                <div>
                    <el-popover v-if="row.operator_id>1"
                                placement="left"
                                width="200"
                                trigger="hover"
                                :open-delay="500"
                                @show="show_change(row.operator_id)">
                        <span v-text="department"></span>
                        <span slot="reference">{{row.operator}}</span>
                    </el-popover>
                    <div v-else>{{row.operator}}</div>
                </div>
            </el-table-column>
            <el-table-column
                label="操作类型"
                width="150"
                inline-template>
                <div>{{row.operator_type}}</div>
            </el-table-column>
            <el-table-column
                    label="操作内容"
                    prop="remark"
                    inline-template>
                <div v-for="(content,index) in remarks(row.remark)" :key="index">
                    {{content}}
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" class="inline" @click.native="close">关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_get_operation_log_department} from '@/api/account-information'
    export default {
        name: "operation-log",
        data() {
            return {
                show:this.value,
                loading:false,
                department:''
            }
        },
        watch: {
            show(val){
                this.$emit('input',val)
            },
            value(val){
                this.show=val;
            },
        },
        methods: {
            show_change(id){
                this.$http(api_get_operation_log_department,id).then(res=>{
                    this.department=res.map(row=>row.name).join('');
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            remarks(remark){
                return remark.map(row=>{
                    if(row.indexOf('【账号创建时间】')>-1){
                        row=row.substring(0,row.length-8);
                    }
                    return row;
                })
            },
            close(){
                this.show=false;
            }
        },
        props: {
            value:{},
            title:{},
            logData:{
                type:Array,
                default:[]
            }
        },
    }
</script>

