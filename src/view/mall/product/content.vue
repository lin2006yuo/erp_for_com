<template>
    <el-row>
        <div class="mt-xs mb-xs ml-sm">
            <permission
                    tag="ElButton"
                    :route="apis.url_product_update"
                    size="mini"
                    class="inline"
                    type="warning"
                    @click.native="dialogTableVisible = true">创建</permission>
            <!--TODO 批量导出没有做权限，暂无接口-->
            <el-button size="mini" class="inline" type="warning" :disabled="true">批量导出</el-button>
            <page-dialog title="新建开发产品" v-model="dialogTableVisible" size="small" :close-on-click-modal="false">
                <mui-select :parent="0" :select="muiSelects" @selected="selected"></mui-select>
                <span slot="footer" class="dialog-footer">
                        <el-button size="mini" :disabled="!selectLast" @click.native="skip" >选择并继续下一步</el-button>
                        <el-button size="mini" type="primary" @click.native="dialogTableVisible = false">关闭</el-button>
                </span>
            </page-dialog>
        </div>
        <slot></slot>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import muiSelect from '../../../components/mui-select.vue';
    import {api_get_categories} from '../../../api/categories';
    import {product_goodsdev} from '../../../api/product_create';//------引入接口文件
    import {url_product_update} from '../../../api/product_create';//------引入接口文件
    export default{
        permission:{
            url_product_update
        },
        data(){
            return{
                muiSelects:{},
                selected_obj:{},
                dialogTableVisible:false,
            }
        },
        watch:{
            dialogTableVisible(val){
                val&&(this.selected_obj={})
            }
        },
        methods:{
            skip(){//----创建
                this.dialogTableVisible=false;
                this.$emit("skip",this.selected_obj.value);
            },
            createNewProduct(){

            },
            handleClick(){
                console.log("el-dropdown");
            },
            selected(selected){
                this.selected_obj = selected;
            }
        },

        computed:{
            selectLast(){
                return this.selected_obj.isLast;
            }
        },
        created(){
            api_get_categories().then(res=>{
                this.muiSelects = res;
            }).catch(code=>{
                this.$message({
                    type:'error',
                    message:code
                });
            });
        },
        props:{
        },
        components:{
            muiSelect,
            pageDialog:require('../../../components/page-dialog.vue').default,
        }
    }
</script>
