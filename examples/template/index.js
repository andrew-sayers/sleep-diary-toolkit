/**
 * @file {One-line description of tool}
 * @author {Name} ({e-mail address})
 * @copyright {Year}
 * @license {name of license}
 */

// Fix annoying issues with specific web browsers:
browser_utils.fix_browser_issues();

/*
 * Use or delete the following examples in your program
 */

// Parse URL parameters:
var search_params = browser_utils.parse_search_params(location.search);

// Construct a diary from values stored in localStorage:
var diary = new Diary();

/*
 * To test your tool against real data,
 * paste the contents of a backup file in here:
 */
//var diary = new Diary("...");

// Construct higher-level data from raw diary events:
var analysed_diary = diary.analyse();


// print the contents of your diary:
document.getElementById('example-diary-contents').innerText
    = JSON.stringify(diary,null,' ');
// print the high-level representation of your diary:
document.getElementById('example-analysis-contents').innerText
    = JSON.stringify(analysed_diary,null,' ');
// print the URL parameters:
document.getElementById('example-url-parameters').innerText
    = JSON.stringify(search_params,null,' ');


// Call this after making a change that should persist between browser refreshes:
diary.save();
