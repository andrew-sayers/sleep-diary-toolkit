# Sleep Diary Toolkit - Access Log Reader

Recreate a sleep diary from an access log.

The Sleep Diary Toolkit can send updates to a server.  Instead of
handling updates in real-time, you can just log the requests and
look for them in the log file.

This example script assumes your URL looks something like
`http://www.example.com/?diary=`, and will try to parse encoded data
after the `?diary=`.
