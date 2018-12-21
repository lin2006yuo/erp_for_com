<template>
    <div class="c-at-roles">
        <span v-for="role in roles">
            {{role.name}}
        </span>
        <el-autocomplete
                class="autocomplete-li2 inline"
                popper-class="autocomplete-li2"
                v-model="input"
                :fetch-suggestions="inputQuery"
                custom-item="form-info-class"
                placeholder="请输入角色..."
                @select="select"
                icon="edit"
        ></el-autocomplete>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import Vue from 'vue';
    Vue.component('at-role-item', {
        functional: true,
        render: function (h, ctx) {
            let item = ctx.props.item;
            if(item.bind){
                return h('li', ctx.data, [
                    h('div', { attrs: { class: 'name bind' } }, [item.name]),
                ]);
            }else{
                return h('li', ctx.data, [
                    h('div', { attrs: { class: 'name' } }, [item.name]),
                ]);
            }
        },
        props: {
            item: { type: Object, required: true }
        }
    });
    export default{
        data(){
            return{
                input:''
            }
        },
        methods:{
            inputQuery(key, cb){

            },
            select(val){
                console.log(val)
            }
        },
        computed:{
            roles(){
                return []
            }
        },
        watch:{
            input(val){
                let reg = /^@(.*)/.exec(val);
                if(reg){
                    reg = reg[1];
                    if(reg){
                        return this.roles.filter(role =>{
                            return role.name.indexOf(reg) >= 0
                        });
                    }
                }
            }
        },
        components:{

        }
    }
</script>