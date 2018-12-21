<template>
    <div class="ui-card">
        <div class="ui-card-header" v-if="$slots.header">
            <slot name="header"></slot>
            <i :class="toggleIcon" @click="hiddenMe"></i>
        </div>
        <!--v-show="hiddenSatus !== 1"-->
        <div class="ui-card-body" v-show="hiddenSatus !== 1" ref="card" v-loading="isLoading">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
</style>
<script>

    export default{
        data(){
            return{
                hidden:this.defHidden,
                sizeMap:{
                    'large': 30,
                    'small': 25,
                    'mini': 20
                },
                showState:{
                    // transition: 'all 0.8s',
                    // visibility: 'visible',
                    // opacity: 1,
                    // height:'',
                }
            }
        },
        created(){
        },
        mounted(){

        },
        methods:{
            hiddenMe(){
                console.log('hiddenMe');
                this.hidden = !this.hidden;
            }
        },
        computed:{
            hiddenSatus(){
                if(this.options.hidden){
                    if(this.hidden){
                        return 1;
                    }else{
                        return 2;
                    }
                }else{
                    return 3;
                }
            },
            toggleIcon(){
                return this.hiddenSatus === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up';
            }
        },
        components:{

        },
        props:{
            isLoading:{
                type:Boolean,
                default(){
                    return false
                }
            },
            defHidden:{
                required:false,
                default:false
            },
            options:{
                required:false,
                default(){
                    return {
                        hidden:true
                    }
                }
            },
            size:{
                type:String,
                default(){
                    // large、small 和 mini
                    return 'mini'
                },
            }
        }
    }
</script>
