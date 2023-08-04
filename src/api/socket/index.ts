import {io, Socket as SocketIo} from 'socket.io-client';
import {useCharacterStore} from '@/store/characterStore';
import {Character, Item} from '@/Types';
import {useItemStore} from '@/store/itemStore';

class Socket {

  socket: SocketIo;
  token: string;
  connected = false;

  channelPrefix = 'myspa-desk-';

  /**
   * Event listeners in the APP for custom events
   *
   * @type {{
   *     id: String,
   *     event: String,
   *     handler: Function
   *     once: Boolean
   * }[]}
   */
  listeners: { id: string, event: string, handler: Function, once: boolean }[] = [];
  uid = 0;

  displayNotifications = true;

  log(...args: unknown[]) {
    if (import.meta.env.VITE_NODE_ENV === 'development' && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }

  constructor(token: string) {
    this.token = token;
    // establish the connection
    // this.socket = io.connect('http://anubarak.s:8080', {query: 'token=' + this.token});
    this.socket = io(import.meta.env.VITE_VUE_APP_SOCKET, {
      query: {
        token: this.token
      },
      transports: ['websocket'],
      reconnection: false,
    });
    this.connected = true;
    this.socket.on('reconnect_attempt', () => {
      this.socket.io.opts.query = {token: this.token};
    });

    this.socket.io.on('error', (error) => {
      console.log('on error', error);
    });

    this.socket.io.on('reconnect', (error) => {
      console.log('on reconnect', error);
    });


    this.socket.on('foo', (data) => {
      console.log('data', data);
      alert(data);
    });

    this.socket.on('save-character', (data: Character[]) => {
      console.log('data save-character', data);
      const characterStore = useCharacterStore();
      characterStore.setCharacters(data);
    })
    this.socket.on('save-item', (data: Item[]) => {
      console.log('data save-item', data);
      const characterStore = useItemStore();
      characterStore.setItems(data);
    })

    //const events = [
      // {name: 'BookingSlot', model: BookingSlot},
      // {name: 'BookingSlotTemplate', model: BookingSlotTemplate},
      // {name: 'BookingDay', model: BookingDay},
      // {name: 'WellzoneMessage', model: WellzoneMessage},
      // {name: 'Locker', model: Locker}
    //];

    // events.forEach(({name, model}) => {
    //     if (this.socket !== null) {
    //         this.socket.on(`save${name}`, (data) => {
    //             this.log('save socket event', name, data);
    //             createModel(model, data).then(model => {
    //                 this.log('inserted' + name, model);
    //             });
    //         });
    //
    //         this.socket.on(`delete${name}`, async (data) => {
    //             this.log('deleting ' + name, data);
    //             store.dispatch(model.getEntity() + '/remove', data);
    //         });
    //     }
    // });

  }

  /**
   * Make the client join rooms
   *
   * @param token
   */
  joinRooms(token: string | null = null) {
    if (this.token !== null && this.token === token) {
      return true;
    }

    if (token === null) {
      token = this.token;
    }

    this.socket.emit('joinRooms', token);
    // store the token as default for the next request
    // in case of disconnections
    this.token = token;
  }

  reconnect() {
    if (this.socket.connected === false) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected === true) {
      this.socket.disconnect();
    }
  }

  emit(eventName: string, message: unknown) {
    if (this.socket.connected === true) {
      this.socket.emit(eventName, message);
      return true;
    }

    return false;
  }

  /**
   * Listen to a self socket message, but only once
   *
   * @param event
   * @param handler
   */
  listenOnce(event: string, handler: Function) {
    const privateHandler = this.uid + '-' + event;
    const data = {
      id: privateHandler,
      event: event,
      handler: handler,
      once: true
    };

    this.listeners.push(data);
  }
}

export default Socket;
