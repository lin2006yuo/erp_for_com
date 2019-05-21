<template>
    <div>
        <published-error-search-card :total="total" @enter="search" @search="search"></published-error-search-card>
    </div>
</template>

<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return {
                total:0
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
            search(val){
                console.log("刊登异常", val);
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            publishedErrorSearchCard: require('./published-error-search-card.vue').default,//只传入一个total和抛出一个查询字段和值的对象
        }
    }
</script>

