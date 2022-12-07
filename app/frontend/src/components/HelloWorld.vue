<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <div>
            <span :title="message">
                xagsaga
            </span>
        </div>
        <div>
            <p v-if="seen">现在你看到我了</p>
        </div>
        <p>
            For a guide and recipes on how to configure / customize this project,<br>
            check out the
            <a href="https://cli.vuejs.org" rel="noopener" target="_blank">vue-cli documentation</a>.
        </p>
        <div id="app-4">
            <ol>
                <li v-for="(todo, i) in todos" :key="i">
                    {{ todo.text }}
                </li>
            </ol>
        </div>
        <h3>Installed CLI Plugins</h3>
        <ul>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" rel="noopener"
                   target="_blank">babel</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" rel="noopener"
                   target="_blank">eslint</a></li>
        </ul>
        <h3>Essential Links</h3>
        <ul>
            <li><a href="https://vuejs.org" rel="noopener" target="_blank">Core Docs</a></li>
            <li><a href="https://forum.vuejs.org" rel="noopener" target="_blank">Forum</a></li>
            <li><a href="https://chat.vuejs.org" rel="noopener" target="_blank">Community Chat</a></li>
            <li><a href="https://twitter.com/vuejs" rel="noopener" target="_blank">Twitter</a></li>
            <li><a href="https://news.vuejs.org" rel="noopener" target="_blank">News</a></li>
        </ul>
        <h3>Ecosystem</h3>
        <ul>
            <li><a href="https://router.vuejs.org" rel="noopener" target="_blank">vue-router</a></li>
            <li><a href="https://vuex.vuejs.org" rel="noopener" target="_blank">vuex</a></li>
            <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" rel="noopener"
                   target="_blank">vue-devtools</a></li>
            <li><a href="https://vue-loader.vuejs.org" rel="noopener" target="_blank">vue-loader</a></li>
            <li><a href="https://github.com/vuejs/awesome-vue" rel="noopener" target="_blank">awesome-vue</a></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {
            message: '页面加载于 ' + new Date().toLocaleString(),
            seen: false,
            todos: [
                { text: '学习 JavaScript' },
                { text: '学习 Vue' },
                { text: '整个牛项目' }
            ]
        }
    },

    methods: {
        asd() {

        }
    },

    created() {

    }
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
