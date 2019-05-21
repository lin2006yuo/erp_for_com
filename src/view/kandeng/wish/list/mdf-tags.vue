<template>
    <div class="c-mdf-tags">
        <page-dialog v-model="dialog" size="small" :title="title">
            <template v-if="module==='tags'">
                <input-tag :tags="form.tags" type="primary"></input-tag>
                <el-button type="primary"
                           size="mini"
                           class="inline mt-sm mt-xs"
                           :disabled="form.tags.length>=10"
                           @click.native="extract_keyword">提取平台关键词</el-button>
                <el-button type="primary"
                           size="mini"
                           class="inline mt-sm ml-sm"
                           v-if="form.tags.length>0"
                           @click.native="copy_tags(form.tags)">复制标签</el-button>
            </template>
            <template v-else>
                <el-input
                        type="textarea"
                        v-model="form.description"
                        :autosize="{minRows: 6, maxRows: 8}"
                        placeholder="请添加描述">
                </el-input>
            </template>
            <extract-keyword v-model="keywordDialog"
                             :oldTags="form.tags"
                             title="选择关键词"
                             @add-data="add_data"></extract-keyword>
            <div slot="footer">
                <el-button size="mini"
                           class="inline"
                           @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value,
                oldForm:{},
                keywordDialog:false,
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.oldForm = clone(this.form);
                }
            },
        },
        methods:{
            add_data(val){
                val = val.map(row=>{
                    return {
                        name:row
                    }
                });
                this.form.tags = [...this.form.tags,...val];
            },
            cancel(){
                this.form[this.module] = this.oldForm[this.module];
                this.dialog = false;
            },
            extract_keyword(){
                this.keywordDialog = true;
            },
            copy_tags(val){
                let name = val.map(row=>{
                    return row.name;
                });
                let input = document.createElement('input');
                let body = document.getElementsByTagName('body')[0];
                input.type = 'text';
                input.value = name.join(',');
                body.appendChild(input);
                input.select();
                document.execCommand('Copy');
                body.removeChild(input);
                this.$message({type:"success",message:"复制成功！"})
            },
        },
        props:{
            value:{},
            form:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            },
            module:{
                required:true,
                type:String
            },
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            inputTag:require('../../../../components/input-tag.vue').default,
            extractKeyword:require('../info/extract-keyword.vue').default,
        }
    }
</script>