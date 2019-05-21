<template>
    <search-card @search="search" :clears="clears" :params="form">
        <label-item label="">
            <el-select class="inline s-width-default" v-model="form.snType"  @change="change">
                <el-option v-for=" item in typeList" :label="item.label" :value="item.value" :key="item.value">

                </el-option>
            </el-select>
        </label-item>
        <label-item label="" class="mr-lg">
            <el-input v-model="form.snText" style="width: 220px;" :placeholder="placeholder"></el-input>
        </label-item>
    <!-- <外网IP重复数> -->
        <label-item label='外网IP重复数 :'>
           <el-select class="inline s-width-small" style="width:60px;padding-left:4px" v-model="form.taskCondition">
               <el-option v-for="item of symList" :label="item.label" :value="item.value" :key="item.value">
               </el-option>
           </el-select>
        </label-item>
        <label-item label="" class="mr-lg">
            <template>        
                <el-input-number v-model="form.taskNum"
                                 style="width:100px"
                                 :min="1" 
                                 :max="999">
                </el-input-number>         
            </template>
        </label-item>
    <!-- </外网IP重复数 >-->
    </search-card>
</template>

<script>
    export default {
        data() {
            return {
                typeList: [
                    {label:'服务器名',value:'name'},
                    {label:'外网IP',value:'ip'}
                ],
                symList:[
                    {label:'>',value:'>'},
                    {label:'≥',value:'>='}
                ],
                placeholder:'支持模糊搜索',
            }
        },
        methods: {
            change(val){
                if(val==='name'){
                    this.placeholder = '支持模糊搜索'
                }else {
                    this.placeholder = '不支持模糊搜索'
                }
            },
            search() {
                this.$emit('search')
            },

        },
       props:{
           clears:{},
           form:{}
       },
        components:{
            searchCard:require('@/components/search-card').default,
            labelItem:require('@/components/label-item').default
        }
    }
</script>

<style scoped>

</style>