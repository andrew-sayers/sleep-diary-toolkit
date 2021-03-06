/**
 * @file Data structures from protocol buffers
 * @author Andrew Sayers <andrew-github.com@pileofstuff.org>
 * @copyright 2020
 * @license MIT
 */
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = (typeof module!=="undefined"&&module.exports)?require("protobufjs/minimal"):window.protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.entry_type = (function() {

    /**
     * Properties of an entry_type.
     * @exports Ientry_type
     * @interface Ientry_type
     * @property {number|Long|null} [timestamp] Milliseconds since the Unix epoch
     * @property {entry_type.event_type|null} [event] entry_type event
     * @property {Object.<string,string>|null} [privateStorage] entry_type privateStorage
     * @property {number|Long|null} [related] A number related to the event.
     * 
     * <p>If <tt>event == RETARGET</tt>, a missing or zero value indicates the target has been disabled, any other value indicates the target timestamp when the user would like to wake up in milliseconds past the Unix epoch.</p>
     * <p>In all other cases, this field has no specific meaning.</p>
     * @property {string|null} [comment] entry_type comment
     */

    /**
     * Constructs a new entry_type.
     * @exports entry_type
     * @classdesc Represents an entry_type.
     * @implements Ientry_type
     * @constructor
     * @param {Ientry_type=} [properties] Properties to set
     */
    function entry_type(properties) {
        this.privateStorage = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Milliseconds since the Unix epoch
     * @member {number|Long} timestamp
     * @memberof entry_type
     * @instance
     */
    entry_type.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * entry_type event.
     * @member {entry_type.event_type} event
     * @memberof entry_type
     * @instance
     */
    entry_type.prototype.event = 0;

    /**
     * entry_type privateStorage.
     * @member {Object.<string,string>} privateStorage
     * @memberof entry_type
     * @instance
     */
    entry_type.prototype.privateStorage = $util.emptyObject;

    /**
     * A number related to the event.
     * 
     * <p>If <tt>event == RETARGET</tt>, a missing or zero value indicates the target has been disabled, any other value indicates the target timestamp when the user would like to wake up in milliseconds past the Unix epoch.</p>
     * <p>In all other cases, this field has no specific meaning.</p>
     * @member {number|Long} related
     * @memberof entry_type
     * @instance
     */
    entry_type.prototype.related = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * entry_type comment.
     * @member {string} comment
     * @memberof entry_type
     * @instance
     */
    entry_type.prototype.comment = "";

    /**
     * Creates a new entry_type instance using the specified properties.
     * @function create
     * @memberof entry_type
     * @static
     * @param {Ientry_type=} [properties] Properties to set
     * @returns {entry_type} entry_type instance
     */
    entry_type.create = function create(properties) {
        return new entry_type(properties);
    };

    /**
     * Encodes the specified entry_type message. Does not implicitly {@link entry_type.verify|verify} messages.
     * @function encode
     * @memberof entry_type
     * @static
     * @param {Ientry_type} message entry_type message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    entry_type.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestamp);
        if (message.event != null && Object.hasOwnProperty.call(message, "event"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.event);
        if (message.privateStorage != null && Object.hasOwnProperty.call(message, "privateStorage"))
            for (var keys = Object.keys(message.privateStorage), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.privateStorage[keys[i]]).ldelim();
        if (message.related != null && Object.hasOwnProperty.call(message, "related"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.related);
        if (message.comment != null && Object.hasOwnProperty.call(message, "comment"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.comment);
        return writer;
    };

    /**
     * Encodes the specified entry_type message, length delimited. Does not implicitly {@link entry_type.verify|verify} messages.
     * @function encodeDelimited
     * @memberof entry_type
     * @static
     * @param {Ientry_type} message entry_type message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    entry_type.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an entry_type message from the specified reader or buffer.
     * @function decode
     * @memberof entry_type
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {entry_type} entry_type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    entry_type.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.entry_type(), key, value;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.timestamp = reader.uint64();
                break;
            case 2:
                message.event = reader.int32();
                break;
            case 3:
                if (message.privateStorage === $util.emptyObject)
                    message.privateStorage = {};
                var end2 = reader.uint32() + reader.pos;
                key = "";
                value = "";
                while (reader.pos < end2) {
                    var tag2 = reader.uint32();
                    switch (tag2 >>> 3) {
                    case 1:
                        key = reader.string();
                        break;
                    case 2:
                        value = reader.string();
                        break;
                    default:
                        reader.skipType(tag2 & 7);
                        break;
                    }
                }
                message.privateStorage[key] = value;
                break;
            case 4:
                message.related = reader.uint64();
                break;
            case 5:
                message.comment = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an entry_type message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof entry_type
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {entry_type} entry_type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    entry_type.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an entry_type message.
     * @function verify
     * @memberof entry_type
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    entry_type.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.event != null && message.hasOwnProperty("event"))
            switch (message.event) {
            default:
                return "event: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                break;
            }
        if (message.privateStorage != null && message.hasOwnProperty("privateStorage")) {
            if (!$util.isObject(message.privateStorage))
                return "privateStorage: object expected";
            var key = Object.keys(message.privateStorage);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.privateStorage[key[i]]))
                    return "privateStorage: string{k:string} expected";
        }
        if (message.related != null && message.hasOwnProperty("related"))
            if (!$util.isInteger(message.related) && !(message.related && $util.isInteger(message.related.low) && $util.isInteger(message.related.high)))
                return "related: integer|Long expected";
        if (message.comment != null && message.hasOwnProperty("comment"))
            if (!$util.isString(message.comment))
                return "comment: string expected";
        return null;
    };

    /**
     * Creates an entry_type message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof entry_type
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {entry_type} entry_type
     */
    entry_type.fromObject = function fromObject(object) {
        if (object instanceof $root.entry_type)
            return object;
        var message = new $root.entry_type();
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
        switch (object.event) {
        case "WAKE":
        case 0:
            message.event = 0;
            break;
        case "SLEEP":
        case 1:
            message.event = 1;
            break;
        case "DISRUPTION":
        case 2:
            message.event = 2;
            break;
        case "FOOD":
        case 3:
            message.event = 3;
            break;
        case "DRINK":
        case 4:
            message.event = 4;
            break;
        case "CAFFEINE":
        case 5:
            message.event = 5;
            break;
        case "ALCOHOL":
        case 6:
            message.event = 6;
            break;
        case "BATHROOM":
        case 7:
            message.event = 7;
            break;
        case "BATH":
        case 8:
            message.event = 8;
            break;
        case "RETARGET":
        case 9:
            message.event = 9;
            break;
        case "OTHER":
        case 10:
            message.event = 10;
            break;
        }
        if (object.privateStorage) {
            if (typeof object.privateStorage !== "object")
                throw TypeError(".entry_type.privateStorage: object expected");
            message.privateStorage = {};
            for (var keys = Object.keys(object.privateStorage), i = 0; i < keys.length; ++i)
                message.privateStorage[keys[i]] = String(object.privateStorage[keys[i]]);
        }
        if (object.related != null)
            if ($util.Long)
                (message.related = $util.Long.fromValue(object.related)).unsigned = true;
            else if (typeof object.related === "string")
                message.related = parseInt(object.related, 10);
            else if (typeof object.related === "number")
                message.related = object.related;
            else if (typeof object.related === "object")
                message.related = new $util.LongBits(object.related.low >>> 0, object.related.high >>> 0).toNumber(true);
        if (object.comment != null)
            message.comment = String(object.comment);
        return message;
    };

    /**
     * Creates a plain object from an entry_type message. Also converts values to other types if specified.
     * @function toObject
     * @memberof entry_type
     * @static
     * @param {entry_type} message entry_type
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    entry_type.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.objects || options.defaults)
            object.privateStorage = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
            object.event = options.enums === String ? "WAKE" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.related = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.related = options.longs === String ? "0" : 0;
            object.comment = "";
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
        if (message.event != null && message.hasOwnProperty("event"))
            object.event = options.enums === String ? $root.entry_type.event_type[message.event] : message.event;
        var keys2;
        if (message.privateStorage && (keys2 = Object.keys(message.privateStorage)).length) {
            object.privateStorage = {};
            for (var j = 0; j < keys2.length; ++j)
                object.privateStorage[keys2[j]] = message.privateStorage[keys2[j]];
        }
        if (message.related != null && message.hasOwnProperty("related"))
            if (typeof message.related === "number")
                object.related = options.longs === String ? String(message.related) : message.related;
            else
                object.related = options.longs === String ? $util.Long.prototype.toString.call(message.related) : options.longs === Number ? new $util.LongBits(message.related.low >>> 0, message.related.high >>> 0).toNumber(true) : message.related;
        if (message.comment != null && message.hasOwnProperty("comment"))
            object.comment = message.comment;
        return object;
    };

    /**
     * Converts this entry_type to JSON.
     * @function toJSON
     * @memberof entry_type
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    entry_type.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * An entry describes an event of a particular type
     * @name entry_type.event_type
     * @enum {number}
     * @property {number} WAKE=0 user woke up
     * @property {number} SLEEP=1 user went to sleep
     * @property {number} DISRUPTION=2 usually a sleep disruption
     * @property {number} FOOD=3 user ate something
     * @property {number} DRINK=4 user drank something
     * @property {number} CAFFEINE=5 user drank caffeine
     * @property {number} ALCOHOL=6 user drank alcohol
     * @property {number} BATHROOM=7 user visited the bathroom
     * @property {number} BATH=8 user had a bath or shower
     * @property {number} RETARGET=9 user changed the target timestamp (see related_timestamp)
     * @property {number} OTHER=10 miscellaneous (usually described in the comment)
     */
    entry_type.event_type = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "WAKE"] = 0;
        values[valuesById[1] = "SLEEP"] = 1;
        values[valuesById[2] = "DISRUPTION"] = 2;
        values[valuesById[3] = "FOOD"] = 3;
        values[valuesById[4] = "DRINK"] = 4;
        values[valuesById[5] = "CAFFEINE"] = 5;
        values[valuesById[6] = "ALCOHOL"] = 6;
        values[valuesById[7] = "BATHROOM"] = 7;
        values[valuesById[8] = "BATH"] = 8;
        values[valuesById[9] = "RETARGET"] = 9;
        values[valuesById[10] = "OTHER"] = 10;
        return values;
    })();

    return entry_type;
})();

