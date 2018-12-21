<template>
    <div>
        <div class="p-title-bg-color">
            <span>{{$t('ymx-detail.image')}}</span>
        </div>
        <div class="p-head-border-color">
            <el-form label-width="100px">
                <el-form-item label="">
                    <div v-for="(item, index) in form.images" :key="index" style="margin-bottom: 10px;">
                        <p class="title-t" style="margin-left: 1px;margin-bottom: 5px;">
                            <span v-if="item.name==='主图'">{{$t('ymx-detail.mainPic')}}：</span>
                            <span v-if="item.name!=='主图'">{{$t('ymx-detail.subSku')}}：{{item.name}}</span>
                            <span v-if="item.name!=='主图'" class="fr"><el-checkbox :value="true"></el-checkbox>{{$t('ymx-detail.swatch')}}</span>
                        </p>
                        <img-add v-model="item.images"
                                 :default-random="rondom"
                                 :show-swatch-img="item.name!=='主图'"
                                 :id="item.goods_id"
                                 :baseUrl="item.baseUrl"></img-add>
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
</style>
<script>
    export default{
        data(){
            return {
                img:[],
                baseUrl:'',
            }
        },
        computed: {
            edit(){
                return String(this.editId);
            }
        },
        props: {
            editId:{},
            form:{
                required:true,
                type:Object
            },
            labelWidth:{
                type:String
            },
            rondom:{}
        },
        components: {
            imgAdd: require('../../../../components/img-add.vue').default,
            htmlEditor: require("../amazon-plan-publish/only-blod-edit.vue").default
        }
    }
</script>

