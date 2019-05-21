<template>
    <div >
        <el-card>
           <div class="out-box">
               <label-item label="产品物流属性：">
                   <el-input placeholder="请输入物流属性" v-model="searchData.transport_property"></el-input>
               </label-item>
                <label-item label="售价区间： " class="ml-lg">
                    <!--<ui-limit-number type="Number" placeholder="00.00" :limit="2" v-model="searchData.from_price"></ui-limit-number>-->
                    <!--&#45;&#45;-->
                    <!--<ui-limit-number type="Number" placeholder="99999.99" :limit="2" v-model="searchData.to_price"></ui-limit-number>-->
                    <el-input v-model="searchData.from_price" style="width: 100px"></el-input>
                     <span > -- </span>
                    <el-input v-model="searchData.to_price" style="width: 100px"></el-input>
                </label-item>
               <label-item label="创建人： " class="ml-lg">
                   <el-input placeholder="请输入创建人" v-model="searchData.creator_name"></el-input>
               </label-item>
               <div class="function ml-lg">
                   <el-button size="mini" type="primary" @click.native="search">搜索</el-button>
                   <el-button size="mini" type="primary" @click.native="clears">清空条件</el-button>
               </div>
           </div>
        </el-card>
    </div>
</template>
<style scoped>
    .out-box{
        display: flex;
        align-items: center;
    }
</style>
<script>
    export default {
        methods: {
            data() {
                return {

                }
            },
            clears() {
                this.searchData.transport_property='',
                    this.searchData.from_price='',
                    this.searchData.to_price='',
                    this.searchData.creator_name=''
            },
            search(){
                this.$emit('search')
            }
        },
        props:{
            searchData:{
                type:Object,
            }
        },
        components:{
            ulLimitNumber:require('@/components/ui-limit-number.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card').default,
        }
    }
</script>

