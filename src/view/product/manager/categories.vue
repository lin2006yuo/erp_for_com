<template>
    <div class="categories-p-tree"    :style="styles">
        <div @click="is_close" class="select">
            <span class="ml-sm" :title="label">{{label}}</span>
            <i :class="[show?'roles ':'roles-round','el-icon-caret-left','middle']" ></i>
        </div>
        <transition  name="fade">
            <categories-tree v-show="show"  :class="['node-tree1']"  v-model="value_" @last="last"
                         :child_ids="child_ids" :tree="tree" :keys="1" :dbclick="dbclick" ref="tree" ></categories-tree>
        </transition>
    </div>
</template>
<style lang="stylus">
    .categories-p-tree{
        position: relative;
        left: 0;
        top:0;
    >.node-tree1{
        min-width: 150%;
        position: absolute;
        top:28px!important;
        left:0!important;
        background: white;
        overflow-x: hidden;
        z-index: 2;
    }
    .select{
        min-width: 100px;
        border:1px solid #C0CCDA;
        border-radius: 4px;
        position: relative;
        height: 26px;
        left: 0;
        top:0;
    >span{
        line-height: 26px;
         display: inline-block;
         width: 80%;
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
     }
    }
    .middle{
        display: block;
        position: absolute;
        top:0;
        right: 10px;
        line-height: 26px;
        z-index: 103;
    }
        .roles{
            transform-origin:50% 50%;
            animation:roles 200ms forwards;
         }
        .roles-round{
            transform-origin:50% 50%;
            transform:rotate(-90deg);
            animation:roles2 200ms forwards;
        }

        .fade-enter-active{
            transform-origin: 50% 0;
            animation:tree_down  100ms linear;
        }
        .fade-leave-active {
            transform-origin: 50% 0;
            animation:tree_down2  200ms  linear;
        }
    }
    @keyframes roles {
        form{
            transform:rotate(0) ;
        }
        to{
            transform:rotate(-90deg) ;
        }
    }
    @keyframes roles2 {
        form{
            transform:rotate(-90deg) ;
        }
        to{
            transform:rotate(0deg) ;
        }
    }
    @keyframes tree_down {
        0%{transform: scale(1,0);}
        100%{transform: scale(1,1);}
    }
    @keyframes tree_down2 {
        0%{transform: scale(1,1);}
        100%{transform: scale(1,0);}
    }
</style>
<script>
    export default{
        data(){
            return{
                value_:this.value,
                show:false,
                timer:null,
            }
        },
        methods:{
            last(child){
                this.show = false;
                this.value_ = child.id;
                this.$emit('last',this.value_);
            },
            is_close(){
               this.show=!this.show;
                console.log(this.show,'this.show');
            },
        },
        computed:{
            child_ids(){
                return this.tree.child_ids || [];
            },
            label(){
                let names = [];
                let caluc = (pid) =>{
                    let child = this.tree[pid];
                    if(child){
                        names.push((child.title||child.name));
                        child.pid > 0 && caluc(child.pid)
                    }
                };
                caluc(this.value_);
                return names.reverse().join(this.sep) || "请选择";
            },
        },
        watch:{
            value_(val){
                this.$emit('input', val);
            },
            value(val){
                this.value_ = val;
            }
        },
        props:{
            value:{},
            tree:{},
            sep:{
                default(){
                    return ">>";
                }
            },
            dbclick:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            styles:{
                type:Object,
                default(){
                   return {minHeight:'300px'}
                }
            }
        },
        components:{
            categoriesTree:require('./categories-tree.vue').default
        }
    }
</script>
