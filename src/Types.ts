import {RouteLocationRaw} from 'vue-router';

interface BaseCharacter {
  name: string
  description: string
  hp: number | null
  mp: number | null
  armor: number
  movement: number
  currentMp: number
  currentHp: number
  xp: number
  isEnemy: boolean
  isTemplate: boolean
  kills: number
  imageUrl: string|null,
  imageUrlLarge: string|null,
  imageTitle: string|null,
  imageId?: number | null
  items: CharacterItems[]
}

export interface Character extends BaseCharacter {
  id: number;
}

export interface NewCharacter extends BaseCharacter {
  id: number | null;
}

export interface CharacterItems {
  id: number;
  itemId: number;
  uses: number;
}

export interface Dice {
  color: string,
  icon: string | null,
  title: string,
  id: number
}

interface BaseItem {
  title: string
  description: string
  imageUrl: string,
  imageUrlLarge: string|null,
  imageTitle: string|null,
  hp: number
  imageId?: number | null,
  type: 'weapon' | 'item' | 'spell',
  dices: Dice[]|number[]
  specialDices: Dice[]|number[],
  manaCostWizzard: number
  manaCostSupport: number
}

export interface UsedItem {
  id: number,
  title: string,
  icon: string | null,
  hp: number | null,
  currentHp: number | null,
  description: string,
  type: ItemTypeValue
  dices: Dice[]|number[],
  specialDices: Dice[]|number[],
  realItem: Item | null
}

export interface Item extends BaseItem {
  id: number
}
export interface NewItem extends BaseItem {
  id: number | null
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
  permissions?: string[];
  hasAdminPermissions: boolean,
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
  route: RouteLocationRaw,
  requiresAdmin: boolean
}

export type ItemTypeValue = 'weapon' | 'item' |'spell';

export interface ItemType {
  id: ItemTypeValue,
  name: string
}


export interface ItemImage {
  id: number,
  url: string
  title: string
}


export type DailogType = 'char' | 'bar'


export interface DialogCharData {
  title: string,
  value: number | null,
}
export interface DialogBarData {
  title: string,
  min: number,
  max: number,
  value: number | null,
}
