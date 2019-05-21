<template>
    <div class="tree-pannel">
        <ul>
            <li v-for="(children,i) in childrens"
                :key="nodeKey_(children, i)"
                @mouseenter="mouseenter(i)"
                @mouseout="mouseOver = -1"
                @click="nodeClick_(children)"
                :class="[current === i ? 'is-current' : '',(children.childrens && children.childrens.length > 0) ? 'has-childrens' : '']"
            >
                {{children.label}}
            </li>
        </ul>
        <div class="children">
            <tree-panel v-if="nodeChildrens"
                        :childrens =nodeChildrens
                        :node-key="nodeKey"
                        :layout="layout+1"
                        :selects="selects"
                        @node-click="$emit('node-click', $event)"
            ></tree-panel>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tree-panel",
        data(){
            return {
                mouseOver:-1
            }
        },
        methods:{
            mouseenter(i){
                setTimeout(()=>{this.mouseOver = i})
            },
            nodeKey_(children, i){
                let key = children[this.nodeKey];
                if(key === undefined){
                    return i;
                }else{
                    return key;
                }
            },
            nodeClick_(children){
                this.$emit('node-click', children);
                const index=this.childrens.indexOf(children);
                if(this.selects[this.layout] !== index){
                    this.$set(this.selects, this.layout, index);
                    this.selects.splice(this.layout+1, this.selects.length);
                }
            }
        },
        computed:{
            nodeChildrens(){
                if(this.mouseOver > -1){
                    return this.childrens[this.mouseOver].childrens;
                }
                if(this.current > -1){
                    return this.childrens[this.current].childrens;
                }else{
                    return false;
                }
            },
            current(){
                let current = this.selects[this.layout];
                if(current === undefined){
                    return -1;
                }else{
                    return current;
                }
            }
        },
        props:{
            nodeKey:{},
            childrens:{},
            layout:{
                default(){
                    return 0;
                }
            },
            selects:{
                default(){
                    return []
                }
            }
        }
    }
</script>

<style scoped lang="stylus">
    .tree-pannel{
        position: absolute;
        display: inline-block;
        top:0;
        right:0;
        border:1px solid #CCC;
        background-color: #FFF;
        ul{
            padding:0;
            margin:0;
        }
        li{
            border-bottom:1px solid #CCC;
            /*width:100%;*/
            padding:5px;
            cursor: pointer;
            white-space:nowrap;
            &.has-childrens{
                &::before{
                    content: '<'
                    display: inline-block;
                }
            }
        }
        .children{
            position: absolute;
            top:-1px;
            right: 100%;
            width:100%;
        }
        .is-current{
            background-color: #5da9ff;
            color: #FFF;
        }
    }
</style>