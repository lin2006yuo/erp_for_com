/**
 * Created by wcg on 16-10-14.
 */

import pathRegex from '@/lib/pathRegex';

import routeMaps from '@/routes/maps';
import pack from '../../routes/pack';
import {setItem, getItem} from '../../lib/localStorage';
import {add as addRecord, clearRecord} from '@/lib/nav-record';

const default_navItems = [pack.find(row=>row.paths === '/dashboard')];
const default_navIndex = 0;
const default_classify = 0;

//需要param over route的字段
const paramRouteFields = [
    'title',//会重写nav.title
];

function url_refresh(router){
    let routerPath = router.route || "/dashboard";
    if(!isEmpty(router.query)){
        const query = Object.keys(router.query).map(k => `${k}=${router.query[k]}`).join('&');
        routerPath = `${routerPath}?${query}`;
    }
    window.history.pushState(routerPath,routerPath,routerPath);
}

function calc_move(state) {
    if(state.navItems.length <= state.navMax){
        return 0;
    }
    if((state.navIndex + state.navMove) > state.navItems.length){
        return Math.max(state.navIndex - state.navMax, 0);
    }
    if(state.navIndex < state.navMove){
        return Math.max(state.navIndex - 1, 0);
    }
    if(Math.abs(state.navIndex - state.navMove) > state.navMax){
        return state.navMove + (state.navIndex - state.navMove - state.navMax);
    }else{
        return state.navMove;
    }
}

function findRouteMap(path){
    if(routeMaps[path]){
        return {path,params:{},routeMap:routeMaps[path]};
    }else{
        for(let rpath in routeMaps){
            const routeMap = routeMaps[rpath];
            if(routeMap.realPath){
                const keys = pathRegex.parseKeys(path, routeMap.realPath);
                if(keys){
                    return {path:rpath, params:keys,routeMap}
                }
            }
        }
        return null;
    }
}

function reloadRoute(routes) {
    clearRecord();
    return routes.map(route =>{
        let routeMap = findRouteMap(route.route);
        route = Object.assign(route, routeMap || {});
        route.rest=true;
        addRecord(route.route);
        return route;
    })
}

