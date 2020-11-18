/**
 * @file Manipulate sleep diaries
 * @author Andrew Sayers <andrew-github.com@pileofstuff.org>
 * @copyright 2020
 * @license MIT
 */

(function() {
"use strict";

var data_structures, browser_utils;
if (typeof module !== 'undefined' && module.exports) { // Compiled:
    data_structures = require("./data_structures");
    browser_utils   = require("./browser_utils");
} else { // Browser:
    data_structures = window.data_structures;
    browser_utils   = window.browser_utils;
}

// base64_* based on https://gist.github.com/enepomnyaschih/72c423f727d395eeaa09697058238727:
function base64_decode(str) {
    var index = str.indexOf("="),
        missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0,
	n = str.length,
	result = new Uint8Array(3 * (n / 4)),
	buffer,
        i,j,
        base64codes = [
	    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63,
	    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
	    255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
	    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255,
	    255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
        ]
    ;
    if ( ( str.length % 4 !== 0 ) || ( index !== -1 && index < str.length - 2 ) ) {
	throw new Error("Unable to parse base64 string.");
    }
    for (i = 0, j = 0; i < n; i += 4, j += 3) {
	buffer =
	    base64codes[str.charCodeAt(i)] << 18 |
	    base64codes[str.charCodeAt(i + 1)] << 12 |
	    base64codes[str.charCodeAt(i + 2)] << 6 |
	    base64codes[str.charCodeAt(i + 3)];
	result[j] = buffer >> 16;
	result[j + 1] = (buffer >> 8) & 0xFF;
	result[j + 2] = buffer & 0xFF;
    }
    return result.subarray(0, result.length - missingOctets);
}
function base64_encode(bytes) {
    var base64abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        result = '',
        i,
        l = bytes.length
    ;
    for (i = 2; i < l; i += 3) {
	result += base64abc[bytes[i - 2] >> 2];
	result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
	result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
	result += base64abc[bytes[i] & 0x3F];
    }
    if (i === l + 1) { // 1 octet yet to write
	result += base64abc[bytes[i - 2] >> 2];
	result += base64abc[(bytes[i - 2] & 0x03) << 4];
	result += "==";
    }
    if (i === l) { // 2 octets yet to write
	result += base64abc[bytes[i - 2] >> 2];
	result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
	result += base64abc[(bytes[i - 1] & 0x0F) << 2];
	result += "=";
    }
    return result;
}

function encode( type, data ) {
    return base64_encode(type.encode(data).finish());
}

/**
 * Load sleep diary data from a string or from localStorage
 * @global
 * @class
 * @classdesc A user's sleep diary
 *
 * @param {string=} data - string to load from (default: load from localStorage)
 *
 * @example
 *     var diary = new Diary(); // returns the diary stored in localStorage
 * @example
 *     var diary = new Diary(""); // returns an empty diary object
 */
function Diary(data) {

    /**
     * Whether a string was passed to the constructor
     * @member {boolean}
     * @private
     */
    this.constructed_from_string = !!data;
    /**
     * Number of requests recently sent to the server
     * @member {number}
     * @private
     */
    this.sending = 0;

    if ( data === undefined ) {

        try {
            var s = window.localStorage;
        } catch (e) {
            console.error("localStorage not found - please run this function in a modern web browser");
            throw e;
        }

        data = localStorage.getItem('diary:data');
        if ( data === null ) {
            /**
             * Actual diary data
             *
             * Do not modify entries directly.  Use the diary functions provided.
             * The diary functions save the data and notify any server the user has requested.
             *
             * @member {diary_type}
             * @public
             * @readonly
             *
             * @see add_entry
             * @see splice_entries
             */
            this.data = data_structures.diary_type.create({ entries: [] });
            return;
        }

    }

    if ( typeof data == 'string' || data instanceof String ) {

        // unwrap the Diary(""), if present:
        data = data.replace(/^Diary\(["'](.*)["']\)/,"$1");

        try {

            this.data = data_structures.diary_type.decode(base64_decode(data));

        } catch (e) {

            this.data = null;
            console.error("Could not load diary - file may have been corrupted",e);

        }

    } else {

        this.data = data_structures.entry_type.create(data);

    }

}

/**
 * Shortcut to convert event strings to IDs
 * @memberof Diary
 * @public
 *
 * @example
 *   console.log(diary.event_string_to_id["WAKE"]); // prints 0
 */
Diary.prototype.event_string_to_id = data_structures.entry_type.event_type;

var event_id_to_string = [];
Object.keys(Diary.prototype.event_string_to_id).forEach( function(key) {
    event_id_to_string[Diary.prototype.event_string_to_id[key]] = key
});

/**
 * Shortcut to convert event IDs to strings
 * @memberof Diary
 * @public
 *
 * @example
 *   console.log(diary.event_id_to_string[0]); // prints "WAKE"
 */
Diary.prototype.event_id_to_string = event_id_to_string;

/**
 * Convert a diary object to a string
 *
 * @return {string}
 *
 * @example
 *     diary.serialise(); // returns 'Diary("...");'
 */
Diary.prototype.serialise = function() {

    /*
     * Wrapping the data in Diary("") does several things:
     * 1. makes the string easier for humans to read
     * 2. provides useful metadata for machines
     * 3. makes it possible in principle to pass backup files as <script> tags
     *    (probably not useful, but worth keeping as an option)
     */
    return 'Diary("' + encode(data_structures.diary_type,this.data) + '")'

}

/**
 * Save a diary object to localStorage
 *
 * <p><tt>save_if_string</tt> enables saving of diaries constructed from strings.</p>
 *
 * <p>During development, it is often useful to load example data from a string,
 * and test your save functionality without actually overwriting real data.
 * By default, this function will print a warning and refuse to save data constructed from a string.
 * The <tt>save_if_string</tt> argument overrides that behaviour.</p>
 *
 * @param {boolean=} save_if_string - save the object even if it was constructed from a string
 * @param {function=} success_callback - called when the update is complete
 * @param {function=} error_callback - called if the update fails
 *
 * @example
 *     diary.save();
 */
Diary.prototype.save = function(save_if_string, success_callback, error_callback) {

    if ( this.constructed_from_string && !save_if_string ) {

        console.warn("Diary was constructed from string - call diary.save(true) if you really want to overwrite your site data");
        if ( error_callback ) error_callback();

    } else {

        localStorage.setItem( 'diary:data', this.serialise() );

        if (
            this.data.server &&
            this.data.serverEntriesSent < this.data.entries.length
        ) {

            if ( !this.sending++ ) {

                var that = this,
                    req = new XMLHttpRequest(),
                    new_server_entries_sent = this.data.server_entries.length,
                    to_send = encode(data_structures.diary_update_type,{
                        entries : this.data.entries.slice(this.data.serverEntriesSent),
                        start   : this.data.serverEntriesSent - this.data.serverEntriesOffset,
                        end     : new_server_entries_sent - this.data.serverEntriesOffset,
                    })
                ;

                // save the data on the server:
                req.onload = function(e) {
                    that.data.serverEntriesSent = new_server_entries_sent;
                    that.save();
                    that.sending = 0;
                    if (
                        that.diary.server &&
                        new_server_entries_sent < that.diary.entries.length
                    ) {
                        // diary was updated while the request was in flight - send again:
                        that.save();
                        if ( success_callback ) success_callback();
                    }
                };
                req.onerror = function(e) {
                    // ignore any requests sent while this request was in flight:
                    that.sending = 0;
                    if ( error_callback ) error_callback();
                }
                req.open( "GET", this.data.server + to_send );
                req.send();

            } else {

                if ( success_callback ) success_callback();

            }
        } else {

            if ( success_callback ) success_callback();

        }

    }

}

/**
 * Set the server that receives updates
 *
 * <p>Will call <tt>error_callback()</tt> if we need to notify the server but the request fails.</p>
 *
 * @param {string=} server - URL of the server (empty or missing to disable the server)
 * @param {function=} success_callback - called when the update is complete
 * @param {function=} error_callback - called if the update fails
 *
 * @example
 *     diary.server(
 *       "https://example.com/",
 *       () => console.log("server activated"),
 *       () => console.log("could not connect to server"),
 *     );
 * @example
 *     diary.server(null); // stop sending updates to a server
 */
Diary.prototype.server = function( server, success_callback, error_callback ) {
    if ( server ) {
        if ( server != this.data.server ) {
            var that = this,
                target = this.target_timestamp(),
                entries = target ? [
                    // make sure the server knows we have a target
                    data_structures.entry_type.create({
                        timestamp: new Date().getTime(),
                        event: this.event_string_to_id.RETARGET,
                        related: target,
                    })
                ] : undefined,
                to_send = encode(data_structures.diary_update_type,{
                    reset: true,
                    entries: entries,
                }),
                req = new XMLHttpRequest()
            ;
            // save the data on the server:
            req.onload = function(e) {
                that.data.server = server;
                that.data.serverEntriesSent = target?1:0;
                that.data.serverEntriesOffset = that.data.entries.length - that.data.serverEntriesSent;
                that.save();
                if ( success_callback ) success_callback();
            };
            if ( error_callback ) req.onerror = function() { error_callback(); }
            req.open( "GET", server + to_send );
            req.send();
        }
    } else {
        delete this.data.server;
        this.data.serverEntriesSent = 0;
        this.data.serverEntriesOffset = 0;
        this.save();
        if ( success_callback ) success_callback();
    }
}

/**
 * Set the diary's preferred day length
 *
 * @param {number} day_length - preferred day length
 */
Diary.prototype.set_preferred_day_length = function(day_length) {
    this.data.preferredDayLength = day_length;
    this.save();
}


/**
 * Send all diary entries to the server
 *
 * <p>Will call <tt>error_callback()</tt> if the request fails.</p>
 *
 * @param {function=} success_callback - called when the update is complete
 * @param {function=} error_callback - called if the update fails
 *
 * @example
 *     diary.send_all_entries(
 *       () => console.log("server activated");
 *       () => console.log("could not connect to server");
 *     );
 */
Diary.prototype.send_all_entries = function( success_callback, error_callback ) {
    if ( this.data.server ) {
        var that = this,
            to_send = encode(data_structures.diary_update_type,{
                entries: this.data.entries,
                reset  : true,
            }),
            entries_sent = this.data.entries.length,
            req = new XMLHttpRequest()
        ;
        // save the data on the server:
        req.onload = function(e) {
            that.data.serverEntriesSent = entries_sent;
            that.data.serverEntriesOffset = 0;
            that.save();
            if ( success_callback ) success_callback();
        };
        if ( error_callback ) req.onerror = function() { error_callback(); }
        req.open( "GET", this.data.server + to_send );
        req.send();
    }
}

function create_entry(event,timestamp,related,comment) {

    if ( timestamp === undefined ) {
        timestamp = new Date().getTime();
    }
    if ( typeof event == 'string' || event instanceof String ) {
        var event_no = Diary.prototype.event_string_to_id[event.toUpperCase()];
        if ( event_no === undefined ) {
            throw Error("Please pass a known event type, not '"+event+'"');
        }
        event = event_no;
    }
    if ( !event ) event = undefined;

    var entry = data_structures.entry_type.create({
        timestamp: timestamp,
        event: event,
        related: related,
        comment: comment,
    }),
        err = data_structures.entry_type.verify(entry);

    if ( err ) throw Error(err);

    return entry;

}

/**
 * Append a diary entry
 *
 * <p>Optional arguments default to useful values based on the diary object.</p>
 *
 * @param {string|number} event - event to add
 * @param {number=} timestamp - time in milliseconds past the epoch
 * @param {number=} related - e.g. the target timestamp for RETARGETED
 * @param {string=} comment - text comment
 *
 * @example
 *     diary.add_entry("wake"); // returns the time of the event
 * @example
 *     diary.add_entry(0,new Date().getTime(),my_related);
 */
Diary.prototype.add_entry = function(event,timestamp,related,comment) {

    this.data.entries.push(create_entry(event,timestamp,related,comment));
    this.save();

}

/**
 * Splice the list of entries
 *
 * Each value in the list of entries should be either an entry object,
 * or a list of argument similar to those passed to add_entry()
 *
 * @param {number} start - zero-based index at which to start inserting entries
 * @param {number} end - zero-based index before which to end inserting entries
 * @param {Array[]} entries - entries to insert
 * @param {function=} success_callback - called when the splice is complete
 * @param {function=} error_callback - called if the splice fails
 *
 * @example
 *     diary.splice_entries(0,diary.data.entries.length); // delete all diary entries
 * @example
 *     diary.splice_entries(10,1,[['WAKE']]); // replace an existing entry
 */
Diary.prototype.splice_entries = function( start, end, entries, success_callback, error_callback) {

    if ( entries ) {
        for ( var n=0; n!=entries.length; ++n ) {
            if ( Array.isArray(entries[n]) ) entries[n] = create_entry.apply(0,entries[n]);
        }
    } else {
        entries = [];
    }

    if ( this.data.server && end > this.data.serverEntriesOffset ) {

        var that = this,
            send_offset = Math.max( 0, this.data.serverEntriesOffset - start ),
            to_send = encode(data_structures.diary_update_type,{
                entries : entries,
                start   : start - this.data.serverEntriesOffset + send_offset,
                end     : Math.max( 0, end - this.data.serverEntriesOffset + send_offset ),
            }),
            req = new XMLHttpRequest()
        ;
        // save the data on the server:
        req.onload = function(e) {
            that.data.entries.splice.apply(
                that.data.entries,
                [ start, end ].concat(entries)
            );
            if ( that.data.serverEntriesSent < end ) that.data.serverEntriesSent = end;
            that.save();
            if ( success_callback ) success_callback();
        };
        if ( error_callback ) req.onerror = function() { error_callback(); }
        req.open( "GET", this.data.server + to_send );
        req.send();

    } else {

        this.data.entries.splice.apply(
            this.data.entries,
            [ start, end ].concat(entries)
        );
        this.save();
        if ( success_callback ) success_callback();

    }

}


/**
 * Calculate diary statistics
 *
 * <p>These statistics try to account for common issues with entered data.
 * For example, if a user normally has a 25 hour day, but appears to have
 * occasional 50 hour days, we assume they just forget to press the button
 * sometimes.</p>
 *
 * <p>The <a href="https://en.wikipedia.org/wiki/Truncated_mean">trimmed mean</a>
 * is a way of calculating the average that ignores extremely high or extremely
 * low values.  This is quite robust for users that enter data fairly reliably
 * and have fairly constant day lengths.  But it could produce misleading results
 * for e.g. someone with an extremely variable day length.</p>
 *
 * <p>A "sleep" usually covers the period between times the moon icon is pressed.
 * But we ignore duplicate button-presses, and try to reconstruct missing data.</p>
 *
 * @return {Object} analysis
 *
 * @example
 *     diary.analyse(diary); // returns something like the following:
 *       {
 *
 *         sleeps: [
 *           {
 *
 *             // sleep/wake events, missing if no event was detected:
 *             sleep_time: 12345,
 *             wake_time: 23456,
 *
 *             // sleep/wake events, estimated if no event was detected:
 *             estimated_sleep_time: 12345,
 *             estimated_wake_time: 23456,
 *
 *             // target wake date/time:
 *             target: 34567,
 *
 *             disruptions: [
 *               // events that occur between "sleep" and "wake" events
 *             ],
 *
 *           },
 *         ],
 *
 *         sleep_duration_stats: {
 *           trimmed_mean: 12.345, // average milliseconds of sleep per day
 *           trimmed_stddev: 1.234, // variability of sleep durations
 *         },
 *
 *         day_duration_stats: {
 *           trimmed_mean: 12.345, // average milliseconds between waking up
 *           trimmed_stddev: 1.234, // variability of day durations
 *         },
 *
 *        suggested_day_lengths : [ 12.34, 23.45 ],
 *
 *       };
 *
 */
Diary.prototype.analyse = function() {

    function a_plus_b(a,b) { return a+b; }
    function calculate_stats(array) {
        // trimmed mean:
        array.sort(function(a,b) { return a - b; });
        array = array.slice( Math.floor(array.length/10), Math.floor(array.length/10)*8 );
        if ( array.length ) {
            var mean = array.reduce(a_plus_b) / array.length,
                stddev = Math.sqrt(
                    array
                        .map(function(a) { return Math.pow(a - mean, 2); })
                        .reduce(a_plus_b)
                        / array.length
                )
            ;
            return {
                trimmed_mean: mean,
                trimmed_stddev: stddev
            };
        } else {
            return {
                trimmed_mean: 0,
                trimmed_stddev: 0
            };
        }
    }

    var one_hour = 60*60*1000, // constant value added for readability
        that = this,

        // ignore duplicate entries:
        ignore_repeat_events_within_this_duration = 30*60*1000,
        dupe_timestamp = NaN, dupe_event = NaN,
        sleeps = [{ disruptions: [] }], // dummy value used during processing, deleted below
        target_timestamp = 0
    ;

    this.data.entries.forEach(function(entry) {
        if ( entry.event == that.event_string_to_id.RETARGET ) {
            target_timestamp = entry.related;
        } else if (
            entry.timestamp != dupe_timestamp &&
            ( entry.timestamp > dupe_timestamp || entry.event != dupe_event )
        ) {
            dupe_timestamp = entry.timestamp + ignore_repeat_events_within_this_duration;
            dupe_event = entry.event;

            var sleep = sleeps[sleeps.length-1],
                push = false;

            switch ( entry.event ) {

            case that.event_string_to_id.WAKE:
                // add a new sleep if the day would otherwise be absurdly long:
                if ( sleep.wake_time ) {
                    push = sleep.wake_time+one_hour < entry.timestamp;
                } else if ( sleep.sleep_time ) {
                    push = sleep.sleep_time+(18*one_hour) < entry.timestamp;
                } else {
                    push = true;
                }
                if (push) sleeps.push(sleep = { disruptions: [] });
                sleep.wake_time = entry.timestamp;
                break;

            case that.event_string_to_id.SLEEP:
                // add a new sleep if the day would otherwise be absurdly long:
                if ( sleep.sleep_time ) {
                    push = sleep.wake_time+(1*one_hour) < entry.timestamp;
                } else if ( sleep.wake_time ) {
                    push = sleep.wake_time+(6*one_hour) < entry.timestamp;
                } else {
                    push = true;
                }
                if (push) sleeps.push(sleep = { disruptions: [] });
                sleep.sleep_time = entry.timestamp;
                if ( target_timestamp ) {
                    sleep.target_timestamp = target_timestamp;
                } else {
                    delete sleep.target_timestamp;
                }
                break;

            default:
                if ( !sleep.wake_time ) {
                    // haven't woken up yet
                    sleep.disruptions.push(entry);
                }

            }

        }
    });

    // remove useless values:
    sleeps = sleeps.filter( function(sleep) { return sleep.wake_time && sleep.sleep_time; } );

    // Calculate the trimmed mean sleep duration:
    var sleep_durations = [], day_durations = [], prev_wake_time = 0;
    sleeps.forEach( function(sleep) {
        if ( sleep.wake_time && sleep.sleep_time ) {
            sleep_durations.push( sleep.wake_time - sleep.sleep_time );
        }
        if ( sleep.wake_time && prev_wake_time ) {
            day_durations.push(sleep.wake_time - prev_wake_time);
        }
        prev_wake_time = sleep.wake_time;
    });
    var sleep_duration_stats   = calculate_stats(sleep_durations),
        day_duration_stats     = calculate_stats(day_durations),
        average_sleep_duration = sleep_duration_stats.trimmed_mean
    ;

    // add estimated times:
    sleeps.forEach( function(sleep) {
        if ( sleep.sleep_time ) {
            sleep.estimated_sleep_time = sleep.sleep_time;
            sleep.estimated_wake_time = sleep.wake_time || sleep.sleep_time + average_sleep_duration;
        } else {
            sleep.estimated_sleep_time = sleep.wake_time - average_sleep_duration;
        }
    });

    var suggested_day_lengths = null,
        target = this.target_timestamp(),
        day_length = this.data.preferredDayLength
    ;
    if ( sleeps.length && target && day_length ) {
        var latest_wake_time  = sleeps[sleeps.length-1].estimated_wake_time,
            latest_sleep_time = sleeps[sleeps.length-1].estimated_sleep_time;
        if ( target > latest_wake_time ) {
            var time_remaining = target - latest_wake_time,
                days_remaining = time_remaining / day_length
            ;
            suggested_day_lengths =
                [
                    Math.ceil (days_remaining),
                    Math.floor(days_remaining)
                ]
                .filter( function(days) { return days > 0; } )
                    .map(function(days) {
                        var day_length = time_remaining/days;
                        return {
                            days_remaining: days,
                            bed_time: latest_sleep_time+day_length,
                            day_length: day_length,
                        }
                    })
            ;
        }
    }

    return {
        sleeps                : sleeps,
        sleep_duration_stats  : sleep_duration_stats,
        day_duration_stats    : day_duration_stats,
        suggested_day_lengths : suggested_day_lengths,
    };

}

/**
 * Current target timestamp
 * @return {number|NaN} current target (or zero if no current target)
 *
 * @example
 *   var target = diary.target_timestamp();
 */
Diary.prototype.target_timestamp = function() {
    for ( var n=this.data.entries.length-1; n>=0; --n ) {
        if ( this.data.entries[n].event == this.event_string_to_id.RETARGET ) {
            return this.data.entries[n].related;
        }
    }
    return 0;
}

/**
 * Current sleep/wake mode
 * @return {number|NaN} ID of the most recent sleep/wake event (if present)
 *
 * @example
 *   switch ( diary.mode() ) {
 *     case diary.event_string_to_id.WAKE:
 *       console.log("user woke up more recently than going to sleep");
 *       break;
 *     case diary.event_string_to_id.SLEEP:
 *       console.log("user went to sleep more recently than waking up");
 *       break;
 *     default:
 *       console.log("user has not registered any wake or sleep events");
 *   }
 */
Diary.prototype.mode = function() {
    for ( var n=this.data.entries.length-1; n>=0; --n ) {
        if ( this.data.entries[n].event < 2 ) return this.data.entries[n].event;
    }
    return NaN;
}

/**
 * Update the diary with the specified events
 *
 * @param {string} update - serialised update object
 */
Diary.prototype.update = function(data) {
    var update = data_structures.diary_update_type.decode(base64_decode(data));
    if ( update.reset ) {
        this.data.entries.splice( 0, this.data.entries.length );
    }
    if ( update.entries ) {
        this.data.entries.splice.apply(
            this.data.entries,
            [ update.start, update.end ].concat(update.entries)
        );
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Diary;
}

// export this globally when loaded in a browser
try { window.Diary = Diary } catch (e) {};

})();
