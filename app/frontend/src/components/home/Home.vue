<template>
    <el-card>
        <img alt="Vue logo"
             src="https://cdn.vox-cdn.com/thumbor/WCvT8BMeNRsW95tQZzp6mQHocuA=/0x0:1200x800/920x613/filters:focal(506x210:698x402):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65460511/kristaps_luka_getty_ringer_2.0.jpg">
        <div v-for="(o, i) in allMatchesInfo" :key="i">
            <el-row>
                <el-col>
                    <el-card class="box-card" shadow="hover">
                        {{ o.shortName }}
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import axios from "axios";

export default {
    name: 'HomePage',
    data() {
        return {
            allMatchesInfo: []
        }
    },

    methods: {
        getMatchesInfo() {
            axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard").then(r => {
                this.allMatchesInfo = r.data.events
            })
        }
    },

    created() {
        this.getMatchesInfo()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
