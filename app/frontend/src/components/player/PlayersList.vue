<template>
    <div>
        <el-card v-for="(o, i) in players" :key="i" class="marginBottom">
            <div @click="() => selectFunc(i)">
                players
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "PlayersList",
    props: {
        players: Array,
        selectFunc: Function,
    },
    methods: {

    }
}
</script>

<style scoped>
.marginBottom {
    margin-bottom: 10px;
}
</style>
