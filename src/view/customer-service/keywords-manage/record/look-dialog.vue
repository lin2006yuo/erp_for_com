<template>
    <page-dialog v-model="show" :title="title" width="50%" class="keywords-look-dialog">
        <el-form :model="form" label-width="45px">
            <el-form-item label="主题：">
                <div style="border: 1px solid #ccc;">
                    <iframe style="width:100%;"
                            scrolling="auto"
                            :srcdoc="form.subject"
                            frameborder="0"
                            height="50"></iframe>
                </div>
            </el-form-item>
            <el-form-item label="内容：" >
                <div style="border: 1px solid #ccc;">
                    <iframe style="width:100%;"
                            scrolling="auto"
                            :srcdoc="form.content"
                            frameborder="0"
                            height="400"></iframe>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="show=false">关闭</el-button>
        </div>
    </page-dialog>

</template>

<script>
    export default {
        data() {
            return {
                show: false,
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        methods: {},
        props: {
            value: {},
            title: {required: true, type: String},
            form: {required: true, type: Object},
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
        },
    }
</script>

<style lang="stylus">
    .keywords-look-dialog{
        .max-heigh_single{
            flex: 1;
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>
