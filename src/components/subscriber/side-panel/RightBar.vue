<template>
    <div class="tw-h-full tw-flex tw-flex-col tw-relative">
        <slot name="extra"></slot>

        <!--right bar mini mode-->
        <template v-if="rightBarState.mode === 'conversation' && rightBarState.conv_id">
            <message
                :ses_id="profile.socket_session.id"
                :conv_id="rightBarState.conv_id"
                :mini_mode="true"
                :key="rightBarState.conv_id || 0"
            >
                <template v-slot:scroll-area-top-section>
                    <div class="tw-mb-3">
                        <messages-top-section
                            v-if="conversationData.users_only"
                            :conv_id="conversationData.id"
                            :mini_mode="true"
                            class="tw-mb-3"
                        />

                        <!--assuming its livechat-->
                        <template v-if="conversationData.id && !conversationData.users_only">
                            <q-list class="tw-px-1 tw-py-3 tw-pt-0" :class="$helpers.colors().defaultText">
                                <q-card class="tw-shadow-none tw-mb-3 no-border-radius">
                                    <q-card-section
                                        class="tw-flex tw-items-center tw-justify-between tw-py-2 tw-font-bold text-white"
                                        :class="[`${globalBgColor}-8`]"
                                    >
                                        <div>Chat Preview</div>
                                        <div>
                                            <q-btn
                                                @click="
                                                    updateRightDrawerState({
                                                        mode: 'client_info',
                                                    })
                                                "
                                                label="Close"
                                                size="sm"
                                                color="grey-3"
                                                text-color="black"
                                                no-caps
                                                no-wrap
                                                unelevated
                                            />
                                        </div>
                                    </q-card-section>

                                    <q-card-section :class="`tw-px-0 tw-py-2 tw-px-2 ${globalBgColor}-1`">
                                        <div class="tw-flex tw-gap-2">
                                            <q-btn
                                                @click="
                                                    $router.push({
                                                        name: 'chats',
                                                        params: { conv_id: conversationData.id },
                                                    })
                                                "
                                                icon="fullscreen"
                                                label="Full View"
                                                size="md"
                                                color="white"
                                                :text-color="$helpers.colors().defaultText"
                                                no-caps
                                                no-wrap
                                                unelevated
                                            />

                                            <send-transcript
                                                icon="mail_outline"
                                                :conv_id="rightBarState.conv_id"
                                                color="white"
                                                :text_color="$helpers.colors().defaultText"
                                            />
                                        </div>
                                    </q-card-section>
                                </q-card>

                                <customer-details-card
                                    v-if="conversationData.id"
                                    :conversation-with-users-info="conversationData.clientConversationSession"
                                    :conversation-info="conversationData"
                                    :parsed-ua-string="parsedUaString"
                                >
                                    <template v-slot:bottom-section>
                                        <div v-if="!conversationShowDetail">
                                            <q-separator />
                                            <q-btn
                                                @click="conversationShowDetail = !conversationShowDetail"
                                                class="tw-w-full tw-py-2"
                                                size="sm"
                                                no-caps
                                                flat
                                            >
                                                <q-icon name="far fa-address-card tw-mr-2"> </q-icon>
                                                <span class="tw-text-sm">
                                                    {{ `${conversationShowDetail ? "Hide" : "Show"} Chat Details` }}
                                                </span>
                                            </q-btn>
                                        </div>
                                    </template>
                                </customer-details-card>

                                <div v-show="conversationShowDetail" class="tw-mb-4"></div>

                                <q-expansion-item
                                    v-show="conversationShowDetail"
                                    label="CHAT DETAILS"
                                    dense
                                    default-opened
                                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                                    class="tw-shadow"
                                    expand-icon-class="hidden"
                                >
                                    <q-card class="tw-shadow tw-mb-3">
                                        <q-card-section class="tw-px-0 tw-py-2">
                                            <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                                                <q-item dense>
                                                    <q-item-section>
                                                        <q-item-label>Connected Agents</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <connected-users-faces
                                                            :users_conv_ses="conversationData.connectedUsers"
                                                            size="md"
                                                        />
                                                    </q-item-section>
                                                </q-item>
                                                <q-item dense>
                                                    <q-item-section>
                                                        <q-item-label>Department</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-item-label class="text-capitalize"
                                                            >{{ conversationData.chatDepartment?.tag }}
                                                        </q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item dense>
                                                    <q-item-section>
                                                        <q-item-label>Chat Start</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-item-label>
                                                            {{
                                                                $helpers.myDate(
                                                                    conversationData.created_at,
                                                                    "MMMM Do YYYY, h:mm a"
                                                                )
                                                            }}
                                                        </q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item dense>
                                                    <q-item-section>
                                                        <q-item-label>Chat Duration</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-item-label ref="chat_duration">
                                                            <template v-if="!conversationData.closed_at"
                                                                >{{ $helpers.preciseDiff(conversationData.created_at) }}
                                                            </template>
                                                            <template v-else>
                                                                {{
                                                                    $helpers.preciseDiff(
                                                                        conversationData.created_at,
                                                                        conversationData.closed_at
                                                                    )
                                                                }}
                                                            </template>
                                                        </q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item dense>
                                                    <q-item-section>
                                                        <q-item-label>Chat Rating</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-item-label>
                                                            <template v-if="conversationData.conversation_rating">
                                                                <span
                                                                    :class="
                                                                        conversationData.conversation_rating.rating ===
                                                                        5
                                                                            ? 'green'
                                                                            : 'orange'
                                                                    "
                                                                    >{{
                                                                        conversationData.conversation_rating.rating ===
                                                                        5
                                                                            ? "Good"
                                                                            : "Bad"
                                                                    }}</span
                                                                >
                                                            </template>
                                                            <template v-else>Not Rated</template>
                                                        </q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-card-section>
                                        <div v-if="conversationShowDetail">
                                            <q-separator />
                                            <q-btn
                                                @click="conversationShowDetail = !conversationShowDetail"
                                                class="tw-w-full tw-py-2"
                                                size="sm"
                                                no-caps
                                                flat
                                            >
                                                <q-icon name="far fa-address-card tw-mr-2"> </q-icon>
                                                <span class="tw-text-sm">
                                                    {{ `${conversationShowDetail ? "Hide" : "Show"} Chat Details` }}
                                                </span>
                                            </q-btn>
                                        </div>
                                    </q-card>
                                </q-expansion-item>
                            </q-list>
                        </template>
                    </div>
                </template>
            </message>
        </template>

        <!--client info / full view-->
        <q-scroll-area
            v-else-if="rightBarState.mode === 'client_info' && conversationData.id && !conversationData.users_only"
            class="fit"
            :thumb-style="$helpers.getThumbStyle()"
        >
            <q-list class="tw-px-1 tw-pr-3 tw-py-3" :class="$helpers.colors().defaultText">
                <customer-details-card
                    v-if="conversationData.id"
                    :conversation-with-users-info="conversationData.clientConversationSession"
                    :conversation-info="conversationData"
                    :parsed-ua-string="parsedUaString"
                />

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="conversationData.closed_at"
                    label="AGENTS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto" :style="{ maxHeight: cardMaxHeight }">
                            <q-list v-if="conversationData.connectedUsers?.length">
                                <q-item v-for="agent of conversationData.connectedUsers" :key="agent.id" dense>
                                    <q-item-section class="tw-w-full">
                                        <div class="tw-flex tw-w-full tw-my-1 tw-gap-4">
                                            <ec-avatar
                                                :size="mini_mode ? 'md' : 'xl'"
                                                :image_src="null"
                                                :name="agent.socket_session.user.user_meta.display_name"
                                                :email="agent.socket_session.user.email"
                                            ></ec-avatar>
                                            <div class="tw-flex tw-flex-col tw-justify-center">
                                                <q-item-label class="text-weight-bold tw-text-sm">
                                                    {{
                                                        $_.upperFirst(agent.socket_session.user.user_meta.display_name)
                                                    }}
                                                </q-item-label>
                                                <q-item-label :class="$helpers.colors().defaultText" caption
                                                    >{{ agent.socket_session.user.email }}
                                                </q-item-label>
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                            <div v-else class="text-center tw-py-2 text-grey-7">No agent found</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationData.closed_at"
                    label="RELATED SERVICES"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto" :style="{ maxHeight: cardMaxHeight }">
                            <q-list
                                v-if="relatedServices.length"
                                :class="$helpers.colors().defaultText"
                                class="tw-text-xs"
                            >
                                <q-item
                                    v-for="(service, index) in relatedServices"
                                    :key="index"
                                    @click="gotoServiceDetails(service)"
                                    class="tw-flex tw-items-center tw-py-2"
                                    :class="`${index !== 0 ? 'custom-border-top' : ''}`"
                                    clickable
                                    dense
                                >
                                    <div>
                                        <div>{{ service.name }} - {{ service.billingcycle }}</div>
                                        <div>
                                            <a
                                                href="javascript:void(0)"
                                                @click.stop="gotoDomain(service.domain)"
                                                class="text-blue-5"
                                            >
                                                {{ service.domain }}
                                            </a>
                                        </div>
                                    </div>
                                    <q-space />
                                    <div class="tw-text-right">
                                        <div
                                            :class="`${
                                                service.status === 'Active'
                                                    ? 'text-green'
                                                    : service.status === 'Pending'
                                                    ? 'text-red'
                                                    : 'text-grey'
                                            }`"
                                        >
                                            {{ service.status }}
                                        </div>
                                        <div>Due Date: {{ $helpers.myDate(service.nextduedate, "MMM Do Y") }}</div>
                                    </div>
                                </q-item>
                            </q-list>
                            <div v-else class="text-center tw-py-2 text-grey-7">No service found</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationData.closed_at"
                    label="RELATED DOMAINS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto" :style="{ maxHeight: cardMaxHeight }">
                            <q-list
                                v-if="clientDomains.length"
                                :class="$helpers.colors().defaultText"
                                class="tw-text-xs"
                            >
                                <q-item
                                    v-for="(domain, index) in clientDomains"
                                    :key="index"
                                    @click="gotoDomainDetails(domain)"
                                    class="tw-flex tw-items-center tw-py-2"
                                    :class="`${index !== 0 ? 'custom-border-top' : ''}`"
                                    clickable
                                    dense
                                >
                                    <div>
                                        <div>
                                            <a
                                                href="javascript:void(0)"
                                                @click.stop="gotoDomain(domain.domainname)"
                                                class="text-blue-5"
                                            >
                                                {{ domain.domainname }}
                                            </a>
                                        </div>
                                    </div>
                                    <q-space />
                                    <div class="tw-text-right">
                                        <div :class="`${domain.status === 'Active' ? 'text-green' : 'text-red'}`">
                                            {{ domain.status }}
                                        </div>
                                        <div>Due Date: {{ $helpers.myDate(domain.nextduedate, "MMM Do Y") }}</div>
                                    </div>
                                </q-item>
                            </q-list>
                            <div v-else class="text-center tw-py-2 text-grey-7">No service found</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationData.closed_at"
                    label="CUSTOMER PAGE VISITS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2 tw-overflow-auto" :style="{ maxHeight: cardMaxHeight }">
                            <q-list v-if="visits?.length" ref="page_visit_list" class="tw-break-all">
                                <q-item
                                    v-for="(visit, key) of visits"
                                    :key="key"
                                    dense
                                    class="tw-text-xs"
                                    :class="`${key !== 0 ? 'custom-border-top' : ''}`"
                                >
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon :name="visit.visiting ? 'visibility' : 'wysiwyg'" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>
                                            <a :href="visit.url" target="_blank" class="text-blue-5 tw-font-medium">{{
                                                visit.title
                                            }}</a>
                                        </q-item-label>
                                        <q-item-label caption
                                            >{{
                                                visit.visiting
                                                    ? $helpers.diffAsMinute(visit.first_visit_time)
                                                    : $helpers.fromNowTime(visit.last_stay_time)
                                            }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                            <div v-else class="text-center tw-py-2 text-grey-7">No visit info</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationData.closed_at"
                    label="PREVIOUS CHATS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto" :style="{ maxHeight: cardMaxHeight }">
                            <q-list
                                v-if="
                                    clientPreviousChats[conversationData.id] &&
                                    Object.keys(clientPreviousChats[conversationData.id]).length
                                "
                                class="tw-break-all"
                            >
                                <q-item
                                    v-for="(conv, key) of clientPreviousChats[conversationData.id]"
                                    :to="{ name: 'chats', params: { conv_id: conv.id } }"
                                    :class="`${key !== 0 ? 'custom-border-top' : ''}`"
                                    :key="key"
                                    clickable
                                    dense
                                    class="tw-text-xs tw-py-2"
                                >
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="chat_bubble_outline" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ conv.messages[0].msg }}</q-item-label>
                                        <q-item-label caption>{{
                                            $helpers.myDate(conv.created_at, "MMM DD, Y, h:mm a")
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="text-center tw-py-2 text-grey-7">No previous chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationData.closed_at"
                    label="TICKETS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto" :style="{ maxHeight: cardMaxHeight }">
                            <q-list v-if="Object.keys(clientTickets).length" class="tw-break-all">
                                <q-item
                                    v-for="(ticket, key) of clientTickets"
                                    :key="key"
                                    class="tw-text-xs tw-py-2"
                                    :class="`${key !== 0 ? 'custom-border-top' : ''}`"
                                    @click="gotoTicketDetails(ticket)"
                                    dense
                                    clickable
                                >
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="confirmation_number" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ ticket.subject }}</q-item-label>
                                        <q-item-label caption>
                                            <div class="tw-flex tw-justify-between tw-items-center">
                                                <div class="tw-mr-2">{{ $helpers.myDate(ticket.date) }}</div>
                                                <q-badge
                                                    :style="{ backgroundColor: getTicketStatusBgColor(ticket) }"
                                                    class="tw-text-xxs"
                                                >
                                                    {{ ticket.status }}
                                                </q-badge>
                                            </div>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="text-center tw-py-2 text-grey-7">No tickets found</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <!--its a modal-->
                <!--<ticket-detail
                    :ticket="ticketSelected"
                    :modal_show="ticketDetailModal"
                    @modalUpdate="ticketDetailModal = $event"
                />-->
            </q-list>
        </q-scroll-area>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";

import Message from "components/common/Message.vue";
import MessagesTopSection from "components/subscriber/chat/MessagesTopSection.vue";
import EcAvatar from "src/components/common/EcAvatar.vue";

import UAParser from "ua-parser-js";
// import TicketDetail from "components/apps/whmcs/TicketDetail.vue";
import ConnectedUsersFaces from "components/subscriber/chat/ConnectedUsersFaces.vue";
import CustomerDetailsCard from "components/common/RightbarCards/CustomerDetailsCard.vue";
import SendTranscript from "components/common/SendTranscript.vue";
import Conversation from "src/store/models/Conversation";

export default defineComponent({
    name: "RightBar",
    components: {
        SendTranscript,
        CustomerDetailsCard,
        ConnectedUsersFaces,
        // TicketDetail,
        MessagesTopSection,
        Message,
        EcAvatar,
    },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: "",
            confirm: false,

            // ticketSelected: null,
            // ticketDetailModal: false,

            chatDuration: "",

            conversationShowDetail: false,

            relatedServices: [],
            clientDomains: [],
            cardMaxHeight: "16rem",
            whmcsBaseUrl: "", // load from helper, its need to direct call WHMCS api from client
            rightBarInterVal: "",
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: "setting_ui/rightBarState",
            profile: "auth/profile",
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
            clientTickets: "ticket/tickets",
            clientPreviousChats: "chat/previousConversations",
        }),
        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.fullChatConvId);
        },

        conversationModel(): any {
            return Conversation.query().where("id", this.fullChatConvId);
        },

        conversationData(): any {
            // if || {} empty object raise error for accessing models getter then manage null
            return this.conversationModel.first() || {};
        },

        fullChatConvId(): any {
            if (this.$route.name === "chats" && this.rightBarState.mode === "client_info") {
                return this.$route.params["conv_id"];
            }

            return this.rightBarState?.conv_id || null;
        },

        visits(): any {
            if (!(this.$route.name === "chats" && this.rightBarState.mode === "client_info")) return [];

            return this.$store.getters["visitor/visits"](this.conversationData.clientSocketSession.id);
        },

        parsedUaString(): any {
            const uaString: any =
                this.conversationData.clientConversationSession?.socket_session?.init_user_agent || "";

            // console.log(uaString, UAParser(uaString));

            return UAParser(uaString);
        },
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),

        getClientServices(clientEmail: string) {
            window.api
                .get("apps/whmcs/client-products", {
                    params: {
                        email: clientEmail,
                    },
                })
                .then((res: any) => {
                    this.relatedServices = res.data;
                })
                .catch((err: any) => {
                    console.log(err.response);
                });
        },

        getClientDomains(clientEmail: string) {
            window.api
                .get("apps/whmcs/client-domains", {
                    params: {
                        email: clientEmail,
                    },
                })
                .then((res: any) => {
                    this.clientDomains = res.data;
                })
                .catch((err: any) => {
                    console.log(err.response);
                });
        },

        gotoDomain(domain: any) {
            window.open(`http://${domain}`, "_blank");
        },

        gotoServiceDetails(service: any) {
            window.open(
                `${this.whmcsBaseUrl}/clientsservices.php?userid=${service.clientid}&id=${service.id}`,
                "_blank"
            );
        },

        gotoDomainDetails(domain: any) {
            window.open(`${this.whmcsBaseUrl}/clientsdomains.php?userid=${domain.userid}&id=${domain.id}`, "_blank");
        },

        gotoTicketDetails(ticket: any) {
            window.open(`${this.whmcsBaseUrl}/supporttickets.php?action=view&id=${ticket.id}`, "_blank");
        },

        getTicketStatusBgColor(ticket: any) {
            return ticket.status === "On Hold"
                ? "#224488"
                : ticket.status === "In Progress"
                ? "#CC0000"
                : ticket.status === "Open"
                ? "#779500"
                : ticket.status === "Customer-Reply"
                ? "#FF6600"
                : ticket.status === "Answered"
                ? "#000000"
                : "#ddd";
        },
    },

    mounted() {
        // console.log("right bar initiated");

        this.rightBarInterVal = setInterval(() => {
            if (
                this.$route.name === "chats" &&
                this.rightBarState.mode === "client_info" &&
                this.conversationData.clientConversationSession?.id
            ) {
                this.$refs.page_visit_list?.$forceUpdate();
                this.$refs.chat_duration?.$forceUpdate();
                this.$refs.connectedForTimer?.$forceUpdate();
            }
        }, 3000);

        this.whmcsBaseUrl = this.$helpers.getWhmcsBaseUrl();
    },

    beforeUnmount() {
        clearInterval(this.rightBarInterVal);
    },

    watch: {
        conversationData: {
            handler: function (newVal, oldVal) {
                // console.log(newVal, oldVal);

                if (
                    this.conversationData.id &&
                    !this.conversationData.users_only &&
                    newVal.id &&
                    newVal.id !== oldVal.id
                ) {
                    // if need remove mini mode check
                    if (
                        !this.conversationInfo.pagination_meta?.first_time_loaded &&
                        this.$route.name === "chats" &&
                        this.rightBarState.mode === "client_info"
                    ) {
                        this.$store.dispatch("chat/getPreviousConversations", {
                            before_conversation_id: this.conversationData.id,
                        });
                    }

                    const clientEmail = this.conversationData.clientConversationSession.socket_session.init_email;

                    if (!this.conversationData.closed_at) {
                        // load client tickets
                        this.$store.dispatch("ticket/getTickets", {
                            email: clientEmail,
                        });

                        this.getClientServices(clientEmail);

                        this.getClientDomains(clientEmail);
                    }
                }
            },
            immediate: true,
        },
    },
});
</script>
