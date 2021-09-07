<template>
    <q-expansion-item
        label="CUSTOMER"
        dense
        default-opened
        :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
        class="tw-shadow"
        expand-icon-class="hidden"
    >
        <q-card>
            <q-card-section class="tw-px-0 tw-py-2">
                <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                    <q-item dense>
                        <q-item-section class="tw-w-full">
                            <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-my-1">
                                <ec-avatar
                                    size="xl"
                                    :image_src="null"
                                    :name="conversationWithUsersInfo.socket_session.init_name"
                                    :email="conversationWithUsersInfo.socket_session.init_email"
                                />
                                <div class="tw-flex tw-flex-col tw-justify-center">
                                    <q-item-label class="text-weight-bold text-right tw-text-sm">
                                        {{ $_.upperFirst(conversationWithUsersInfo.socket_session.init_name) }}
                                    </q-item-label>
                                    <q-item-label class="text-right text-blue-7" caption
                                        >{{ conversationWithUsersInfo.socket_session.init_email }}
                                    </q-item-label>
                                    <q-item-label class="text-right" ref="connectedForTimer" caption
                                        >Connected for
                                        <b>{{
                                            $helpers.preciseDiff(
                                                conversationWithUsersInfo.socket_session.created_at,
                                                conversationInfo.closed_at
                                            )
                                        }}</b>
                                    </q-item-label>
                                </div>
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-item class="tw-flex" dense>
                        <div class="tw-flex tw-gap-1 tw-items-center">
                            <q-icon name="flag" size="xs"></q-icon>
                            <div>
                                {{
                                    conversationWithUsersInfo?.socket_session?.init_location?.country?.names?.en ||
                                    "Not Available"
                                }}
                            </div>
                        </div>
                        <q-space />
                        <div class="tw-flex tw-gap-1 tw-items-center">
                            <q-icon name="language" size="xs"></q-icon>
                            <div>
                                {{ parsedUaString.browser.name }}
                                {{ parsedUaString.browser.version }}
                            </div>
                        </div>
                    </q-item>
                    <q-item class="tw-flex" dense>
                        <div class="tw-flex tw-gap-1 tw-items-center">
                            <q-icon name="devices" size="xs"></q-icon>
                            <div>{{ parsedUaString.os.name }} {{ parsedUaString.os.version }}</div>
                        </div>
                        <q-space />
                        <div class="tw-flex tw-gap-1 tw-items-center">
                            <q-icon name="dns" size="xs"></q-icon>
                            <div>
                                {{ conversationWithUsersInfo.socket_session.init_ip }}
                            </div>
                        </div>
                    </q-item>

                    <q-item v-if="rightBarState.mode !== 'conversation'" dense>
                        <q-item-section>
                            <q-item-label>Department</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label class="text-capitalize"
                                >{{ conversationInfo.chat_department.tag }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item v-if="rightBarState.mode !== 'conversation'" dense>
                        <q-item-section>
                            <q-item-label>Chat Start</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label>
                                {{ $helpers.myDate(conversationInfo.created_at, "MMMM Do YYYY, h:mm a") }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <slot name="bottom-section"></slot>
        </q-card>
    </q-expansion-item>
</template>

<script>
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar";

export default {
    name: "CustomerDetailsCard",
    components: { EcAvatar },
    props: {
        conversationWithUsersInfo: {
            type: Object,
            default: () => ({}),
        },
        conversationInfo: {
            type: Object,
            default: () => ({}),
        },
        parsedUaString: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        ...mapGetters({
            globalColor: "setting_ui/globalColor",
            globalBgColor: "setting_ui/globalBgColor",
            rightBarState: "setting_ui/rightBarState",
        }),
    },
};
</script>

<style scoped></style>
