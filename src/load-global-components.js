import Vue from 'vue';

const components = require.context('./global-components');
components.keys().forEach(key=>{
    const component = components(key);
    let name = /([\w-]+)\.(js|vue)$/i.exec(key);
    if(name){
        register_global_component(component.default.name || name[1], component.default);
    }
});

function register_global_component(name, component){
    console.log(`register-global-component:${name}`)
    Vue.component(name, component);
}
