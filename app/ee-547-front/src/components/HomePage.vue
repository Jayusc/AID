<template>
  <div class="hello">
      <img alt="Vue logo" src="https://cdn.vox-cdn.com/thumbor/WCvT8BMeNRsW95tQZzp6mQHocuA=/0x0:1200x800/920x613/filters:focal(506x210:698x402):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65460511/kristaps_luka_getty_ringer_2.0.jpg">
      <div v-for="(o, i) in 4" :key="i">
          <el-row>
              <el-col>
                  <el-card class="box-card" shadow="hover">
                    Match
                  </el-card>
              </el-col>
          </el-row>
      </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
