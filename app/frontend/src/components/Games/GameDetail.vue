<template>
    <div>
        <div @click="openComments" v-if="!showComments">
            game detail
        </div>

        <div>
            <PlayerRates v-if="showComments"/>
        </div>
    </div>
</template>

<script>
import PlayerRates from "@/components/player/PlayerRates";
export default {
    name: "GameDetail",
    components: {PlayerRates},
    data() {
        return {
            showComments: false
        }
    },

    methods: {
        openComments() {
            this.showComments = true
        }
    }
}
</script>

<style scoped>

</style>
