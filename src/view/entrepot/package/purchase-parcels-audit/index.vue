<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handle_click">
            <el-tab-pane label="拆包审核" name="1">
                <audit ref="audit" v-if="activeName === '1'"></audit>
            </el-tab-pane>
            <el-tab-pane label="未审核列表" name="2">
                <list ref="list" v-if="activeName === '2'" @search-id="search_id"></list>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        activated(){//当切换到当前页面时触发这个回调。
            this.$refs.audit.$refs.search_input.$refs.input.focus();
            let component = this;
            document.onkeydown=function(event){
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode===113){ // 按 F2
                    component.$refs.audit.onkey_f2();
                }
            };
        },
        deactivated(){//当切换到其它页面时触发这个回调。

        },
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
                    this.$refs.audit.searchData.s_bill_type = 4;
                    this.$refs.audit.searchData.s_bill_number = row.id;
                    this.$refs.audit.search_btn(this.$refs.audit.searchData);
                });
            }
        },
        watch: {},
        props: {},
        components: {
            audit:require('./audit').default,
            list:require('./list').default
        }
    }
</script>
