import { Connector} from './connector';
import SyncClient from 'twilio-sync';
import {
    SyncChannel, SyncPrivateChannel, SyncPresenceChannel, PresenceChannel
} from '../channel';

/**
 * This class creates a connector to Pusher.
 */
export class SyncConnector extends Connector {
    /**
     * The Sync instance.
     *
     * @type {object}
     */
    sync: any;

    /**
     * All of the subscribed channel names.
     *
     * @type {array}
     */
    channels: any = {};

    /**
     * Create a fresh Sync connection.
     *
     * @return void
     */
    connect(): void {
        if (typeof this.options.client !== 'undefined') {
            this.sync = this.options.client;
        } else {
            this.sync = new SyncClient(this.options.token, this.options);
        }
    }

    /**
     * Listen for an event on a channel instance.
     *
     * @param  {string} name
     * @param  {event} string
     * @param  {Function} callback
     * @return {SyncChannel}
     */
    listen(name: string, event: string, callback: Function): SyncChannel {
        return this.channel(name).listen(event, callback);
    }

    /**
     * Get a channel instance by name.
     *
     * @param  {string} name
     * @return {SyncChannel}
     */
    channel(name: string): SyncChannel {
        if (!this.channels[name]) {
            this.channels[name] = new SyncChannel(
                this.sync,
                name,
                this.options
            );
        }

        return this.channels[name];
    }

    /**
     * Get a private channel instance by name.
     *
     * @param  {string} name
     * @return {SyncPrivateChannel}
     */
    privateChannel(name: string): SyncChannel {
        if (!this.channels['private-' + name]) {
            this.channels['private-' + name] = new SyncPrivateChannel(
                this.sync,
                'private-' + name,
                this.options
            );
        }

        return this.channels['private-' + name];
    }

    /**
     * Get a presence channel instance by name.
     *
     * @param  {string} name
     * @return {PresenceChannel}
     */
    presenceChannel(name: string): PresenceChannel {
        if (!this.channels['presence-' + name]) {
            this.channels['presence-' + name] = new SyncPresenceChannel(
                this.sync,
                'presence-' + name,
                this.options
            );
        }

        return this.channels['presence-' + name];
    }

    /**
     * Leave the given channel.
     *
     * @param  {string} channel
     */
    leave(name: string) {
        let channels = [name, 'private-' + name, 'presence-' + name];

        channels.forEach((name: string, index: number) => {
            if (this.channels[name]) {
                this.channels[name].unsubscribe();

                delete this.channels[name];
            }
        });
    }

    /**
     * Get the socket ID for the connection.
     *
     * @return {string}
     */
    socketId(): string {
        return this.sync.connection.socket_id;
    }

    /**
     * Disconnect Pusher connection.
     *
     * @return void
     */
    disconnect(): void {
        this.sync.disconnect();
    }
}
