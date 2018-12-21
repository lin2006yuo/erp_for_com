<template>
    <page-dialog size="large" v-model="show" @open="open">
        <div>
            <div class="page-node-page" v-for="filter in filters">
                <el-checkbox :label="filter.title" :value="selected_page(filter.tag)" @change="change_page(filter.tag)"></el-checkbox>
            </div>
        </div>
        <span slot="footer">
            <el-button size="mini" type="primary" @click.native="save">确定</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .page-node-page{
        padding-top:10px;
    }
    .page-node-nodes{
        padding:10px;
        border-bottom:1px solid gainsboro;
    }
</style>
<script>

    import {api_get_filters, api_get_filter_node, api_set_filter_node} from '../../../api/mca-node';
    export default{
        data(){
            return{
                show:this.value,
                filters:{},
                selecteds:{}
            }
        },
        methods:{
            open(){
                this.selecteds = {};
                this.$http(api_get_filters).then(res=>{
                    this.filters = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
                this.$http(api_get_filter_node, {nodeid:this.controller.id}).then(res=>{
                    if(res instanceof Array && res.length === 0){
                        res = {};
                    }
                    this.selecteds = res;
                })
            },
            selected_page(pageIndex){
                return this.selecteds[pageIndex] || false;
            },
            change_page(pageIndex){
                if(this.selecteds[pageIndex] === undefined){
                    this.$set(this.selecteds, pageIndex, true);
                    return;
                }
                this.selecteds[pageIndex] = !this.selecteds[pageIndex];
            },
            save(){
                this.$http(api_set_filter_node, {
                    nodeid:this.controller.id,
                    page_nodes:this.selecteds,
                }).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                })
            }
        },
        computed:{
            title(){
                const title = this.controller.title || "";
                return `过滤器设置--${title}`;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(val){

                }
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            controller:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
