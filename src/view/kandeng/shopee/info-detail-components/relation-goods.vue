<template>
    <div class="c-relation-goods">
        <rainbow-header title="关联商品信息" backgroundColor="#E70012">
            <el-form :model="form" label-width="220px">
                <el-form-item label="产品名称：">{{form.name}}</el-form-item>
                <el-form-item label="本地SPU：">{{form.spu}}</el-form-item>
                <el-form-item label="产品品牌：">{{form.brand}}</el-form-item>
                <el-form-item label="本地分类：">{{form.category}}</el-form-item>
                <el-form-item label="来源渠道：" v-if="curPage==='not'">
                    <el-button type="primary" size="mini" class="inline" @click.native="add_account">添加账号</el-button>
                </el-form-item>
            </el-form>
        </rainbow-header>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            /**
             * 添加账号
             */
            add_account(){
                this.$emit('add-account');
            },
        },
        props:{
            /***
             *当前页面的参数
             */
            form:{
                type:Object,
                required:true
            },
            /*curPage 判断当前页面的使用场景
            * */
            curPage:{
                type:String,
                required:true
            }
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>