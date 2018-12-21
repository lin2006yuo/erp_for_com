<template>
    <div class="p-add-images">
        <page-dialog size="large" left="30%" width="550px" v-model="picVisable" title="图片" @change="change_dialog">
            <el-row class="mb-sm">
                <input type="file" ref="input" hidden @change="handleChange" :multiple="true">
                <el-button type="primary"
                            size="mini"
                            @click="$refs.input.click();">添加本地图片</el-button>
                <el-popover
                        v-model="webUrl"
                        placement="top"
                        trigger="click">
                    <div>
                        <label>图片地址：</label>
                        <el-input v-model="imgUrl" placeholder="多个地址以 | 隔开"  class="inline" style='width:300px;'></el-input>
                        <el-button  type="primary" size="mini" @click="add_url">确定</el-button>
                    </div>
                    <span  slot="reference" >
                        <el-button type="primary" size="mini">添加网络图片</el-button>
                    </span>
                </el-popover>
            </el-row>
            <el-table
                    height="500"
                    :data="allpic"
                    border
                    class="scroll-bar"
                    @selection-change="selection_change">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        label="图片"
                        inline-template
                >
                    <div>
                        <img :src="row.path" height="26px"width="26px">
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer" >
                <el-button type="primary" @click="submit" size="mini">确认</el-button>
                <el-button @click.native="picVisable=false" size="mini">取 消</el-button>
            </div>
        </page-dialog>

    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_wish_image,api_wish_image_web} from "../../../../../api/kandeng";
    import {api_aliexpress_image } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                allpic:[],
                picSelect:[],
                picVisable:false,
                isSinge:false,
                webUrl:false,
                imgUrl:"",
                value_id:"",
                attribute_id:"",
            }
        },
        watch:{
            id(val){
                console.log("val",val)
            }
        },
        methods:{
            //添加网络图片
            add_url(){
                this.$http(api_wish_image_web,{id:this.id,images:this.imgUrl}).then(res=>{
                    this.$message({type:"success",message:res.message||res})
                    this.get_pic();
                }).catch(code=>{
                   this.$message({message:code.message||code,type:'error'})
                })
            },
            //选中
            selection_change(val){
                this.picSelect=val;
            },
            //获取图片列表
            get_pic(){
                this.allpic=[];
                this.$http(api_aliexpress_image,{goods_id:this.id}).then(res=>{
                    this.allpic=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //保存
            submit(){
                if(this.isSinge){
                    this.picVisable=false;
                    this.$emit("submit",this.picSelect)
                }else {
                    if(this.picSelect.length===1){
                        this.picVisable=false;
                        this.$emit("submit",this.picSelect)
                    }else {
                        this.$message({
                            type:"error",
                            message:"替换只能选择一张图片"
                        })
                    }
                }

            },
            //添加图片
            handleChange(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                let images=[];
                fileArr.forEach((file,index)=>{
                    let  reader = new FileReader();
                    reader.readAsDataURL(file) ;
                    reader.onload =(e)=> {
                        let  imgs = e.target.result;
                        let parm = {
                            name:file.name,
                            image: imgs,
                        };
                        if(this.value_id!==""&&this.attribute_id!==""){
                            parm.attribute_id=this.attribute_id;
                            parm.value_id=this.value_id
                        }
                        images.push(parm);
                    }
                });
                setTimeout(()=>{
                    this.$http(api_wish_image,{id:Number(this.id),images:images}).then(res=>{
                        this.$message({type:"success",message:res.message||res})
                        this.get_pic();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                },100)

            },
            //弹框关闭打开
            change_dialog(val){
                if(!val){
                     this.picSelect=[];
                     this.value_id="";
                     this.attribute_id="";
                }else {
                    this.get_pic();
                }
            }
        },
        watch:{
            value(val){
                this.picVisable=val
            },
            picVisable(val){
                this.$emit("input",val)
            }
        },
        props:{
            value:{},
            id:{},
        },
        components:{
            pageDialog:require("../../../../../components/page-dialog.vue")
        }
    }
</script>
