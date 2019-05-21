<template>
    <div class="mt-lg">
        <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">不良交易率表现（%）：</label>
        <table class="template" ref="table" style="width: 70%">
            <tr>
                <th width="17%">不良交易率表现</th>
                <th width="27%"><=$10 12月不良交易率状态</th>
                <th width="27%"><=$10 12月不良交易率当前值</th>
                <th ><=$10 12月不良交易率标准值</th>
            </tr>
            <tr>
                <td rowspan="999" :class="table.status_lst_eval_txt==='正常'?'color-green':'color-red'">{{table.status_lst_eval_txt}}</td>
                <td :class="table.status_lt10_lst_eval_txt==='正常'?'color-green':'color-red'">{{table.status_lt10_lst_eval_txt}}</td>
                <td>{{table.dft_rt_lt10_12m_lst_eval}}</td>
                <td>{{table.dft_rt_lt10_12m_th}}</td>
            </tr>
            <tr>
                <th >>$10 12月不良交易率状态</th>
                <th >>$10 12月不良交易率当前值</th>
                <th >>$10 12月不良交易率标准值</th>
            </tr>
            <tr>
                <td :class="table.status_gt10_lst_eval_txt==='正常'?'color-green':'color-red'">{{table.status_gt10_lst_eval_txt}}</td>
                <td>{{table.dft_rt_gt10_12m_lst_eval}}</td>
                <td>{{table.dft_rt_gt10_12m_th}}</td>
            </tr>
            <tr>
                <th >综合12月不良交易率状态</th>
                <th >综合12月不良交易率当前值</th>
                <th >综合12月不良交易率标准值</th>
            </tr>
            <tr>
                <td :class="table.status_adj_lst_eval_txt==='正常'?'color-green':'color-red'">{{table.status_adj_lst_eval_txt}}</td>
                <td>{{table.adj_dft_rt_12m_lst_eval}}</td>
                <td>{{table.adj_dft_rt_12m_th}}</td>
            </tr>
        </table>
        <table class="template mt-lg" ref="table" style="width: 50.1%">
            <tr>
                <th width="200px">预期评价</th>
                <th >预期-<=$10 12月不良交易率状态</th>
                <th >预期-<=$10 12月不良交易率当前值</th>
            </tr>
            <tr>
                <td rowspan="999" :class="table.status_wk_eval_txt==='正常'?'color-green':'color-red'">{{table.status_wk_eval_txt}}</td>
                <td :class="table.status_lt10_wk_eval_txt==='正常'?'color-green':'color-red'">{{table.status_lt10_wk_eval_txt}}</td>
                <td>{{table.dft_rt_lt10_12m_wk_eval}}</td>
            </tr>
            <tr>
                <th >预期->$10 12月不良交易率状态</th>
                <th >预期->$10 12月不良交易率当前值</th>
            </tr>
            <tr>
                <td :class="table.status_gt10_wk_eval_txt==='正常'?'color-green':'color-red'">{{table.status_gt10_wk_eval_txt}}</td>
                <td>{{table.dft_rt_gt10_12m_wk_eval}}</td>
            </tr>
            <tr>
                <th >预期-综合12月不良交易率状态</th>
                <th >预期综合12月不良交易率当前值</th>
            </tr>
            <tr>
                <td :class="table.status_adj_wk_eval_txt==='正常'?'color-green':'color-red'">{{table.status_adj_wk_eval_txt}}</td>
                <td>{{table.adj_dft_rt_12m_wk_eval}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "trade-rate",
        data(){
            return{

            }
        },
        methods:{},
        props:{
            table:{

            }
        }
    }
</script>

<style scoped>

</style>
