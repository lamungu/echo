import { SyncChannel } from './sync-channel';
import { PresenceChannel } from './presence-channel';

const pageHandler = async (items, paginator, callback) => {
    items = [
        ...items,
        ...items.map(({value}) => value)
    ];
    if (paginator.hasNextPage) {
        let nextPaginator = await paginator.nextPage();
        await pageHandler(items, nextPaginator, callback)
    } else {
        callback(items);
    }
};
/**
 * This class represents a Pusher presence channel.
 */
export class SyncPresenceChannel extends SyncChannel implements PresenceChannel {

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
        //todo: give the information of the person here
        this.map.then(map => {
            map.set('presence-' + this.options.identity, {identity: this.options.identity});
            return map;
        });
    }

    /**
     * Register a callback to be called when the agent connects to the channel
     *
     * @param  {Function} callback
     * @return {object} this
     */
    here(callback): SyncPresenceChannel {
        this.map.then(map => {
            map.getItems({from:'presence-', pageSize:100}).then((paginator) => pageHandler([], paginator, callback));
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
     * @param  {Function}  eventName
     * @param  {object}  data
     * @return {SyncPresenceChannel}
     */
    whisper(eventName, data): SyncPresenceChannel {
        this.map.publishMessage({ eventName, data});
        return this;
    }
}
