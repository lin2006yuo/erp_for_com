<template>
    <div class="c-template-variable">
            <label class="bold-font">{{label}}</label>
            <ul class="list">
                <li class="ml-lg" v-for="(item,index) in variable" :key="index" @click="cur_item(item)">
                    <label class="operate bold-font">{{item}}</label>
                </li>
            </ul>
    </div>
</template>
<style lang="stylus">
    .c-template-variable{
        >ul.list{
             /*list-style: disc inside;*/
            >li{
                &:before{
                    content:"";
                    margin-right:-18px;
                 }
                label.operate{
                    color: #2305F8;
                    cursor: pointer;
                    user-select: none;
                    -ms-user-select: none;
                    -moz-user-select: none;
                    -webkit-user-select: none;
                }
             }
         }
    }
</style>
<script>

    export default{
        data(){
            return {}
        },
        methods:{
            cur_item(item){
                this.$emit("cur-item",item)
            }
        },
        props:{
            label:{
                require:true,
            },
            variable:{
                require:true,
                type:Array
            }
        },
        components: {}
    }
</script>