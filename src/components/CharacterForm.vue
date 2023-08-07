<script setup
        lang="ts">

import {ref, watch} from 'vue';
import {Character, NewCharacter} from '@/Types';
import {showError, showMessage} from '@/services/Utils';
import {useRouter} from 'vue-router';
import CharacterPreview from '@/views/Character.vue';
import {useCharacterStore} from '@/store/characterStore';
import AvatarInput from '@/components/AvatarInput.vue';
import WeaponSelect from '@/components/WeaponSelect.vue';


interface Props {
    isEnemy: boolean,
    redirect: boolean,
    id?: number | null,
    showWeapons?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    redirect: true,
    id: null,
    showWeapons: false,
});

const reset = (): NewCharacter => ({
    id: null,
    name: '',
    description: '',
    hp: null,
    mp: null,
    armor: 2,
    movement: 2,
    imageTitle: '',
    currentMp: 10,
    currentHp: 10,
    imageId: null,
    imageUrl: '',
    imageUrlLarge: '',
    xp: 0,
    isEnemy: props.isEnemy,
    isTemplate: props.isEnemy,
    kills: 0,
    items: [],
    weapons: []
});

watch(() => props.id, () => {
    if(props.id === null){
        char.value = reset()
        return;
    }

    const c = characterStore.characters.find(el => el.id === props.id) || null
    if(!c){
        char.value = reset()
        return;
    }

    char.value = setClone(c);
})

const characterStore = useCharacterStore();
const c = props.id ? characterStore.characters.find(el => el.id === props.id) || null : null;

const setClone = (c: Character): NewCharacter => {
    const clone = {...c} as NewCharacter;

    if(c.isTemplate){
        clone.weapons = c.items.map(item => item.itemId);
    } else {
        clone.weapons = null;
    }
    return clone;
}

const char = ref<NewCharacter>(c ? setClone(c) : reset());

const loading = ref(false);
const router = useRouter();
const onSubmit = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    try {
        const res = await characterStore.saveCharacter(char.value as Character);
        showMessage(`${res.name} erfolgreich gespeichert`);

        if (props.redirect) {
            router.push({name: 'character', params: {id: res.id}});
        } else {
            char.value = reset();
            router.push({name: 'enemy-form', params: {id: null}});
        }
    } catch (err) {
        showError(err);
    } finally {
        loading.value = false;
    }
};

</script>

<template>
    <v-form @submit.prevent="onSubmit">
        <v-container>
            <AvatarInput
                v-model:image-title="char.imageTitle"
                v-model:id="char.imageId"
                v-model:url="char.imageUrl"
            ></AvatarInput>
            <v-row>
                <v-text-field
                    v-model="char.name"
                    label="Name"
                    required
                ></v-text-field>
            </v-row>

            <v-row>
                <v-text-field
                    v-model="char.description"
                    label="Beschreibung"
                    required
                ></v-text-field>
            </v-row>
            <v-row>
                <v-text-field
                    v-model="char.hp"
                    label="HP"
                    type="number"
                    required
                ></v-text-field>
            </v-row>
            <v-row>
                <v-text-field
                    v-model="char.mp"
                    label="MP"
                    type="number"
                    required
                ></v-text-field>
            </v-row>
            <v-row>
                <v-text-field
                    v-model="char.armor"
                    label="Rüstung"
                    type="number"
                    required
                ></v-text-field>
            </v-row>
            <v-row>
                <v-text-field
                    v-model="char.movement"
                    label="Bewegung"
                    type="number"
                    required
                ></v-text-field>
            </v-row>

            <v-row v-if="showWeapons">
                <WeaponSelect
                    :chips="true"
                    :mulitple="true"
                    v-model="char.weapons" />
            </v-row>
            <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                class="mt-2"
                text="Absenden"
            ></v-btn>
        </v-container>
    </v-form>

    <CharacterPreview
        :allow-edit="false"
        :character="char as Character"></CharacterPreview>
</template>

<style scoped>

</style>
