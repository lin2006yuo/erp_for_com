<template>
    <el-row>
        <el-col :span="24">
            <el-popover
                    ref="popover1"
                    placement="top-start"
                    title="标题"
                    width="200"
                    trigger="hover"
                    content="这是一段容,这是一段容,这是一段容,这是一段容。">
            </el-popover>
            <el-button v-popover:popover1>hover 激活</el-button>
            <el-popover
                    ref="popover2"
                    placement="bottom"
                    title="标题"
                    width="200"
                    trigger="click"
                    content="这是一段容,这是一段容,这是一段容,这是一段容。">
            </el-popover>
            <el-button v-popover:popover2>click 激活</el-button>
        </el-col>
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
