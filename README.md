# Sleep Diary Toolkit

This is an early alpha release of a library to create applications that manage a sleep diary.  Depending on where you are viewing this, you may be able to see some example applications:

* [Sleep Diary Logger](../sleep-diary-logger/) - a simple sleep/wake logger
* [Sleep Diary Menu](../sleep-diary-menu/) - a menu system for viewing and configuring a diary

By default, this toolkit only stores your diary in your browser, so your data will be removed whenever you clear site data.  Your data will also be not be available in other browsers, on other sites, or in web pages hosted on your local filesystem.  You can transfer data around with the _backup_ and _restore_ functions in the menu system, and you can notify a server about updates with the _online backup_ feature.

Most browsers require you to allow cookies in order for this site to work.  This site actually uses [web storage](https://en.wikipedia.org/wiki/Web_storage), which is a more private alternative to cookies.

# Getting Started

## Production use (in a browser)

This library is available as a single file for production use.  Include [sleep-diary-toolkit.min.js](sleep-diary-toolkit.min.js) in your project directory, then do:

    <script src="sleep-diary-toolkit.min.js">
    <script>
      console.log(new Diary());
      console.log(browser_utils)
    </script>

## Production use (in node.js)

This library requires `protobufjs`.  Download this repository, then do:

    npm install -g protobufjs
    node -e 'console.log(require("/path/to/repository/src/diary.js"))'

## Accessing data in other languages

When you create a backup file or configure an online backup, the toolkit encodes the data using [protocol buffers](https://developers.google.com/protocol-buffers).  You can load that data in any language that supports protocol buffers.  Here are the steps to decode the data:

1. decide which type of data is represented
   * `diary_type` objects usually begin with `Diary("` and end with `")`
   * online backup requests are always `diary_update_type` objects
   * `entry_type` objects are only sent as part of another object
2. if the data was wrapped in `Diary("...")`, remove the wrapping
3. [base64](https://en.wikipedia.org/wiki/Base64)-decode the data
4. pass the decoded data to your library

# Sending updates to a server

As well as saving data in your browser, the toolkit can send regular updates to a server.  This server will know when you wake up and go to sleep, so you should only use this with a server you trust.

Developers can set the server with the [server() function in diary.js](src/diary.js).  Or you can use the <em>online backup</em> option in the [Sleep Diary Menu](../sleep-diary-menu/) app.

Once configured, the toolkit will send GET requests to the specified URL.  The requests will have base-64 encoded [diary update protocol buffers](data_structures/diary_update_type.proto) appended to the URL.  If the browser can't connect to the server, or the server responds with a code <tt>500</tt> or higher, the toolkit will send the information again later.

Traditionally, servers handle this type of request by passing the data directly to a program.  But the toolkit doesn't differentiate between a CGI script returning a <tt>200 OK</tt> response and a server sending a <tt>404 Not Found</tt> response.  So you might prefer to simply point the toolkit at an unconfigured URL, then occasionally run a program to extract those requests from the server's access log.  See the [the access log reader example](examples/access-log-reader/).

# Developing the toolkit itself

If you want to modify the library, it can be useful to test your changes in a browser before recompiling.

    <script src="https://cdn.rawgit.com/dcodeIO/protobuf.js/v6.10.1/dist/minimal/protobuf.min.js"></script>
    <script src="src/data_structures.js"></script>
    <script src="src/browser_utils.js"></script>
    <script src="src/diary.js"></script>
    <script>
      console.log(new Diary());
      console.log(browser_utils)
    </script>

It is recommended to build the toolkit with [Docker](https://www.docker.com/) or a compatible equivalent.  Once you have installed Docker, run the following commands:

    # Go to the directory this file is in:
    cd .../sleep-diary-toolkit

    # First time only: create the build envirnoment:
    docker build -t sleep-diary-toolkit .

    # Build the project:
    docker run --rm -v "$PWD":/sleep-diary-toolkit sleep-diary-toolkit

This will create a build environment that runs the [Makefile](Makefile) in a repeatable way.  The Makefile might run on your system without Docker, but is likely to produce different results.

# Data Structures

## Private Fields

You are welcome to extend this format locally, but you need to manage the risk that the public protocol is later updated in a way that's incompatible with your changes.  Here are some recommended solutions.

Use the "private storage" field as a key/value store for things you don't expect to ever publicly release.  Here is a simple Javascript example:

    diary.data.privateStorage.my_key = "my value";
    diary.save();

The public version of this file will never put any specific requirements on this field, so you can safely use it however you like.

If you are developing something that might go public in the future, assign your field a value between `10000` and `11000`.  The public version of this file will never include a field with a value in that range.  If and when your change goes public, it will be assigned a new field number in the normal range.
