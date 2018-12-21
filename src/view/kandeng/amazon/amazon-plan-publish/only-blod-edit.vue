<template class="p-html-editor">
    <textarea :id="editid" :name="editid" style="height:500px">
</textarea>
</template>

<script>
    import 'jquery';
    import wangEditor from 'wangeditor';
    import Vue from 'vue';
    export default {
        data() {
            return {
                editor:this.value,
                editorRef:null,
                isEditChange:false,
            }
        },
        props:{
            editid:{
                required:true,
                type:String
            },
            value:{}
        },
        computed: {
        },
        mounted() {
            let self = this;
            this.editorRef = new wangEditor(this.editid);
            //删除地图
            this.editorRef.config.menus = ['bold'];
            this.editorRef.onchange =  () =>{
                self.editor = this.editorRef.$txt.html();
            };
            this.editorRef.create();
            this.editorRef.$txt.html(this.editor);
        },
        watch:{
            editor(val){
                this.isEditChange = true;
                this.$emit('input', val);
            },
            value(val){
                console.log("htmledit:",val)
                this.editor = val;
                if(!this.isEditChange){
                    this.editorRef.$txt.html(this.editor);
                    this.$nextTick(() => {
                        this.isEditChange = false;
                    })
                }else{
                    this.isEditChange = false;
                }
            }
        },
        methods: {
            insertText(item){
                this.editorRef.command({preventDefault(){}}, 'insertHtml', item);
            },
            insertHtml(html){
                this.editorRef.command({preventDefault(){}}, 'insertHtml', html);
            }
        },
        components: {},
        beforeDestroy(){
            this.editorRef.destroy();
        }
    }
</script>

<style lang="stylus" scoped>
    #editor{
        height: 200px;
    }
    .wangEditor-container{
        border-radius: 2px;
        overflow: hidden;
        border: 1px solid #CCC;
    }
</style>

