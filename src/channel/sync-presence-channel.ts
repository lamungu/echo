import { SyncChannel } from './sync-channel';
import { PresenceChannel } from './presence-channel';

/**
 * This class represents a Pusher presence channel.
 */
export class SyncPresenceChannel extends SyncChannel implements PresenceChannel {
    /**
     * Register a callback to be called anytime the member list changes.
     *
     * @param  {Function} callback
     * @return {object} this
     */
    here(callback): SyncPresenceChannel {
        this.on('pusher:subscription_succeeded', (data) => {
            callback(Object.keys(data.members).map(k => data.members[k]));
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
        this.on('pusher:member_added', (member) => {
            callback(member.info);
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
        this.on('pusher:member_removed', (member) => {
            callback(member.info);
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
        this.sync.channels.channels[this.name].trigger(`client-${eventName}`, data);

        return this;
    }
}
