import { SyncChannel } from './sync-channel';
import { PresenceChannel } from './presence-channel';

/**
 * This class represents a Pusher presence channel.
 */
export class SyncPresenceChannel extends SyncChannel implements PresenceChannel {

    /**
     * The map of the channel.
     *
     * @type {any}
     */
    map: any;

    constructor(sync: any, name: any, options: any) {
        super(sync, name, options);
        this.join();
    }


    /**
     * Subscribe to a Sync channel.
     *
     * @return {object}
     */
    join(): any {
        this.map = this.createMapInstance(this.name)
    }

    createMapInstance(name: any) {
        return this.authorize().then(({data}) => (
            this.sync.map(name).then(map => {
                map.set(this.options.identity, data);
                return map;
            })
        ));
    }

    /**
     * Register a callback to be called when the agent connects to the channel
     *
     * @param  {Function} callback
     * @return {object} this
     */
    here(callback): SyncPresenceChannel {
        this.map.then(map => {
            map.getItems().then(({items}) => {
                callback(items.map(({value}) => value));
            });
        });
        return this;
    }

    /**
     * Listen for someone joining the channel.
     *
     * @param  {Function} callback
     * @return {SyncPresenceChannel}
     */
    joining(callback): SyncPresenceChannel {
        this.map.then(map => {
            map.on('itemAdded', ({item}) => {
                callback(item.value)
            });
        });
        return this;
    }

    /**
     * Listen for someone leaving the channel.
     *
     * @param  {Function}  callback
     * @return {SyncPresenceChannel}
     */
    leaving(callback): SyncPresenceChannel {
        this.map.then(map => {
            map.on('itemRemoved', ({item}) => {
                callback(item.value);
            });
        });
        return this;
    }

    /**
     * Trigger client event on the channel.
     *
     * @param  {Function}  callback
     * @return {SyncPresenceChannel}
     */
    whisper(eventName, data): SyncPresenceChannel {
        this.stream.publishMessage({ eventName, data});
        return this;
    }
}
