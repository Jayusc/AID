import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import Teams from "@/components/Teams";
import Players from "@/components/Players";

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
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router