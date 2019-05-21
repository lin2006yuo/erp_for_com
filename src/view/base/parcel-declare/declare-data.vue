<template>
    <div class="p-declare-data">
        <div v-for="list in lists">
            <div class="mt-xs mb-xs">{{list.title}}</div>
            <el-card>
                <div v-for="data in list.data">
                    <div v-if="data.type==2">
                        <el-radio class="radio" v-model="list.radio" :label="data.key">{{data.title}}</el-radio>
                    </div>
                    <div v-if="data.type==1">
                        <el-select v-model="data.val" class="inline" style="width:300px" filterable clearable>
                            <el-option
                                    :key="index"
                                    v-for="(item,index) in data.condition"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                        <label class="p-color">{{data.desc}}</label>
                    </div>
                    <div v-if="data.type==5">
                        <el-checkbox v-model="data.checked" >{{data.title}}</el-checkbox>
                        <el-input v-model="data.val" class="inline" :disabled="!data.checked" style="width:90px"></el-input>
                        <label>{{data.unit}}</label>
                        <label class="p-color">{{data.desc}}</label>
                    </div>
                    <div v-if="data.type==6" class="mt-xs">
                        <el-radio class="radio" v-model="list.radio" :label="data.key">{{data.title}}</el-radio>
                        <el-select v-model="data.val" class="inline" :disabled="data.key!=list.radio" v-if="!polyType(data)" style="width:90px">
                            <el-option
                                    :key="index"
                                    v-for="(item,index) in data.condition"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                        <el-input v-model="data.other" class="inline" :disabled="data.key!=list.radio" style="width:90px"></el-input>
                        <label>{{data.unit}}</label>
                        <div v-if="data.child.length>0" v-for="child in data.child" style="display: inline-block;padding-left: 5px;">
                            <div v-if="child.type==5">
                                <el-checkbox v-model="child.checked" >{{child.title}}</el-checkbox>
                                <el-input v-model="child.val" class="inline" :disabled="!child.checked" style="width:90px"></el-input>
                                <label>{{child.unit}}</label>
                                <label class="p-color">{{child.desc}}</label>
                            </div>
                          <!--  <declare-data :lists="data.child" :cardShow="false"></declare-data>-->
                        </div>
                        <label class="p-color">{{data.desc}}</label>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<style lang="stylus">
</style>
<script>

    export default{
       /* name:'declare-data',*/
        data(){
            return {
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            polyType(data){
                if(data.condition instanceof Array){
                    return true
                }else{
                    return false
                }
            },
        },
        filters: {},
        watch: {
            lists(val){
                console.log(val)
            }
        },
        props: {
            lists:{},
            cardShow:{}
        },
        components: {}
    }
</script>