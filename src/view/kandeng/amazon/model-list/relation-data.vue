<template>
    <div class="c-relation-data">
        <rainbow-header background-color="#FF6C36" title="关联产品信息">
            <el-form :model="form" label-width="220px">
                <el-form-item label="本地SPU：">{{form.spu}}</el-form-item>
                <el-form-item label="产品名称：">{{form.goods_name}}</el-form-item>
                <el-form-item label="本地分类：">{{form.category_id}}</el-form-item>
                <el-form-item label="本地品牌：">{{form.brand}}</el-form-item>
                <el-form-item label="平台站点：">
                    <el-checkbox-group v-model="form.siteList" fill="#20a0ff" text-color="#fff">
                        <el-checkbox-button v-for="item in form.sites"
                                            :key="item.value"
                                            :label="item.value" :disabled="!!item.used">{{item.label}}</el-checkbox-button>
                    </el-checkbox-group>
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
            return {

            }
        },
        watch:{
            'form.siteList':{
                deep:true,
                handler(new_,old) {
                    if(new_&&old){
                        if(new_.length>old.length){
                            let find = new_.find(row=>!old.includes(row));
                            if(find)this.$emit('add-site',find)
                        }else if(new_.length<old.length){
                            let find = old.find(row=>!new_.includes(row));
                            if(find)this.$emit('del-site',find)
                        }
                    }
                }
            }
        },
        props: {
            form: {}
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>