export default {
    namespaced:true,
    state: {
        navItems:[],
        navIndex:default_navIndex,
        navMove:0,
        navMax:10,
        leftOpen:true,
        triggerMenu:getItem('triggerMenu')?getItem('triggerMenu'):'hover',

        headerIndex:default_classify,
        headerMenus:[],
        menus:[],
        allMenus:[],
        fastMenus:getItem('fast-menus', []),
        headerMaps:{},
        headerTaps:{},
        userId:-1,
    },
    mutations:{
        initState(state, initState){
            state.userId = initState.userId;
            state.navItems = reloadRoute(getItem(`navItems|${state.userId}`, default_navItems));
        },
        clearOldNavs(state){
            setItem(`navItems|${state.userId}`, []);
            state.navItems = default_navItems;
        },
        async nav_open(state, router){
            let route = {};
            switch (router.constructor.name){
                case String.prototype.constructor.name:
                    route.paths = router;
                    break;
                case Object.prototype.constructor.name:
                    route = router;
                    break;
            }
            const splitPath = route.paths.split('?');
            route.route = splitPath[0];
            addRecord(route.route);
            route.query = {};
            if(splitPath[1]){
                splitPath[1].split('&').forEach(kv =>{
                    const s = kv.split('=');
                    const k = s[0];
                    route.query[k] = s[1] === undefined ? s[0] : s[1];
                })
            }
            const routeMap = findRouteMap(route.route);

            if(routeMap){
                router = await new Promise((succ,fail)=>{
                    function sure(){
                        if(isEmpty(state.allMenus)){
                            setTimeout(()=>{
                                sure(succ);
                            },500)
                        }else{
                            let item = state.allMenus.find(row=>row.paths === routeMap.path);
                            if(item){
                                let overRoute = {};
                                if(route.param){
                                    overRoute = paramRouteFields.filterMap((f,ret) =>{
                                        if(route.param[f]){
                                            ret[f] = route.param[f];
                                            return ret;
                                        }else{
                                            return ret;
                                        }
                                    }, overRoute)
                                }
                                route = Object.assign(routeMap, item, route, overRoute)
                                succ(route)
                            }else{
                                fail(`path ${routeMap.path} not match menu`);
                            }
                        }

                    }
                    sure();
                });

                url_refresh(router);
                let retInd = state.navItems.findRetInd(row=>{
                    let obj = obj2value(row);
                    if(obj.paths === router.paths){
                        return obj;
                    }
                });
                router.rest = false;
                router.param = Object.assign(router.param || {}, router.params || {});
                if(retInd){
                    state.navIndex = retInd.index;
                    state.navItems.splice(retInd.index,1,router);
                }else{
                    state.navItems.push(router);
                    state.navIndex = state.navItems.length - 1;
                    setItem(`navItems|${state.userId}`, state.navItems);
                }
                state.navMove = calc_move(state);
            }else{
                throw new Error(`not valid route ${route.paths}`);
            }

        },
        nav_close(state, ind){
            switch (typeof ind){
                case 'string':
                    ind = state.navItems.indexOfFun((old)=>{
                        return old.paths === ind;
                    });
                    break;
                case 'number':
                    ind = state.navItems.indexOfFun(old=>old.id === ind);
                    break;
            }
            state.navItems.splice(ind, 1);
            const maxIndex = state.navItems.length - 1;
            if(state.navIndex > maxIndex){
                state.navIndex = maxIndex;
            }
            setItem(`navItems|${state.userId}`, state.navItems);
            url_refresh(state.navItems[state.navIndex]);
            state.navMove = calc_move(state);
        },
        nav_closeall(state){
            state.navItems = state.navItems.filter(row=>{
                return row.id === 3
            });
            setItem(`navItems|${state.userId}`, state.navItems);
            state.navIndex = 0;
            state.navItems[state.navIndex].rest = false;
            url_refresh(state.navItems[state.navIndex]);
            state.navMove = calc_move(state);
        },
        nav_closeother(state, me){
            state.navItems = state.navItems.filter(row=>{
                return row.id === 3 || row.paths === me.router;
            });
            state.navIndex = state.navItems.length - 1;
            state.navItems[state.navIndex].rest = false;
            setItem(`navItems|${state.userId}`, state.navItems);
            url_refresh(state.navItems[state.navIndex]);
            state.navMove = calc_move(state);
        },
        nav_cast(state, ind){
            state.navIndex = ind;
            url_refresh(state.navItems[ind]);
            state.navItems[ind].rest = false;
            state.navMove = calc_move(state);
        },
        nav_cast_router(state, router){
            router.rest = false;
            state.navIndex = state.navItems.indexOf(router);
            url_refresh(state.navItems[state.navIndex]);
            state.navMove = calc_move(state);
        },
        nav_move_left(state) {
            state.navMove = Math.max(0, state.navMove-1);
        },
        nav_move_right(state){
            state.navMove = Math.min(state.navItems.length-1, state.navMove+1);
        },
        nav_go_left(state){
            state.navIndex = Math.max(0, state.navIndex-1);
            state.navItems[state.navIndex].rest = false;
        },
        nav_go_right(state){
            state.navIndex = Math.min(state.navItems.length-1, state.navIndex+1);
            state.navItems[state.navIndex].rest = false;
        },

        current(state, id){
            if(state.headerIndex !== id){
                let item = state.headerMenus.find(row=>row.id===id);
                if(item){
                    state.menus = item.children;
                }
                state.headerIndex = id; 
            }
        },

        load(state, allMenus){
            state.allMenus = [...pack,...allMenus];
            state.navMove = calc_move(state);
            function calc_node(node, rootId) {
                state.headerMaps[node.id] = rootId;
                let childrens = state.allMenus.filter(row=>row.pid === node.id);
                childrens.map(child=>{
                    return calc_node(child, rootId);
                });
                if(childrens.length > 0){
                    const c = childrens.filter(children=>{
                        if(children.type === 1){
                            return true;
                        }
                        if(children.type === 0){
                            children = calc_node(children, rootId);
                            return children.children && children.children.length > 0
                        }
                        return false;
                    });
                    if(c.length > 0){
                        node.children = childrens
                    }
                }
                return node;
            }
            let children = state.allMenus.filter(row=>{
                if(row.pid === 0 && row.type !== 2){
                    const node = calc_node(row, row.id);
                    return node.children && node.children.length > 0;
                }else{
                    return false;
                }
            });
            state.headerMenus = children;
            if(children.length >= 1){
                state.headerIndex = children[0].id;
                state.menus = children[0].children;
                state.headerTaps = children.map(child =>{
                    let childs = [];
                    let others = [];
                    for(let i = 0; i <child.children.length; i++){
                        if(child.children[i].type !== 1){
                            childs.push(child.children[i]);
                        }else{
                            others.push(child.children[i]);
                        }
                    }
                    if(others.length > 0){
                        childs.push({
                            children:others,
                            group:0,
                            id:1000000,
                            paths:"",
                            pid:child.id,
                            remark:"",
                            sort:0,
                            status:1,
                            title:"其它",
                            type:0});
                    }
                    return childs;
                });
            }

        },
        navMax(state, max){
            state.navMax = max;
        },
        setFastMenus(state, menus){
            state.fastMenus = menus;
            setItem('fast-menus', menus);
        },
        openCloseLeftMenu(state,bool){
            state.leftOpen =bool;
        },
        changeTriggerMenu(state,triggerName){
            state.triggerMenu = triggerName;
            setItem('triggerMenu',state.triggerMenu);
        },
    },
    actions:{
        clearOldNavs({commit}){
            commit('clearOldNavs');
        },
        nav_open(store, router){
            store.commit('nav_open', router, store.rootState.user.info.user_id);
        },
        nav_cast(store, ind){
            store.commit('nav_cast', ind);
        },
        nav_cast_router(store, router){
            store.commit('nav_cast_router', router);
        },
        nav_close(store, ind){
            store.commit('nav_close', ind)
        },
        nav_closeall(store){
            store.commit('nav_closeall')
        },
        nav_closeother(store, me){
            store.commit('nav_closeother', me)
        },
        nav_move_left(store){
            store.commit('nav_move_left')
        },
        nav_move_right(store){
            store.commit('nav_move_right')
        },
        nav_go_left({commit}){
            commit('nav_go_left')
        },
        nav_go_right(store){
            store.commit('nav_go_right')
        },

        load({commit}, allmenus){
            commit('load',allmenus);
        },
        switcher({commit}, index){
            commit('current', index);
        },
        navMax({commit}, max){
            commit('navMax', max);
        },
        setFastMenus({commit}, menus){
            commit('setFastMenus', menus);
        },
        initState({commit}, initState){
            commit('initState', initState);
        },
        openCloseLeftMenu({commit},bool){
           commit('openCloseLeftMenu',bool)
        },
        changeTriggerMenu({commit},triggerName){
            commit('changeTriggerMenu',triggerName)
        },
    },
    getters:{
        navs_get(state){
            return state.navItems;
        },
        navs_index(state){
            return state.navIndex;
        },
        navs_move(state){
            return state.navMove;
        },

        menus_get(state){
            return state.menus;
        },
        menus_index(state){
            return state.headerIndex;
        },
        menus_all(state){
            return state.allMenus;
        },
        headerMenus(state){
            return state.headerMenus;
        },
        navMax(state){
            return state.navMax;
        },
        fastMenus(state){
            return state.fastMenus;
        },
        headerMaps(state){
            return state.headerMaps;
        },
        headerTaps(state){
            return state.headerTaps;
        },
        leftOpen(state){
            return state.leftOpen
        },
        triggerMenu(state){
            return state.triggerMenu
        }
    }
};