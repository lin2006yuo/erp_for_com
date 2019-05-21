<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handle_click">
            <el-tab-pane label="包裹拆包" name="1">
                <arrive ref="arrive" v-if="activeName === '1'"></arrive>
            </el-tab-pane>
            <el-tab-pane label="待拆包条目" name="2">
                <wait-arrive ref="wait" v-if="activeName === '2'" @search-id="search_id"></wait-arrive>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                activeName:'1'
            }
        },
        methods: {
            handle_click(){
                switch (this.activeName){
                    case '1':
                        break;
                    case '2':
                }
            },
            search_id(row){
                this.activeName = '1';
                this.$nextTick(()=>{
                    this.$refs.arrive.searchData.s_bill_type = '1';
                    this.$refs.arrive.searchData.s_bill_number = row.id;
                    this.$refs.arrive.search_btn(this.$refs.arrive.searchData);
                });
            }
        },
        components: {
            arrive:require('./arrive').default,
            waitArrive:require('./wait-arrive').default
        }
    }
</script>
