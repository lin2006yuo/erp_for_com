<template>
    <el-table :data="tableData"
               v-loading="loading"
               v-resize="{height:41}"
               element-loading-text="玩命加载中..."
               highlight-current-row>
        <el-table-column prop="id" label="NO">

        </el-table-column>
         <el-table-column prop="post" label="邮局">
            
        </el-table-column>
         <el-table-column prop="email_count" label="邮箱号数">
            
        </el-table-column>
         <el-table-column prop="imap_url" label="收件服务器地址">
            
        </el-table-column>
         <el-table-column prop="smtp_url" label="发件服务器地址">
            
        </el-table-column>
         <el-table-column prop="status" label="状态" inline-template>
            <el-switch :value="row.status"
                       on-text="启用"
                       off-text="停用"
                       @change="change_status(row)">
            </el-switch>
        </el-table-column>
         <el-table-column prop="create_txt" label="添加人">
            
        </el-table-column>
        <el-table-column prop="create_time_date" label="添加时间">
            
        </el-table-column>
        <el-table-column label="操作" inline-template>
        <template>
            <span class="operate" @click="view(row)">查看</span>
            |&nbsp;<span class="operate" @click="edit(row)">编辑</span>
        </template>
    </el-table-column>
    </el-table>
</template>

<style lang="">   
</style>

<script>
import {api_put_status} from '../../../api/post-management.js'

export default {
    data(){
        return{
            loading:false
        }
    },
    methods:{
        view(row){
            let data={row:row,type:'view'}
            this.$emit('get-form',data)
        },
        edit(row){
            let data={row:row,type:'edit'}
            this.$emit('get-form',data)
        },
        change_status(row){
             this.$confirm(`确定进行此操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    row.status = !row.status
                    let updateData={status:row.status===true?1:0};
                    // console.log("updateData:",updateData);
                    this.$http(api_put_status,row.id,updateData)
                        .then(res=>{
                            this.$message({type:'success',message:'修改成功'});
                        })
                        .catch(error=>{
                            this.$message({type:'error',message:error.message})
                            row.status = !row.status
                        })                    
                }).catch(()=>{                
                   this.$message({
                        type:"info",
                        message:"已取消操作"
                    });
                })
        }
    },
    props:{
        tableData:{}
    }
}
</script>
