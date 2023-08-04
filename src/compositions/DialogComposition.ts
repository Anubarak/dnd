import {ref} from 'vue';
import {DailogType, DialogBarData, DialogCharData} from '@/Types';

const dialogState = ref<{[key: DailogType]: boolean}>({
  bar: false,
  char: false
})

let promise: Promise<number|null>|null = null;
let resolve: null|((id: number|null) => void) = null;

const isImageOpen = ref(false);
const imageUrl = ref<string|null>(null);

const createPromise = () => {
  promise = new Promise<number|null>((res) => {{
    resolve = res;
  }})

  return promise;
}

const dialogData = ref<DialogCharData|DialogBarData|null>(null);

export const useDialog = () => {

  const openDialog = async <T extends object>(type: DialogType, data: T): Promise<T> => {
    if(!type){
      throw new Error('Dialog must be opened with a type');
    }
    dialogState.value[type] = true;
    dialogData.value = data;

    return await createPromise();
  }

  const closeDialog = (type: DialogType, data: object|number|null) => {
    dialogState.value[type] = false;
    if(resolve !== null){
      resolve(data);
      resolve = null;
    }
  }


  const openImage = (image: string) => {
    imageUrl.value = image;
    isImageOpen.value = true;
  }

  return {
    openDialog,
    closeDialog,
    dialogState,
    openImage,
    isImageOpen,
    imageUrl,
    dialogData
  }
}
