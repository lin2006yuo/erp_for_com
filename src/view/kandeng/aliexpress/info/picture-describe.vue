<template>
    <el-row class="p-picture-describe-ali">
        <div class="p-titleBgcol">
            <span class="p-picture-describe">图片与描述</span>
        </div>
        <div class="p-picture" >
            <el-form :model="pictureData" ref="picture" label-width="130px">
                <el-form-item label="刊登图片：">
                    <!-- 图片组件 -->
                    <img-add v-model="pictureData.imgs"
                             :is-kandeng="true"
                             :id="especialIds"
                             @save-meitu="save_meitu(pictureData.imgs,$event)"
                             :channel_id="4"
                             :showSwatchImg="false"
                             :defaultRandom="!trueId||isCopy"
                             :show-random-btn="!trueId||isCopy"
                             :base-url="baseUrl"
                             :img-number=6></img-add>
                    <div class="p-upload__notice">图片格式JPEG，文件大小5M以内；图片像素建议大于800*800；横向和纵向比例建议1:1到1:1.3之间；图片中产品主体占比建议大于70%；背景白色或纯色，风格统一；如果有LOGO，建议放置在左上角，不宜过大。不建议自行添加促销标签或文字。最多只能上传6张图片</div>
                </el-form-item>
                <el-form-item label="关联产品模块：" >
                    <el-select v-model="pictureData.relation_template_id" clearable placeholder="请选择" class="inline" style="width: 200px;">
                        <el-option
                                v-for="(item,i) in pictureData.relation_template"
                                :key="i"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-radio-group v-model="pictureData.relation_template_postion">
                        <el-radio label="top" :disabled="relationDis">顶部</el-radio>
                        <el-radio label="bottom" :disabled="relationDis">底部</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义信息模块：" >
                    <el-select v-model="pictureData.custom_template_id" clearable placeholder="请选择"  class="inline" style="width: 200px;">
                        <el-option
                                v-for="(item,i) in pictureData.custom_template"
                                :key="i"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-radio-group v-model="pictureData.custom_template_postion">
                        <el-radio label="top" :disabled="customDis">顶部</el-radio>
                        <el-radio label="bottom" :disabled="customDis">底部</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容描述：" class="pictures" >
                    <kindeditor :editor-text="pictureData.description"
                                :limit-img="true"
                                :limit-count="60"
                                :id="id"
                                :add_img_btn="addImgBtn"
                                @content-change="editor_content_change"
                                :editor-id="editorId"></kindeditor>
                </el-form-item>
                <el-form-item label="移动端描述：">
                        <span class="operate" @click="mobieClick">点击</span>
                            <div style="width: 100%;border: 1px solid #CCCCCC;" v-if="showMobie">
                                <el-row style="border-bottom: 1px solid black;padding:3px 5px;">
                                    <!--<el-button @click="create_detail">生成详情</el-button>-->
                                    <el-button @click="data_creat" type="primary" size="mini">自动生成</el-button>
                                    <el-button  @click="add_mobie_pic" type="primary" size="mini">图片</el-button>
                                    <el-button @click="mobie_font" type="primary" size="mini">文字</el-button>
                                </el-row>
                                <div ref="mobie"
                                            class="alipressPublish"
                                        style="width: 414px;height: 736px;
                                        padding: 5px;
                                        overflow-y:auto;box-sizing: border-box;
                                         border-left:1px solid #ccc;border-right: 1px solid #ccc;
                                         margin-left: 50%;transform: translateX(-50%);
                            ">
                                    <div style="
                                            border:1px  dashed  #ccc ;margin-bottom: 5px;
                                             padding:10px;position:relative"
                                            v-for=" (item,index) in mobileDetailLists"
                                          :key="index">
                                        <i class="el-icon-circle-close" style="font-size: 20px;position: absolute ;top: 0;right: 0;padding: 3px" @click="deletes(index)"> </i>
                                        <el-input
                                                :autosize="true"
                                                v-if="item.type==='text'"
                                                type="textarea"
                                                placeholder="请输入内容"
                                                v-model="item.content">
                                        </el-input>
                                        <div v-if="item.type==='image'">
                                            <img :src="mergin_img(image.imgUrl)" alt="图片"
                                                 v-for="(image,index) in item.images" :key="index" width="100%">
                                        </div>
                                    </div>
                                </div>
                            </div>
                </el-form-item>
            </el-form>
            <select-img v-model="picVisable"
                        :is-kandeng="true"
                        :id="especialIds"
                        :channel-id="4"
                        @add="add_img"
                        @move-drap="move_drap"
                        @handle-change="handleChange"
                        @call-back="call_back_img"
                        :edit-img="editImg"></select-img>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-picture-describe-ali{
      .wangEditor-txt{
        height: 500px!important;
      }
      .alipressPublish{
         img{
            width: 100%!important;
         }
         table{
            width: 100%!important;
         }
      }
        .p-titleBgcol{
            background: #FAECE7;
            .p-picture-describe{
                color: #FFF;
                font-weight:bold;
                font-size: 1.7rem;
                padding: 5px 10px;
                background: #FFB732;
                display: inline-block;
            }
        }
        .p-picture{
            .pictures{
            .el-form-item__label{
                margin-top: 25px;
            }
         }
            padding: 50px;
            border-left: 3px solid #FFB732;
            .p-upload__notice{
                color: red;
            }
        }
    }

