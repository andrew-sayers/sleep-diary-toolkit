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


/*
 * CONSTRUCT, CREATE AND LOAD DIARY OBJECTS
 */

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
    this.constructed_from_string = data !== undefined;

    /**
     * Queue of functions waiting to be sent to the server
     * @member {number}
     * @private
     */
    this.server_queue = [];

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
             * Do not access entries directly.  Use the diary functions provided.
             *
             * @member {diary_type}
             * @private
             *
             * @see server
             * @see preferred_day_length
             * @see entries
             * @see private_storage
             * @see add_entry
             * @see splice_entries
             */
            this.data = data_structures.diary_type.create({ entries: [] });
            return;
        }

    }

    if ( typeof data == 'string' || data instanceof String ) {

        // unwrap the Diary(""), if present:
        data = data.replace(/\n+$/,'').replace(/^Diary\(["'](.*)["']\)/,"$1");

        this.data = data_structures.diary_type.decode(base64_decode(data));

    } else {

        this.data = data_structures.entry_type.create(data);

    }

}

Diary.prototype._push_server_queue = function(callback) {
    this.server_queue.push(callback);
    if ( this.server_queue.length == 1 ) {
        callback.call(this);
    }
}
Diary.prototype._pop_server_queue = function() {
    this.server_queue.shift();
    if ( this.server_queue.length ) {
        this.server_queue[0].call(this);
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
 * Events that are natural opposites (e.g. "wake" and "sleep")
 * @memberof Diary
 * @public
 *
 * @example
 *   console.log(diary.inverse_of(diary.event_string_to_id["WAKE"])); // prints diary.event_string_to_id["SLEEP"]
 */
Diary.prototype.inverse_of = [];
Diary.prototype.inverse_of[Diary.prototype.event_string_to_id.WAKE ] = Diary.prototype.event_string_to_id.SLEEP;
Diary.prototype.inverse_of[Diary.prototype.event_string_to_id.SLEEP] = Diary.prototype.event_string_to_id.WAKE ;

/**
 * Convert a diary object to a string
 *
 * @memberof Diary
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
 * <p><tt>save_if_string</tt> resets the internal "constructed_from_string" flag, allowing this diary to be saved.</p>
 *
 * <p>During development, it is often useful to load example data from a string,
 * and test your save functionality without actually overwriting real data.
 * By default, this function will print a warning and refuse to save data constructed from a string.
 * The <tt>save_if_string</tt> argument overrides that behaviour.</p>
 *
 * @memberof Diary
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

        this.constructed_from_string = false;

        localStorage.setItem( 'diary:data', this.serialise() );

        if ( this.data.server ) {
            this._push_server_queue(function() {

                if ( this.data.serverEntriesSent < this.data.entries.length ) {

                    var self = this,
                        req = new XMLHttpRequest(),
                        length = this.data.entries.length - this.data.serverEntriesSent,
                        url
                    ;

                    for (;;) { // construct a URL short enough that all servers will accept it
                        url = this.data.server + encode(data_structures.diary_update_type,{
                            entries: this.data.entries.slice(self.data.serverEntriesSent,self.data.serverEntriesSent+length),
                            start  : self.data.serverEntriesSent - this.data.serverEntriesOffset,
                        });
                        if ( length == 1 || url.length <= 2048 ) break;
                        length = Math.ceil(length/2);
                    }

                    // save the data on the server:
                    req.onload = function(e) {
                        if ( req.status < 500 ) {
                            self.data.serverEntriesSent += length;
                            self._pop_server_queue();
                            self.save(save_if_string,success_callback,error_callback);
                        } else {
                            self._pop_server_queue();
                            if ( error_callback ) error_callback();
                        }
                    };
                    req.onerror = function(e) {
                        // ignore any requests sent while this request was in flight:
                        self._pop_server_queue();
                        if ( error_callback ) error_callback();
                    }
                    req.open( "GET", url );
                    req.send();

                } else {

                    this._pop_server_queue();

                }

            });

        } else if ( success_callback ) {

            success_callback();

        }

    }

}

/**
 * Update the diary with the specified events
 *
 * @memberof Diary
 *
 * @param {string} update - serialised update object
 */
Diary.prototype.update = function(data) {
    var update = data_structures.diary_update_type.decode(base64_decode(data));
    if ( update.reset ) {
        this.data.entries.splice( 0, this.data.entries.length );
    }
    this.data.entries.splice.apply(
        this.data.entries,
        [ update.start, update.delete_count ].concat(update.entries||[])
    );
}


/*
 * LOW-LEVEL MEMBER FUNCTIONS
 */

/**
 * Get/set the server that receives updates
 *
 * <p>Will call <tt>error_callback()</tt> if we need to notify the server but the request fails.</p>
 *
 * @memberof Diary
 *
 * @param {string=} server - URL of the server (empty or missing to disable the server)
 * @param {function=} success_callback - called when the update is complete
 * @param {function=} error_callback - called if the update fails
 * @return {string=} server that will receive updates
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
Diary.prototype.server = function( server, send_all_entries, success_callback, error_callback ) {
    if ( server === '' ) {
        delete this.data.server;
        this.data.serverEntriesSent = 0;
        this.data.serverEntriesOffset = 0;
        this.save(false,success_callback,error_callback);
    } else if ( server !== undefined ) {
        if ( server == this.data.server && ( !send_all_entries || this.data.serverEntriesOffset == 0 ) ) {
            if ( success_callback ) success_callback();
        } else {
            this._push_server_queue(function() {
                var self = this,
                    target = this.target_timestamp(),
                    entries = ( target && !send_all_entries ) ? [
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
                self.data.server = server;
                if ( !this.constructed_from_string ) {
                    localStorage.setItem( 'diary:data', this.serialise() );
                }
                // save the data on the server:
                req.onload = function(e) {
                    if ( req.status < 500 ) {
                        if ( send_all_entries ) {
                            self.data.serverEntriesSent = self.data.serverEntriesOffset = 0;
                        } else {
                            self.data.serverEntriesSent = self.data.entries.length;
                            self.data.serverEntriesOffset = self.data.entries.length - (target?1:0);
                        }
                        self._pop_server_queue();
                        self.save(false,success_callback,error_callback);
                    } else {
                        self._pop_server_queue();
                        if ( error_callback ) error_callback();
                    }
                };
                req.onerror = function() {
                    self._pop_server_queue();
                    if ( error_callback ) error_callback();
                }
                req.open( "GET", server + to_send );
                req.send();
            });
        }
    }
    return this.data.server;
}

/**
 * Get the list of entries
 *
 * If you want to replace the list of entries altogether, use other
 * functions that more clearly communicate what information you want
 * to send to the server.
 *
 * @see splice_entries
 * @see server
 *
 * @memberof Diary
 *
 * @readonly
 *
 * @return {Array.<Ientry_type>} entries
 */
Diary.prototype.entries = function() {
    return this.data.entries;
}

/**
 * Get/set the user's preferred day length
 *
 * @param {number=} day_length - new preferred day length
 * @return {number} preferred day length
 */
Diary.prototype.preferred_day_length = function(preferred_day_length) {
    if ( preferred_day_length !== undefined ) {
        this.data.preferredDayLength = preferred_day_length;
        if ( !this.constructed_from_string ) {
            localStorage.setItem( 'diary:data', this.serialise() );
        }
    }
    return (
        (typeof(this.data.preferredDayLength)=='number')
            ? this.data.preferredDayLength
            : parseInt(this.data.preferredDayLength,10)
    );
}

/**
 * Get/set the private storage object
 *
 * This is your private key/value store.  The toolkit itself
 * guarantees never to do anything with this data.
 *
 * @memberof Diary
 *
 * @param {Object=} private_storage - new private storage object
 * @return {number} private storage object
 */
Diary.prototype.private_storage = function(private_storage) {
    if ( private_storage !== undefined ) {
        this.data.privateStorage = private_storage;
        if ( !this.constructed_from_string ) {
            localStorage.setItem( 'diary:data', this.serialise() );
        }
    }
    return this.data.privateStorage;
}

/**
 * Get the offset between the first entry in our diary and the first entry on the server
 *
 * If you want to manipulate server-side data, use other functions
 * that more clearly communicate what information you want to send to
 * the server.
 *
 * @see splice_entries
 * @see server
 *
 * @memberof Diary
 *
 * @readonly
 *
 * @return {number} offset between the first entry in our diary and the first entry on the server
 */
Diary.prototype.server_entries_offset = function() {
    return this.data.serverEntriesOffset;
}

/**
 * Get the number of entries that have been successfully sent to the server
 *
 * If you want to manipulate server-side data, use other functions
 * that more clearly communicate what information you want to send to
 * the server.
 *
 * @see splice_entries
 * @see server
 *
 * @memberof Diary
 *
 * @readonly
 *
 * @return {number} number of entries that have been successfully sent to the server
 */
Diary.prototype.server_entries_sent = function() {
    return this.data.serverEntriesSent;
}

/*
 * HIGH-LEVEL ENTRY MANAGEMENT
 */

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
 * @memberof Diary
 *
 * @param {string|number} event - event to add
 * @param {number=} timestamp - time in milliseconds past the epoch
 * @param {number=} related - e.g. the target timestamp for RETARGETED
 * @param {string=} comment - text comment
 * @param {function=} success_callback - called when the update is complete
 * @param {function=} error_callback - called if the update fails
 *
 * @example
 *     // these two do the same thing:
 *     diary.add_entry("wake");
 *     diary.add_entry(0,new Date().getTime());
 */
Diary.prototype.add_entry = function(event,timestamp,related,comment,success_callback,error_callback) {

    this.data.entries.push(create_entry(event,timestamp,related,comment));
    this.save(false,success_callback,error_callback);

}

/**
 * Splice the list of entries
 *
 * Each value in the list of entries should be either an entry object,
 * or a list of arguments similar to those passed to add_entry()
 *
 * @memberof Diary
 *
 * @param {number} start - zero-based index at which to start
 * @param {number} delete_count - number of entries to remove
 * @param {Array[]} entries - entries to insert
 * @param {function=} success_callback - called when the splice is complete
 * @param {function=} error_callback - called if the splice fails
 *
 * @example
 *     diary.splice_entries(0,diary.data.entries.length); // delete all diary entries
 * @example
 *     diary.splice_entries(10,1,[['WAKE']]); // replace an existing entry
 */
Diary.prototype.splice_entries = function( start, delete_count, entries, success_callback, error_callback) {

    if ( entries ) {
        for ( var n=0; n!=entries.length; ++n ) {
            if ( Array.isArray(entries[n]) ) entries[n] = create_entry.apply(0,entries[n]);
        }
    } else {
        entries = [];
    }

    if ( this.data.server && start+delete_count > this.data.serverEntriesOffset ) {

        this._push_server_queue(function() {

            var self = this,
                send_offset = Math.max( 0, this.data.serverEntriesOffset - start ),
                to_send = encode(data_structures.diary_update_type,{
                    entries     : entries,
                    start       : start - this.data.serverEntriesOffset + send_offset,
                    delete_count: Math.max( 0, delete_count - send_offset ),
                }),
                req = new XMLHttpRequest()
            ;
            // save the data on the server:
            req.onload = function(e) {
                if ( req.status < 500 ) {
                    self.data.entries.splice.apply(
                        self.data.entries,
                        [ start, delete_count ].concat(entries)
                    );
                    if ( self.data.serverEntriesSent < start+delete_count ) self.data.serverEntriesSent = start+delete_count;
                    self._pop_server_queue();
                    self.save(false,success_callback,error_callback);
                } else {
                    self._pop_server_queue();
                    if ( error_callback ) error_callback();
                }
            };
            req.onerror = function() {
                self._pop_server_queue();
                if ( error_callback ) error_callback();
            };
            req.open( "GET", this.data.server + to_send );
            req.send();

        });

    } else {

        this.data.entries.splice.apply(
            this.data.entries,
            [ start, delete_count ].concat(entries)
        );
        this.save(false,success_callback,error_callback);

    }

}


/*
 * COMPUTED INFORMATION
 */


/**
 * Calculate sleep/wake periods
 *
 * <p>This function tries to account for common data entry issues.
 * For example, if a user normally has a 25 hour day, but appears to
 * have occasional 50 hour days, we assume they just forget to press
 * the button sometimes.</p>
 *
 * <p>This function also needs to balance the needs of two user
 * groups.  New users may start adding events before they register a
 * sleep or wake event, then expect to see graphs update based on that
 * data.  Whereas long-time users may find that early data causes
 * problems with their analyses.  We delete those early events once
 * the list of sleep/wake events is long enough that we don't expect
 * them to care any more.</p>
 *
 * <p>This function estimates the current "day number" associated with
 * each sleep/wake period.  This number may be useful for creating
 * graphs, but should not be relied upon for statistics.  For example,
 * people with polyphasic sleep might not have a meaningful concept of
 * days.  Day numbers usually increase by one at a time, but can
 * increase by two at a time if the user appears to have forgotten to
 * log sleep/wake events for a while.</p>
 *
 * <p>This function provides summary statistics for user's whole days,
 * and for the primary sleep period in each day.  Because real-world
 * data tends to be quite messy, the function provides several related
 * values:</p>
 *
 * <ul>
 *  <li>The <tt>recommended_average</tt> is the best guess at what the
 *      user would intuitively consider the average.  The exact
 *      calculation is chosen from the list below, and may change in
 *      future.  It is currently the <tt>trimmed_mean</tt>.  If you
 *      don't have any specific requirements, you should use this and
 *      ignore the others.</li>
 *  <li>The <tt>mean</tt> and <tt>standard_deviation</tt> are
 *      traditional summary statistics, but are not recommended
 *      because real-world data tends to skew these values higher than
 *      one would expect.</li>
 *  <li>The <tt>trimmed_mean</tt> and <tt>trimmed_standard_deviation</tt>
 *      produce more robust values in cases like ours, because they
 *      ignore the highest and lowest few records.
 *  <li>The <tt>median</tt> and <tt>interquartile_range</tt> produce
 *      more robust results, but tend to be less representative when
 *      there are only a few outliers in the data.
 * </ul>
 *
 * @memberof Diary
 *
 * @param {number=} minimum_date - only return periods that start at or after this date
 *
 * @return {Object[]} list of sleep/wake periods
 *
 * @example
 *     diary.sleep_wake_periods(); // returns something like the following:
 *     {
 *       records: [
 *         {
 *           // status is "awake" or "asleep" - two events with the same status can occur if the user forgot to log some data:
 *           status: "awake",
 *           // start and end time (in seconds past the Unix epoch), estimated if the user forgot to log some data:
 *           start_time: 12345678,
 *           end_time: 23456789,
 *           // raw diary entries for the start/end time, or null if the user forgot to log some data:
 *           start_entry: { ... },
 *           end_entry: { ... },
 *           // other diary entries that occurred during this period:
 *           mid_entries: { ... },
 *           // estimated duration of this period (see above):
 *           day_number: 1,
 *           // true if the current day number is greater than the previous period's day number:
 *           start_of_new_day: true,
 *           // target wake time, as of the end of this period
 *           target: ...,
 *           // this is set if it looks like the user forgot to log some data:
 *           missing_event_after: true
 *         },
 *         ...
 *       ],
 *       day_summary: {
 *         // number of milliseconds in the average biological day:
 *         trimmed_mean: 12345,
 *         // a day is usually within this many milliseconds of the mean:
 *         trimmed_standard_deviation: 12.34,
 *         // duration of each day, or undefined if the user forgot to log some data:
 *         records: [ 12344, undefined, 12346, ... ],
 *       },
 *       sleep_summary: {
 *         // number of milliseconds in the average primary sleep:
 *         trimmed_mean: 12345,
 *         // a primary sleep is usually within this many milliseconds of the mean:
 *         trimmed_standard_deviation: 12.34,
 *         // duration of each primary sleep, or undefined if the user forgot to log some data:
 *         records: [ 1233, undefined, 1235, ... ],
 *       },
 *
 */
Diary.prototype.sleep_wake_periods = function(minimum_date) {

    var one_hour = 60*60*1000, // constant value added for readability

        /*
         * We assume that some fraction of days are outliers (e.g. a long
         * supplementary sleep that got counted as a main sleep, or a pair
         * of days accidentally recorded as a single day).
         *
         * Trimming a certain percentage of days should solve that problem
         * for most people.
         */
        trim_amount = 8/10,

        /*
         * Users will occasionally press a button twice, or will press
         * the wrong button and cancel it by pressing another button.
         *
         * If the user presses the button several times within this
         * amount of time, we assume it was just a misclick.
         */
        dupe_duration = 30000,

        /*
         * A user is considered a long-time user once they have
         * generated more than this many sleep/wake periods.
         */
        maximum_new_user_length = 14,

        /*
         * If we see adjacent "sleep" and "wake" events, we normally
         * assume they're related.  But it could just be the user
         * forgot to press the sleep/wake button some times in
         * between.
         *
         * We assume two events are unrelated if they are farther
         * apart than the following values.
         */
        maximum_sleep_duration = 15*one_hour,
        maximum_wake_duration = 30*one_hour,

        /*
         * We calculate day numbers by looking for "wake" events
         * at least this far apart.  We calculate skipped days
         * by looking for "wake" events at least twice as far
         * apart as this
         */
        minimum_day_duration = 20*one_hour,

        self = this,

        records = [{
            status: "awake",
            start_entry: null,
            end_entry: null,
            mid_entries: [],
            target: 0,
        }],

        /*
         * Remove entries that look like accidental extra clicks
         */
        dupe_timestamp = NaN,
        dupe_event = NaN,

        day_start = 0,
        day_number = 0,

        day_durations = [],
        sleep_durations = [],
        day_summary,
        sleep_summary,

        timestamp
    ;

    this.data.entries

        // remove duplicate entries
        .slice(0).sort(function(a,b) { return b.timestamp - a.timestamp })
        .filter(function(entry) {
            var ret = (
                entry.timestamp < dupe_timestamp ||
                ( entry.event != dupe_event && self.inverse_of[entry.event] != dupe_event )
            );
            dupe_timestamp = entry.timestamp - dupe_duration;
            dupe_event = entry.event;
            return ret;
        })

        // build the initial sleep-wake cycle:
        .reverse()
        .forEach(function(entry) {
            /*
             * NodeJS treats the time as an object of type "Long":
             */
            timestamp
                = (typeof(entry.timestamp)=='number')
                ? entry.timestamp
                : parseInt(entry.timestamp,10)
            ;
            if ( timestamp >= (minimum_date||0) ) {
                if ( entry.event == self.event_string_to_id.WAKE ) {
                    records.push({
                        status: "awake",
                        start_time: timestamp,
                        start_entry: entry,
                        end_entry: null,
                        mid_entries: [],
                        target: records[records.length-1].target,
                    });
                } else if ( entry.event == self.event_string_to_id.SLEEP ) {
                    records.push({
                        status: "asleep",
                        start_time: timestamp,
                        start_entry: entry,
                        end_entry: null,
                        mid_entries: [],
                        target: records[records.length-1].target,
                    });
                } else {
                    if ( entry.event == self.event_string_to_id.RETARGET ) {
                        records[records.length-1].target
                            = (typeof(entry.related)=='number')
                            ? entry.related
                            : parseInt(entry.related,10)
                        ;
                    }
                    records[records.length-1].mid_entries.push(entry);
                }
            }
        })
    ;

    /*
     * Tidy up the first few events as best we can.
     *
     * See the discussion in the function description.
     */
    if ( !records[0].mid_entries.length || records.length > maximum_new_user_length ) {
        records.shift();
    } else if ( records.length > 1 ) {
        records[0].status = ( records[1].status == 'asleep' ) ? 'awake' : 'asleep';
        records[0].is_first_event = true;
    }

    /*
     * Calculate extra information
     */
    for ( var n=0; n!=records.length; ++n ) {

        var current = records[n],
            next    = records[n+1];

        // track day numbers:
        if ( current.status == 'awake' && current.start_time > day_start + minimum_day_duration ) {
            ++day_number;
            if ( current.start_time > day_start + minimum_day_duration*2 ) {
                // assume we skipped a day
                ++day_number;
            } else {
                day_durations[day_number] = current.start_time - day_start;
            }
            day_start = current.start_time;
            current.start_of_new_day = true;
        }
        current.day_number = day_number;

        // set end_time, end_entry and missing_event_after:
        if ( next ) {
            if ( current.status == 'asleep' ) {
                if ( next.status == 'asleep' ) {
                    current.missing_event_after = true;
                    current.end_time = Math.min( next.start_time, current.start_time+maximum_sleep_duration );
                } else if ( next.start_time < current.start_time + maximum_sleep_duration ) {
                    current.end_time = next.start_time;
                    current.end_entry = next.start_entry;
                    sleep_durations[day_number] = Math.max( sleep_durations[day_number]||0, next.start_time - current.start_time );
                } else {
                    current.end_time = current.start_time+maximum_sleep_duration;
                }
            } else {
                if ( next.status == 'awake' ) {
                    current.missing_event_after = true;
                    current.end_time = Math.min( next.start_time, current.start_time+maximum_wake_duration );
                } else if ( next.start_time < current.start_time + maximum_wake_duration ) {
                    current.end_time = next.start_time;
                    current.end_entry = next.start_entry;
                } else {
                    current.end_time = current.start_time+maximum_wake_duration;
                }
            }
        }

    }

    /*
     * Summary statistics for a set of numbers:
     * 1. trim the numbers based on trim_amount
     * 2. calculate the mean of the trimmed subset
     * 3. calculate the standard deviation of the trimmed subset
     */
    function summary_statistics(records) {

        function a_plus_b (a,b) { return a+b; }
        function a_minus_b(a,b) { return a-b; }

        var ret = {
            records: records,
        }, n;

        if ( !records.length ) return ret;

        // Calculate the normal mean and standard deviation:
        var total_records = 0;
        ret.mean = records.reduce(a_plus_b);
        ret.standard_deviation = 0;
        for ( n=0; n!=records.length; ++n ) {
            if ( records[n] ) {
                ++total_records;
                ret.standard_deviation += Math.pow(records[n] - ret.mean, 2);
            }
        }
        ret.mean /= total_records;
        ret.standard_deviation = Math.sqrt( ret.standard_deviation / total_records );

        // Calculate the median and IQR:
        var sorted =
            records
            .filter(function(a) { return a; })
            .sort(a_minus_b)
        ;
        ret.median = sorted[Math.floor(sorted.length/2)];
        ret.interquartile_range = (
                sorted[Math.ceil((sorted.length-1)*0.75)] -
                sorted[Math.ceil((sorted.length-1)*0.25)]
        );

        // Calculate the trimmed mean and standard deviation:
        var trimmed = sorted.slice(
            Math.floor((sorted.length-1)*(1-trim_amount)    ),
            Math.ceil ((sorted.length-1)*(  trim_amount) + 1)
        );
        if ( trimmed.length ) {
            // calculate trimmed mean and standard deviation:
            ret.trimmed_mean = trimmed.reduce(a_plus_b) / trimmed.length;
            ret.trimmed_standard_deviation = 0;
            for ( n=0; n!=trimmed.length; ++n ) ret.trimmed_standard_deviation += Math.pow(trimmed[n] - ret.trimmed_mean, 2);
            ret.trimmed_standard_deviation = Math.sqrt( ret.trimmed_standard_deviation / trimmed.length );
        }

        return ret;

    }

    day_summary = summary_statistics(day_durations);
    sleep_summary = summary_statistics(sleep_durations);

    day_summary.recommended_average = day_summary.mean;
    sleep_summary.recommended_average = sleep_summary.trimmed_mean;

    return {
        records: records,
        day_summary: day_summary,
        sleep_summary: sleep_summary,
    };

}

/**
 * Calculate suggested day lengths
 *
 * <p>If a user has specified a preferred day length and a target wake
 * time, we can suggest possible bed times based on the number of days
 * between now and then.  Otherwise, we calculate a likely bed time
 * based on recent data</p>
 *
 * <p>This function will normally return an array with two elements
 * (indicating "early" and "late" bed times).  It will return an array
 * with one element if it was only able to generate one
 * recommendation.  And it will return <tt>undefined</tt> if no bed
 * time could be calculated.</p>
 *
 * @memberof Diary
 *
 * @return {Object[]|undefined} list of sleep/wake periods
 *
 * @example
 *     diary.suggested_day_lengths(); // returns something like the following:
 *     [
 *       {
 *         bed_time: 123456789, // recommended time the user should next go to bed
 *         day_length: 1234567, // number of milliseconds in a user's biological day
 *         days_remaining: 123, // number of day_length's until the target
 *       },
 *       // there may also be a second record with the same structure
 *     ]
 *
 */
Diary.prototype.suggested_day_lengths = function() {

    var sleep_wake_periods = this.sleep_wake_periods(new Date().getTime() - 180*24*60*60*1000),
        records = sleep_wake_periods.records,
        target = this.target_timestamp(),
        day_length = this.preferred_day_length() || sleep_wake_periods.day_summary.recommended_average,
        sleep_duration = sleep_wake_periods.sleep_summary.recommended_average,
        latest_time,
        n
    ;

    if ( !target && !day_length ) return undefined;

    if ( !records.length ) {
        // new user has not yet created a "wake" event:
        latest_time = new Date();
        if ( target <= latest_time ) return undefined;
        return [{
            days_remaining: Math.floor( target - latest_time ),
            bed_time: latest_time + ( ( target - latest_time ) % day_length ) - sleep_duration,
            day_length: day_length,
        }];
    }

    latest_time = (
        records[records.length-1].start_time +
        ( ( records[records.length-1].status == 'asleep' ) ? sleep_duration : 0 )
    );

    if ( !target ) {
        if ( day_length ) {
            return [{
                bed_time: latest_time + day_length - sleep_duration,
                day_length: day_length,
            }];
        } else {
            return undefined;
        }
    }


    if ( target <= latest_time ) return undefined;
    var time_remaining = target - latest_time,
        days_remaining = time_remaining / day_length,
        ret = []
    ;
    for ( var days = Math.floor(days_remaining); days <= Math.ceil(days_remaining); ++days ) {
        if ( days > 0 ) {
            var day_length = time_remaining/days;
            ret.push({
                days_remaining: days,
                bed_time: latest_time + day_length - sleep_duration,
                day_length: day_length,
            });
        }
    }
    return ret.length ? ret : undefined;

}



/**
 * Current target timestamp
 *
 * @memberof Diary
 *
 * @return {number|NaN} current target (or zero if no current target)
 *
 * @example
 *   var target = diary.target_timestamp();
 */
Diary.prototype.target_timestamp = function() {
    for ( var n=this.data.entries.length-1; n>=0; --n ) {
        if ( this.data.entries[n].event == this.event_string_to_id.RETARGET ) {
            return (
                (typeof(this.data.entries[n].related)=='number')
                ? this.data.entries[n].related
                : parseInt(this.data.entries[n].related,10)
            );
        }
    }
    return 0;
}

/**
 * Current sleep/wake mode
 *
 * @memberof Diary
 *
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

/*
 * EXPORT FORMATS
 */

/**
 * Get a JSON string of the diary
 * @memberof Diary
 * @return {string}
 */
Diary.prototype.toJSON = function() {
    return JSON.stringify(this.data.toJSON());
}

/**
 * Get a list of columns describing the diary entries
 * @memberof Diary
 * @return {Array[]}
 */
Diary.prototype.toColumns = function() {
    var ret = [
        ["time","event","related time","comment"]
    ];
    this.data.entries.forEach( function(entry) {
        ret.push([
            entry.timestamp,
            event_id_to_string[entry.event],
            entry.related||'',
            entry.comment||''
        ]);
    });
    return ret;
}

/**
 * Get a list of columns describing the analysed diary
 * @memberof Diary
 * @return {Array[]}
 */
Diary.prototype.toColumnsCalendar = function() {
    var ret = [
        ["Status","Start time","End time","Is the end time accurate?"]
    ];
    this.sleep_wake_periods().records.forEach(function(record) {
        ret.push([
            record.status,
            record.start_time,
            record.end_time||'',
            record.end_entry?'YES':'NO'
        ]);
    });
    return ret;
}

/*
 * EXPORT THE CLASS
 */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Diary;
}

// export this globally when loaded in a browser
try { window.Diary = Diary } catch (e) {};

})();
