<template>
    <div id="app">
        <NavBar/>
    </div>
</template>

<script>
import Home from './components/Home.vue'
import NavBar from "@/components/NavBar";

export default {
    name: 'App',
    components: {
        NavBar,
        Home
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

}

</style>
