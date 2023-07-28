import {ref} from 'vue';

interface Message {
  message: string,
  type: 'error' |'success',
  id: number
}

let id = 0;

const messages = ref<{id: number, message: string, type: 'error' |'success'}[]>([]);

const removeAfterTimeout = (id: number, timeout: number) => {
  window.setTimeout(() => {
    const index = messages.value.findIndex(m => m.id === id);
    console.log(index);
    if(index!== -1) {
      messages.value.splice(index, 1)
    }
  }, timeout)
}

export const useAlert = () => {
  const showError = (message: string) => {
    console.trace(message);
    messages.value.push({
      message,
      type: 'error',
      id
    })

    removeAfterTimeout(id, 3000);
    id++;
  }

  const showSuccess = (message: string) => {
    messages.value.push({
      message,
      type: 'success',
      id
    })
    removeAfterTimeout(id, 3000);
    id++;
  }

  return {
    showError,
    showSuccess,
    messages
  }
}
