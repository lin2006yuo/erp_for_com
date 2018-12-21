<template>
    <div>
        <page-dialog title="" v-model="visible" size="small" :close-on-click-modal="false">
            <p class="tracking"><span>SKU：{{goods_detail.sku}} 产品详情</span></p>
            <p class="bold-font">SKU：{{goods_detail.sku}} 基本信息</p>
            <hr>
            <div>
                <label class="label_width width-xs t-right inline">商品尺寸：</label>
                <span class="mr-sm">长：{{goods_detail.form.length}}cm</span>
                <span class="mr-sm">宽：{{goods_detail.form.width}}cm</span>
                <span class="mr-sm">高：{{goods_detail.form.height}}cm</span>
            </div>
            <div class="mt-sm">
                <label class="label_width width-xs t-right inline">重量：</label>
                <span>{{goods_detail.form.weight}}g</span>
            </div>
            <p class="bold-font">SKU：{{goods_detail.sku}} 产品图片</p>
            <hr>
            <div>
                <p v-if="goods_detail.form.pictures.length === 0">此产品还没有上传图片！</p>
                <div v-if="goods_detail.form.pictures.length > 0">
                    <img width="100" height="100" class="mr-md" v-for="item in goods_detail.form.pictures" :src="item" :key="item">
                </div>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .label_width{
        width: 80px;
        text-align: right;
    }
    .tracking{
        position: absolute;
        top:0;
        z-index: 999;
    }
</style>
<script>
    export default {
        data(){
            return {
                visible:false,
            }
        },
        methods: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            goods_detail:{
                required:true,
                type:Object
            },
        },
        components: {
            pageDialog:require("@/components/page-dialog.vue").default
        },
    }
</script>
