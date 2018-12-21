<template>
    <div class="c-picture-describe">
        <rainbow-header title="图片与描述" background-color="#68BA5A">
            <el-form :model="form" label-width="220px">
                <el-form-item :label="`刊登图片 (${form.images.length}/9)：`">
                    <img-add :is-kandeng="true"
                             v-model="form.images"
                             :id="form.goods_id"
                             :baseUrl="form.base_url"
                             :need-clear-all="true"
                             :show-swatch-img="false"
                             :defaultRandom="form.curpage==='not'"
                             :img-number="9"></img-add>
                    <div class="bold-font mt-sm" style="font-size:1.3rem">图片可拖动排序，每个商品最多可以上传9张图片</div>
                </el-form-item>
                <el-row class="mb-sm" v-if="form.curPage==='not'">
                    <el-col :span="3" class="t-right">
                        <el-radio class="radio" v-model="form.radioData" :label="0">英文描述 ({{form.description.length}}/3000)：</el-radio>
                    </el-col>
                    <el-col :span="21">
                        <el-input v-model="form.description"
                                  :disabled="form.radioData!==0"
                                  :autosize="{minRows: 15, maxRows: 20}"
                                  type="textarea"></el-input>
                    </el-col>
                </el-row>
                <el-row class="mb-sm" v-if="form.curPage==='not'">
                    <el-col :span="3"  class="t-right">
                        <el-radio class="radio" v-model="form.radioData" :label="1">中文描述 ({{form.description_zh.length}}/3000)：</el-radio>
                    </el-col>
                    <el-col :span="21">
                        <el-input v-model="form.description_zh"
                                  :disabled="form.radioData!==1"
                                  :autosize="{minRows: 15, maxRows: 20}"
                                  type="textarea"></el-input>
                    </el-col>
                </el-row>
                <el-form-item :label="`商品描述 (${form.description.length}/3000)：`" v-if="form.curPage!=='not'">
                    <el-input v-model="form.description"
                              :autosize="{minRows: 15, maxRows: 20}"
                              type="textarea"></el-input>
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
        props:{
            form:{
                type:Object,
                required:true
            },
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
            imgAdd:require('@/components/img-add.vue').default,
        }
    }
</script>