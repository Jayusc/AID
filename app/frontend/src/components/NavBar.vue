<template>
    <div>
        <el-menu
            :default-active="initialSelect"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="Home">Home</el-menu-item>
            <el-menu-item index="Teams">Teams</el-menu-item>
            <el-menu-item index="Players">Players</el-menu-item>
            <el-menu-item index="Games">Games</el-menu-item>
        </el-menu>
        <router-view/>
    </div>
</template>

<script>

export default {
    name: "NavBar",
    data() {
        return {
            initialSelect: ""
        }
    },
    methods: {
        handleSelect(key) {
            if (key === "Home" && this.$route.path !== "/home") {
                this.$router.push("/home")
            }
            if (key === "Teams" && this.$route.path !== "/teams") {
                this.$router.push("/teams")
            }
            if (key === "Players" && this.$route.path !== "/players") {
                this.$router.push("/players")
            }
            if (key === "Games" && this.$route.path !== "/games") {
                this.$router.push("/games")
            }
        },
    },
    created() {
        const curUrl = this.$route.path.slice(1)
        if (curUrl === "home") {
            this.initialSelect = "Home"
        }
        if (curUrl === "teams") {
            this.initialSelect = "Teams"
        }
        if (curUrl === "players") {
            this.initialSelect = "Players"
        }
        if (curUrl === "games") {
            this.initialSelect = "Games"
        }
    }
}
</script>

<style scoped>

</style>