</style>
<script>
    import htmlEditor from '../../../../components/html-editor.vue'; //-----文本编辑器引入
    export default{
        data(){
            return {
//                detailImg:{},
//                modifyVisible:false,
                editor: "0",
                picVisable: false,
                tempImg: {},
                flag:0,
                multiple:false,
                showMobie: this.showMobieDetail,
                editImg:false,
                addImgBtn:{
                    'position': 'absolute',
                    'top':'1px',
                    'right':'666px',
                    'z-index':'1000',
                }
            }
        },
        methods:{
//            mdfimg_submit(form){
//                this.pictureData.detail_images = form.path;
//                console.log(this.pictureData.detail_images,'this.pictureData.detail_images');
//                let img = '';
//                let value = KindEditor(`#${this.editorId}`).val();
//
//                form.path.forEach(row=>{
//                    img += `<img src="${row.base_url}${row.path}" />`;
//                });
//                KindEditor.insertHtml(`#${this.editorId}`, img);
//
//                console.log(value,'value');
//            },
//            add_img_normal(){
//                this.modifyVisible = true;
//                console.log("执行到了吗");
//                this.detailImg = {
//                    path:this.pictureData.detail_images
//                }
//            },
            save_meitu(imageList,obj){
                if(imageList[obj.curIndex])imageList[obj.curIndex].path = obj.newPath;
            },
            editor_content_change(val){
                this.pictureData.description = val;
            },
            call_back_img(val){
                this.picVisable = false;
                switch (this.flag){
                    case 4:
                        let path = val.path instanceof Array?val.path:JSON.parse(val.path);
                        let img='';
                        path.forEach(row=>{
                            img += `<img src="${this.baseUrl+row}" />`
                        });
                        this.$refs.editor.insertHtml(img);
                        break;
                }
            },
            add_html(src){
                this.flag=4;
                this.multiple=true;
                this.editImg = false;
                this.picVisable=true;
            },
            mergin_img(image){
            	if(image.indexOf("http")>-1){
                    return image;
                }
                return this.baseUrl + image;
            },
            move_drap(val){
                console.log(val);
            },
            handleChange(imgs,path){
//                this.imgs.push(item);
            },
            data_creat(){
                this.pictureData.mobileDetail=[];
                let str=this.pictureData.description;
                str=str.replace(/&nbsp;/g,"");
                //截掉table字符串
                let table=/<table[^>]*>/gi;
                if(str.indexOf("<table")!==-1){
                     let start=str.indexOf("<table");
                     let end=str.indexOf("</table>")
                    let substr=str.substr(start,end+8);
                    str=str.replace(substr,"")
                }
                //匹配其他标签
                let htmlreg=/<[^>]+>/g;
                let img=/<img[^>]*>/gi;
                str=str.replace(htmlreg, (tag) =>{
                    if(img.test(tag)){
                        return tag
                    }else {
                        return  ""
                    }
                });
                let strings=str.split(img);
                let imgs =str.match(img);
                let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                 for(let i=0;i<strings.length;i++){
                         strings[i].trim();
                        if(strings[i]===""){
                        }else {
                            this.pictureData.mobileDetail.push({type:"text",content:strings[i]})
                        }
                        if(i<strings.length-1){
                            let src=imgs[i].match(srcReg);
                            this.pictureData.mobileDetail.push({type:"image",images:[{imgUrl:src[1]}]});
                        }
                 };
            },
            deletes(i){
              this.pictureData.mobileDetail.splice(i,1)
            },
            mobie_font(){
                if(!this.pictureData.mobileDetail|| this.pictureData.mobileDetail===""){
                    this.pictureData.mobileDetail=[]
                };
                this.pictureData.mobileDetail.push({type:"text",content:""})
            },
            mobieClick(){
              this.showMobie=!this.showMobie
            },
            add_mobie_pic(){
                this.flag=3;
                this.multiple=true;
                this.picVisable=true;
            },
            add_img(val){
                switch (this.flag){
                    //添加图片
                    case 1:
                        let length=this.pictureData.imgs.length+val.length
                        if(length>6){
                            this.$message({type: "warning", message: '最多只能上传6张'})
                        }
                        val.forEach(row=>{
                            this.add_html(row.path)
                            if(this.pictureData.imgs.length<6){
                                this.pictureData.imgs.push({path:row.path})
                            }
                        });
                        break;
                    case 2: //修改
                        this.tempImg.path=val[0].path;
                        break;
                    case 3:// 移动端添加图片
                        let pic=val.map(row=>{
                            return  {imgUrl:row.path}
                        });
                        if(!this.pictureData.mobileDetail|| this.pictureData.mobileDetail===""){
                            this.pictureData.mobileDetail=[]
                        }
                        this.pictureData.mobileDetail.push({type:"image",images:pic});
                        break;
                    case 4:
                        let img='';
                        val.forEach(row=> {
                            img += `<img src="${this.baseUrl+row.path}" />`
                        })
                        this.$refs.editor.insertHtml(img);
                        break;
                }
            },
        },
        computed:{
            editorId(){
                return `${this.pictureData.index}${this.id}${this.trueId}${this.channelId}${this.spu}`;
            },
            mobileDetailLists(){
                if(this.pictureData.mobileDetail&&Array.isArray(this.pictureData.mobileDetail)) {
                    return this.pictureData.mobileDetail
                }else if(this.pictureData.mobileDetail&&this.pictureData.mobileDetail.mobileDetail&&Array.isArray(this.pictureData.mobileDetail.mobileDetail)){
                    return this.pictureData.mobileDetail.mobileDetail
                }
            },
        	relationDis(){
        		if(!this.pictureData.relation_template_id){
                    this.pictureData.relation_template_postion = "";
        			return true;
                }else{
        			this.pictureData.relation_template_postion = "top";
        			return false;
                }
            },
            customDis(){
                if(!this.pictureData.custom_template_id){
                    this.pictureData.custom_template_postion = "";
                    return true;
                }else{
                    this.pictureData.custom_template_postion = "bottom";
                    return false;
                }
            },
        },
        props:{
            channelId: {
                default() {
                    return 4
                }
            },
            id:{
                required:true,
            },
            pictureData:{
                required:true,
                 type:Object
            },
            spu:{
                required:true,
            },
            baseUrl:{
                default(){
                    return "";
                }
            },
            isCopy:{
                type:Boolean
            },
            trueId:{
                required:true,
                type:[String,Number]
            },
            showMobieDetail:{
                default(){
                    return false;
                }
            },
            especialIds:{//多个商品情况下传入img-add组件的id
                require: true,
                type: Array,
            },
        },
        components: {
            htmlEditor,
            dragDrop:require("../../../../components/drag-drop"),
            pictureComponent:require('../../ebay/kandeng-list/add-edit-listing/picture-component.vue').default,
            imgAdd:require('../../../../components/img-add.vue').default,
            selectImg: require('../../../../components/select-img.vue').default,
            html5Editor:require('../../../../components/html5-editor.vue').default,
            kindeditor:require('@/components/kindeditor.vue').default,
            mdfImg:require('@/view/kandeng/ebay/kandeng-list/add-edit-listing/mdf-img.vue').default,
        }
    }
</script>
