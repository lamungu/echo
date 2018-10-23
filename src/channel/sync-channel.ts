import { EventFormatter } from '../util';
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
     * The subsciption of the channel.
     *
     * @type {any}
     */
    subscription: any;

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
     * @param  {string} channel
     * @return {object}
     */
    subscribe(): any {
        this.subscription = this.sync.subscribe(this.name);
    }

    /**
     * Unsubscribe from a Sync channel.
     *
     * @return {void}
     */
    unsubscribe(): void {
        this.sync.unsubscribe(this.name);
    }

    /**
     * Listen for an event on the channel instance.
     *
     * @param  {string} event
     * @param  {Function}   callback
     * @return {SyncChannel}
     */
    listen(event: string, callback: Function): SyncChannel {
        this.on(this.eventFormatter.format(event), callback);

        return this;
    }

    /**
     * Stop listening for an event on the channel instance.
     *
     * @param  {string} event
     * @return {SyncChannel}
     */
    stopListening(event: string): SyncChannel {
        this.subscription.unbind(this.eventFormatter.format(event));

        return this;
    }

    /**
     * Bind a channel to an event.
     *
     * @param  {string}   event
     * @param  {Function} callback
     * @return {void}
     */
    on(event: string, callback: Function): SyncChannel {
        this.subscription.bind(event, callback);

        return this;
    }
}
