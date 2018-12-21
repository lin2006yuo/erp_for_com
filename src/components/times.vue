<template>
    <div>
        <span :title="timeFilter">{{time|secFilter(hasHMS)}}</span>
    </div>

</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        props: {
            time: {
                required: true,
            },
            hasHMS:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        computed: {
            timeFilter() {
                return datef('YYYY-MM-dd HH:mm:ss', this.time);
            }
        },
        filters: {
            secFilter(val,bool) {
                return datef(bool?'YYYY-MM-dd HH:mm:ss':'YYYY-MM-dd', val);
            },

        },
        components: {}
    }
</script>
