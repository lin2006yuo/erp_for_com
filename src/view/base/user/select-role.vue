<template>
    <page-dialog
        v-model="show"
        :title="title"
        @open="open"
        size="large"
        >
        <div class="mt-md mb-md border">
            <el-row class="mb-sm">
                <label-buttons @select="changeSelect" label="状态：" :buttons="userStatus"
                               :default-index="defaultIndex"></label-buttons>
            </el-row>
            <el-row>
                <label-item label="角色名称：">
                    <el-input v-model="search" class="mr-sm"></el-input>
                    <el-button size="mini" type="primary" @click="searchFilter">搜索</el-button>
                </label-item>
            </el-row>
        </div>

        <div class="mt-md mb-md border height-overflow">
            <el-row>
                <el-button class="mb-sm"
                           :title="item.remark"
                           @click="selectToggle(item.id)"
                           :class="{'ml-xs': index === 0}" v-for="(item, index) in list"
                           :key="index" :type="select.includes(item.id) ? 'primary' : 'default'">
                    {{item.name}}
                </el-button>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="sure">确 定</el-button>
            <el-button size="mini" @click.native="cancle">取 消</el-button>
        </span>

    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                show: this.value,
                userStatus: [
                    {name: "全部", status: 0},
                    {name: "已选中", status: 1},
                    {name: "未选中", status: 2},
                ],
                defaultIndex: 0,
                search: "",
                filter: "",
                status: -1,
            }
        },
        methods: {
            open() {

            },
            sure() {
                this.show = false;
                this.$emit('sure');
            },
            cancle() {
                this.show = false;
            },
            searchFilter() {
                this.filter = this.search.trim();
            },
            changeSelect(val) {
                this.status = val;
            },
            selectToggle(id) {
                if (!~this.select.indexOf(id)) {
                    this.select.push(id);
                } else {
                    let index = this.select.findIndex(item => item === id);
                    this.select.splice(index, 1);
                }
            }
        },
        computed: {
            list() {
                let module = [];
                this.roleList.forEach(item => {
                    if (this.filter) {
                        if (!~item.name.indexOf(this.filter)) {
                            return;
                        }
                    }
                    if (this.status === 0) {
                        module.push(item);
                    } else if (this.status === 1) {
                        if (this.select.includes(item.id)) {
                            module.push(item);
                        }
                    } else if (this.status === 2) {
                        if (!this.select.includes(item.id)) {
                            module.push(item);
                        }
                    } else {
                        module.push(item);
                    }
                });
                return module;
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            title: {},
            select: {
                /** 包括选中的id数量。 */
                type: Array,
                require: true,
            },
            roleList: {}
        },
        components: {
            labelButtons: require('../../../components/label-buttons.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
        }
    }
</script>

<style lang="stylus" scoped>
    .border {
        border 1px solid #ddd;
        padding 10px 10px;
    }

    .height-overflow {
        height: 450px;
        overflow auto
    }


</style>
