/**
 * Event listener
 */
export class EventListener {

    /**
     * Event name.
     *
     * @type {string}
     */
    name: string | boolean;

    /**
     *
     */
    callback: Function;

    /**
     * Create a new class instance.
     *
     * @params  {string} name
     */
    constructor(name: string, callback: Function) {
        this.setName(name);
        this.setCallback(callback);
    }

    /**
     * call the callback
     */
    call(payload) {
        this.callback(payload);
    }

    /**
     * Set the event name.
     *
     * @param  {string} value
     * @return {void}
     */
    setName(value: string): void {
        this.name = value;
    }

    /**
     * Set the event name.
     *
     * @param  {Function} callback
     * @return {void}
     */
    setCallback(callback: Function): void {
        this.callback = callback;
    }
}
