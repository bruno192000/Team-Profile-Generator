const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

const employeeList = [];


const questions = [
    {
        type: "input",
        name: "name",
        message: "Write employee name:"
    },
    {
        type: "input",
        name: "id",
        message: "Write employee ID number:"
    },
    {
        type: "input",
        name: "email",
        message: "Write employee e-mail address:"
    },
    {
        type: "list",
        name: "role",
        message: "Employee's role in the team:",
        choices: [{
            name: "Manager"
        },
        {
            name: "Engineer"
        },
        {
            name: "Intern"
        }]
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Write manager's office number:",
        when: function(answers){
            return answers.role === "Manager";
        }
    },
    {
        type: "input",
        name: "github",
        message: "Write engineer's github username:",
        when: function(answers){
            return answers.role === "Engineer";
        }
    },
    {
        type: "input",
        name: "school",
        message: "Name of the school:",
        when: function(answers){
            return answers.role === "Intern";
        }
    }
];
function promptUser() {

   inquirer.prompt(questions).then(function(response) {
       if (response.role === "Manager") {
           const newManager = new Manager(response.name, response.id, response.email, response.officeNumber);
           employeeList.push(newManager);
       }
       else if (response.role === "Engineer") {
           const newEngineer = new Engineer(response.name, response.id, response.email, response.github);
           employeeList.push(newEngineer);
       }
       else if (response.role === "Intern") {
           const newIntern = new Intern(response.name, response.id, response.email, response.school);
           employeeList.push(newIntern);
       }
       newEmployee();
   });
};

function newEmployee() {
    inquirer.prompt([
        {
            type:"confirm",
            name:"newEmployee",
            message:"Add another employee?",
            default:true
        }
    ]).then(function(answers) {
        if (answers.newEmployee) {
            promptUser();
        }
        else {
            const html = render(employeeList);
            fs.writeFile(outputPath, html, function(err) {
                if (err) throw err;
            })
        }
    })
}

promptUser();