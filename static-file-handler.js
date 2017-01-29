var fs = require('fs');

class StaticFileHandler {
    constructor(server) {
        server.use('GET', /^\/$/, (req, res, params) => this.getIndex(req, res, params));
        server.use('GET', /^\/(.*\.(js|html|css))$/, (req, res, params) => this.getFile(req, res, params));
    }

    // Get index.html
    getIndex(req, res, params) {
        return this._getFile('index.html', res);
    }

    // Get any static file
    getFile(req, res, params) {
        return this._getFile(params[0], res);
    }

    _getFile(filePath, res) {
        var fileStream = fs.createReadStream(`./public/${filePath}`);
        fileStream.pipe(res);
    }
}

module.exports = StaticFileHandler;
