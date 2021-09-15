<template>
    <div class="q-pa-md">
        <div class="q-gutter-md row">
            <q-input
                :model-value="`${filters.date.from ? filters.date.from : ''}`"
                label="Date"
                placholder=""
                :style="`width: ${filterWidth}`"
                dense
            >
                <q-menu>
                    <q-date v-model="filters.date" range />
                </q-menu>
            </q-input>

            <q-select
                v-model="filters.department"
                label="Department"
                :options="chatDepartments"
                option-value="id"
                option-label="display_name"
                :style="`width: ${filterWidth}`"
                clearable
                dense
            >
                <template v-slot:option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label v-html="opt.display_name"></q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-select
                v-model="filters.agent"
                label="Agent"
                :options="chatUsers"
                option-value="id"
                option-label="email"
                :style="`width: ${filterWidth}`"
                clearable
                dense
            >
                <template v-slot:selected v-if="filters.agent">
                    <q-chip dense square color="white" class="q-my-none q-mr-none tw-ml-0">
                        <div class="tw-flex tw-items-center">
                            <div class="tw-mr-1">
                                {{ filters.agent.user_meta.display_name }}
                            </div>
                        </div>
                    </q-chip>
                </template>

                <template v-slot:option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <div class="tw-flex tw-w-full tw-items-center tw-my-1 tw-gap-3">
                                <ec-avatar
                                    :image_src="opt.user_meta.src"
                                    :name="opt.user_meta.display_name"
                                    :email="opt.email"
                                    size="sm"
                                />
                                <div>
                                    <q-item-label>{{ opt.user_meta.display_name }} </q-item-label>
                                </div>
                            </div>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-select
                v-model="filters.rating"
                label="Rating"
                :options="['Good', 'Bad', 'Not Rated']"
                :style="`width: ${filterWidth}`"
                clearable
                dense
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar.vue";

export default defineComponent({
    name: "ChatHistoryFilter",
    components: { EcAvatar },
    data(): any {
        return {
            chatDepartments: [],
            model: "",
            filters: {
                date: "",
                department: "",
                agent: "",
                rating: "",
            },
            filterWidth: "200px",
        };
    },

    computed: {
        ...mapGetters({
            chatUsers: "chat/chatUsers",
        }),
    },

    mounted() {
        this.getChatDepartments();
    },

    methods: {
        getChatDepartments() {
            window.socketSessionApi
                .get("/departments")
                .then((res: any) => {
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },
    },
});
</script>

<style scoped></style>
