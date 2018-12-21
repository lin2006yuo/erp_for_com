<script>
    import Vue from 'vue';
    export default{
        functional: true,
        props:{
            route:{
                required:true,
            },
            tag:{
                required:true,
                type:String
            }
        },
        render(createElement, context){
            const tag = context.props.tag;
            const route = context.props.route;
            if(!route && (typeof route !== 'string')){
                const file = context.parent.$options.__file;
                const msg = `${file} in ${tag} component not define router`;
                return console.error(msg);
            }
            const calucComponent = () => {
                const components = context.parent.$options.components;
                if(Vue.config.isReservedTag(tag)){
                    return tag;
                }
                let component = components[tag];
                if(component){
                    return component;
                }
                component = Vue.component(tag);
                if(component){
                    return component;
                }
                return false;

            };
            let component = null;
            if(component = calucComponent()){
                if(context.parent.$hasPermission(route)){
                    return createElement(component, context.data, context.children);
                }else{
                    return createElement('span', {attrs:{title:`not auth ${route}`}});
                }
            }else{
                const file = context.parent.$options.__file;
                const msg = `${file} can't find Element or Component :${tag}`;
                console.error(msg);
            }
        },
        components:{

        }
    }
</script>