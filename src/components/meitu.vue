<template>
    <page-dialog v-model="show"
                 :close-on-click-modal="false"
                 title=""
                 size="large"
                 width="1300px"
                 height="800px">
        <div :id="meituId"></div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import '../lib/xiuxiu';
    import Base64 from  "@/lib/base64"
    export default {
        name: "meitu",
        data(){
            return {
                show:this.value,
                instance:null,
            }
        },
        created(){
//            console.log(`$UID:${this._uid}`);
        },
        mounted(){
        },
        methods:{
            showMeitu(){
                xiuxiu.embedSWF(this.meituId,3,"100%","100%");
                //修改为您自己的图片上传接口
                xiuxiu.setUploadDataFieldName("upload_file");
                xiuxiu.setUploadURL(`${config.host}meituupload`);
                console.log(this.sourceUrl,'this.sourceUrl');
                xiuxiu.onInit = () =>
                {
                    xiuxiu.setUploadType(3);
                    xiuxiu.loadPhoto(this.sourceUrl || "http://open.web.meitu.com/sources/images/1.jpg");//修改为要处理的图片url
                };
                xiuxiu.onSaveBase64Image = (data, fileName, fileType, id) =>{
                    this.$emit('save-base64', data, fileName, fileType, id);
                    this.show = false;
                };
                xiuxiu.onUploadResponse = function (data)
                {
                    console.log(data);
                    //这里处理
                };
                xiuxiu.onDebug = function (data)
                {
                    alert("错误响应" + data);
                }
            }
        },
        computed:{
            meituId(){
                return `menutu${this._uid}`;
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
                if(val){
                    this.$nextTick(()=>{
                        this.showMeitu();
                    });
                }else{

                }
            }
        },
        props:{
            value:{},
            sourceUrl:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog').default
        }
    }
</script>

<style scoped>
    #menutu{
        width: 500px;
        height: 500px;
    }
</style>