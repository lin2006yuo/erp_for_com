<template>
    <el-row class="p-check">
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click.native="dialogVisible = false">取 消</el-button>
    <el-button type="primary" size="mini"  @click.native="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {}
        },
        components: {}
    }
</script>