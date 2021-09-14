<template>
    <q-tab-panel name="facebook">
        <q-card-section>
            <div class="tw-mb-4 tw-border-b-1">
                <div class="tw-font-medium tw-pb-2" @click="fbLoginHandle">Facebook API Manager</div>
            </div>
        </q-card-section>

        <q-card-section class="tw-flex tw-items-center tw-justify-between tw-gap-4">
            <div>
                <div>To add Pages, please log in to Facebook</div>
                <div>You are currently connect as <span>Mohammed Younus</span></div>
            </div>

            <div>
                <q-btn label="Facebook Login" :color="globalColor" unelevated no-wrap no-caps @click="fbLoginHandle" />
                <q-btn label="logout" @click="fbLogoutHandle" />
            </div>
        </q-card-section>

        <q-inner-loading />
    </q-tab-panel>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

declare global {
    interface Window {
        fbAsyncInit: any;
        FB: any;
    }
}

export default defineComponent({
    name: "FacebookTabPanel",
    props: {},

    data(): any {
        return {
            FB: {},
            ao: {
                accessToken:
                    "EAAI84REZBiiUBALY1T5jFM6p9i1LH3ZCUMnZAggT7w8ZCe8nOAdfwPjhMcAl5m31Q8IsH8feCl3cBX0QCakS0651PbadoX5KaZBerKV04CeVrCi1zGX7iMUBhLOQiZC9CgXCaM88gFbZALbwbFmbsDJ8JXqx3p7lTsoQVecohEXxR3nxNZAuXN27xzv8RjqQYhL371EUc8ls3YkzZCbqlAe51",
                userID: "3050567211893527",
                expiresIn: 4408,
                signedRequest:
                    "AyyveD28sWQY8nyPomvE4H-2i6vCFgdm2GdADG-1Z0A.eyJ1c2VyX2lkIjoiMzA1MDU2NzIxMTg5MzUyNyIsImNvZGUiOiJBUUJjd0RidUJCUFMyai1URHc2VmlJOHJQUjlvXy1QMVhtTFBtS0t5anJ3UlRMaU9GOFF6N2NTTjc0S0phUTdwWmRzc0Q4RXFpaFBEWTJ0Y0duZ0dFMmxaNEFaR3ljTWhRaGhwR0I4TXBrNDhxTkF6UGpHMzlwZzJTRzBPWU5YNDZNNGtZaFU2ZkNZUWVCUUI4cmh6aGFxSG9WU2k0enZ6anpxaU83Y2tsTFJKWFgxazBTRUhDOGttVFBMTWdwRGNDdk5VRDdjYW9HeFZkczlSODRqdWlhdDlZNEhFenlQVEpWZVhhWGV5WTFlWTlpTkxiZzZRVmRJRGhXSy1UZnl5SjFFZTZiN0JTSjJfbFFCSDcybkprdE15RUZiTE1vQ3pqdWlWUTJwM0U3SWdxZFViTUFvcEV3ZVF2VDA2REtuU1UxZGhPMzF4QVlfLTJQRHhUZWVyZ0xpdFk4bVNBaVZYZ29sb0thS25yNEVjOEEiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTYzMTUzMzU5Mn0",
                graphDomain: "facebook",
                data_access_expiration_time: 1639309592,
            },
            facebookDataForSubmit: {
                auth_response: {},
                user_response: {},
            },
            facebookLoginWorking: false,
        };
    },

    mounted() {
        this.$nextTick(() => {
            window.fbAsyncInit = () => {
                FB.init({
                    appId: "629887308040741",
                    xfbml: true,
                    version: "v11.0",
                });

                console.log("FB SDK was initialized as mixin");
            };
        });

        (function (d, s, id) {
            let js: any,
                fjs: any = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
    },

    computed: {
        ...mapGetters({ profile: "auth/profile", globalColor: "setting_ui/globalColor" }),
    },

    methods: {
        fbLoginHandle() {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            self.facebookLoginWorking = true;

            // loginRes.{
            //     "response": {
            //         "authResponse": {
            //                 "accessToken": "ppbn1ll2OJS2ZCOYdtkZCtwTZC6w04K0TAwWDfybHSH0MEhiql5UW95",
            //                 "userID": "305893527",
            //                 "expiresIn": 4118,
            //                 "signedRequest": "mDPzc3VlZF9hdCI6MTYzMTYwOTQ4Mn0",
            //                 "graphDomain": "facebook",
            //                 "data_access_expiration_time": 1639385482
            //         },
            //         "status": "connected"
            //     }
            // }
            FB.login(
                function (authResponse: any) {
                    console.log({ authResponse });
                    if (authResponse.status === "connected") {
                        // me call response
                        // meRes.{
                        //     "name": "Mohammed Younus",
                        //     "id": "1893527"
                        // }
                        FB.api("/me", function (userResponse: any) {
                            if (!userResponse.error) {
                                console.log({ userResponse });

                                self.facebookDataForSubmit.auth_response = authResponse.authResponse;
                                self.facebookDataForSubmit.user_response = userResponse;

                                self.$api
                                    .post("/apps/facebook/connect", self.facebookDataForSubmit)
                                    .then((res: any) => {
                                        console.log({ res });
                                    })
                                    .catch((e: any) => {
                                        console.log(e);
                                    })
                                    .finally(() => {
                                        self.facebookLoginWorking = false;
                                    });
                            } else {
                                console.log("something went wrong");
                                self.facebookLoginWorking = false;
                            }
                        });
                    } else {
                        console.log("User cancelled login or did not fully authorize.");
                        self.facebookLoginWorking = false;
                    }
                },
                { scope: "email,pages_show_list", auth_type: "reauthorize" } //reauthorize need for update access_token
            );

            // after login before final submit call check less then 1hr. cz access token time is limited to 1hr
        },

        fbLogoutHandle() {
            FB.logout(() => {
                console.log("logged out");
            });
        },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
