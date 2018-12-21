<template>
    <div>
        <div class="p-title-bg-color">
            <span>{{label}}</span>
        </div>
        <div class="p-head-border-color">
            <el-form label-width="266px">
                <el-form-item :label="`${$t('ymx-detail.localspu')}：`">
                    <span>{{form.header.spu}}</span>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.pName')}：`">
                    <span>{{form.header.goods_name}}</span>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.category')}：`">
                    <span>{{form.header.category_name}}</span>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.brand')}：`">
                    <span>{{form.header.brand}}</span>
                </el-form-item>
                <el-form-item label="来源渠道：" v-if="showBtn==='not'||showBtn==='copy'||showBtn==='draft'">
                    <el-button type="primary"
                               size="mini"
                               @click="add_account">{{$t('ymx-detail.addAcc')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="stylus" type="text/stylus" scoped>
    .p-title-bg-color {
        background: #FAECE7;
        span {
            color: #FFF;
            font-weight: bold;
            padding: 5px 10px;
            font-size: 1.7rem;
            display: inline-block;
            background: #FF6C36;
        }
    }
    .p-head-border-color {
        padding: 20px;
        border-left: 3px solid #FF6C36;
        .head-list{
            display inline-block;
            width 200px;
            text-align right;
        }
    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        methods: {
            add_account(){
                this.$emit('add-account')
            },
            quote_model(){
                this.$emit('quote-model');
            },
        },
        props: {
            label:{
                type:String,
                default(){
                    return this.$t('ymx-detail.relation')
                }
            },
            form:{
                required:true,
                type:Object,
            },
            showBtn:{
                required:true,
                type:String,
            }
        },
        components: {}
    }
</script>

