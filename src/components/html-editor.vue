<template class="p-html-editor">
    <textarea :id="editid" :name="editid" style="maring:100px;width:700px;min-height:200px;max-height: 250px;">
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
            this.editorRef.config.menus = this.editorRef.config.menus.map(row=>{
                if(row==="location"){
                    return null
                }
                 return row;
             });
            this.editorRef.onchange =  () =>{
                self.editor = this.editorRef.$txt.html();
            };
            this.editorRef.create();
            if(this.editor){
                let index = this.editor.indexOf('\r');
                if(index>0){
                    this.editor = this.editor.replace(/\r/g,'<br/>');
                }
                this.editor = '<p>'+this.editor+'</p>';
                this.editorRef.$txt.html(this.editor);
                
            }
        },
        watch:{
            editor(val){
                this.isEditChange = true;
                this.$emit('input', val);
            },
            value(val){
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
