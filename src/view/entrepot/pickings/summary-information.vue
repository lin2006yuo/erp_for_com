<template>
    <div>
        <table class="right-table" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">拣货单号</td>
                <td width="300">{{lookData.number+(lookData.remark?(' '+'('+lookData.remark+')'):'')}}</td>
                <td>拣货单状态</td>
                <td>{{lookData.status}}</td>
            </tr>
            <tr>
                <td>拣货类型</td>
                <td>{{lookData.type}}</td>
                <td>创建时间</td>
                <td>{{lookData.create_time | filterTime}}</td>
            </tr>
            <tr>
                <td>物流商</td>
                <td>{{lookData.shipping}}</td>
                <td>创建人</td>
                <td>{{lookData.creator_id}}</td>
            </tr>
        </table>
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">拣货人</td>
                <td width="150">{{lookData.shipper_id}}</td>
                <td width="150">拣货开始时间</td>
                <td width="175">{{lookData.picking_start_time | filterTime}}</td>
                <td>拣货结束时间</td>
                <td width="175">{{lookData.picking_end_time | filterTime}}</td>
            </tr>
            <tr>
                <td>包装员</td>
                <td>{{lookData.packager_id}}</td>
                <td>包装作业开始时间</td>
                <td>{{lookData.packing_start_time | filterTime}}</td>
                <td>包装作业结束时间</td>
                <td>{{lookData.packing_end_time | filterTime}}</td>
            </tr>
            <tr>
                <td>分拣员</td>
                <td>{{lookData.sorting_id}}</td>
                <td>分拣开始时间</td>
                <td>{{lookData.sorting_start_time | filterTime}}</td>
                <td>分拣结束时间</td>
                <td>{{lookData.sorting_end_time | filterTime}}</td>
            </tr>
        </table>
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0" v-if="!!lookData.package">
            <tr>
                <td>包裹总数量</td>
                <td colspan="5">
                    {{lookData.package.create_total}}
                </td>
            </tr>
            <tr>
                <td>等待包装数量</td>
                <td width="150">
                    {{lookData.package.wait_for_packing}}
                </td>
                <td>已包装包裹数</td>
                <td width="150">
                    {{lookData.package.already_packing}}
                </td>
                <td>已作废数量</td>
                <td width="150">
                    {{lookData.package.packing_cancel}}
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_look_pickings} from '@/api/pickings'
    export default {
        data(){
            return {
                lookData:{},
            }
        },
        mounted(){
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            init(){
                this.$http(api_look_pickings, this.trendAction.id).then(res=>{
                    this.lookData = res;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        computed: {},
        watch: {
            informationVisible(val){
                console.log(val)
                if(val){
                    this.init();
                }
            }
        },
        props: {
            trendAction:{},
            informationVisible:{}
        },
        components: {},
    }
</script>
