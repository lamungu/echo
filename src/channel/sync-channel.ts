import { EventFormatter, EventListener } from '../util';
import { Channel } from './channel';

/**
 * This class represents a Sync channel.
 */
export class SyncChannel extends Channel {
    /**
     * The Sync client instance.
     *
     * @type {any}
     */
    sync: any;

    /**
     * The name of the channel.
     *
     * @type {object}
     */
    name: any;

    /**
     * Channel options.
     *
     * @type {any}
     */
    options: any;

    /**
     * The event formatter.
     *
     * @type {EventFormatter}
     */
    eventFormatter: EventFormatter;

    /**
     * The list of events
     * @type {EventListener[]}
     */
    events: any = [];

    /**
     * The map of the channel.
     *
     * @type {any}
     */
    map: any;

    /**
     * Create a new class instance.
     *
     * @param  {any} sync
     * @param  {object} name
     * @param  {any}  options
     */
    constructor(sync: any, name: any, options: any) {
        super();

        this.name = name;
        this.sync = sync;
        this.options = options;

        this.eventFormatter = new EventFormatter(this.options.namespace);

        this.subscribe();
    }

    /**
     * Subscribe to a Sync channel.
     *
     * @return {object}
     */
    subscribe(): any {
        this.map = this.createMapInstance(this.name)
    }

    /**
     * Creates a map instance
     * @param name
     */
    createMapInstance(name: any): any {
        return this.authorize().then(() => {
            return this.sync.map(name).then((map) => {
                // attach all event listeners
                map.on('itemAdded', (args) => {
                    console.log(args);
                });
                return map;
            });
        });
    }

    /**
     * Verify if user is authorized to subscribe to the channel
     */
    authorize(): Promise<any> {
        return axios.create({baseURL:'/'}).post(this.options.authEndpoint, {socket_id:this.options.identity, channel_name: this.name})
    }

    /**
     * Unsubscribe from a Sync channel.
     *
     * @return {void}
     */
    unsubscribe(): void {
        //this.sync.unsubscribe(this.name);
    }

    /**
     * Listen for an event on the channel instance.
     *
     * @param  {string} event
     * @param  {Function}   callback
     * @return {SyncChannel}
     */
    listen(event: string, callback: Function): SyncChannel {
        this.events = [
            ...this.events,
            new EventListener(event, callback)
        ];
        return this;
    }

    /**
     * Stop listening for an event on the channel instance.
     *
     * @param  {string} event
     * @return {SyncChannel}
     */
    stopListening(event: string): SyncChannel {
        //this.map.unbind(this.eventFormatter.format(event));
        return this;
    }
}
