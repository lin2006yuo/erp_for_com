<template>
    <div class="c-table-data">
        <el-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :data="tableData.data"
                  ref="tableData"
                  border
                  align="center"
                  v-resize="{height:41}"
                  highlight-current-row>
            <el-table-column prop="english_name" label="城市（英文）"></el-table-column>
            <el-table-column prop="name" label="城市（中文）"></el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <el-button  size="mini" type="primary" @click="see_account(row)">修改</el-button>
                    <span> | </span>
                    <el-button size="mini"  @click="del(row)">删除</el-button>
                </div>
            </el-table-column>
        </el-table>

        <modify v-model="dialogShow"
                :form="form"
                @update="update"
        >
        </modify>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {api_city_mod, api_city_del} from '../../../api/global-countries';

    export default {
        name: "table-data",
        data() {
            return {
                dialogShow: false,
                flag: 0, //0 add  1 see  2 edit,
                form: {
                    english_name: "",
                    name: '',
                },
            }
        },
        methods: {
            see_account(row) {
                this.dialogShow = true;
                this.form = clone(row);
            },
            // 删除数据。
            del(row) {
                this.$confirm(`您将删除此城市信息,确认操作吗?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http(api_city_del, row.id).then(res => {
                        let index = this.tableData.data.findIndex(item => item.id === row.id);
                        this.tableData.data.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: "删除成功"
                        });
                        this.dialogShow = false;
                    }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: err.message || err
                        });
                    })
                });
            },
            update(params) {
                let index = this.tableData.data.findIndex(item => item.id === params.id);
                this.tableData.data[index] = params;
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

