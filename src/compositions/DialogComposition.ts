import {ref} from 'vue';

const isOpen = ref(false);

let promise: Promise<number|null>|null = null;
let resolve: null|((id: number|null) => void) = null;

const createPromise = () => {
  promise = new Promise<number|null>((res) => {{
    resolve = res;
  }})

  return promise;
}

export const useDialog = () => {



  const openDialog = async () => {
    isOpen.value = true;

    return await createPromise();
  }

  const closeDialog = (id: number|null) => {
    isOpen.value = false;
    if(resolve !== null){
      resolve(id);
    }
  }

  return {
    openDialog,
    closeDialog,
    isOpen
  }
}
