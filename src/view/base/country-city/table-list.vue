<template>
    <div class="c-table-data">
        <el-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :data="tableData.data"
                  ref="tableData"
                  border
                  @row-click="rowClick"
                  align="center"
                  v-resize="{height:41}"
                  highlight-current-row>
            <el-table-column   prop="country_en_name"  label="国家（英文）"></el-table-column>
            <el-table-column   prop="country_cn_name"  label="国家（中文）"></el-table-column>
        </el-table>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    export default {
        name: "table-data",
        data() {
            return {
                form: {
                    english_name:"",
                    name:'',
                },
            }
        },
        methods: {
            rowClick(row) {
                this.$emit("row-click", row);
            }
        },
        props: {
            loading: {
                required: true,
                type: Boolean
            },
            tableData: {
                required: true
            }
        },
        components: {
            modify: require('./modify.vue').default
        },
    }
</script>

