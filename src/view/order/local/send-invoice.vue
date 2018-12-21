<template>
    <div class="p-review-evaluate">
        <page-dialog title="发送invoice给买家" size="small" v-model="visible" :close-on-click-modal="false"
                     @open="open" @close="close">
            <div class="mb-sm">
                <el-form label-width="74px" ref="form" :model="forms" :rules="rules">
                    <el-form-item label="标题：" required prop="title">
                        <el-input class="inline" style="width: 90%;" type="text" v-model="forms.title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容：" required prop="content">
                        <el-input class="inline" style="width: 90%;" type="textarea" v-model="forms.content"
                                  :autosize="{ minRows: 8, maxRows: 10}"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="submit">发送</el-button>
                <el-button size="mini" @click.native="close">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-review-evaluate {
        .box-wripper {
            padding: 10px 10px 20px;
            border: 1px solid #BDCDDC;
            background-color: #F1F6FC;
        }
        .el-form-item__label {
            font-weight: bold;
        }
    }

</style>
<script>
    import {api_orders_send_invoice} from '@/api/order-local'

    export default {
        data() {
            return {
                visible: false,
                forms:{
                    title:'',
                    content: '',
                },
                rules: {
                    title: [
                        {required: true, message: "标题不能为空", trigger: "blur"}
                    ],
                    content: [
                        {required: true, message: "内容不能为空", trigger: "blur"}
                    ],
                }

            }
        },
        methods: {
            open(){
                this.forms = {
                    title:'',
                    content:''
                }
            },
            close(){
                this.visible = false;
            },
            submit() {
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let data = {
                            order_id: this.mdfid,
                            subject:this.forms.title,
                            content: this.forms.content,
                        };
                        this.$http(api_orders_send_invoice, data).then(res => {
                            this.$message({
                                message: res.message || res,
                                type: 'success'
                            });
                            this.visible = false;
                        }).catch(code => {
                            this.$message({message: code.message || code, type: 'error'})
                        })
                    }
                });
            },
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            },
        },
        props: {
            value: {},
            mdfid: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>
