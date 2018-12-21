<template>
    <div class="c-kindeditor">
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
                    :img-count="imgCount"
                    :limit-img="limitImg"
                    :limit-count:="limitCount"
                    @add="add"
                    @call-back="call_back"
                    :id="id"></select-img>
        <editor :id="editorId" :height="height" :width="width" :content="editorText"
                :items="curItems"
                :filterMode="false"
                pluginsPath="/static/kindeditor/plugins/"
                :loadStyleMode="false"
                @on-content-change="onContentChange"></editor>
    </div>
</template>
<style lang="stylus">
    .new-ke-kindeditor{
        font:18px/1.5 "sans serif",tahoma,verdana,helvetica !important;
        td{
            font:18px/1.5 "sans serif",tahoma,verdana,helvetica !important;
        }
    }
    .c-kindeditor{
        position: relative;
    }
</style>
<script>
    import {api_upload_local_images,api_upload_style_imgs,api_upload_net_images} from '../api/aliexpress-product-info'
    export default {
        name: 'hello',
        data () {
            return {
                addVisible:false,
                dialog:false,
                content:''
            }
        },
        created(){
            KindEditor.create(`#${this.editorId}`, {
                cssData:'body{font:18px/1.5 Arial,"sans serif",tahoma,verdana,helvetica;}',
                filterMode:false,
//                htmlTags:{
//                    link:['href','rel'],
//                    meta:['name','content'],
//                }
            });
        },
        mounted(){
            if(this.editorText&&this.canReplace){
                let reg = /(\n)|(\r)/g;
                let _editorText = this.editorText.replace(reg,"<br/>");
                KindEditor.html(`#${this.editorId}`, _editorText);
            }
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
                        KindEditor.insertHtml(`#${this.editorId}`, img);
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
                                    if(this.channel==='ebay'){
                                        this.upload_style_imgs(res);
                                    }else{
                                        let img = '';
                                        res.data.forEach(row=>{
                                            img += `<img src="${res.base_url}${row}" />`;
                                        });
                                        KindEditor.insertHtml(`#${this.editorId}`, img);
                                    }
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
            /*上传到ebay服务器*/
            upload_style_imgs(res){
                let imgList =  res.data.map(row=>{
                    return `${res.base_url}${row}`
                });
                let params = {imgs:imgList};
                this.$http(api_upload_style_imgs,params).then(row => {
                    let img = '';
                    row.data.forEach(item=>{
                        img += `<img src="${item}" />`;
                    });
                    KindEditor.insertHtml(`#${this.editorId}`, img);
                    this.$message({type:'success',message:'添加成功'})
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            onContentChange (val) {
                this.content = val;
                this.$emit('content-change',val);
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
                if(this.limitImg){
                    let count = this.imgCount;
                    arr.forEach(row=>{
                        count++;
                        if(count<=this.limitCount) {
                            img += `<img src=${row.base_url}${row.path}>`
                        }
                    });
                    if(count>this.limitCount){
                        this.$message({type:'warning',message:`最多只能上传${this.limitCount}张图片！`});
                    }
                }else{
                    arr.forEach(row=>{
                        img += `<img src=${row.base_url}${row.path}>`
                    });
                }
                KindEditor.insertHtml(`#${this.editorId}`, img);
            },
            call_back(res){
                res.path = res.path instanceof Array?res.path:JSON.parse(res.path);
                let path = res.path.map(row=>{
                    return {path:row,base_url:res.baseUrl}
                });
                this.add(path);
            },
        },
        computed:{
            imgCount(){
                let searchNum = this.content.match(/<img /g);
                return searchNum===null?0:searchNum.length;
            }
        },
        props:{
            /*使用编辑器的模块
            * ebay模块添加‘本地图片’，调用的接口与其他模块不同
            * */
            channel:{
                type:String,
                default(){
                    return 'other';
                }
            },
            /* 编辑器ID
             *必填
             *全局不能重复
             **/
            editorId:{
                type:[String,Number],
                required:true
            },
            /* 编辑器内容
             *必填
             **/
            editorText:{
                required:true,
            },
            /* 工具栏
             **/
            curItems:{
                default(){
                    return [
                        'source', '|','undo', 'redo', '|','formatblock','fontname','fontsize','|','forecolor','hilitecolor','bold',
                        '|','justifyleft','justifycenter','justifyright','justifyfull','indent','outdent','hr','removeformat','|'
                        ,'link','unlink','table',
                    ]
                }
            },
            /*编辑器的宽
            * */
            width:{
                type:String,
                default(){
                    return '1050px'
                }
            },
            /*编辑器的高
            * */
            height:{
                type:String,
                default(){
                    return '450px'
                }
            },
            /*是否显示‘添加图片’按钮
            * */
            showAddPicNormal:{
                type:Boolean,
                default(){
                    return true;
                },
            },
            /*是否显示‘本地图片’按钮
            * */
            showAddPicLocal:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            /*是否显示‘网络图片’按钮
            * */
            showAddPicNet:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            /*定义按钮的位置
            * */
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
            /*select-img组件需要goods_id
            * */
            id:{
                type:[Number, String,Array],
                default(){
                    return 0;
                }
            },
            /*编辑器转换时，会多出来\n空格
            *如果只希望在初始化时去掉数据源带的\n\r空格，不希望在编辑页面去掉\n\r空格的话，可以使用这个参数
            *     true为将\n\r替换为<br>，false为不替换
            * */
            canReplace:{
                type:Boolean,
                default(){
                    return true
                }
            },
            //是否限制上传图片数量
            limitImg:{
                default(){
                    return false
                }
            },
            //限制上传图片的数量，
            limitCount:{
                type:Number,
                default(){
                    return 60
                }
            },
            htmlTags: {
                type: Object,
                default: function () {
                    return {
                        link:['href','rel'],
                        meta:['name','content'],
                        font: ['color', 'size', 'face', '.background-color'],
                        span: ['style'],
                        div: ['class', 'align', 'style'],
                        table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style'],
                        'td,th': ['class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'style'],
                        a: ['class', 'href', 'target', 'name', 'style'],
                        embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality',
                            'style', 'align', 'allowscriptaccess', '/'],
                        img: ['src', 'width', 'height', 'border', 'alt', 'title', 'align', 'style', '/'],
                        hr: ['class', '/'],
                        br: ['/'],
                        'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': ['align', 'style'],
                        'tbody,tr,strong,b,sub,sup,em,i,u,strike': []
                    }
                }
            },
        },
        components:{
            selectImg:require('./select-img').default,
            addNetworkImgs:require('./add-network-imgs.vue').default,
        },
    }
</script>
