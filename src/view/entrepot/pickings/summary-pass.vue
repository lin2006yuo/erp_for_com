<template>
    <div>
        <table class="right-table" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">周转箱</td>
                <td width="300">
                    <div>
                        <span v-for="(item,index) in lookData">
                            <span><b :style="`color:${item.status===0?'green':'red'}`">{{item.number}}</b>{{(index!==(lookData.length-1)?'，':'')}}</span>
                        </span>
                        <el-button type="primary"
                                   size="mini"
                                   class="fr mr-sm"
                                   @click.native="transfer_summary"
                                   :disabled="lookData.length === 0">转移周转箱
                        </el-button>
                    </div>
                </td>
            </tr>
        </table>
        <transfer-turnover-box v-model="transferVisible" :transfer-info="transferInfo" :box-list="boxList"></transfer-turnover-box>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_look_turnover} from '@/api/pickings'

    export default {
        data() {
            return {
                lookData: [],
                boxList: [],
                transferInfo: {},
                transferVisible: false,
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            init() {
                this.boxList = [];
                this.$http(api_look_turnover, this.trendAction.id).then(res => {
                    this.lookData = res.data;
                    this.boxList = this.lookData.map(row => row.number);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            transfer_summary() {
                this.transferVisible = true;
                this.transferInfo = {
                    id: this.trendAction.id,
                }
            }
        },
        computed: {},
        watch: {
            passVisible(val) {
                if (val) {
                    this.init();
                }
            }
        },
        props: {
            trendAction: {},
            passVisible: {}
        },
        components: {
            transferTurnoverBox: require('./transfer-turnover-box.vue').default,
        },
    }
</script>
