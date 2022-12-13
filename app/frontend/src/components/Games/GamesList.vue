<template>
    <div>
        <el-card v-for="(o, i) in players" :key="i" class="marginBottom">
            <div @click="() => selectFunc(i)">
                {{o.name}}
            </div>
            <div>
                {{o.competitions[0].competitors[1].team.name}} VS {{o.competitions[0].competitors[0].team.name}}
            </div>
            <div>
                {{o.competitions[0].competitors[1].score}} : {{o.competitions[0].competitors[0].score}}
            </div>
        </el-card>
    </div>
</template>

<script>
// import axios from "axios";

export default {
    name: "GameList",
    props: {
        players: Array,
        selectFunc: Function,
    },
}
</script>

<style scoped>
.marginBottom {
    margin-bottom: 10px;
}
</style>
