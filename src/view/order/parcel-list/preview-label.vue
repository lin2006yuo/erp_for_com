<template>
    <page-dialog v-model="visible" size="full" class="c-preview-label" @open="open" @close="close"
                 :title="labelInfo.title">
        <div id="declare-page" v-html="labelInfo.content"></div>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="sure">下载
            </el-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-preview-label {
        #declare-page {
            overflow: auto;
            height: 660px;
            width: 380px;
            margin: auto;
            margin-top: 20px;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                visible: this.value,
            }
        },
        methods: {
            open() {
            },
            close() {
            },
            sure() {
                let el = document.querySelector('#declare-page');
                let elBounds = el.getBoundingClientRect();
                let bounds = {
                    left: elBounds.left,
                    right: elBounds.right,
                    top: elBounds.top,
                    bottom: elBounds.bottom,
                    width: elBounds.width,
                    height: elBounds.height,
                    x: 0,
                    y: 0,
                };
                html2canvas(el, {
                    scale: 2,
                    logging: true, //日志开关，发布的时候记得改成false
                    tainttest: true, //检测每张图片都已经加载完成
                    bounds: bounds,
                    onrendered: (canvas) => {
                        let type = 'png';
                        canvas.getContext("2d").translate(0, 0);
                        let imgData = canvas.toDataURL(type).replace(this.fix_type(type), 'image/octet-stream');
                        this.save_file(imgData);
                    }
                });
            },
            fix_type(type) {
                type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                let r = type.match(/png|jpeg|bmp|gif/)[0];
                return 'image/' + r;
            },
            save_file(data) {
                let evt = document.createEvent("MouseEvents");
                evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
                let link = document.createElement('a');
                link.download = this.labelInfo.file_name;
                link.href = data;
                link.dispatchEvent(evt);
            },
            px2pt(px, decimal = 4) {
                let dpi = getDPI();
                let num = parseInt(px);
                return (num * (72 / dpi.y)).toFixed(decimal)
            },
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            labelInfo: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>