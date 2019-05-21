<template>
    <page>
        <el-card>
            <el-button>添加打印机</el-button>
            <el-button>添加打印服务器</el-button>
        </el-card>
        <el-table :data="printers">
            <el-table-column prop="" label="打印机名字"></el-table-column>
            <el-table-column prop="" label="打印机别名"></el-table-column>
            <el-table-column prop="" label="打印机服务器"></el-table-column>
            <el-table-column prop="" label="操作"></el-table-column>
        </el-table>
    </page>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: "setting-printer",
        computed:{
            ...mapGetters({
                printers:'printer/printers'
            })
        }

    }
</script>

<style scoped>

</style>