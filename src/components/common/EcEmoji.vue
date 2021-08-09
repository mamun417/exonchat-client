<template>
    <q-btn flat :color="globalColor" icon="mood">
        <q-menu ref="emojiMenu" style="max-height: 400px; height: 400px">
            <q-card class="tw-h-full">
                <q-card-section
                    class="tw-flex tw-flex-col tw-h-full"
                    :class="{ 'tw-p-3 tw-w-60': mini_box, 'tw-w-84': !mini_box }"
                >
                    <div class="tw-flex tw-flex-wrap tw-border-b-2 tw-gap-1">
                        <div v-for="(group, key) in emojiGroups" :key="key" class="tw-flex tw-justify-center tw-w-8">
                            <q-btn
                                padding="10"
                                @click="emojiGroup = group.name"
                                class="tw-border-blue-700"
                                :style="group.name === emojiGroup ? 'border-bottom: 3px solid rgb(76 142 60)' : ''"
                                flat
                                :dense="mini_box"
                            >
                                {{ group.char }}
                            </q-btn>
                        </div>
                    </div>

                    <q-input
                        @update:model-value="$refs.emojiMenu.updatePosition()"
                        color="green-8"
                        class="tw-mb-4 tw-mt-3"
                        outlined
                        v-model="emojiKeyword"
                        placeholder="Search"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>

                    <q-scroll-area
                        class="fit"
                        :bar-style="{
                            background: '#60A5FA',
                            width: '4px',
                            opacity: 0.2,
                            borderRadius: '10px',
                        }"
                        :thumb-style="{
                            borderRadius: '9px',
                            backgroundColor: '#60A5FA',
                            width: '4px',
                            opacity: 0.5,
                        }"
                    >
                        <div class="tw-flex tw-flex-wrap tw-gap-1 tw-justify-between" v-if="filterNewEmoji.length">
                            <template v-for="(emojiObj, key) in filterNewEmoji">
                                <div
                                    v-if="!emojiObj.char.includes('&')"
                                    @click="handleEmojiClick(emojiObj)"
                                    :key="key"
                                    class="tw-cursor-pointer hover:tw-bg-gray-200 tw-w-6 tw-flex tw-justify-center"
                                    style="font-size: 18px"
                                >
                                    {{ emojiObj.char }}
                                </div>
                            </template>
                        </div>
                        <div v-else>
                            <b>Oh no!</b>
                            <p>We couldn’t find that emoji</p>
                        </div>
                    </q-scroll-area>
                </q-card-section>
            </q-card>
        </q-menu>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import emojiJson from "emoji.json";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "EcEmoji",
    props: {
        mini_box: {
            type: Boolean,
            default: false,
        },
    },
    data(): any {
        return {
            emojiKeyword: "",
            emojis: [],
            emojiGroup: "Smileys & Emotion",
            emojiGroups: [
                {
                    name: "all",
                    char: "All",
                },
            ],
            emojiUpTo: 4500,
        };
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
        }),

        filterNewEmoji(): any {
            return this.emojis
                .filter((emoji: any) => {
                    if (this.emojiKeyword) {
                        return (
                            (this.emojiGroup === "all" || this.emojiGroup === emoji.group) &&
                            emoji.name.includes(this.emojiKeyword)
                        );
                    } else {
                        return this.emojiGroup === "all" || this.emojiGroup === emoji.group;
                    }
                })
                .splice(0, this.emojiUpTo);
        },
    },

    mounted() {
        // setInterval(() => {
        //     this.$refs.emojiMenu.$forceUpdate();
        // }, 3000);

        this.emojis = emojiJson.filter((emoji: any) => emoji.codes.split(" ").length < 3);

        console.log({ em: this.emojis });

        this.emojis.forEach((emoji: any) => {
            if (
                !this.emojiGroups.find(function (el: any) {
                    return el.name === emoji.group;
                })
            ) {
                this.emojiGroups.push({
                    name: emoji.group,
                    char: emoji.char,
                });
            }
        });
    },

    methods: {
        handleEmojiClick(emojiObj: any) {
            this.$refs.emojiMenu.hide();
            this.$emit("clickEmoji", emojiObj.char);
        },
    },
});
</script>

<style scoped></style>
