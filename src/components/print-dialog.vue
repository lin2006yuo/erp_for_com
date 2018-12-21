<template>
    <page-dialog :title="title"
                 size="large"
                 @open="open"
                 class="p-weighing-packages"
                 v-model="visible"
                 :close-on-click-modal="false">
        <slot name="title"></slot>
        <div style="position: relative;height: 550px ;width:900px;margin: 0 auto">
            <iframe frameborder="0"
                    :srcdoc="content"
                    style="position: absolute; left: 0;right: 0;top:20px;bottom: 0;margin: 0 auto;width: 900px;height: 550px;"
                    name="image">
            </iframe>
            <div style="display: none;">
                <slot></slot>
            </div>
        </div>
        <div slot="footer">
            <slot name="footer"></slot>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-weighing-packages {
        .dialog__body{
            overflow-y hidden !important;
        }
        .img-div {
            height: 200px;
        }
        .right-table {
            width: 100%;
            font-size: 1.2rem;
            border: 1px solid #d3dce6;
            td {
                text-align: center;
                border-bottom: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 33px;
            }
        }
    }
</style>
<script>
    const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/><title></title><style> *{margin: 0;padding: 0}img{border: none} .right-table{width: 95%;font-size: 12px;border:1px solid #d3dce6;position: absolute;bottom: 30px;left: 0;right: 0;margin: auto;}.right-table td{text-align: center;border-bottom:1px solid #d3dce6;border-right:1px solid #d3dce6;height:33px;}.bottom-none{border-bottom:none !important;}.right-none{border-right: none  !important;}</style></head><body style='margin: 0'><div>";
    const bottom = "</div></body></html>";
    export default {
        data() {
            return {
                visible: this.value,
                html:''
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            open() {
                this.$emit('open');
            }
        },
        updated(){
            this.html = this.$slots.default.filter(v=>v.tag).map(vnode =>{
                return this.__patch__(null, vnode).outerHTML || '';
            }).join('');
        },
        computed: {
            content(){
                const header = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/><title></title><style> *{margin: 0;padding: 0}img{border: none} .right-table{width: 95%;font-size: 12px;border:1px solid #d3dce6;position: absolute;bottom: 30px;left: 0;right: 0;margin: auto;}.right-table td{text-align: center;border-bottom:1px solid #d3dce6;border-right:1px solid #d3dce6;height:33px;}.bottom-none{border-bottom:none !important;}.right-none{border-right: none  !important;}</style></head><body style='margin: 0'><div>";
                const footer ='</div></body></html>'
                return header+this.html+footer;
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value: {},
            title: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        },
    }
</script>
