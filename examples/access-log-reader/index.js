#!/usr/bin/node

/*
 * Copyright (C) 2020 Andrew Sayers
 * See LICENSE.txt for license information.
 *
 * Node.js script to read diary updates from a log file
 */

if ( process.argv.length > 2 ) {

    const fs = require('fs');
    const Diary = require("../../src/diary.js");

    var diary = new Diary();

    process.argv
        .slice(2)
        .forEach(
            file => {
                fs.readFileSync(file)
                    .toString()
                    .replace( /^[&?]diary=([a-zA-Z0-9+/=]*)/, (_,data) => diary.update(data) )
            }
        );

    console.log(diary.analyse());

} else {

    console.log( "Usage: " + process.argv[0] + " <log-files>" );

}
