<template>
    <page>
        <el-table  :data="tableData"
                    v-loading="loading"
                    v-resize="{height:41}"
                    element-loading-text="玩命加载中..."
                   highlight-current-row>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="code" label="code"></el-table-column>
            <el-table-column prop="name" label="标签名称"></el-table-column>
            <el-table-column prop="typeText" label="类型"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="statusText" label="状态"></el-table-column>
            <el-table-column prop="create_time" label="添加时间"></el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <span class="operate" @click="view(row)">查看</span> |
                    <span class="operate" @click="edit(row)">编辑</span> |
                    <span class="operate" @click="remove(row)">删除</span>
                </div>
            </el-table-column>
        </el-table>
    </page>
</template>

<script>
    export default {
        data(){
            return{
                loading:false
            }
        },
        methods:{
            view(row){
                console.log("查看",row);
                this.$emit("operation",{data:row,type:"view"});
            },
            edit(row){
                this.$emit("operation",{data:row,type:"edit"});
            },
            remove(row){
                this.$emit("operation",{data:row,type:"remove"});
            }
        },
        props:{
            tableData:{
                required: true,
                type:Array
            }
        }
    }
</script>

<style scoped>

</style>
