<template>
    <svg t="1502689128492"
         class="icon"
         style=""
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="2360" xmlns:xlink="http://www.w3.org/1999/xlink"
         width="18" height="18" @click="click" @mouseenter="enter" @mouseleave="leave" :class="{'active':isActive}">
        <path d="M819.2 172.373333c-29.013333-23.893333-71.68-20.48-95.573333 8.533334-23.893333 29.013333-20.48 71.68 8.533333 95.573333 76.8 64.853333 119.466667 158.72 119.466667 257.706667 0 186.026667-151.893333 337.92-337.92 337.92s-337.92-151.893333-337.92-337.92c0-98.986667 44.373333-194.56 119.466666-257.706667 29.013333-23.893333 32.426667-68.266667 8.533334-95.573333-23.893333-29.013333-68.266667-32.426667-95.573334-8.533334-107.52 90.453333-168.96 223.573333-168.96 363.52 0 262.826667 213.333333 474.453333 474.453334 474.453334s474.453333-213.333333 474.453333-474.453334c-1.706667-141.653333-63.146667-273.066667-168.96-363.52z" p-id="2361" :fill="newColor"></path>
        <path d="M512 675.84c37.546667 0 68.266667-30.72 68.266667-68.266667V81.92c0-37.546667-30.72-68.266667-68.266667-68.266667s-68.266667 30.72-68.266667 68.266667v525.653333c0 37.546667 30.72 68.266667 68.266667 68.266667z" p-id="2362" :fill="newColor"></path>
    </svg>
</template>
<style lang="stylus">
    .active{
        cursor pointer
    }
</style>
<script>
    import {mapActions} from 'vuex';
    export default{
        data(){
            return{
                oldColor:this.color,
                newColor:this.color,
                isActive:false
            }
        },
        methods:{
            ...mapActions({
                set_info:'user/set_info',
                switcher:'menu-nav/switcher',
                nav_closeall:'menu-nav/nav_closeall',
            }),
            click(){
                this.newColor="#aaa";
                this.$alert('退出登录', '系统提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        switch (action){
                            case 'confirm':
                                this.nav_closeall();
                                setTimeout(()=>{
                                    this.$router.replace('/login');
                                },1000);
                                break;
                            default:
                                console.log(`${action}`);
                        }
                    }
                });
            },
            enter(){
                this.newColor="#ccc";
                this.isActive = true
            },
            leave(){
                this.newColor=this.oldColor
                this.isActive = false
            }
        },
        watch:{
        },
        props:{
            color:{
                required:true
            },
        }
    }
</script>
