<template>
    <div>
        <div v-for="(item,index) in productAttr" :key="index" style="padding:20px 0;">
            <label>{{item.group_name}}：</label>
            <div style="padding:10px 5px;">
                    <span v-for="attr in item.attributes" :key="index"
                          style="padding:5px;">{{attr.name}}</span>
            </div>
        </div>
    </div>
</template>

<style lang="stylus">

</style>
<script>

    export default{

        data(){
            return {}
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
            productAttr:{

            }
        },
        components: {}
    }
</script>

