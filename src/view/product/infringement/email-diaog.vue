<template>
    <page-dialog
        width="670px"
        v-model="emial_diaog"
        :title="title"
        @close='close'
    >
        <editor id="20"
                height="500px"
                :content="public.email_content"
                :items="curItems"
                bodyClass="new-ke-kindeditor"
                :filterMode="false"
                :loadStyleMode="false"
                style="margin: 0 auto">
        </editor>
    </page-dialog>
</template>

<script>
    export default {
        data(){
            return{
                emial_diaog:this.value,
                curItems:['source']
            }
        },
        methods:{
            close(){
                this.$emit('close')
            }
        },
        watch:{
            value(val){
              this.emial_diaog=val;
            },
            emial_diaog(val){
                this.$emit('input',val)
            }
        },
        props: {
            value:{},
            title: {
                type: String,
                required: true,
            },
            public: {
                type: Object,
                required: true,
            }

        },
        components:{
            pageDialog:require("@/components/page-dialog").default,
        }
    }
</script>

<style scoped>

</style>
