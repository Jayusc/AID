<template>
    <el-card>
        <div v-if="showHome">
            <div class="bc"></div>
            <div v-for="(o, i) in allMatchesInfo" :key="i" @click="() => selectFunc(i)">
                <el-row>
                    <el-col>
                        <el-card class="box-card marginBottom" shadow="hover">
                            <div>
                                {{ o.name }}
                            </div>
                            <div>
                                {{ o.competitions[0].competitors[1].team.name }} VS
                                {{ o.competitions[0].competitors[0].team.name }}
                            </div>
                            <div>
                                {{ o.competitions[0].competitors[1].score }} : {{
                                    o.competitions[0].competitors[0].score
                                }}
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div v-if="showGameDeatil">
            <GameDetail/>
        </div>
    </el-card>
</template>

<script>
import axios from "axios";
import GameDetail from "@/components/Games/GameDetail";

export default {
    name: 'HomePage',
    components: {GameDetail},
    data() {
        return {
            allMatchesInfo: [],
            gameInfo: {},
            showGameDeatil: false,
            showHome: true,
        }
    },

    methods: {
        getMatchesInfo() {
            axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard").then(r => {
                this.allMatchesInfo = r.data.events
            })
        },

        selectFunc(id) {
            console.log(id)
            // axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard").then(r => {
            //     this.gameInfo = r.data.xxxxx
            // })
            this.showHome = false
            this.showGameDeatil = true
        }
    },

    created() {
        this.getMatchesInfo()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bc {
    width: 920px;
    height: 613px;
    background: url("../kristaps_luka_getty_ringer_2.0.png");
    margin: 0 auto;
}

.marginBottom {
    margin-bottom: 10px;
}
</style>
