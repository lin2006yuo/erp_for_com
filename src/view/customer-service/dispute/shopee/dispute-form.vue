<template>
    <page-dialog class="form-shopee-dispute"
                 title="向shopee提出争议"
                 v-model="showDialog"
                 :close-on-click-modal="false"
                 @close="close"
                 size="small">
        <el-form label-width="80px" :model="disForm" ref="form" :rules="rules" class="mt-sm">
            <el-form-item label="选择理由：" required>
                <el-select v-model="disForm.dispute_reason"
                           placeholder="请选择理由"
                           filterable clearable>
                    <el-option
                            :key="item.value"
                            v-for="item in reasonList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="原因：" required>
                <el-input type="text" v-model="disForm.dispute_text_reason" placeholder="请填写您的原因"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址：" required prop="email">
                <el-input v-model="disForm.email" placeholder="请输入您的电子邮件地址"></el-input>
            </el-form-item>
            <el-form-item label="证据：">
                <div v-for="(item, index) in imgList" :key="index" class="inline mr-xs shopee-image-box">
                    <img :src="item.file.src" width="100%" height="100%">
                    <i class="shopee-delete-icon" @click="del(index)"></i>
                </div>
                <span class="shopee-add-icon" v-if="imgList.length < 3" @click="add_pic"></span>
                <div v-if="imgList.length>0">
                    <span>共{{imgList.length}}张图片,共{{bytesToSize(size)}},最多三张</span>
                </div>
                <input type="file" ref="input" hidden multiple @change="handleChange" accept="image/jpeg,image/jpg,image/png,image/svg">
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini"
                       type="primary"
                       @click="submit">确定</el-button>
            <el-button size="mini" @click.native="showDialog=false">取消</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" scoped>
    .shopee-image-box{
        width: 100px;
        height: 100px;
        border: 1px solid #00b7ee
    }
   .shopee-add-icon{
       width:100px;
       height:100px;
       display: inline-block;
       vertical-align: middle;
       text-align:center;
       background: url("../../../../../src/assets/add-image-icon.png") no-repeat center;
       background-position: center center;
       background-size: 35% 35%;
   }
    .shopee-delete-icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        background-color: rgba(255, 255, 255, 1);
        transition: all 0.2s;
        &:hover {
            background-color: rgba(0, 0, 0, .1);
            border-radius: 3px;
        }
    }
    .shopee-delete-icon {
        border-radius: 8px;
        background: url('../../../../assets/delete(2).png') no-repeat center;
    }
    .shopee-delete-icon{
        position: relative;
        top: -112px;
        left: 80px
    }
</style>

<script>
    import pageDialog from "@/components/page-dialog.vue";
    export default {
        name: "dispute-form",
        data() {
            return {
                showDialog: this.value,
                reasonList: [//理由
                    {label: '拒绝买方退货申请', value: 'OTHER'},
                    {label: '同意买方退货申请,我方还未收到货', value: 'NOT_RECEIVED'},
                ],
                rules: {//规则
                    email: [
                        {type: 'email', message: '请输入正确的邮箱地址',trigger: 'blur,change'}
                    ]
                },
                imgList:[],
                size: 0
            }
        },
        methods: {
            close(){
                this.imgList = []
            },
            submit(){
                if(this.disForm.dispute_reason === '' || this.disForm.dispute_text_reason === '' || this.disForm.email === ''){
                    this.$message({type: 'warning', message: '请填写必填项'})
                }else{
                    this.$emit('submit-dispute')
                }
            },
            add_pic(){
                this.$refs.input.click();
            },
            handleChange(ev){
                if(!ev.target.files[0].size) return
                this.fileList(ev.target.files);
                ev.target.value = ''
            },
            fileList(files){
                for(let i = 0; i < files.length; i++){
                    this.fileAdd(files[i])
                }
            },
            fileAdd(file){
                this.size = this.size + file.size;
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    file.src = e.target.result;
                    this.imgList.push({
                        file
                    });
                    this.disForm.files.push({
                        name: file.name,
                        size: file.size,
                        image: file.src
                    });
                }
            },
            bytesToSize(bytes){
                if (bytes === 0) return '0 B';
                let k = 1000, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            },
            del(index){
                this.size = this.size - this.imgList[index].file.size;//总大小
                this.imgList.splice(index, 1);
            },
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            }
        },
        props: {
            value: {
                type:Boolean,
                default(){
                    return false;
                },
            },
            disForm: {
                type: Object
            }
        },
        components: {
            pageDialog,
        }
    }
</script>