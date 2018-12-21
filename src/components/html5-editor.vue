<template>
    <div class="c-html5-editor">
        <vue-html5-editor  :content="content" :height="300" @change="change_data"></vue-html5-editor>
    </div>
</template>
<style lang="stylus">
    /*.c-html5-editor{
        position:absolute;
        top:0;
    }*/
</style>
<script>
    import Vue from 'vue';
    import VueHtml5Editor from 'vue-html5-editor';
    Vue.use(VueHtml5Editor, {
        showModuleName: true,
        language: "zh-cn",
        image: {
            sizeLimit: 512 * 1024,
            compress: true,
            width: 500,
            height: 500,
            quality: 80
        }
    });
    export default {
       data() {
            return {}
        },
        props:{
            content:{
                required:true,
            },

        },
        methods:{
            change_data(val){
                this.$emit('change',val);
            },
        },
        components: {}
    }
</script>