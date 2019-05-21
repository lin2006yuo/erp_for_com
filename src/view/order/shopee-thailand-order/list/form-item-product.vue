<template>
    <el-row>
        <table class="shopee-look">
            <template v-for="(item,index) in form">
                <tr class="success-color-title">
                    <td width="16px">{{index + 1}}</td>
                    <td>商品ID: <a class="link" :href="item.channel_item_link" target="_blank">{{item.prduct_id}}</a></td>
                    <td>平台SKU：<span v-copy>{{item.sku}}</span></td>
                    <td>商品属性</td>
                    <td>商品状态</td>
                    <td>物流属性</td>
                    <td>商品备注</td>
                    <td v-copy>{{item.channel_sku_title}}</td>
                    <td class="width-xs">数量：{{item.quantity}}</td>
                </tr>
                <template>
                    <tr>
                        <td class="relevance">
                            <img src="../../../../assets/relevance.png" title="自动关联">
                        </td>
                        <td>
                            <el-popover
                                placement="right"
                                trigger="hover">
                                <img v-lazy="sku_image(item.thumb)" width="200px" height="200px">
                                <span slot="reference">
                                    <img v-lazy="item.thumb" height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td>
                           <span > SKU：{{item.sku}}</span>
                        </td>
                        <td>{{item.product_property}}</td>
                        <td>{{item.status}}</td>
                        <td>{{item.logistics}}</td>
                        <td>{{item.comment}}</td>
                        <td>
                            <div>{{item.spu_name}}</div>
                        </td>
                        <td>数量：
                            <span >{{item.quantity}}</span>
                        </td>
                    </tr>
                </template>
            </template>
        </table>
    </el-row>

</template>
<style lang="stylus">
    .shopee-look {
        width: 100%;
        box-sizing: border-box;
        border-collapse: collapse;
        border-left: 1px solid #e0e6ed;
        border-top: 1px solid #e0e6ed;
        font-size: 1.2rem;
        td, th {
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
            height: 30px;
            text-align: center;
            padding: 0 10px;
        }
        .relevance {
            vertical-align: middle;
        }
        .success-color-title {
            background-color: #E0F7E6;
        }
    }
</style>
<script>
    export default {
        permission: {},
        data() {
            return {}
        },
        methods: {
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
        },
        props: {
            form: {
                required: true,
                type: Array
            },
        },
        components: {}
    }
</script>
