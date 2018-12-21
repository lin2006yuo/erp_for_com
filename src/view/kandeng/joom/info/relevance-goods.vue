<template>
        <div>
            <div class="p-title-bg-color">
                <span>{{label}}</span>
            </div>
            <div class="p-head-border-color">
                <el-form label-width="175px">
                    <el-form-item label="产品名称：">
                        <span>{{goodsName}}</span>
                    </el-form-item>
                    <el-form-item label="本地SPU：">
                        <span>{{spu}}</span>
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <span>{{brand}}</span>
                    </el-form-item>
                    <el-form-item label="详情信息网址：">
                        <a :href="web" target="_blank">点击查看</a>
                    </el-form-item>
                    <el-form-item label="发货仓库：">
                        <el-select v-model="warehouse.warehouse" style="width:200px">
                            <el-option
                                v-for="item in warehouseList"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="添加账号：">
                        <el-button type="primary" size="mini" @click="add_account">添加平台账号</el-button>
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

            },
            add_account(){
                this.$emit('add-account')
            }
        },
        computed: {},
        watch: {},
        props: {
            label:{
                type:String,
                default(){
                    return '关联产品信息'
                }
            },
            goodsName:{},
            brand:{},
            spu:{},
            web:{},
            warehouse:{},
            warehouseList:{}
        },
        components: {}
    }
</script>

