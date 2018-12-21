<template>
    <div class="tabs">
        <slot></slot>
    </div>
</template>
<style lang="stylus">
    .tabs{
        /*border: 1px solid #cbcbcb;*/
        border-radius: 5px;
        padding:0px 3px 2px 3px;
    }
</style>
<script>
    export default {
        name:'tabs',
        data(){
            return {
                navs:[]
            };
        },
        mounted(){
            this.show_all(!!this.def);
            this.caluc_show_all();
            let slots = this.$slots.default;
            slots.forEach(slot=>{
                if(slot.componentOptions) {
                    if (slot.componentOptions.tag === 'tab-item') {
                        let nav = {
                            action:slot.componentOptions.propsData.id,
                            label:slot.componentOptions.propsData.label,
                        };
                        this.navs.push(nav);
                    }
                }
            });
            for(let i = 0; i < slots.length; i++){
                let slot = slots[i];
                if(slot.componentOptions) {
                    if(slot.componentOptions.tag === 'tab-head'){
//                        console.log(slot.child.navs);
//                        let nav = null;
//                        while(nav = this.navs.shift()){
//                            console.log("nav",nav)
//                            console.log("tabsnav",slot.child.navs)
//                            slot.child.navs.push(nav);
//                        }
                    }
                }
            }
        },
        methods:{
            show_item(item){
                this.$slots.default.forEach(function(slot) {
                    if(slot.componentOptions) {
                        if(slot.componentOptions.tag === 'tab-item'){
                            if(slot.componentOptions.propsData.id === item.action){
                                slot.child.isShow = true;
                            }else{
                                slot.child.isShow = false;
                            }
                        }
                    }
                });
                this.$slots.default.forEach(function (slot) {
                    if(slot.componentOptions){
                        if(slot.componentOptions.tag === 'tab-head'){
                            slot.child.isShowAll = false;
                        }
                    }
                })
            },
            show_all(isShowAll){
                this.$slots.default.forEach(function(slot){
                    if(slot.componentOptions){
                        if(slot.componentOptions.tag === 'tab-item'){
                            slot.child.isShow = isShowAll;
                        }
                    }
                });
            },
            caluc_show_all(){
                let isShowAll = true;
                let slots = this.$slots.default;
                for(let i = 0; i < slots.length; i++){
                    let slot = slots[i];
                    if(slot.componentOptions) {
                        if(slot.componentOptions.tag === 'tab-item'){
                            isShowAll = slot.child.isShow;
                            if(!isShowAll)break;
                        }
                    }
                }
                for(let i = 0; i < slots.length; i++){
                    let slot = slots[i];
                    if(slot.componentOptions) {
                        if(slot.componentOptions.tag === 'tab-head'){
                            slot.child.isShowAll = isShowAll;
                        }
                    }
                }
            }
        },
        props:{
            def:{
                default(){
                    return false;
                }
            }
        }
    }
</script>
