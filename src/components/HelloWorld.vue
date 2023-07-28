<template>
  <v-container
    class="py-8 px-6"
    fluid
  >

    <v-row>
      <v-col
        cols="12"
      >
        <v-card>
          <v-list lines="two">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar image="/avatar.jpg"
                          size="80"></v-avatar>
              </template>

              <v-list-item-title>Marcel</v-list-item-title>

              <v-list-item-subtitle>
                A Dungeon Master mit a bissl IQ
              </v-list-item-subtitle>

              <div>
                HP
                <v-btn
                  size="small"
                  icon="mdi-minus"
                  color="secondary"
                ></v-btn>
                3 / 7
                <v-btn
                  size="small"
                  icon="mdi-plus"
                  color="secondary"
                ></v-btn>
              </div>

              <div>
                MP
                <v-btn
                  size="small"
                  icon="mdi-minus"
                  color="secondary"
                ></v-btn>
                4 / 6
                <v-btn
                  size="small"
                  icon="mdi-plus"
                  color="secondary"
                ></v-btn>
              </div>


              <v-divider
                inset
              ></v-divider>
            </v-list-item>

            <v-list-item>
              <v-autocomplete
                clearable
                label="Waffe hinzufügen"
                :items="['Axt', 'Bär', 'Taube', 'Stab', 'usw']"
                variant="solo"
              ></v-autocomplete>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-list lines="two">

            <v-list-item
              v-for="item in items"
              :key="item.id"
            >
              <template v-slot:prepend>
                <v-avatar :image="item.icon"
                          size="80"></v-avatar>
              </template>

              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <v-list-item-subtitle>
                {{ item.description }}
              </v-list-item-subtitle>
              <div>
                Haltbarkeit
                <v-btn
                  size="small"
                  icon="mdi-minus"
                  color="secondary"
                ></v-btn>
                {{ item.uses }} / {{ item.max }}
                <v-btn
                  size="small"
                  icon="mdi-plus"
                  color="secondary"
                ></v-btn>
              </div>

              <v-divider
                inset
              ></v-divider>

            </v-list-item>

          </v-list>

        </v-card>
      </v-col>
    </v-row>


  </v-container>
</template>

<script lang="ts"
        setup>


const items = [
  {
    id: 1,
    title: 'Amulet',
    description: 'Macht dich unsichtbar',
    uses: 5,
    max: 10,
    icon: '/weapon1.webp',
  },
  {
    id: 2,
    description: 'Würfle ein mal mit a schwarze un a weiße würfle',
    title: 'Waffe 2',
    uses: 1,
    max: 3,
    icon: '/weapon2.webp',
  },
  {
    id: 3,
    title: 'Waffe 3',
    description: 'Is schwarf, macht aua',
    uses: 5,
    max: 10,
    icon: '/weapon3.webp',
  }
]
</script>
