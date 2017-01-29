class EmployeeManager {
    constructor(server, base_path) {
        this.employees = {};
        this.id = 1;
        
        // Register employee handlers
        server.use('POST', new RegExp(base_path.source + 'employee/\\?name=(.*)&image_url=(.*)&email=(.*)$'), (req, res, params) => this.handleNew(req, res, params));
        server.use('GET', new RegExp(base_path.source + 'employees$'), (req, res, params) => this.handleList(req, res, params));
        server.use('DELETE', new RegExp(base_path.source + 'employee/([\\d*])$'), (req, res, params) => this.handleDelete(req, res, params));
        server.use('POST', new RegExp(base_path.source + 'employee/([\\d*])/\\?name=(.*)&image_url=(.*)&email=(.*)$'), (req, res, params) => this.handleUpdate(req, res, params));
    }

    // Add a new employee
    handleNew(req, res, params) {
        var departmentId = params[0];
        if (!this.employees[departmentId]) {
            this.employees[departmentId] = [];
        }

        var emp = { id: this.id, name: unescape(params[1]),image_url: unescape(params[2]),email: unescape(params[3])};
        this.employees[departmentId].push(emp);
        this.id++;
        res.write(JSON.stringify(emp));
        res.end();
    }

    handleList(req, res, params){
        var departmentId = params[0];
        res.write(JSON.stringify(this.employees[departmentId] || []));
        res.end();
    }

    // Delete an employee
    handleDelete(req, res, params) {
        var departmentId = params[0];
        var employee = this._getEmployee(departmentId, params[1], res);
        if (!employee) {
            return;
        }
        this.employees[departmentId] = this.employees[departmentId].filter(emp => emp.id != employee.id);
        res.end();
    }

    // Find an employee by its ID string
    _getEmployee(departmentId, employeeIdStr, res) {
        var employeeId = parseInt(employeeIdStr);
        var employee = this.employees[departmentId].find(emp => emp.id === employeeId);
        if (!employee) {
            res.writeHead(404, 'Not found');
            res.end()
            return null;
        }
        return employee;
    }

    // Update an employee
    handleUpdate(req, res, params) {
        var departmentId = params[0];
        var employee = this._getEmployee(departmentId, params[1], res);
        if (!employee) {
            return;
        }
        this.employees[departmentId] = this.employees[departmentId].map(emp => {
            return emp.id != employee.id ? emp : { id: emp.id, name: unescape(params[2]),image_url: unescape(params[3]),email: unescape(params[4]) };
        });
        res.write(JSON.stringify(this.employees[departmentId].find(emp => emp.id === employee.id)));
        res.end();
    }
}

module.exports = EmployeeManager;
