<template>
    <div class="c-card-search">
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <div>
                <label-buttons class='inline' label="状态：" v-sf.status
                               @select="select" :buttons="buttons"></label-buttons>
            </div>
            <label-item label="平台：" class="inline mr-sm">
                <el-input v-model="searchData.channelName" class='width-super'></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                buttons:[
                    {label:'全部',value:''},
                    {label:'已启用',value:0},
                    {label:'已停用',value:1},
                ],
                authorization:[
                    {label:'1号',value:''},
                    {label:'2号',value:1},
                    {label:'3号',value:0},
                ]
            }
        },
        methods:{
            search(){
                this.$emit('search');
            },
            select(index){
                this.searchData.status = this.buttons[index].value;
                this.$emit('select');
            },
        },
        props:{
            searchData:{},
            clears:{},
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,

        }
    }
</script>