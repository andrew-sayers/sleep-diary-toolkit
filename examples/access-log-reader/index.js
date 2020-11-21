#!/usr/bin/node

/*
 * Copyright (C) 2020 Andrew Sayers
 * See LICENSE.txt for license information.
 *
 * Node.js script to read diary updates from a log file
 */

const fs = require('fs');

const Diary = require("../../src/diary.js");

var help_required = false;
var analyse = false;
var format = 'JSON';
var files = process.argv
    .slice(2)
    .filter( arg => {
        switch ( arg ) {
        case '-h':
        case '--h':
        case '--he':
        case '--hel':
        case '--help':
            help_required = true;
            return false;
        case '-j':
        case '--j':
        case '--js':
        case '--jso':
        case '--json':
            format = 'JSON';
            return false;
        case '-c':
        case '--c':
        case '--cs':
        case '--csv':
            format = 'CSV';
            return false;
        case '-d':
        case '--d':
        case '--di':
        case '--dia':
        case '--diar':
        case '--diary':
            format = 'diary';
            return false;
        case '-a':
        case '--a':
        case '--an':
        case '--ana':
        case '--anal':
        case '--analy':
        case '--analys':
        case '--analyse':
            analyse = true;
            return false;
        default:
            help_required |= !fs.existsSync(arg);
            return true;
        };
    })
;

if ( help_required || !files.length ) {

    console.log( "Usage: " + process.argv[0] + " [--analyse] [--json|--csv|--diary] <log-files>" );

} else if ( analyse && format == 'diary' ) {

    console.log( "please choose one of --analyse or --diary" );

} else {

    var diary = new Diary("");

    files.forEach(
        file => {
            fs.readFileSync(file)
                .toString()
                .replace( /[&?]diary=([a-zA-Z0-9+/=]*)/g, (_,data) => diary.update(data) )
        }
    );

    switch ( format ) {
    case 'diary':
        console.log(diary.serialise());
        break;
    case 'JSON':
        if ( analyse ) {
            console.log(JSON.stringify(diary.analyse()));
        } else {
            console.log(diary.toJSON());
        }
        break;
    case 'CSV':
        if ( analyse ) {
            console.log(diary.toColumnsCalendar().map( row => row.join(',')+"\n" ).join(''));
        } else {
            console.log(diary.toColumns().map( row => row.join(',')+"\n" ).join(''));
        }
        break;
    }

}
