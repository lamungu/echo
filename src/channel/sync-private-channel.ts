import { SyncChannel } from './sync-channel';

/**
 * This class represents a Pusher private channel.
 */
export class SyncPrivateChannel extends SyncChannel {
    /**
     * Trigger client event on the channel.
     *
     * @param  {Function}  callback
     * @return {SyncPrivateChannel}
     */
    whisper(eventName, data): SyncPrivateChannel {
        this.pusher.channels.channels[this.name].trigger(`client-${eventName}`, data);

        return this;
    }
}
