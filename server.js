const http = require('http');

const DepartmentManager = require('./department-manager');
const StaticFileHandler = require('./static-file-handler');

class Server {
    constructor (port) {
        this.port = port;
        this.handlers = [];
    }

    use(method, path, callback) {
        if (!(path instanceof RegExp)) {
            throw('path must be a RegExp');
        }
        if (['GET', 'POST', 'DELETE'].indexOf(method) === -1){
            throw(`Unsupported method: ${method}`);
        }
        this.handlers.push({method, path, callback});
    }

    start() {
        this.httpServer = http.createServer((req, res) => {            
            var handler = this.handlers.find(tmpHandler => 
            {                
                var parsedPath = tmpHandler.path.exec(req.url);               
                return parsedPath && tmpHandler.method === req.method;
            });
            if (!handler) {
                res.writeHead(404, 'Not found');
                res.end()
                return;
            }            
            var parsedPath = handler.path.exec(req.url);
            handler.callback(req, res, parsedPath.slice(1, parsedPath.length));
        });
        return this.httpServer.listen(this.port);
    }
}

var server = new Server(8000);
var departmentManager = new DepartmentManager(server);
var staticFileHanler = new StaticFileHandler(server);
server.start();
