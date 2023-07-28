import {RouteLocationRaw} from 'vue-router';

export interface Character {
  id: number
  name: string
  description: string
  hp: number | null
  mp: number | null
  currentMp: number
  currentHp: number
  xp: number
  isEnemy: boolean
  isTemplate: boolean
  kills: number
  imageUrl: string,
  imageId?: number | null
  items: CharacterItems[]
}


export interface CharacterItems {
  id: number;
  itemId: number;
  uses: number;
}

export interface Item {
  id: number | null
  title: string
  description: string
  imageUrl: string,
  hp: number
  imageId?: number | null
}

export interface ModelErrors {
  [key: string]: string[];
}


export interface User {
  id: number;
  username: string;
  color1: string;
  color2: string;
  color3: string;
  permission?: string[];
}

export interface UserIdentityResponse {
  identity: User,
  accessToken: string,
  encoded: string
}


export interface MenuItem {
  title: string
  id: number | null,
  avatar: string | null,
  icon: string | null,
  divider: boolean,
  type: 'char' | 'none',
  route: RouteLocationRaw
}
