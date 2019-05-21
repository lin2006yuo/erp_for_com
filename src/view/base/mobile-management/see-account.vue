<template>
    <page-dialog
        :title='title'
        v-model="show">
        <el-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :data="seeTableData.data"
                  ref="tableData"
                  border
                  align="center"                
                  highlight-current-row>
            <el-table-column
                    label="平台"
                    prop="channel_name">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="站点"
                    prop="site_code">
            </el-table-column>
            <el-table-column
                    label="账号简称"
                    show-overflow-tooltip
                    prop="account_code">
            </el-table-column>
            <el-table-column
                    label="公司名称"
                    show-overflow-tooltip
                    prop="company">
            </el-table-column>   
        </el-table>
        <div slot="footer" class="see-account">
            <el-button @click.native="close" class="mt-sm">关闭</el-button>            
        </div>
    </page-dialog>
</template>

<script>
export default {
    data() {
        return {
            show: this.value
        }
    },
    methods: {
        close(){
            this.show=false;          
        },
    },
    watch: {
        show(val){
            this.$emit('input',val)
        },
        value(val) {
            this.show=val;
        },
    },
    props: {
        value: {},
        title: {},        
        loading: {},
        seeTableData: {}   
    }
}
</script>

<style lang="stylus" scoped>
.see-account{
    display flex
    justify-content flex-end
}
    
</style>