$root.diary_type = (function() {

    /**
     * Properties of a diary_type.
     * @exports Idiary_type
     * @interface Idiary_type
     * @property {Array.<Ientry_type>|null} [entries] diary_type entries
     * @property {Object.<string,string>|null} [privateStorage] diary_type privateStorage
     * @property {number|Long|null} [preferredDayLength] User's ideal day length in milliseconds
     * @property {string|null} [server] URL of the server that will receive updates
     * @property {number|Long|null} [serverEntriesSent] Number of entries that have been sent to the server
     * @property {number|Long|null} [serverEntriesOffset] Number of entries in the diary before the first one sent
     */

    /**
     * Constructs a new diary_type.
     * @exports diary_type
     * @classdesc Represents a diary_type.
     * @implements Idiary_type
     * @constructor
     * @param {Idiary_type=} [properties] Properties to set
     */
    function diary_type(properties) {
        this.entries = [];
        this.privateStorage = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * diary_type entries.
     * @member {Array.<Ientry_type>} entries
     * @memberof diary_type
     * @instance
     */
    diary_type.prototype.entries = $util.emptyArray;

    /**
     * diary_type privateStorage.
     * @member {Object.<string,string>} privateStorage
     * @memberof diary_type
     * @instance
     */
    diary_type.prototype.privateStorage = $util.emptyObject;

    /**
     * User's ideal day length in milliseconds
     * @member {number|Long} preferredDayLength
     * @memberof diary_type
     * @instance
     */
    diary_type.prototype.preferredDayLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * URL of the server that will receive updates
     * @member {string} server
     * @memberof diary_type
     * @instance
     */
    diary_type.prototype.server = "";

    /**
     * Number of entries that have been sent to the server
     * @member {number|Long} serverEntriesSent
     * @memberof diary_type
     * @instance
     */
    diary_type.prototype.serverEntriesSent = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Number of entries in the diary before the first one sent
     * @member {number|Long} serverEntriesOffset
     * @memberof diary_type
     * @instance
     */
    diary_type.prototype.serverEntriesOffset = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new diary_type instance using the specified properties.
     * @function create
     * @memberof diary_type
     * @static
     * @param {Idiary_type=} [properties] Properties to set
     * @returns {diary_type} diary_type instance
     */
    diary_type.create = function create(properties) {
        return new diary_type(properties);
    };

    /**
     * Encodes the specified diary_type message. Does not implicitly {@link diary_type.verify|verify} messages.
     * @function encode
     * @memberof diary_type
     * @static
     * @param {Idiary_type} message diary_type message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    diary_type.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entries != null && message.entries.length)
            for (var i = 0; i < message.entries.length; ++i)
                $root.entry_type.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.privateStorage != null && Object.hasOwnProperty.call(message, "privateStorage"))
            for (var keys = Object.keys(message.privateStorage), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.privateStorage[keys[i]]).ldelim();
        if (message.preferredDayLength != null && Object.hasOwnProperty.call(message, "preferredDayLength"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.preferredDayLength);
        if (message.server != null && Object.hasOwnProperty.call(message, "server"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.server);
        if (message.serverEntriesSent != null && Object.hasOwnProperty.call(message, "serverEntriesSent"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.serverEntriesSent);
        if (message.serverEntriesOffset != null && Object.hasOwnProperty.call(message, "serverEntriesOffset"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.serverEntriesOffset);
        return writer;
    };

    /**
     * Encodes the specified diary_type message, length delimited. Does not implicitly {@link diary_type.verify|verify} messages.
     * @function encodeDelimited
     * @memberof diary_type
     * @static
     * @param {Idiary_type} message diary_type message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    diary_type.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a diary_type message from the specified reader or buffer.
     * @function decode
     * @memberof diary_type
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {diary_type} diary_type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    diary_type.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.diary_type(), key, value;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.entries && message.entries.length))
                    message.entries = [];
                message.entries.push($root.entry_type.decode(reader, reader.uint32()));
                break;
            case 2:
                if (message.privateStorage === $util.emptyObject)
                    message.privateStorage = {};
                var end2 = reader.uint32() + reader.pos;
                key = "";
                value = "";
                while (reader.pos < end2) {
                    var tag2 = reader.uint32();
                    switch (tag2 >>> 3) {
                    case 1:
                        key = reader.string();
                        break;
                    case 2:
                        value = reader.string();
                        break;
                    default:
                        reader.skipType(tag2 & 7);
                        break;
                    }
                }
                message.privateStorage[key] = value;
                break;
            case 3:
                message.preferredDayLength = reader.uint64();
                break;
            case 4:
                message.server = reader.string();
                break;
            case 5:
                message.serverEntriesSent = reader.uint64();
                break;
            case 6:
                message.serverEntriesOffset = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a diary_type message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof diary_type
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {diary_type} diary_type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    diary_type.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a diary_type message.
     * @function verify
     * @memberof diary_type
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    diary_type.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entries != null && message.hasOwnProperty("entries")) {
            if (!Array.isArray(message.entries))
                return "entries: array expected";
            for (var i = 0; i < message.entries.length; ++i) {
                var error = $root.entry_type.verify(message.entries[i]);
                if (error)
                    return "entries." + error;
            }
        }
        if (message.privateStorage != null && message.hasOwnProperty("privateStorage")) {
            if (!$util.isObject(message.privateStorage))
                return "privateStorage: object expected";
            var key = Object.keys(message.privateStorage);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.privateStorage[key[i]]))
                    return "privateStorage: string{k:string} expected";
        }
        if (message.preferredDayLength != null && message.hasOwnProperty("preferredDayLength"))
            if (!$util.isInteger(message.preferredDayLength) && !(message.preferredDayLength && $util.isInteger(message.preferredDayLength.low) && $util.isInteger(message.preferredDayLength.high)))
                return "preferredDayLength: integer|Long expected";
        if (message.server != null && message.hasOwnProperty("server"))
            if (!$util.isString(message.server))
                return "server: string expected";
        if (message.serverEntriesSent != null && message.hasOwnProperty("serverEntriesSent"))
            if (!$util.isInteger(message.serverEntriesSent) && !(message.serverEntriesSent && $util.isInteger(message.serverEntriesSent.low) && $util.isInteger(message.serverEntriesSent.high)))
                return "serverEntriesSent: integer|Long expected";
        if (message.serverEntriesOffset != null && message.hasOwnProperty("serverEntriesOffset"))
            if (!$util.isInteger(message.serverEntriesOffset) && !(message.serverEntriesOffset && $util.isInteger(message.serverEntriesOffset.low) && $util.isInteger(message.serverEntriesOffset.high)))
                return "serverEntriesOffset: integer|Long expected";
        return null;
    };

    /**
     * Creates a diary_type message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof diary_type
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {diary_type} diary_type
     */
    diary_type.fromObject = function fromObject(object) {
        if (object instanceof $root.diary_type)
            return object;
        var message = new $root.diary_type();
        if (object.entries) {
            if (!Array.isArray(object.entries))
                throw TypeError(".diary_type.entries: array expected");
            message.entries = [];
            for (var i = 0; i < object.entries.length; ++i) {
                if (typeof object.entries[i] !== "object")
                    throw TypeError(".diary_type.entries: object expected");
                message.entries[i] = $root.entry_type.fromObject(object.entries[i]);
            }
        }
        if (object.privateStorage) {
            if (typeof object.privateStorage !== "object")
                throw TypeError(".diary_type.privateStorage: object expected");
            message.privateStorage = {};
            for (var keys = Object.keys(object.privateStorage), i = 0; i < keys.length; ++i)
                message.privateStorage[keys[i]] = String(object.privateStorage[keys[i]]);
        }
        if (object.preferredDayLength != null)
            if ($util.Long)
                (message.preferredDayLength = $util.Long.fromValue(object.preferredDayLength)).unsigned = true;
            else if (typeof object.preferredDayLength === "string")
                message.preferredDayLength = parseInt(object.preferredDayLength, 10);
            else if (typeof object.preferredDayLength === "number")
                message.preferredDayLength = object.preferredDayLength;
            else if (typeof object.preferredDayLength === "object")
                message.preferredDayLength = new $util.LongBits(object.preferredDayLength.low >>> 0, object.preferredDayLength.high >>> 0).toNumber(true);
        if (object.server != null)
            message.server = String(object.server);
        if (object.serverEntriesSent != null)
            if ($util.Long)
                (message.serverEntriesSent = $util.Long.fromValue(object.serverEntriesSent)).unsigned = true;
            else if (typeof object.serverEntriesSent === "string")
                message.serverEntriesSent = parseInt(object.serverEntriesSent, 10);
            else if (typeof object.serverEntriesSent === "number")
                message.serverEntriesSent = object.serverEntriesSent;
            else if (typeof object.serverEntriesSent === "object")
                message.serverEntriesSent = new $util.LongBits(object.serverEntriesSent.low >>> 0, object.serverEntriesSent.high >>> 0).toNumber(true);
        if (object.serverEntriesOffset != null)
            if ($util.Long)
                (message.serverEntriesOffset = $util.Long.fromValue(object.serverEntriesOffset)).unsigned = true;
            else if (typeof object.serverEntriesOffset === "string")
                message.serverEntriesOffset = parseInt(object.serverEntriesOffset, 10);
            else if (typeof object.serverEntriesOffset === "number")
                message.serverEntriesOffset = object.serverEntriesOffset;
            else if (typeof object.serverEntriesOffset === "object")
                message.serverEntriesOffset = new $util.LongBits(object.serverEntriesOffset.low >>> 0, object.serverEntriesOffset.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a diary_type message. Also converts values to other types if specified.
     * @function toObject
     * @memberof diary_type
     * @static
     * @param {diary_type} message diary_type
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    diary_type.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.entries = [];
        if (options.objects || options.defaults)
            object.privateStorage = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.preferredDayLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.preferredDayLength = options.longs === String ? "0" : 0;
            object.server = "";
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.serverEntriesSent = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.serverEntriesSent = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.serverEntriesOffset = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.serverEntriesOffset = options.longs === String ? "0" : 0;
        }
        if (message.entries && message.entries.length) {
            object.entries = [];
            for (var j = 0; j < message.entries.length; ++j)
                object.entries[j] = $root.entry_type.toObject(message.entries[j], options);
        }
        var keys2;
        if (message.privateStorage && (keys2 = Object.keys(message.privateStorage)).length) {
            object.privateStorage = {};
            for (var j = 0; j < keys2.length; ++j)
                object.privateStorage[keys2[j]] = message.privateStorage[keys2[j]];
        }
        if (message.preferredDayLength != null && message.hasOwnProperty("preferredDayLength"))
            if (typeof message.preferredDayLength === "number")
                object.preferredDayLength = options.longs === String ? String(message.preferredDayLength) : message.preferredDayLength;
            else
                object.preferredDayLength = options.longs === String ? $util.Long.prototype.toString.call(message.preferredDayLength) : options.longs === Number ? new $util.LongBits(message.preferredDayLength.low >>> 0, message.preferredDayLength.high >>> 0).toNumber(true) : message.preferredDayLength;
        if (message.server != null && message.hasOwnProperty("server"))
            object.server = message.server;
        if (message.serverEntriesSent != null && message.hasOwnProperty("serverEntriesSent"))
            if (typeof message.serverEntriesSent === "number")
                object.serverEntriesSent = options.longs === String ? String(message.serverEntriesSent) : message.serverEntriesSent;
            else
                object.serverEntriesSent = options.longs === String ? $util.Long.prototype.toString.call(message.serverEntriesSent) : options.longs === Number ? new $util.LongBits(message.serverEntriesSent.low >>> 0, message.serverEntriesSent.high >>> 0).toNumber(true) : message.serverEntriesSent;
        if (message.serverEntriesOffset != null && message.hasOwnProperty("serverEntriesOffset"))
            if (typeof message.serverEntriesOffset === "number")
                object.serverEntriesOffset = options.longs === String ? String(message.serverEntriesOffset) : message.serverEntriesOffset;
            else
                object.serverEntriesOffset = options.longs === String ? $util.Long.prototype.toString.call(message.serverEntriesOffset) : options.longs === Number ? new $util.LongBits(message.serverEntriesOffset.low >>> 0, message.serverEntriesOffset.high >>> 0).toNumber(true) : message.serverEntriesOffset;
        return object;
    };

    /**
     * Converts this diary_type to JSON.
     * @function toJSON
     * @memberof diary_type
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    diary_type.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return diary_type;
})();

$root.diary_update_type = (function() {

    /**
     * Properties of a diary_update_type.
     * @exports Idiary_update_type
     * @interface Idiary_update_type
     * @property {Array.<Ientry_type>|null} [entries] diary_update_type entries
     * @property {number|Long|null} [start] Zero-based index at which to start inserting entries
     * @property {number|Long|null} [deleteCount] Number of entries to remove before inserting entries
     * @property {boolean|null} [reset] Indicates the diary should be reset (all previous items cleared)
     */

    /**
     * Constructs a new diary_update_type.
     * @exports diary_update_type
     * @classdesc Represents a diary_update_type.
     * @implements Idiary_update_type
     * @constructor
     * @param {Idiary_update_type=} [properties] Properties to set
     */
    function diary_update_type(properties) {
        this.entries = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * diary_update_type entries.
     * @member {Array.<Ientry_type>} entries
     * @memberof diary_update_type
     * @instance
     */
    diary_update_type.prototype.entries = $util.emptyArray;

    /**
     * Zero-based index at which to start inserting entries
     * @member {number|Long} start
     * @memberof diary_update_type
     * @instance
     */
    diary_update_type.prototype.start = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Number of entries to remove before inserting entries
     * @member {number|Long} deleteCount
     * @memberof diary_update_type
     * @instance
     */
    diary_update_type.prototype.deleteCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Indicates the diary should be reset (all previous items cleared)
     * @member {boolean} reset
     * @memberof diary_update_type
     * @instance
     */
    diary_update_type.prototype.reset = false;

    /**
     * Creates a new diary_update_type instance using the specified properties.
     * @function create
     * @memberof diary_update_type
     * @static
     * @param {Idiary_update_type=} [properties] Properties to set
     * @returns {diary_update_type} diary_update_type instance
     */
    diary_update_type.create = function create(properties) {
        return new diary_update_type(properties);
    };

    /**
     * Encodes the specified diary_update_type message. Does not implicitly {@link diary_update_type.verify|verify} messages.
     * @function encode
     * @memberof diary_update_type
     * @static
     * @param {Idiary_update_type} message diary_update_type message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    diary_update_type.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entries != null && message.entries.length)
            for (var i = 0; i < message.entries.length; ++i)
                $root.entry_type.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.start != null && Object.hasOwnProperty.call(message, "start"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.start);
        if (message.deleteCount != null && Object.hasOwnProperty.call(message, "deleteCount"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.deleteCount);
        if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.reset);
        return writer;
    };

    /**
     * Encodes the specified diary_update_type message, length delimited. Does not implicitly {@link diary_update_type.verify|verify} messages.
     * @function encodeDelimited
     * @memberof diary_update_type
     * @static
     * @param {Idiary_update_type} message diary_update_type message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    diary_update_type.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a diary_update_type message from the specified reader or buffer.
     * @function decode
     * @memberof diary_update_type
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {diary_update_type} diary_update_type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    diary_update_type.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.diary_update_type();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.entries && message.entries.length))
                    message.entries = [];
                message.entries.push($root.entry_type.decode(reader, reader.uint32()));
                break;
            case 2:
                message.start = reader.uint64();
                break;
            case 3:
                message.deleteCount = reader.uint64();
                break;
            case 4:
                message.reset = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a diary_update_type message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof diary_update_type
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {diary_update_type} diary_update_type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    diary_update_type.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a diary_update_type message.
     * @function verify
     * @memberof diary_update_type
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    diary_update_type.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entries != null && message.hasOwnProperty("entries")) {
            if (!Array.isArray(message.entries))
                return "entries: array expected";
            for (var i = 0; i < message.entries.length; ++i) {
                var error = $root.entry_type.verify(message.entries[i]);
                if (error)
                    return "entries." + error;
            }
        }
        if (message.start != null && message.hasOwnProperty("start"))
            if (!$util.isInteger(message.start) && !(message.start && $util.isInteger(message.start.low) && $util.isInteger(message.start.high)))
                return "start: integer|Long expected";
        if (message.deleteCount != null && message.hasOwnProperty("deleteCount"))
            if (!$util.isInteger(message.deleteCount) && !(message.deleteCount && $util.isInteger(message.deleteCount.low) && $util.isInteger(message.deleteCount.high)))
                return "deleteCount: integer|Long expected";
        if (message.reset != null && message.hasOwnProperty("reset"))
            if (typeof message.reset !== "boolean")
                return "reset: boolean expected";
        return null;
    };

    /**
     * Creates a diary_update_type message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof diary_update_type
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {diary_update_type} diary_update_type
     */
    diary_update_type.fromObject = function fromObject(object) {
        if (object instanceof $root.diary_update_type)
            return object;
        var message = new $root.diary_update_type();
        if (object.entries) {
            if (!Array.isArray(object.entries))
                throw TypeError(".diary_update_type.entries: array expected");
            message.entries = [];
            for (var i = 0; i < object.entries.length; ++i) {
                if (typeof object.entries[i] !== "object")
                    throw TypeError(".diary_update_type.entries: object expected");
                message.entries[i] = $root.entry_type.fromObject(object.entries[i]);
            }
        }
        if (object.start != null)
            if ($util.Long)
                (message.start = $util.Long.fromValue(object.start)).unsigned = true;
            else if (typeof object.start === "string")
                message.start = parseInt(object.start, 10);
            else if (typeof object.start === "number")
                message.start = object.start;
            else if (typeof object.start === "object")
                message.start = new $util.LongBits(object.start.low >>> 0, object.start.high >>> 0).toNumber(true);
        if (object.deleteCount != null)
            if ($util.Long)
                (message.deleteCount = $util.Long.fromValue(object.deleteCount)).unsigned = true;
            else if (typeof object.deleteCount === "string")
                message.deleteCount = parseInt(object.deleteCount, 10);
            else if (typeof object.deleteCount === "number")
                message.deleteCount = object.deleteCount;
            else if (typeof object.deleteCount === "object")
                message.deleteCount = new $util.LongBits(object.deleteCount.low >>> 0, object.deleteCount.high >>> 0).toNumber(true);
        if (object.reset != null)
            message.reset = Boolean(object.reset);
        return message;
    };

    /**
     * Creates a plain object from a diary_update_type message. Also converts values to other types if specified.
     * @function toObject
     * @memberof diary_update_type
     * @static
     * @param {diary_update_type} message diary_update_type
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    diary_update_type.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.entries = [];
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.start = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.start = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.deleteCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.deleteCount = options.longs === String ? "0" : 0;
            object.reset = false;
        }
        if (message.entries && message.entries.length) {
            object.entries = [];
            for (var j = 0; j < message.entries.length; ++j)
                object.entries[j] = $root.entry_type.toObject(message.entries[j], options);
        }
        if (message.start != null && message.hasOwnProperty("start"))
            if (typeof message.start === "number")
                object.start = options.longs === String ? String(message.start) : message.start;
            else
                object.start = options.longs === String ? $util.Long.prototype.toString.call(message.start) : options.longs === Number ? new $util.LongBits(message.start.low >>> 0, message.start.high >>> 0).toNumber(true) : message.start;
        if (message.deleteCount != null && message.hasOwnProperty("deleteCount"))
            if (typeof message.deleteCount === "number")
                object.deleteCount = options.longs === String ? String(message.deleteCount) : message.deleteCount;
            else
                object.deleteCount = options.longs === String ? $util.Long.prototype.toString.call(message.deleteCount) : options.longs === Number ? new $util.LongBits(message.deleteCount.low >>> 0, message.deleteCount.high >>> 0).toNumber(true) : message.deleteCount;
        if (message.reset != null && message.hasOwnProperty("reset"))
            object.reset = message.reset;
        return object;
    };

    /**
     * Converts this diary_update_type to JSON.
     * @function toJSON
     * @memberof diary_update_type
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    diary_update_type.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return diary_update_type;
})();

if (typeof module!=="undefined"&&module.exports) { module.exports = $root; } else { window.data_structures = $root; }
