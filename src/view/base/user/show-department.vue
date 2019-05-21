<template>
    <div class="c-show-department">
        <page-dialog title="选择部门" v-model="dialogTableVisible" size="small" :close-on-click-modal="false" @change="change_dialog">
            <categories v-model="values" :tree="muiSelects" ref="categories"></categories>
            <span slot="footer" class="dialog-footer">
                 <el-button size="mini" type="primary"  @click.native="skip" :disabled="!values" >选择并继续下一步</el-button>
                 <el-button size="mini"  @click.native="dialogTableVisible = false">关闭</el-button>
            </span>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                values:this.categories_id||"",
                dialogTableVisible:this.value,
                selectObj:{},
            }
        },
        computed:{
            selectLast(){
                return this.selectObj.isLast;
            },
        },
        watch:{
            categories_id(val){
                this.values=val||'';
            },
            dialogTableVisible(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialogTableVisible = val;
            },
        },
        methods:{
            change_dialog(val){
//              !val&&(this.values='')
                if(val){
                    console.log('categories_id',this.categories_id);
                }
            },
            selected(val){
                this.selectObj = val;
            },
            skip(){
                console.log('skipcategories_id',this.categories_id);
                console.log('skipvalues',this.values);
                if(!this.muiSelects[this.values]){
                    return "";
                }
                let name=this.$refs.categories.label;
                this.$emit("skip",name,this.values);
                this.dialogTableVisible = false;
            },
        },
        props:{
            categories_id:{},
            muiSelects:{
                type:Object,
                required:true
            },
            value:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            muiSelect:require('../../../components/mui-select.vue').default,
            categories:require("../../product/manager/categories.vue")
        }
    }
</script>