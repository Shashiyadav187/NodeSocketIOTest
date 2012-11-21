## NodeSocketIOTest

This is a simple web page I whipped up using [node.js](http://nodejs.org/) and the [socket.io](http://socket.io/) library. The server pushes its current process information to the web browser once per second, and the browser displays it.

Here is how to set it up on a server and run it.  It is assumed that git, Node, and npm are already set up, and that the firewall will allow connections to port 3000.

    git clone https://github.com/kristopherjohnson/NodeSocketIOTest.git
    cd NodeSocketIOTest
    npm install          # If you get privilege errors, do 'sudo npm install' instead
    node app

Once the server is listening, visit http://localhost:3000/ from a local web browser.  To access it from a remote machine, substitute the appropriate hostname (e.g., http://example.com:3000/).

To run the server in the background, with output discarded, and leave it running after you log out, do this (assuming you are on a UNIX-ish system):

    nohup nice node app > /dev/null 2>&1 &