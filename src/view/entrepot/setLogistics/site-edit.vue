<template>
    <page-dialog v-model="siteVisible"
                 class="receive-abnormal-handle"
                 title="添加站点"
                 @open="open"
                 @close="close">
        <ui-table element-loading-text="玩命加载中..."
                  ref="table"
                  :body-height="65"
                  @check="change_all"
                  v-model="checkAll"
                  :heads="[
                    {isCheck:true,width:40},
                    {label:'站点',width:60},
                    ]">
            <tbody>
            <template v-for="(row,index) in siteList">
                <tr :key="index">
                    <td>
                        <el-checkbox v-model="row.enabled" @change="change(row)"></el-checkbox>
                    </td>
                    <td>
                        <div>{{row.site_code}}</div>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>

        <div slot="footer">
            <request-button req-key="" type="primary" size="mini" @click="sure">确定</request-button>
            <el-button size="mini" @click.native="siteVisible = false">取消</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        name: "site-edit",
        data() {
            return {
                siteVisible: this.value,
                checkAll: false,
            }
        },
        mounted() {

        },
        methods: {
            open() {
                this.$nextTick(() => {
                    let arr = this.siteList.filter(item => {
                        return item.enabled;
                    })
                    if (arr.length === this.siteList.length) {
                        this.checkAll = true;
                    } else {
                        this.checkAll = false;
                    }
                });
            },
            close() {
                this.checkAll = false;
            },
            sure() {
                /*if (this.siteList.length > 0) {
                    this.siteData.content = [];//遍历前让content数据变空
                    this.siteList.forEach(item => {
                        if (item.enabled) {
                            this.siteData.content.push(item)
                        }
                    })
                }*/
                this.siteVisible = false;
                this.$emit('ready-edit', this.siteList.filter(row => row.enabled));
            },
            change_all(val) {
                // let data = [];
                this.siteList.forEach(row => {
                    this.$set(row, 'enabled', val);
                    // row.enabled = val;
                    // data.push(row)
                })
            },
            change() {
                if (this.siteList.length > 0) {
                    let notCheckAll = !this.siteList.find(row => !row.enabled);
                    this.checkAll = notCheckAll
                }
            },
        },
        watch: {
            value(val) {
                this.siteVisible = val;
            },
            siteVisible(val) {
                this.$emit('input', val)
            },

        },
        props: {
            value: {},
            /*siteData: {
                required: true,
                type: Object
            },*/
            siteList:{
                required:true,
                type:Array
            }

        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,

        },
    }
</script>

<style lang="stylus">
    .tracking-number.el-input {
        width: 153px;
    }

    .table {
        display: inline-table;
    }
</style>
