// Get the list of departments when loading
$(document).ready(function () {
    $.get('/departments')
        .done(function (data) {
            var departments = JSON.parse(data);
            departments.forEach(function (department) {
                addDepartmentItem(department);
            });           
        });
});

// Add a department
function addDepartment() {
    var newDepartmentName = $('#new-department').val();
    $.post('/department?name=' + newDepartmentName)
        .done(function (data) {
            addDepartmentItem(JSON.parse(data));
        });
}

// Add an employee
function addEmployee(departmentId) {
    var newEmployeeName = $('#department-' + departmentId + ' .employee-name').val();
    var newEmployeeImage = $('#department-' + departmentId + ' .employee-image').val();
    var newEmployeeEmail = $('#department-' + departmentId + ' .employee-email').val();
    //var departmentId = $("#employeesBlock").attr("data-department-id");
    $.post('/department/'+departmentId+'/employee/?name=' + newEmployeeName + '&image_url=' + newEmployeeImage+'&email=' + newEmployeeEmail)
        .done(function (data) {
            addEmployeeItem(JSON.parse(data),departmentId);
        });
}

// Delete a department
function deleteDepartment(departmentId) {
    $.ajax({
        url: '/department/' + departmentId,
        type: 'DELETE'
    })
        .done(function () {
            $('#department-' + departmentId).remove();
        });
}

// Delete a department
function deleteEmployee(employeeId,departmentId) {
    $.ajax({
        url: '/department/' + departmentId + '/employee/' + employeeId,
        type: 'DELETE'
    })
        .done(function () {
            $('#employee-' + employeeId).remove();
        });
}

// list Employees for specific department
function listEmployees(departmentId) {
    $.get('/department/' + departmentId + '/employees')
        .done(function (data) {
            console.log("here");
            //$('#departmentsBlock').hide().addClass('hidden');
            $('#department-' + departmentId + ' .employeesBlock').show().removeClass('hidden');
            $("#department-" + departmentId +"-employees").html('<h1>Employees list</h1>');
            var employees = JSON.parse(data);
            if(!employees || employees.length == 0){
                $("#department-" + departmentId +"-employees").html('<h1>Employees list</h1><span style="margin-left: 10px;">&nbsp;&nbsp; No Available Employees </span>');
            }
            employees.forEach(function (employee) {
                addEmployeeItem(employee,departmentId);
            });           
        });
}

// Add a employee to the departments list
function addEmployeeItem(employee, departmentId) {
    var employeeItem = '<li class="employeeItem" id="employee-' + employee.id + '">Id: ' + employee.id + '&nbspName: ' + 
        '<input type="text" class="employeeName" value="' + employee.name + '">'+
        '<input type="text" class="employeeImage" value="' + employee.image_url + '">'+
        '<input type="text" class="employeeEmail" value="' + employee.email + '">'+
        '&nbsp<button class="deleteBtn">delete</button>' +
        '</li>';
    console.log("here again");
    //'heading' + department.id + ' #employeesBlock'
    console.log(departmentId);
    //console.log("#department-" + departmentId +"-employees");
    $("#department-" + departmentId +"-employees").append(employeeItem);
    //$('#employees').append(employeeItem);
    // Handle onClick for the delete button
    $('#employee-' + employee.id + " .deleteBtn").click(deleteEmployee.bind(null, employee.id,departmentId));
    // Handle department name change
    $('#employee-' + employee.id + " input").keyup(function() {
        //var departmentId = $("#employeesBlock").attr("data-department-id");
        var employeeName = $(this).parent().find('.employeeName').val();
        var employeeImage = $(this).parent().find('.employeeImage').val();
        var employeeEmail = $(this).parent().find('.employeeEmail').val();
        onEmployeeChange(departmentId,employee.id, employeeName,employeeImage,employeeEmail)
    });
}

// Create a debounced version of update
var debouncedUpdate = debounce(250, updateDepartment);
function onDepartmentChange(departmentId, departmentName) {    
    // Handle department change
    debouncedUpdate(departmentId, departmentName);
}

var debouncedEmployeeUpdate = debounce(250, updateEmployee);
function onEmployeeChange(departmentId,employeeId, employeeName, employeeImageURL, employeeEmail) {    
    // Handle department change
    debouncedEmployeeUpdate(departmentId, employeeId, employeeName, employeeImageURL, employeeEmail);
}

// Update a department
function updateDepartment(departmentId, departmentName) {
    $.post('/department/' + departmentId + '?name=' + departmentName);
}

// Update an employee
function updateEmployee(departmentId, employeeId, employeeName, employeeImageURL, employeeEmail) {
    $.post('/department/' + departmentId + '/employee/'+employeeId+'/?name=' + employeeName + '&image_url=' + employeeImageURL+'&email=' + employeeEmail);
}

// Add a department to the departments list
function addDepartmentItem(department) {
    var departmentHeader = '<div class="panel-heading" role="tab" id="heading' + department.id + '">'+
        '<h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#departments" href="#collapse'+department.id+'" aria-expanded="false" aria-controls="collapse'+department.id+'">'+department.name+'</a>'+
      '</h4>'+
    '</div>';
    var employeesSection = '<div class="employeesBlock" data-department-id="">'+
        '<label>Add employee'+
            '<input class="employee-name" type="text">'+
            '<input class="employee-image" type="text">'+
            '<input class="employee-email" type="text">'+
        '</label>'+
        '<button onClick="addEmployee('+ department.id +')">Add</button>'+
    '</div>';
    var departmentItem = '<div class="panel-body" id="department-' + department.id + '">Id: ' + department.id + '&nbspName: ' + 
        '<input type="text" value="' + department.name + '">'+
        '&nbsp<button class="deleteBtn">delete</button><button class="employeesBtn">employees</button>' +
        '<ul id="employees">'+
        employeesSection +
        '</ul>'+
        '<div id="department-' + department.id + '-employees"></div>'+
        '</div>';
    
    var contentHolder = '<div id="collapse'+department.id+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + department.id + '">' + departmentItem + '</div>';
    var html = '<div class="panel panel-default">'+departmentHeader + contentHolder +'</div>';
    $('#departments').append(html);
    // Handle onClick for the delete button
    $('#department-' + department.id + " .deleteBtn").click(deleteDepartment.bind(null, department.id));
    // Handle onClick for employees button
    $('#department-' + department.id + " .employeesBtn").click(listEmployees.bind(null, department.id));
    // Handle department name change
    $('#department-' + department.id + " input").keyup(function() {
        onDepartmentChange(department.id, this.value)
    });
}

// Debounce a function
function debounce(wait, func) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };       
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};