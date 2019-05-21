<template>
        <div class="mui-select">
            <sin-select :size="size" class="sin-select" :options="options" @select="change"></sin-select>
            <template v-if="subs">
                <mui-select :parent="subindex" :select="select" :size="size" @selected="selected"></mui-select>
            </template>
        </div>
</template>
<style lang="stylus">
    .mui-select{
        display: inline;
        .sin-select{
            min-width: 80px;
            font-size: 1.2rem;
        }
    }
</style>
<script>
    import sinSelect from './sin-select';
    export default{
        name:'mui-select',
        data(){
            return {
                subindex:''
            }
        },
        methods:{
            change(change){
                this.subindex = change;
                this.$emit('selected', {isLast:!this.subs,value:change});
            },
            selected(selected){
                this.$emit('selected', selected);
            }
        },
        computed:{
            subs(){
                if(this.subindex === ''){
                    return false;
                }
                if(this.select && this.select[this.subindex].child_ids.length > 0){
                    return true;
                }else{
                    return false;
                }
            },
            options(){
                if(this.parent===0){
                    return this.select.child_ids.map(id=>{
                        return this.select[id];
                    })
                }else{
                    return this.select[this.parent].child_ids.map(id=>{
                        return this.select[id];
                    })
                }
            }
        },
        update(){
            console.log('update!!!');
        },
        props:{
            select:{
                type:Object
            },
            size:{
                default:function(){
                    return 5;
                }
            },
            parent:{

            }
        },
        components: {
            sinSelect
        }
    }
</script>
