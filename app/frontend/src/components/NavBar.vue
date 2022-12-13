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
            <div style="float: right; position: relative; top: 10px; margin-right: 10px">
                <el-button type="info" @click="enterProfile">Profile</el-button>
            </div>
            <div style="float: right; position: relative; top: 10px; margin-right: 10px">
                <el-button type="info" @click="dialogVisible = true">Login</el-button>
            </div>
        </el-menu>
        <router-view/>


        <el-dialog
            title="Login"
            :visible.sync="dialogVisible"
            width="50%"
        >
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="Email" prop="user">
                    <el-input type="text" v-model="ruleForm.user" autocomplete="off" placeholder="Please Input Email"/>
                </el-form-item>
                <el-form-item label="Password" prop="pwd">
                    <el-input type="password" v-model="ruleForm.pwd" autocomplete="off" placeholder="Please Input Password"/>
                </el-form-item>
<!--                <el-form-item class="ppp">-->
<!--                    <el-button type="success" @click="toRegister" style="float: left">Sign Up</el-button>-->
<!--                    <el-button @click="returnHome" style="float: right">Cancel</el-button>-->
<!--                    <el-button type="primary" @click="submitForm('ruleForm')" style="float: right">Login</el-button>-->
<!--                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
<!--                <el-button @click="dialogVisible = false">Cancel</el-button>-->
<!--                <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>-->

                <el-button type="success" @click="toRegister">Sign Up</el-button>
                    <el-button @click="returnHome">Cancel</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">Login</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import {MessageBox} from "element-ui";

export default {
    name: "NavBar",
    data() {
        let validateUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please Input Email'))
            } else {
                callback()
            }
        }
        let validatePwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please Input Password'))
            } else {
                callback()
            }
        }
        return {
            initialSelect: "",
            dialogVisible: false,
            ruleForm: {
                user: '',
                pwd: ''
            },
            rules: {
                user: [{validator: validateUser, trigger: 'blur'}],
                pwd: [{validator: validatePwd, trigger: 'blur'}],
            }
        }
    },

    methods: {
        enterProfile() {
            this.$router.push("/profile")
        },

        handleSelect(key) {
            if (key === "Home" && this.$route.path !== "/home") {
                this.$router.push("/home")
            }
            if (key === "Teams" && this.$route.path !== "/teams") {
                this.$router.push("/teams")
            }
        },

        toRegister() {
            this.$router.push({
                name: 'register'
            })
        },
        returnHome() {
            this.$router.push({
                name: 'home'
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let {user, pwd} = this.ruleForm
                    let res = await this.$http.post('http://127.0.0.1:8000/api/login',
                        {'username': user, 'password': pwd})
                    if (res.data.code === 1) {
                        let token = res.data.token
                        let username = res.data.user
                        let head = res.data.head
                        console.log(token, username, head)
                        // setStore('token', token)
                        // setStore('user', username)
                        // setStore('head', head)
                        await this.$router.push({
                            name: 'home'
                        })
                    } else {
                        await MessageBox.alert('<h2 style="color: red">wrong username or password</h2>', {
                            dangerouslyUseHTMLString: true
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },

    created() {
        const curUrl = this.$route.path.slice(1)
        if (curUrl === "home") {
            this.initialSelect = "Home"
        }
        if (curUrl === "teams") {
            this.initialSelect = "Teams"
        }
    }
}
</script>

<style scoped>

</style>
