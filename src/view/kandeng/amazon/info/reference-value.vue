<template>
    <div class="c-reference-value">
        <label>参考值：</label>
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
                referenceValue:['adults','babies','birds','cats','children','dogs','fish','insects','men','reptiles,amphibians',
                    'women','horses','house-cats','industrial_product','hamsters,guinea-pigs,ferrets,rabbits,chichillas,rats,mice',
                    'hamsters,guinea-pigs,ferrets,rabbits,chinchillas,rats,mice'],
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