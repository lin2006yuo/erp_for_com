<template>
    <page class="p-attributes-info">
        <el-form :model="checkForm" :rules="rules" label-width="180px">
            <!--属性-->
            <card label="产品属性" v-if="checkForm.attributes.length>0">
                <card class="attr-card" :label="p.group_name" v-for="p in checkForm.attributes" :key="p.group_name">
                    <div v-for="data in p.attributes" class="p-col_margin" :key="data.name">
                        <el-checkbox v-model="data.enabled" :disabled="markId===1">
                            <label class="p-argument">{{data.name}}</label>：
                            <el-input class="inline" v-if="data.type==2" v-model="data.attribute_value" :disabled="markId===1"></el-input>
                            <el-checkbox v-for="item in data.attribute_value" :key="item.value" v-model="item.selected" :disabled="markId===1"  v-else>
                                <div v-show="item.icon!=''" style="display: inline-block;">
                                    <span class="p-span_color" :style="{backgroundColor:item.icon}" v-if="/^#/g.test(item.icon)"></span>
                                    <img  :src="item.icon"  width="26px" height="26px" style="vertical-align:middle;" v-else>
                                </div>
                                <span>{{item.value}}</span>
                            </el-checkbox>
                        </el-checkbox>
                    </div>
                </card>
            </card>
        </el-form>
    </page>
</template>
<style lang="stylus">
    .p-attributes-info{
        .el-checkbox__label{
            white-space: initial;
        }
        .attr-card{
            .card-label{
                padding: 10px 20px 0 30px;
                border-bottom: 0;
            }

        }
    }

</style>
<script>
    import card from '../../../components/card.vue';
    export default{
        data(){
            return {
                rules:{}
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {},
        filters: {},
        watch: {},
        computed: {},
        props: {
            checkForm:{
                required:true,
                type:Object
            },
            markId:{},
        },
        components: {
            card,
        }
    }
</script>