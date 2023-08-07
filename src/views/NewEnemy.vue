<script setup
        lang="ts">
import CharacterForm from '@/components/CharacterForm.vue';
import {useCharacterStore} from '@/store/characterStore';
import {Character} from '@/Types';
import {computed, ref} from 'vue';
import {showError, showMessage} from '@/services/Utils';
import {useRoute, useRouter} from 'vue-router';

const characterStore = useCharacterStore();
const charLoading = ref(0);

const deleteChar = async (char: Character) => {
    if (!char.id) {
        return false;
    }


    charLoading.value = char.id;
    try {
        await characterStore.deleteCharacter(char.id);
        showMessage('Der is gelöscht');
    } catch (err) {
        showError(err);
    } finally {
        charLoading.value = 0;
    }
};

const router = useRouter();
const routeToCharacter = (char: Character) => {
    router.push({name: 'enemy-form', params: {id: char.id}});
};

const route = useRoute();
const charId = computed(() => {

    const id = route?.params?.id ?? null;
    if (!id) {
        return null;
    }

    return Number.parseInt(id as string);
});

</script>

<template>
    <CharacterForm
        :id="charId"
        :show-weapons="true"
        :redirect="false"
        :is-enemy="true"/>


    <v-container>
        <h3>Existierende Gegnervorlagen</h3>
        <template v-if="characterStore.enemyTemplates.length === 0">
            Noch keine Gegner vorhanden
        </template>

        <v-list>
            <v-list-item
                v-for="(character, index) in characterStore.enemyTemplates"
                :key="index"
                :value="character"
            >
                <v-sheet class="d-flex flex-wrap"
                         style="width: 100%;">
                    <v-sheet class="flex-1-0 ma-2 pa-2"
                             @click="routeToCharacter(character)">
                        {{ character.name }} - {{ character.hp }}
                    </v-sheet>
                    <v-sheet class="ma-2 pa-2">
                        <v-btn
                            @click="deleteChar(character)"
                            :loading="charLoading === character.id"
                            size="small"
                            icon="mdi-trash-can"
                            color="primary"
                        >
                        </v-btn>
                    </v-sheet>
                </v-sheet>
                <v-divider/>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<style scoped>

</style>
