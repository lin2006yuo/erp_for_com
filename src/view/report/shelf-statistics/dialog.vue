<template>
    <page-dialog size="small" v-model="dialog" :close-on-click-modal="false" :title="title">
        <el-table
                :data="infoList"
                border
                style="width: 100%;margin-top: 30px">
            <el-table-column prop="accountName" label="账号简称"></el-table-column>
            <el-table-column prop="num" label="次数" ></el-table-column>
        </el-table>
        <div slot="footer">
            <el-button @click="close">关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialog: this.value
            }
        },
        methods: {
            close() {
                this.dialog=false
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog=val;
            }
        },
        props:{
            title:{
                type:String
            },
            infoList:{
                type:Array
            },
            value:{},
        },
        components:{ pageDialog:require('@/components/page-dialog.vue').default,}
    }
</script>

<style scoped>

</style>