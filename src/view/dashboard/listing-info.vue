<template>
    <ui-card class="form-item">
        <span slot="header" class="title">刊登管理</span>
        <el-table :data="datas" v-resize="{height:41}">
            <el-table-column label="刊登平台" prop="name"></el-table-column>
            <el-table-column label="未刊登" prop="notyet"></el-table-column>
            <el-table-column label="刊登中" prop="listing"></el-table-column>
            <el-table-column label="刊登异常" prop="exceptionCount"></el-table-column>
            <el-table-column label="停售待下架" prop="stopsell"></el-table-column>
        </el-table>
    </ui-card>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import {api_listing_count} from '../../api/dashborad';
    export default{
        data(){
            return{
                datas:[]
            }
        },
        mounted(){
            this.refresh();
        },
        methods:{
            refresh(){
                this.$http(api_listing_count).then(res=>{
                    this.datas = res;
                }).catch(code=>{
                    console.error(code);
                })
            }
        },
        components:{
            uiCard:require('../../components/ui-card.vue').default
        }
    }
</script>