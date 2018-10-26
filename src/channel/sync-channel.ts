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
     * The stream of the channel.
     *
     * @type {any}
     */
    stream: any;

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
        this.stream = this.createStreamInstance(this.name)
    }

    /**
     * Creates a stream instance
     * @param name
     */
    createStreamInstance(name: any) {
        return this.authorize().then(() => {
            console.log(name);
            return this.sync.stream(name).then((stream) => {
                stream.on('messagePublished', (args) => {
                    console.log(args);
                });
                return stream;
            });
        });
    }

    attachEventListeners(stream: any) {
        console.log('setting up stream mmessage');
        console.log(stream);
        stream.on('messagePublished', (args) => {
            let type = args.message.value.type;
            console.log(type);
            console.log(args);
            this.events.map((event) => {
                if (event.getName() === type) {
                    event.call(args.message.value.payload)
                }
            });
        });
        return stream;
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
        //this.stream.unbind(this.eventFormatter.format(event));
        return this;
    }
}
