<template>
    <div class="c-reference-value">
        <label>{{$t('ymx-detail.reference')}}：</label>
        <span v-for="(ref,ref_index) in referenceValue" class="operate" @click="click_reference(ref)">
              <label class="reference-value">{{ref}}</label>
              <label v-if="ref_index!==referenceValue.length-1">&nbsp;&nbsp;</label>
        </span>
    </div>
</template>
<style lang="stylus" scoped>
    .c-reference-value{
        .reference-value{
            color:#6699FF;
            cursor: pointer;
            font-size:1.35rem;
            &:hover{
                color:#074791;
                text-decoration:underline;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                referenceValue:['baby','boys','girls','mens','unisex','womens','youth','unisex-adult','unisex-child','baby-boys','baby-girls','unisex-baby']
            }
        },
        methods:{
            click_reference(ref){
                this.$emit('click-reference',ref);
            },
        },
        components:{

        }
    }
</script>
