<template>
    <q-btn flat color="green" icon="mood">
        <q-menu ref="emojiMenu">
            <q-card>
                <q-card-section class="tw-w-full tw-max-w-sm">
                    <div class="tw-flex tw-border-b-2">
                        <q-btn
                            padding="10"
                            @click="emojiGroup = group.name"
                            v-for="(group, key) in emojiGroups"
                            :key="key"
                            class="tw-border-blue-700"
                            :style="group.name === emojiGroup ? 'border-bottom: 3px solid rgb(76 142 60)' : ''"
                            flat
                        >
                            {{ group.char }}
                        </q-btn>
                    </div>

                    <q-input
                        @update:model-value="$refs.emojiMenu.updatePosition()"
                        color="green-8"
                        class="tw-mb-4 tw-mt-3"
                        outlined
                        v-model="emojiKeyword"
                        label="Search"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>

                    <div class="tw-grid tw-grid-cols-11 tw-gap-4" v-if="filterNewEmoji.length">
                        <div
                            v-for="(emojiObj, key) in filterNewEmoji"
                            @click="handleEmojiClick(emojiObj)"
                            :key="key"
                            class="tw-cursor-pointer hover:tw-bg-gray-200"
                            style="font-size: 18px"
                        >
                            <!--<q-tooltip :offset="[10, 10]">{{ emojiObj }}</q-tooltip>-->
                            {{ emojiObj.char }}
                        </div>
                    </div>
                    <div v-else>
                        <b>Oh no!</b>
                        <p>We couldn’t find that emoji</p>
                    </div>
                </q-card-section>
            </q-card>
        </q-menu>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import emojiJson from 'emoji.json';

export default defineComponent({
    name: 'EcEmoji',
    data(): any {
        return {
            emojiKeyword: '',
            emojis: [],
            emojiGroup: 'all',
            emojiGroups: [
                {
                    name: 'all',
                    char: 'All',
                },
            ],
            emojiUpTo: 4500,
        };
    },

    computed: {
        filterNewEmoji(): any {
            return this.emojis
                .filter((emoji: any) => {
                    if (this.emojiKeyword) {
                        return (
                            (this.emojiGroup === 'all' || this.emojiGroup === emoji.group) &&
                            emoji.name.includes(this.emojiKeyword)
                        );
                    } else {
                        return this.emojiGroup === 'all' || this.emojiGroup === emoji.group;
                    }
                })
                .splice(0, this.emojiUpTo);
        },
    },

    mounted() {
        this.emojis = emojiJson.filter((emoji) => !['smiling face'].includes(emoji.name));

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
            this.$emit('clickEmoji', emojiObj.char);
        },
    },
});
</script>

<style scoped></style>
