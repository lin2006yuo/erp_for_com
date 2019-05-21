<template>
    <div>
        <child :cprop1="data1"></child>
        <child :cprop2="prop1"></child>
        <child :cprop3="func1">{{getName}}</child>
    </div>
</template>
<script>
    import orderNew from './orde_new';
    import vuex_mixin from './vuex_mixin';
    export default{//vue实例
        mixins:[vuex_mixin(['getName'],[])],
        data(){//实例数据，ps:返回一个对象
            return {
                data1:'',
            }
        },

        vuex_modules:[orderNew],

        filters:{//过滤器

        },
        events:{//事件处理方法
        },
        methods:{//实例方法
            func1(){
                console.log(this.getName);
                console.log(this.data1);
                console.log(this.prop1);
                console.log('methods func1');
                this.name();
            }
        },
        computed:{//实例计算属性
            computed1(){
                console.log(this.data1);
                console.log(this.prop1);
                return this.func1();
            }
        },
        watch:{//监控数据变化
            data1(new_, old_){
                this.func1();
                console.log(this.data1);//不允许了，
                console.log(this.prop1);
            }
        },
        props:{//本组件属性列表
            prop1:{}
        },
        components:{//实例引用的外部组件
//
//            directives: [{
//                name: "show",
//                rawName: "v-show",
//                value: (value),
//                expression: "value"
//            }],
        }
    }
</script>

<style lang="stylus">

</style>
