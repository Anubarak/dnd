<template>
    <v-container>
        <h2>Changelog</h2>
        <v-card>
            <v-card-title>
                v0.5.1 - 2023.08.04
            </v-card-title>
            <v-card-text>
                <h3>Hinzugefügt</h3>
                <ul>
                    <li>Funktion zum tauschen von Items wurde hinzugefügt</li>
                    <li>Spell Nutzung verbraucht Mana</li>
                    <li>Admin Rechte wurden hinzugefügt -> normale User sehen die Punkte "Item Erstellen", "Gegner Vorlagen" und "Alle Charactere" nicht mehr
                    </li>
                    <li>Gegner Vorlagen können Standardwaffen zugewiesen werden, damit deren Angriffe ebenfalls getrackt werden könnenn</li>
                </ul>

                <h3>Geändert</h3>
                <ul>
                    <li>Bildgröße bei den Avataren im Overlay wurde erhöht</li>
                </ul>
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                v0.5 - 2023.08.03
            </v-card-title>
            <v-card-text>
                <h3>Hinzugefügt</h3>
                <ul>
                    <li>Slider zum Bearbeiten der HP/MP hinzugefügt</li>
                    <li>Registrierung</li>
                    <li>Changelog</li>
                </ul>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts"
        setup>
</script>

<style scoped>
ul {
    padding-left: 15px;
}
</style>
