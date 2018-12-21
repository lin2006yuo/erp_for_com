<template>
    <div class="chart-table">
        <div class="chart-table-header">
            <img v-show="mode" src="../assets/table.svg" @click="mode=false" title="切换表格">
            <img v-show="!mode" src="../assets/chart.svg" @click="mode=true" title="切换图表">
        </div>
        <slot v-show="mode" name="chart"></slot>
        <slot v-show="!mode" name="table"></slot>
    </div>
</template>
<style lang="stylus">
    .chart-table{
        position: relative;
        .chart-table-header{
            z-index: 999;
            position: absolute;
            height:27px;
            img{
                width:27px;
                height:27px;
                &:hover{
                    background-color: rgba(38,139,255,0.44);
                }
                &:active{
                    background-color: rgba(38,139,255,0.8);
                }
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                mode:false
            }
        },
        mounted(){
            this.refresh_slots(this.mode);
        },
        methods:{
            refresh_slots(mode){
                this.$nextTick(()=>{
                    if(mode){
                        this.$slots.table[0].elm.style.display="none";
                        this.$slots.chart[0].elm.style.display="block";
                    }else{
                        this.$slots.table[0].elm.style.display="block";
                        this.$slots.chart[0].elm.style.display="none";
                    }
                });
            }
        },
        watch:{
            mode(val){
                this.refresh_slots(val);
            }
        },
        components:{

        }
    }
</script>