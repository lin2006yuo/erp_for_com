<template>
    <div class="c-star inline">
        <span v-for="(item,index) in sumStar" :class="item" @click="addStar(index)" @mouseover="hoverStar(index)" @mouseout="curStar"></span>
    </div>
</template>
<style lang="stylus">
    .c-star{
        display: inline-block;
        >.on{
            cursor: pointer;
            display: inline-block;
            width:32px;
            height:32px;
            margin-left:3px;
            background: url('../../../assets/goodStar (2).png') no-repeat;
        }
        >.off{
            cursor: pointer;
            display: inline-block;
            width:32px;
            height:32px;
            margin-left:3px;
            background: url('../../../assets/badStar.png') no-repeat;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                sumStar:[],
            }
        },
        created(){
            this.ccc(this.amount);
        },
        watch:{
            amount(val){
                this.ccc(val);
            },
        },
        methods:{
            hoverStar(index){
                let cur = index+1;
                this.ccc(cur);
            },
            curStar(){
                this.ccc(this.amount);
            },
            addStar(index){
                let cur = index+1;
                this.$emit("add-star",cur);
            },
            ccc(val){
                this.sumStar = [];
                for(let i = 0;i<val;i++){
                    this.sumStar.push("on");
                }
                if(this.sumStar.length<5){
                    let cur = 5-this.sumStar.length;
                    for(let i = 0;i<cur;i++){
                        this.sumStar.push("off")
                    }
                }
                return this.sumStar;
            }
        },
        props:{
            amount:{
                required:true,
                default(){
                    return 5
                }
            }
        },
        components: {}
    }
</script>