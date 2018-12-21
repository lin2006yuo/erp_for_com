<template>
    <div class="p-categories-tree"  :style="styles">
        <ul class="node-tree" v-if="childs.length > 0">
            <li v-for="child in childs" @mouseenter.stop="show(child)"
                @mouseleave.stop="show(child)"
                @click="select(child)"
                :title="get_label(child)"
                :class="child.show ? 'highlight' : ''"
                @dblclick="doubel(child)">
                {{get_label(child)}}
                <i :class="['el-icon-caret-right' ,'next']"
                   v-if="child.child_ids&&child.child_ids.length>0"></i>
            </li>
        </ul>
        <template v-for="child in childs" >
            <categories-tree v-model="valueInner" :dbclick="dbclick"  @open="open(child)" @last="last" v-show="child.show" :class="[child.show?'move':'']" :child_ids="get_child(child)" :tree="tree"   :keys="getkeys"></categories-tree>
        </template>

    </div>
</template>
<style lang="stylus">
    .p-categories-tree{
        display: inline;
        ul.node-tree{
            /*animation: move .2s  linear;*/
            box-sizing: border-box;
            min-width:80px;
            display: inline-block;
            border:1px solid #ddd;
            height: 150px;
            width: 150px;
            overflow-y: auto;
            li{
                position: relative;
                height:26px;
                line-height:26px;
                white-space: nowrap;
                overflow-x:hidden ;
                text-overflow: ellipsis;
                padding:0 26px 0 10px;
                &:hover{
                    background-color:#e5e9f2 ;
                }
                 >.next{
                      position: absolute;
                        right:8px;
                        top:8px;
                  }
            }
            .highlight{
                background-color:#2e90fe ;
                color:#fff;
                &:hover{
                    background-color:#2e90fe;
                }
            }
        }
        .show{
             background-color: red;
         }
            .move{
                transform-origin: 50% 0;
                animation: move .2s  linear;
            }
    }

    @keyframes move {
        0%{transform: scale(1,0);}
        100%{transform: scale(1,1);}
    }
</style>
<script>

    export default{
        name:'categories-tree',
        data(){
            return{
                valueInner:this.value,
                currentShowIcon:true,
            }
        },
        created(){

        },
        methods:{
            doubel(child){
                if(this.dbclick){
                    this.$emit("last",child)
                }
            },
            open(parant){
                this.$set(parant,'show',true);
                if(parant.pid!==0){
                    this.$emit('open',this.tree[parant.pid])
                }
            },
            get_label(child){
                return child.title||child.name;
            },
            get_child(child){
                if(  !child){return []}
                return child.child_ids || [];
            },
            show(child){
                if(child.show === undefined){
                    this.$set(child, "show" ,false);
                }
                child.show = true;
                this.childs.forEach(row=>{
                    row.show && row.id !== child.id && (row.show = false)
                });
            },
            select(child){
                this.last(child);
            },
            last(last){
                this.$emit('last', last);
            },
        },
        computed:{
            getkeys(){
              return this.keys+1
            },
            styles(){
              return {
                  position:'absolute',
                  left:`150px`,
                  top:0,
                  zIndex:this.keys
              }
            },
            childs(){
                if(this.child_ids){
                    let childIdsList = this.child_ids.filter(id=>{
                        return this.tree[id];
                    });
                    let childs = childIdsList.map(id=>{
                        let child = this.tree[id];
                        if(id === this.valueInner){
                            this.$set(child, 'show', true);
                            this.$emit('open');
                        }else{
                            this.$set(child, 'show', false);
                        }
                        return child;
                    });
                    return childs;
                }else{
                    return [];
                }
            }
        },
        watch:{
            valueInner(val){
                this.$emit('input', val);
            },
            value(val){
                this.valueInner = val;
            }
        },
        props:{
            child_ids:{},
            tree:{},
            value:{},
            keys:{
                required:true,
                type:Number
            },
            dbclick:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components:{
        }
    }
</script>
