<template>
    <div>
        <node-tree :select="select" @change="change" :child="child" :data="data"></node-tree>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    import http from '../../../lib/http';
    export default{
        data(){
            return{
                data:{},
                child:{},
                select:this.value
            }
        },
        mounted(){
            let url = config.apiHost+this.form.url;
            let request = () =>{
                return http('GET', url);
            };
            this.$http(request).then(res=>{
                this.data = res;
                this.child =res;
            }).catch(code=>{
                console.error(code);
            })
        },
        methods:{
            change(){
                if(this.data.child_ids){
                    let check = [];
                    let childs = (ids) =>{
                        ids.forEach(id=>{
                            if(this.data[id].child_ids.length > 0){
                                childs(this.data[id].child_ids);
                            }else{
                                if(this.data[id].check){
                                    check.push(id);
                                }
                            }
                        })
                    }
                    childs(this.data.child_ids);
                    this.select = check;
                }
            }
        },
        watch:{
            select(val){
                this.$emit('input',val);
            },
            value(val){
                console.log('下拉框',val);
                this.select = val;

            }
        },
        props:{
            form:{},
            value:{}
        },
        components:{
            nodeTree:require('./node-tree').default
        }
    }
</script>
