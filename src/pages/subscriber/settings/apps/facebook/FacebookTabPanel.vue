<template>
    <q-tab-panel name="facebook" :class="$helpers.colors().defaultText">
        <q-card-section>
            <div class="tw-border-b-1">
                <div class="tw-font-medium tw-pb-2">Facebook API Manager</div>
            </div>
        </q-card-section>

        <q-card-section>
            <div>App ID</div>
            <q-input
                v-model="facebookApiManagerForm.apps_fb_app_id"
                :error-message="facebookApiManagerFormErrors.apps_fb_app_id"
                :error="!!facebookApiManagerFormErrors.apps_fb_app_id"
                @update:model-value="facebookApiManagerFormErrors.apps_fb_app_id = ''"
                placeholder="Ex. 1033239004116693"
                type="input"
                bg-color="white"
                class="tw-shadow tw-px-2 tw-mb-3"
                hide-bottom-space
                standout
                borderless
                dense
            />

            <div>Secret Key</div>
            <q-input
                v-model="facebookApiManagerForm.apps_fb_secret_key"
                :error-message="facebookApiManagerFormErrors.apps_fb_secret_key"
                :error="!!facebookApiManagerFormErrors.apps_fb_secret_key"
                @update:model-value="facebookApiManagerFormErrors.apps_fb_secret_key = ''"
                placeholder="Ex. 26ee4518d92aad3173751b1c491d70a7"
                type="input"
                bg-color="white"
                class="tw-shadow tw-px-2"
                hide-bottom-space
                standout
                borderless
                dense
            />

            <q-btn
                @click="updateFacebookApiSetting"
                class="tw-mt-5"
                type="submit"
                :color="globalColor"
                unelevated
                no-caps
            >
                Update App Setting
            </q-btn>
        </q-card-section>

        <q-card-section class="tw-mt-4">
            <div class="tw-mb-4 tw-border-b-1">
                <div class="tw-font-medium tw-pb-2" :class="$helpers.colors().defaultText">
                    Facebook Account Manager
                </div>
            </div>
        </q-card-section>

        <template v-if="accounts.length">
            <q-card-section v-for="account of accounts" :key="account.id" class="tw-py-0">
                <div class="bg-grey-3 tw-rounded-sm tw-p-6 tw-flex tw-items-center tw-justify-between tw-gap-4">
                    <div class="tw-font-medium" :class="$helpers.colors().defaultText">
                        You are currently connected as
                        <span :class="`text-${globalColor}`" class="tw-font-bold">{{
                            accounts[0].user_info.name
                        }}</span>
                    </div>
                    <q-btn label="Disconnect" text-color="orange-8" @click="fbLogoutHandle" flat />
                </div>

                <div class="tw-my-6">
                    <div class="tw-mb-4 tw-font-medium" :class="$helpers.colors().defaultText">
                        Select a page to connect to ExonChat
                    </div>

                    <q-list class="tw-mb-4">
                        <q-item class="custom-border-top custom-border-bottom">
                            <q-item-section :class="$helpers.colors().defaultText">Page Name</q-item-section>
                            <q-item-section side>Assign To</q-item-section>
                        </q-item>

                        <template
                            v-if="
                                account.facebook_pages?.length &&
                                account.facebook_pages.filter((page) => !page.active).length
                            "
                        >
                            <q-item
                                v-for="page of account.facebook_pages.filter((page) => !page.active)"
                                :key="page.id"
                            >
                                <q-item-section :class="`text-${globalColor}`" class="tw-font-medium">{{
                                    page.page_name
                                }}</q-item-section>
                                <q-item-section class="tw-flex tw-gap-6 tw-items-center" side>
                                    <q-select
                                        v-model="page.chat_department_id"
                                        :options="chatDepartments"
                                        hide-bottom-space
                                        option-value="id"
                                        option-label="display_name"
                                        label="Select Chat Department"
                                        class="tw-mb-3 tw-w-48"
                                        :color="globalColor"
                                        use-chips
                                        emit-value
                                        map-options
                                        dense
                                    />
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn
                                        :color="globalColor"
                                        label="Connect"
                                        :disable="!page.chat_department_id"
                                        @click="updatePageConnection(page.id, page.chat_department_id)"
                                        unelevated
                                    />
                                </q-item-section>
                            </q-item>
                        </template>

                        <q-item v-else>
                            <q-item-section class="text-center" :class="$helpers.colors().defaultText"
                                >No pages to connect</q-item-section
                            >
                        </q-item>
                    </q-list>
                </div>

                <div class="tw-my-6">
                    <div class="tw-mb-4 tw-font-medium" :class="$helpers.colors().defaultText">Connected Pages</div>

                    <q-list>
                        <q-item class="custom-border-top custom-border-bottom">
                            <q-item-section :class="$helpers.colors().defaultText">Page Name</q-item-section>
                            <q-item-section side>Assigned To</q-item-section>
                        </q-item>

                        <template
                            v-if="
                                account.facebook_pages?.length &&
                                account.facebook_pages.filter((page) => page.active).length
                            "
                        >
                            <q-item v-for="page of account.facebook_pages.filter((page) => page.active)" :key="page.id">
                                <q-item-section :class="`text-${globalColor}`" class="tw-font-medium">{{
                                    page.page_name
                                }}</q-item-section>

                                <q-item-section class="tw-flex tw-items-center" side>
                                    <q-select
                                        v-model="page.chat_department_id"
                                        :options="chatDepartments"
                                        hide-bottom-space
                                        option-value="id"
                                        option-label="display_name"
                                        label="Select Chat Department"
                                        class="tw-mb-3 tw-w-48"
                                        :color="globalColor"
                                        use-chips
                                        emit-value
                                        map-options
                                        dense
                                    />
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn
                                        :color="globalColor"
                                        label="Update"
                                        :disable="!page.chat_department_id"
                                        @click="updatePageConnection(page.id, page.chat_department_id)"
                                        unelevated
                                    />
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn
                                        label="Disconnect"
                                        text-color="orange-8"
                                        @click="disconnectPage(page.id)"
                                        flat
                                    />
                                </q-item-section>
                            </q-item>
                        </template>
                        <q-item v-else>
                            <q-item-section class="text-center" :class="$helpers.colors().defaultText"
                                >You have no connected pages yet</q-item-section
                            >
                        </q-item>
                    </q-list>
                </div>
            </q-card-section>
        </template>

        <q-card-section v-else class="tw-py-0">
            <div class="bg-grey-3 tw-rounded-sm tw-p-6 tw-flex tw-items-center tw-justify-between tw-gap-4">
                <div class="tw-font-medium" :class="$helpers.colors().defaultText">
                    To add Pages, please log in to Facebook
                </div>
                <q-btn
                    label="Facebook Login"
                    :color="globalColor"
                    :loading="facebookLoginWorking"
                    unelevated
                    no-wrap
                    no-caps
                    @click="fbLoginHandle"
                />
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
            accounts: [],
            chatDepartments: [],
            facebookApiManagerForm: {
                apps_fb_app_id: "",
                apps_fb_secret_key: "",
            },
            facebookApiManagerFormErrors: {},
            facebookDataForSubmit: {
                auth_response: {},
                user_response: {},
            },
            facebookLoginWorking: false,
        };
    },

    mounted() {
        this.getAppSetting();
    },

    computed: {
        ...mapGetters({ profile: "auth/profile", globalColor: "setting_ui/globalColor" }),
    },

    methods: {
        getAppSetting() {
            this.$store
                .dispatch("setting_app/getAppSetting")
                .then((res: any) => {
                    res.data.forEach((appSetting: any) => {
                        if (this.facebookApiManagerForm.hasOwnProperty(appSetting.slug)) {
                            this.facebookApiManagerForm[appSetting.slug] = this.getSingleInputValue(appSetting);
                        }
                    });

                    this.initFacebookSdk();
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                });
        },

        getSingleInputValue(appSetting: any) {
            const value = appSetting.user_settings_value.length
                ? appSetting.user_settings_value[0].value
                : appSetting.default_value;

            return appSetting.input_type === "checkbox" ? value === "true" : value;
        },

        updateFacebookApiSetting() {
            const data = Object.keys(this.facebookApiManagerForm).map((inputName: any) => {
                return {
                    name: inputName,
                    value: this.facebookApiManagerForm[inputName].toString(),
                };
            });

            this.$store
                .dispatch("setting_app/updateAppSetting", {
                    inputs: {
                        app_settings: data,
                    },
                })
                .then(() => {
                    this.initFacebookSdk();
                    this.$helpers.showSuccessNotification(this, "App setting update successful");
                })
                .catch((err: any) => {
                    if (this.$_.isObject(err.response.data.message)) {
                        this.facebookApiManagerFormErrors = err.response.data.message;
                    } else {
                        this.$helpers.showErrorNotification(this, err.response.data.message);
                    }
                });
        },

        initFacebookSdk() {
            this.$nextTick(() => {
                window.fbAsyncInit = () => {
                    FB.init({
                        appId: this.facebookApiManagerForm.apps_fb_app_id,
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

            this.getFacebookAccounts();
            this.getChatDepartments();
        },

        getFacebookAccounts() {
            this.$api.get("/apps/facebook/accounts").then((res: any) => {
                this.accounts = res.data;
            });
        },
        getChatDepartments() {
            this.loadingChatDepartments = true;

            window.socketSessionApi
                .get("/departments")
                .then((res: any) => {
                    // console.log('webchat departments', res);
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                })
                .finally(() => {
                    //
                });
        },

        updatePageConnection(id: any, chat_department_id: string) {
            window.api
                .post(`/apps/facebook/update-page-connection/${id}`, {
                    chat_department_id,
                })
                .then((res: any) => {
                    this.accounts = res.data;
                });
        },
        disconnectPage(id: any) {
            window.api.post(`/apps/facebook/page-disconnect/${id}`).then((res: any) => {
                this.accounts = res.data;
            });
        },

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
                                        self.accounts = [res.data];
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
                { scope: "pages_show_list, pages_messaging", auth_type: "rerequest" } //reauthorize need for update access_token
            );

            // after login before final submit call check less then 1hr. cz access token time is limited to 1hr
        },

        fbLogoutHandle() {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;

            self.facebookLoginWorking = true;

            self.$api
                .post("/apps/facebook/disconnect")
                .then(() => {
                    console.log("logged out");
                    self.accounts = [];
                })
                .catch((e: any) => {
                    console.log(e);
                })
                .finally(() => {
                    self.facebookLoginWorking = false;
                });

            FB.logout(() => {
                //
            });
        },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
