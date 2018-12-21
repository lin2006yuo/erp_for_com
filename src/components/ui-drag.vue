<template>
    <div class="p-ui-drag"  v-if="show" @mousedown.stop="mousedown"   :style="dragstyle" >
        <slot></slot>
    </div>
</template>
<style lang="stylus">
    .p-ui-drag{
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        z-index: 9999;
    }

</style>
<script>

    export default{
        data(){
            return{
                show:false,
                offsetx:0,
                offsety:0,
            }
        },
        created(){
        },
        mounted(){
        },
        computed:{
            dragstyle(){
                return this.position
            }
        },
        methods:{
            mousedown(event){
                event.stopPropagation();
                event.preventDefault();
                let x=event.clientX-this.$el.offsetLeft;
               let y=event.clientY-this.$el.offsetTop;
                let This=this.$el
                let style=this.$el.style;
                document.onmousemove=function (e) {
                    e=e||event;
                    let ox=e.clientX-x;
                    let oy=e.clientY-y;
                    if(ox<0) ox=0;
                    if(oy<0) oy=0;
                    if(oy>document.documentElement.clientHeight-This.offsetHeight){
                        oy=document.documentElement.clientHeight-This.offsetHeight;}
                    if(ox>document.documentElement.clientWidth-This.offsetWidth) {
                        ox=document.documentElement.clientWidth-This.offsetWidth;}
                    style.left=e.clientX-x+'px';
                    style.top=e.clientY-y+'px';
                }
                document.onmouseup=function (ev) {
                    document.onmousemove=null;
                }

            },



        },
        filters:{
        },
        watch:{
            show(val){
                this.$emit("input",val)
            },
            value(val){
                console.log("show")
                this.show=val;
            }
        },
        props:{
            value:{},
            position:{
                type:Object,
                default(){
                    return  {top:0,left:0,right:`auto`,bottom:`auto`};
                },
            }
        },
        components:{

        }
    }
</script>