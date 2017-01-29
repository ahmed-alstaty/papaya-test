var EmployeeManager = require("./employee-manager.js");
class DepartmentManager {
    constructor(server) {
        this.departments = [];
        this.id = 1;
        // Register department handlers
        server.use('POST', /^\/department\?name=(.*)$/, (req, res, params) => this.handleNew(req, res, params));
        server.use('GET', /^\/departments$/, (req, res, params) => this.handleList(req, res, params));
        server.use('GET', /^\/department\/([\d*])$/, (req, res, params) => this.handleGet(req, res, params));
        server.use('DELETE', /^\/department\/([\d*])$/, (req, res, params) => this.handleDelete(req, res, params));
        server.use('POST', /^\/department\/([\d*])\?name=(.*)$/, (req, res, params) => this.handleUpdate(req, res, params));

        this.employeeManager = new EmployeeManager(server, /^\/department\/([\d*])\//);
    }

    // Add a new deprtmpent
    handleNew(req, res, params) {
        this.departments.push({ id: this.id, name: unescape(params[0]), employees: []});
        this.id++;
        res.write(JSON.stringify(this.departments[this.departments.length - 1]));
        res.end();
    }

    // Get a list of all deprtmpents
    handleList(req, res, params) {
        res.write(JSON.stringify(this.departments));
        res.end();
    }

    // Get a single department
    handleGet(req, res, params) {
        var department = this._getDepartment(params[0], res);
        if (!department) {
            return;
        }
        res.write(JSON.stringify(department));
        res.end();
    }

    // Delete a department
    handleDelete(req, res, params) {
        var department = this._getDepartment(params[0], res);
        if (!department) {
            return;
        }
        delete this.employeeManager.employees[params[0]];
        this.departments = this.departments.filter(dept => dept.id != department.id);
        res.end();
    }

    // Update a department
    handleUpdate(req, res, params) {
        var department = this._getDepartment(params[0], res);
        if (!department) {
            return;
        }
        this.departments = this.departments.map(dept => {
            return dept.id != department.id ? dept : { id: dept.id, name: unescape(params[1]) };
        });
        res.write(JSON.stringify(this.departments.find(dept => dept.id === department.id)));
        res.end();
    }

    // Find a department by its ID string
    _getDepartment(deparmentIdStr, res) {
        var departmentId = parseInt(deparmentIdStr);
        var department = this.departments.find(dept => dept.id === departmentId);
        if (!department) {
            res.writeHead(404, 'Not found');
            res.end()
            return null;
        }
        return department;
    }

}

module.exports = DepartmentManager;
