<template>
    <div>
        <page-dialog title="批量上传付款回单" v-model="addFormVisible" @open="open">
            <div class="mt-lg">
                <label><span class="red">*</span>  付款回单：</label>
                <image-upload v-model="images"
                              @remove-img="remove_payment_image"
                              :download-img="downloadImg"
                              :is-look="isEdit"
                              :show-download="true"
                              :maximum="20"
                              :maximize="500*1024"
                              class="inline"
                              ref="batchUploadImage">
                </image-upload>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
                <request-button req-key="batch_image_load" @click="submit">确 定</request-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import {downloadFile} from '@/lib/http';
    export default{
        data(){
            return{
                addFormVisible:false,
                removePaymentImage: [],
                images: []
            }
        },
        created(){},
        watch: {
            addFormVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.addFormVisible = val;
            }
        },
        methods: {
            open() {
                this.images = [];
            },
            submit(){
                let files = this.$refs.batchUploadImage.images;
                this.$emit('submit', files)
            },
            remove_payment_image(arr){
                this.removePaymentImage.push(...arr);
            },
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
        },
        computed: {},
        props: {
            value:{},
            isEdit: {required: true, type: Boolean},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('../../../global-components/request-button').default,
            imageUpload: require('./image-upload').default,

        }
    }
</script>
