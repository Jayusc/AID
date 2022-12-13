<template>
    <div class="login">
        <div class="box">
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="Email" prop="user">
                    <el-input type="text" v-model="ruleForm.user" placeholder="Please Input Email"/>
                </el-form-item>
                <el-form-item label="Password" prop="pwd">
                    <el-input type="password" v-model="ruleForm.pwd"
                              placeholder="Please Input Password"/>
                </el-form-item>
                <el-form-item class="ppp">
                    <el-button type="success" @click="toRegister" style="float: left">Sign Up</el-button>
                    <el-button @click="returnHome" style="float: right">Cancel</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')" style="float: right">Login</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
// import {setStore} from '@/utils/storage'
import {MessageBox} from 'element-ui'

export default {
    name: "LoginPage",
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
                        await MessageBox.alert('<h2 style="color: #ff0000">wrong username or password</h2>', {
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
    }
}
;
</script>

<style>
/*::v-deep #login-span {*/
/*    position: relative;*/
/*    left: 38px*/
/*}*/

/*::v-deep .login .box[data-v-2014ec42] {*/
/*    padding: 61px 50px 50px 10px*/
/*}*/

/*.ppp {*/
/*    margin-right: -138px;*/
/*}*/

/*.login {*/
/*    position: relative;*/
/*    overflow: visible;*/
/*    background: #ededed;*/
/*}*/

/*.box {*/
/*    border: 1px solid #dadada;*/
/*    border-radius: 10px;*/
/*    position: absolute;*/
/*    top: 100px;*/
/*    left: 45%;*/
/*    padding: 50px 50px 50px 10px;*/
/*    margin-left: -225px;*/
/*    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),*/
/*    0 18px 20px -10px rgba(0, 0, 0, 0.04),*/
/*    0 18px 20px -10px rgba(0, 0, 0, 0.04),*/
/*    0 10px 20px -10px rgba(0, 0, 0, 0.04);*/
/*    text-align: center;*/
/*}*/

</style>


<!--<template>-->
<!--    <div>-->
<!--        <h1>Please Login</h1>-->
<!--        <el-input-->
<!--            placeholder="Please Input Email"-->
<!--            v-model="input"-->
<!--            clearable>-->
<!--        </el-input>-->
<!--        <el-input placeholder="Please Input Password" v-model="input" show-password></el-input>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--    name: "LoginPage",-->
<!--    data() {-->
<!--        return {-->
<!--            input: ''-->
<!--        }-->
<!--    }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
