<template>
    <div class="c-score-color-star">
       <div :class="[whichColor,'default-star-box']"></div>
    </div>
</template>
<style lang="stylus">
    .default-star-box{
        margin:0 auto;
        width:26px;
        height: 26px;
        line-height:26px;
        background:url('../../../assets/hollow.png') no-repeat 5px 5px;
    }
    .Red{
         background:url('../../../assets/red.png') no-repeat 5px 5px;
    }
    .RedShooting{
        background:url('../../../assets/red-shooting.png') no-repeat 5px 5px;
    }
    .Blue{
         background:url('../../../assets/blue.png') no-repeat 5px 5px;
    }
    .BlueShooting{
        background:url('../../../assets/blue-shooting.png') no-repeat 5px 5px;
    }
    .Yellow{
         background:url('../../../assets/yellow.png') no-repeat 5px 5px;
    }
    .YellowShooting{
        background:url('../../../assets/yellow-shooting.png') no-repeat 5px 5px;
    }
    .Turquoise{
         background:url('../../../assets/turquoise.png') no-repeat 5px 5px;
    }
    .TurquoiseShooting{
        background:url('../../../assets/turquoise-shooting.png') no-repeat 5px 5px;
    }
    .Silver{
         background:url('../../../assets/silver.png') no-repeat 5px 5px;
    }
    .SilverShooting{
        background:url('../../../assets/silver-shooting.png') no-repeat 5px 5px;
    }
    .Purple{
         background:url('../../../assets/purple.png') no-repeat 5px 5px;
    }
    .PurpleShooting{
        background:url('../../../assets/purple-shooting.png') no-repeat 5px 5px;
    }
    .Green{
         background:url('../../../assets/green.png') no-repeat 5px 5px;
    }
    .GreenShooting{
        background:url('../../../assets/green-shooting.png') no-repeat 5px 5px;
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        props:{
            whichColor:{}
        },
        components:{

        }
    }
</script>