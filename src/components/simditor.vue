<template>
    <div>
        <textarea :id="editorId" autofocus v-model="editorValue"></textarea>
        <div class="mt-sm">
            <b class="mt-sm mb-sm">{{$t('ymx-detail.note')}}</b>
            <el-button type="primary" size="mini"  @click.native="empty_content">{{$t('ymx-detail.clearStyle')}}</el-button>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import 'simditor/styles/simditor.css';
    import $ from 'jquery';
    import 'simple-module';
    import 'simple-hotkeys';
    import 'simple-uploader';
    import Simditor from 'simditor';
    require('@/lib/simditor-html/beautify-html');
    import '@/lib/simditor-html/simditor-html.css';
    require('@/lib/simditor-html/simditor-html');

    export default {
        data() {
            return {
                editorValue:this.value,
                editor:null,
            }
        },
        mounted() {
            this.createEditor()
        },
        methods: {
            empty_content(){
                let content = this.editor.getValue();
                let contentList = content.split('<\/p><p>');
                let reg=/<[^>]+>/ig;
                let nbsp = /&nbsp;/ig;
                let br = /<br>/ig;
                let _br = /--br--/ig;
                content=contentList.map(row=>{
                    row=row.replace(br,'--br--').replace(reg,'').replace(_br,'<br>').replace(nbsp,'  ');
                    let line  = `<p>${row}</p>`;
                    return line;
                }).join('');
                this.editor.setValue(content);
            },
            /**
             * 初始富文本编辑器
             */
            createEditor() {
                let _this = this;
                _this.editor = new Simditor({
                    textarea: $('#'+_this.editorId),
                    placeholder: '',
                    defaultImage: 'images/image.png',
                    params: {},
                    upload: false,
                    tabIndent: true,
                    toolbar: _this.toolbar,
                    toolbarFloat: false,
                    toolbarFloatOffset: 0,
                    toolbarHidden: false,
                    pasteImage: false,
                    cleanPaste: false,
                });
                //内容变动时抛出事件；valuechanged为Simditor编辑器提供的事件
                _this.editor.on("valuechanged", function(e, src) {
                    _this.editorValue = _this.editor.getValue();
                    _this.$emit('value-changed',_this.editorValue);
                })
            }
        },
        watch:{
            editorValue(val){
                this.$emit('input',val);
            },
            value(val){
                this.editorValue = val;
            },
        },
        destroyed() {
            this.editor.destroy();
        },
        props:{
            /**
             * 富文本编辑内的值
             */
            value:{},
            /**
             * 类型不限，同一个页面值不能重复
             */
            editorId:{
                required:true
            },
            /**
             * 工具条，可选值为'title','bold','italic','underline','strikethrough',
             * 'fontScale','color','ol','ul','blockquote','code','table','link','image','hr','indent','outdent','alignment'
             * 值代表的意义参考http://simditor.tower.im/docs/doc-config.html
             */
            toolbar:{
                default(){
                    return ['html', 'bold']
                }
            }
        },
    }
</script>