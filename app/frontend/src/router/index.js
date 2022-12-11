import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/home/Home";
import Teams from "@/components/team/Teams";
import Players from "@/components/player/Players";
import Games from "@/components/Games/Games";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home',
        name: 'home',
        component: Home,
        // children: [
        //     {
        //         path: 'home',
        //         component: Home,
        //     },
        // ]
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
    },
    {
        path: '/teams',
        name: 'teams',
        component: Teams,
    },
    {
        path: '/players',
        name: 'players',
        component: Players,
    },
    {
        path: '/games',
        name: 'games',
        component: Games,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router