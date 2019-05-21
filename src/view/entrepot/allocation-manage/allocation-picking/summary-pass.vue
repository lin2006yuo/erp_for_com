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
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_allocation_picking_turnover} from "@/api/allocation-picking";

    export default {
        data() {
            return {
                lookData: [],
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
                this.lookData = [];
                this.$http(api_allocation_picking_turnover, this.trendAction.id).then(res => {
                    this.lookData = res.data;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            }
        },
        computed: {},
        watch: {
            show(val) {
                if (val) {
                    this.init();
                }
            }
        },
        props: {
            trendAction: {},
            show: {}
        },
        components: {
        },
    }
</script>
