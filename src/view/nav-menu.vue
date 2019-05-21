<style lang="stylus">
    .menu-search, .menu-fast {
        height: 14px !important;
        width: 14px;
        float: right;
        margin-top: 10px;
        margin-left: 15px;
    }
    .home-collection{
        background-image: url(../assets/home-collection-to.png);
        background-repeat:no-repeat;
        background-size:100% 100%;
        &:hover {
            background-image: url(../assets/home-collection-do.png);
            background-repeat:no-repeat;
            background-size:100% 100%;
        }
        &:active {
            background-color: #194e64;
        }
        &.active {
            background-image: url(../assets/home-collection-do.png);
            background-repeat:no-repeat;
            background-size:100% 100%;
        }
    }
    .homepage-search{
        background-image: url(../assets/homepage-search-to.png);
        background-repeat:no-repeat;
        background-size:100% 100%;
        &:hover {
            background-image: url(../assets/homepage-search-do.png);
            background-repeat:no-repeat;
            background-size:100% 100%;
        }
        &:active {
            background-color: #194e64;
        }
        &.active {
            background-image: url(../assets/homepage-search-to.png);
            background-repeat:no-repeat;
            background-size:100% 100%;
            background-color: #00A881;
        }
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import mouseKey from '../lib/mouse-key';

    export default {
        data() {
            return {}
        },
        props: {
            menus: {
                required: true,
                type: Array
            },
            fastActive: {
                required: true,
                type: Boolean
            },
            open: {},
            close: {},
            select: {},
            router: {}
        },
        components: {},
        computed: {
            ...mapGetters({fastMenus: 'menu-nav/fastMenus'})
        },
        mounted() {
            mouseKey('ctrl+o', (e) => {
                e.stopPropagation();
                this.$emit('update:fastActive', !this.fastActive);
                return false;
            })
        },
        methods: {
            ...mapActions({setFastMenus: 'menu-nav/setFastMenus'}),
            openAllNew(menu) {
                menu.children.forEach(child => {
                    this.$openNew(child.paths);
                })
            },
            openAll(menu) {
                menu.children.forEach(child => {
                    this.$open(child.paths);
                })
            },
            openNew(menu) {
                this.$openNew(menu.paths);
            },
        },
        render(createElement) {
            const createmenu = (menu) => {
                if (menu.type === 0) {
                    menu.children = menu.children || [];
                    if (menu.children.length > 0) {
                        return createElement('el-submenu', {
                                props: {index: `${menu.id}`}
                            },
                            [
                                createElement('div', {
                                    directives: [
                                        {
                                            name: 'menu-context',
                                            value: [
                                                {
                                                    label: '打开所有', action() {
                                                    this.openAll(menu)
                                                }
                                                },
                                                {
                                                    label: '在新窗口打开所有', action() {
                                                    this.openAllNew(menu)
                                                }
                                                }
                                            ],
                                        }
                                    ], slot: 'title'
                                }, menu.title),
                                menu.children.map(createmenu)
                            ]
                        );
                    }
                } else if (menu.type === 1&&menu.status===1) {
                    return createElement('el-menu-item', {
                        directives: [
                            {
                                name: 'menu-context',
                                value: [
                                    {
                                        label: '在新窗口打开', action() {
                                        this.openNew(menu)
                                    }
                                    },
                                    {
                                        label: '关闭该窗口', action() {
                                        this.$close(menu.paths)
                                    }
                                    }
                                ],
                            }
                        ], props: {index: `${menu.id}`}
                    }, menu.title)
                }
            };
            let self = this;
            const dashbroad = createElement('el-menu-item', {props: {index: '3'}}, ["首页",
                    createElement('span', {
                        attrs: {title: "ctrl+s快捷键"},
                        class: ["homepage-search", "menu-search"],
                        on: {
                            click(event) {
                                event.stopPropagation();
                                self.$emit('menu-search')
                            }
                        }
                    }),
                    createElement('span', {
                            attrs: {
                                title: '快捷菜单ctrl+o快捷键'
                            },
                            class: ["menu-fast", "home-collection", self.fastActive ? 'active' : ''],
                            on: {
                                click(event) {
                                    event.stopPropagation();
                                    self.$emit('update:fastActive', !self.fastActive);
                                }
                            }
                        }
                    )
                ])
            ;
            let fastMenus = [];
            if (this.fastActive) {
                fastMenus = this.fastMenus.map((fast, findex) => {
                    return createElement('el-menu-item', {
                        directives: [
                            {
                                name: 'menu-context',
                                value: [
                                    {
                                        label: '在新窗口打开', action() {
                                        this.openNew(fast)
                                    }
                                    },
                                    {
                                        label: '取消快捷', action() {
                                        this.fastMenus.splice(findex, 1);
                                        this.setFastMenus(this.fastMenus);
                                    }
                                    }
                                ],
                            }
                        ], props: {index: `${fast.id}`}
                    }, fast.name)
                });
                fastMenus = [
                    createElement('el-submenu', {props: {index: `fast-menus`}},
                        [
                            createElement('div', {
                                directives: [
                                    {
                                        name: 'menu-context',
                                        value: [
                                            {
                                                label: '打开所有', action() {
                                                this.fastMenus.forEach(child => {
                                                    this.$open(child.router);
                                                })
                                            }
                                            },
                                            {
                                                label: '在新窗口打开所有', action() {
                                                this.fastMenus.forEach(child => {
                                                    this.$openNew(child.router);
                                                })
                                            }
                                            }
                                        ],
                                    }
                                ], slot: 'title'
                            }, "快捷菜单"),
                            fastMenus
                        ])
                ];
            }
            const menus = this.menus.map(createmenu);
            const ret = createElement('el-menu', {
                ref: 'menu',
                on: {
                    select: this.select,
                    open: this.open,
                    close: this.close,
                },
                style: {
                    width: this.width
                },
                props: {
                    theme: "dark", "default-active": this.router, "menu-trigger": 'hover'
                }
            }, [dashbroad, ...fastMenus, ...menus]);
            if (this.$refs.menu) {
                this.$nextTick(_ => {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() =>{
                        this.$refs.menu.activedIndex = this.router;
                    }, 300);
                })
            }
            return ret;
        }
    }
</script>
