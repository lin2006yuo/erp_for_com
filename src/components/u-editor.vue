<template>
    <div class="c-u-edtior">
        <div :style="add_img_btn">
            <el-button type="primary"
                       v-if="showAddPicNormal"
                       size="mini"
                       @click.native="add_img_normal">添加图片</el-button>
            <el-button type="primary"
                       v-if="showAddPicLocal"
                       size="mini"
                       @click.native="add_img_local">本地图片</el-button>
            <el-button type="primary"
                       v-if="showAddPicNet"
                       size="mini"
                       @click.native="add_img_net">网络图片</el-button>

        </div>
        <!--添加本地图片-->
        <input type="file" ref="input"
               hidden @change="handleChange"
               :multiple="true"
               accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <!--添加网络图片-->
        <add-network-imgs v-model="addVisible"
                          @add-url="add_url"></add-network-imgs>
        <!--图片组件-->
        <select-img v-model="dialog"
                    @add="add"
                    @call-back="call_back"
                    :id="id"></select-img>
        <div :id="ueditId" type="text/plain"></div>
    </div>
</template>
<style lang='stylus' scoped>
    .c-u-edtior{
        position: relative;
    }
</style>
<script>
    window.UEDITOR_HOME_URL = '/';
    import '../ueditor/ueditor.config';
    import '../ueditor/ueditor.all';
    import '../ueditor/ueditor.parse';
    import '../ueditor/lang/zh-cn/zh-cn';
    import {api_upload_local_images,api_upload_net_images} from '../api/aliexpress-product-info'
    export default {
        name:"UE",
        data () {
            return {
                addVisible:false,
                editor: null,
                defaultMsg:this.value,
                dialog:false,
                config:{
                    initialFrameWidth:this.FrameWidth,
                    initialFrameHeight:this.FrameHeight,
                    simpleupload:this.simpleupload,
                    toolbars:this.toolbars,
                }
            }
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor(_this.ueditId, this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                let defaultMsg = _this.replaceAll(_this.defaultMsg);
                _this.editor.setContent(defaultMsg); // 确保UE加载完成后，放入内容。
            });
            this.editor.addListener('contentChange', (content)=>{
                this.defaultMsg = this.editor.getContent();
                this.$emit('content-change',this.defaultMsg);
            });
        },
        computed:{
            ueditId(){
                return `${this.editId}-${this._uid}`
            }
        },
        watch:{
            defaultMsg(val){
                this.$emit('input',val);
            },
            value(val){
                this.defaultMsg = val;
            },
        },
        methods: {
            add_url(val){
                this.$http(api_upload_net_images,{images:val}).then(res=>{
                    this.addVisible = false;
                    if(res.data.length>0){
                        let img = '';
                        res.data.forEach(row=>{
                            img = `<img src="${res.base_url}${row}" />`;
                        });
                        this.editor.focus();
                        this.editor.execCommand('inserthtml',img);
                    }
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            handleChange(ev) {
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file, index) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let imgs = e.target.result;
                        let path = URL.createObjectURL(file);
                        let img = JSON.stringify(imgs);
                        let params = [];
                        params.push(img);
                        if(params){
                            this.$http(api_upload_local_images,{images:params}).then(res=>{
                                if(res.data.length>0){
                                    let img = '';
                                    res.data.forEach(row=>{
                                        img +=`<img src="${res.base_url}${row}" />`;
                                    });
                                    this.editor.focus();
                                    this.editor.execCommand('inserthtml',img)
                                }
                            }).catch(code=>{
                                this.$message({
                                    type:'error',
                                    message:code.message || code
                                });
                            });
                        }
                    }
                });
            },
            add_img_normal(){
                this.dialog = true;
            },
            add_img_local(){
                this.$refs.input.click();
            },
            add_img_net(){
                this.addVisible = true;
            },
            add(arr){
                let img = '';
                arr.forEach(row=>{
                    img+= `<img src=${row.base_url}${row.path}>`
                });
                this.editor.focus();
                this.editor.execCommand('inserthtml',img)
            },
            call_back(res){
                res.path = res.path instanceof Array?res.path:JSON.parse(res.path);
                let path = res.path.map(row=>{
                    return {path:row,base_url:res.baseUrl}
                });
                this.add(path);
            },
            replaceAll(str) {
                str = str || '';
                return str.replace(/\r/g, "<br>")
            },
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            }
        },
        props: {
            showAddPicNormal:{
                type:Boolean,
                default(){
                    return true;
                },
            },
            showAddPicLocal:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            showAddPicNet:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            add_img_btn:{
                type:Object,
                default() {
                    return{
                        'position': 'absolute',
                        'top':'5px',
                        'right':'350px',
                        'z-index':'1000',
                    }
                }
            },
            editId:{//编辑器id
                type: String,
                required:true,
            },
            value:{},
            FrameWidth:{
                default(){
                    return null
                }
            },
            FrameHeight:{
                default(){
                    return 350
                }
            },
            simpleupload:{
                default(){
                    const host = url('hostname');
                    const port = url('port');
                    return `http://${host}:${port}/simpleupload`
                }
            },
            toolbars:{
                default(){
                    return [
                        [
                            'source', //源代码
                            'undo', //撤销
                            'redo', //重做
                            'fontfamily', //字体
                            'fontsize', //字号
                            'paragraph', //段落格式
                            'bold', //加粗
                            'indent', //首行缩进
                            'justifyleft', //居左对齐
                            'justifycenter', //居中对齐
                            'justifyright', //居右对齐
                            'justifyjustify', //两端对齐
//                                'snapscreen', //截图
                            'italic', //斜体
                            'underline', //下划线
                            'strikethrough', //删除线
//                                'simpleupload', //单图上传
//                                'insertimage', //多图上传
//                                'insertvideo', //视频
                            'forecolor', //字体颜色
                            'backcolor', //背景色
                            'insertorderedlist', //有序列表
                            'insertunorderedlist', //无序列表
                            'fullscreen', //全屏
                            'rowspacingtop', //段前距
                            'rowspacingbottom', //段后距
                            'lineheight', //行间距
                            'autotypeset', //自动排版
//                                'background', //背景
                        ]
                    ]
                },
            },
            id:{//select-img组件需要goods_id
                default(){
                    return 0;
                }
            }
        },
        destroyed() {
            this.editor.destroy();
        },
        components:{
            selectImg:require('./select-img').default,
            addNetworkImgs:require('./add-network-imgs.vue').default,
        },
    }
</script>