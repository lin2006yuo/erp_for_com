<template>
    <div class="c-muti-upload">
        <draggable v-model="images"
                   class="images">
            <div class="inline pointer"
                 @click="$refs.input.click()"
                 v-if="edit">
                <i class="el-icon-upload2"></i> {{label}}
            </div>
            <div v-for="(image,index) in images"
                 :key="index">
                <div class="image-item inline">
                    <i class="el-icon-document"></i>
                    <span class="pointer"
                          :title="title(image)"
                          @click="look_at(image)">
                        {{image.file_name}}
                    </span>
                    <span v-for="item in get_operation(image)"
                          :key="item.value" class="operate ml-xs"
                          @click="operate(image,item,index)">{{item.label}}
                    </span>
                </div>
            </div>
        </draggable>
        <input type="file"
               ref="input"
               hidden
               @change="change"
               :accept="accept"
               :multiple="multiple">
        <page-dialog title="查看大图"
                     v-model="enlargeShow"
                     size="small"
                     class="enlarge-image-dialog">
            <div align="center">
                <img :src="imgPath" class="img-style">
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus" scoped>
    .img-style{
        width :200px;
    }
</style>

<script>
    export default {
        name: "multi-upload",
        data() {
            return {
                tempUid:'',
                tempIndex:'',
                operation:[
                    {label:'替换',value:'replace',action(row,item,index){
                            this.tempIndex=index;
                            this.tempUid=row.file_name;
                            this.$refs.input.click();
                        }
                    },
                    {label:'删除',value:'delete',action(row){
                            console.log(row,this.images,'this.images');
                            let index=this.images.findIndex(img=>img.file_name===row.file_name);
                            if(index!==-1)this.images.splice(index,1);
                        }
                    },
                    {label:'下载',value:'download',action(row){
                            console.log(row,'tets download');
                            this.$emit('download',row);
                        }
                    }
                ],
                enlargeShow:false,
                imgPath:''
            }
        },
        methods: {
            change(ev){
                const files=ev.target.files;
                if(!files)return;
                let fileArr = Array.prototype.slice.call(files);
                let file=fileArr[0];
                let  reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload =(e)=> {
                    let param = {
                        file_content:e.target.result,
                        file_name:file.name,
                        // size:file.size,
                        path:URL.createObjectURL(file),
                        is_add:true
                    };
                    console.log(param.file_name,this.images);
                    if(this.tempUid){
                        let index=this.images.findIndex(row=>row.file_name===param.file_name);
                        console.log(index,'test index');
                        if(index!==-1){
                           this.$message({type:'warning',message:'该文件已选'});
                            this.$refs.input.value=null;
                            return;
                        }else{
                            Object.assign(this.images[this.tempIndex],param);
                            this.tempUid='';
                            this.tempIndex='';
                            return;
                        }
                    }else {
                        if(this.images.length<this.limit){
                            this.images.push(param);
                        }else{
                            this.$message({type:'warning',message:`最大限制${this.limit}张图片`})
                        }
                        this.$refs.input.value=null;
                        return;
                    }
                }
            },
            title(image){
                let arr=['gif','jpg','jpeg','png'];
                let name=image.file_name.substring(image.file_name.lastIndexOf('.')+1).toLowerCase();
                if(arr.includes(name))return '点击查看大图';
            },
            look_at(image){
                let arr=['gif','jpg','jpeg','png'];
                let name=image.file_name.substring(image.file_name.lastIndexOf('.')+1).toLowerCase();
                if(arr.includes(name)){
                    this.imgPath=image.path;
                    this.enlargeShow=true;
                }
            },
            get_operation(image){
                return this.operation.filter(row=>{
                    switch (row.value){
                        case 'replace':
                            return this.edit;
                        case 'delete':
                            return this.edit;
                        case 'download':
                            return !image.is_add&&this.edit;
                    }
                })
            },
            operate(row,operate,index){
                operate.action.call(this,row,operate,index);
            },
        },
        props: {
            label:{
                type:String,
                default:'上传图片'
            },
            images:{
                type:Array,
                default:[],
            },
            multiple:{
                type:Boolean,
                default:true
            },
            accept:{
                default:'image/gif,image/jpeg,image/jpg,image/png,image/svg,application/pdf'
            },
            limit:{
                type:Number,
                default:999
            },
            edit:{
                type:Boolean,
                default:true
            }
        },
    }
</script>

