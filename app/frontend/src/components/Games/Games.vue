<template>
    <div>
        <GamesList :players="playersList" :selectFunc="enterCommentsPage" v-if="showPlayersList"/>
        <PlayerRates v-if="showComments"/>
    </div>
</template>

<script>
// import PlayersList from "@/components/player/PlayersList";
import PlayerRates from "@/components/player/PlayerRates";
import GamesList from "@/components/Games/GamesList";
export default {
    name: "GamesPage",
    components: {PlayerRates, GamesList},
    data() {
        return {
            playersList: [1, 1, 1, 1, 1],
            showPlayersList: true,
            selectedPlayerId: null,
            showComments: false
        }
    },

    methods: {
        enterCommentsPage(id) {
            this.selectedPlayerId = id
            this.showComments = true
            this.showPlayersList = false
        }
    },

    created() {

    }
}
</script>

<style scoped>

</style>
