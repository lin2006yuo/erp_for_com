<template>
    <div>
        <div class="p-title-bg-color">
            <span>图片与描述</span>
        </div>
        <div class="p-head-border-color">
            <el-form label-width="150px">
                <el-form-item label="刊登图片：" requred>
                    <img-add v-model="accountInfo.images" picSize="_200x200." :showBigPic=true :base-url="baseUrl" :default-random="false"
                             :show-satch-img="false" :id="goodsId" :img-number="11" :row-count="13"></img-add>
                    <div class="p-upload__notice">注意:第一张默认为主图，支持拖动排序。像素建议为800*800的图片,最多可选20张图，每张图片大小不超过2M。</div>
                </el-form-item>
                <el-form-item label="内容描述：">
                    <div>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 30}"
                            placeholder="请输入内容"
                            v-model="accountInfo.description">
                        </el-input>
                    </div>
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
            background: #ffb732;
        }
    }
    .p-head-border-color {
        padding: 20px;
        border-left: 3px solid #ffb732;
    }
    .title-t {
        padding: 0;
        margin: 0;
        background: #EFF2F7;
        display: block;
        height: 30px;
        line-height: 30px;
    }
    .p-upload__notice{
          color: red;
      }
</style>
<script>

    export default{
        data(){
            return {
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){

            }
        },
        computed: {},
        watch: {},
        props: {
            accountInfo: {
            },
            baseUrl:{},
            goodsId:{}
        },
        components: {
            imgAdd: require('../../../../components/img-add.vue').default,
        }
    }
</script>

