/**
 * List of Subscribers
 */
const _subscribers = {};


/**
 * Object of subscribers meta info 
 */
const _meta = {};


/**
 * @param mode {Boolean} – toggler of debug mode
 */
const mode = {
    debug: false
};


/**
 * Setter for debug mode.
 * Debug mode is set by default if no arguments passed
 * @param {*} debug boolean [not required] if true debug will be turned on
 */
function setDebug(debug){
    mode.debug = debug ? debug : true;
}


/**
 * [for debug]
 * @return {object} Meta info about events
*/
const getMeta = () => {
    return _meta;
}


function _getCallerMeta() {
    let e = new Error();
    if (!e.stack) try {
      // IE requires the Error to actually be throw or else the Error's 'stack'
      // property is undefined.
      throw e;
    } catch (e) {
      if (!e.stack) {
        return 0; // IE < 10, likely
      }
    }
    let stack = e.stack.toString().split(/\r\n|\n/);

    stack.shift();
    stack.shift();
    stack.shift();

    const line = stack[0].split(' ');

    return line[line.length-1];
  }

/**
 * Encode – encodes key for meta
 * @param {String} from message sender
 * @param {String} event event message
 * @return {String} message type JSON.stringify
*/
function _encode(from, event) {
    return JSON.stringify({
        from: from,
        event: event,
    });
}


/**
 * CreateMeta – creating meta information of event
 * @param {String} from sender function name
 * @param {String} event event name
 * @param {Function} callback callback function
 * @param {*} data data which is passed to callback
 * @return {String} тип сообщения (JSON_string)
*/
const _createMeta = ({from, link, event, callback, data} = {}) => {
    return {
        'from': from ? from.name : undefined,
        'link': link ? link : undefined,
        'event': event ? event : undefined,
        'callback': callback ? callback.name : undefined,
        'data': data ? data : undefined
    };
}


const _attachMeta = ({from, link, event, callback, data} = {}) => {
    if (!mode.debug) return;
    const meta = _createMeta({from, link, event, callback, data});
    if (!_meta[event]) {
        _meta[event] = [];
    }
    _meta[event].push(meta);
}

/**
 * Getting the sender
 * @param {sting} message - encoded message
 * @return {object}
 */
const _from = (message) => {
    return JSON.parse(message).from;
}


/**
 * Getting the event
 * @param {sting} message - encoded message
 * @return {object}
 */
const _event = (message) => {
    return JSON.parse(message).event;
}

/**
 * On – listener or subscription method for subscriber
 * adds meta information of the event
 * @param {String} event event on which to subcribe
 * @param {Function} callback callback function
 */
function on(event, callback){
    const link = _getCallerMeta();
    const from = on.caller;
    _attachMeta({from: from, event: event, callback: callback, link: link});
    if (!_subscribers[event]) {
        _subscribers[event] = [];
    }
    _subscribers[event].push({callback});
}


/**
 * Off – unsubscribe function
 * @param {*} event event on which to unsubscribe
 * @param {*} callback callback to check 
 */
const off = (event, callback) => {
    _subscribers[event] = _subscribers[event].filter((subscriber) => {
        return subscriber.callback !== callback;
    });
}


/**
 * TotalOff – delete all subscriptions
 * @param {*} event 
 */
const totalOff = (event) => {
    _subscribers[event] = [];
}


/**
 * Emit – emit data on event
 * @param {*} {event, data} event and data which to sent to callback
 */
function emit({event, data} = {}) {
    const link = _getCallerMeta();
    const from = emit.caller;
    _attachMeta({from: from, event: event, data: data, link: link});
    _subscribers[event].forEach((subscriber) => {
        subscriber.callback(data);
    });
}

module.exports.getMeta = getMeta;
module.exports.on = on;
module.exports.off = off;
module.exports.totalOff = totalOff;
module.exports.emit = emit;
module.exports.setDebug = setDebug;

/**
 * Bus – extension of event bus with powerful debugging.
 * The main idea is to track the flow of events. 
*/
