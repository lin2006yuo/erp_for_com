<template>
    <page-dialog title="查看"
                 size="small"
                 class="c-forecast-look"
                 v-model="lookVisible"
                 :close-on-click-modal="false">
        <label-item label="预报品类：">
            <span>{{forecastDetail.third_category_name}}</span>
        </label-item>
        <label-item label="SKU：">
            <span>{{forecastDetail.sku}}</span>
        </label-item>
        <label-item label="产品名称：">
            <span>{{forecastDetail.title}}</span>
        </label-item>
        <label-item label="申报价值$：">
            <span>{{forecastDetail.declared_value}}</span>
        </label-item>
        <label-item label="中文申报品名：">
            <span>{{forecastDetail.declared_name_zh}}</span>
        </label-item>
        <label-item label="英文申报品名：">
            <span>{{forecastDetail.declared_name}}</span>
        </label-item>
        <label-item label="货物属性：">
            <span>{{goods_props}}</span>
        </label-item>
        <label-item label="预报重量：">
            <span>{{forecastDetail.weight}}</span>
        </label-item>
        <label-item label="长宽高尺寸(cm)：">
            <span>{{`长：${forecastDetail.length}  宽：${forecastDetail.width}  高：${forecastDetail.height}`}}</span>
        </label-item>
        <label-item label="海关编码：">
            <span>{{forecastDetail.hs_code}}</span>
        </label-item>
        <label-item label="产品图片：">
            <span class="category-img">
                <img v-for="item in forecastDetail.thumb" class="category-img" v-lazy="sku_image(item)" width="100" height="100">
            </span>
        </label-item>

        <div slot="footer">
            <el-button size="mini" @click.native="lookVisible = false">关闭</el-button>
        </div>

    </page-dialog>
</template>

<style lang="stylus">
    .c-forecast-look {
        .c-label-item {
            display: block;
            line-height: 28px;
            label, span {
                vertical-align: top;
                display: inline-block;
                font-size: 1.6rem;
            }
            label {
                width: 30%;
                text-align: right;
            }
            span {
                max-width: 70%;
            }
        }
        .category-img {
            display: inline-block;
            vertical-align: top;
        }
    }
</style>

<script>
    export default {
        data() {
            return {
                lookVisible: false,
            }
        },
        methods: {
            sku_image(images) {
                try {

                    console.log('change image src', images);
                    if (!!images) {
                        return images.replace('_60x60.', '_100x100.')
                    }
                    return ""
                } catch (e) {
                    console.log(e);
                }
            },
        },
        computed: {
            goods_props() {
                switch (this.forecastDetail.contain_battery) {
                    case 0:
                        return '普货';
                    case 1:
                        return '含电池';
                    case 2:
                        return '蓄电池';
                    default:
                        return '';
                }
            }
        },
        watch: {
            lookVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.lookVisible = val;
            }
        },
        props: {
            value: {},
            id: {},
            forecastDetail: {
                type: Object
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default
        }
    }
</script>
