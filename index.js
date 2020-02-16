var pdf = require("html-pdf");
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML");

const readFileSync = util.promisify(fs.readFileSync);
const writeFileAsync = util.promisify(fs.writeFile);

function writeToFile(fileName, data) {
 
}

async function init() {
  try {
    await inquirer
    .prompt([
      {
        type: "list",
        message: "Choose your favorite color.",
        choices: ["green", "blue", "pink", "red"],
        name: "color"
      },
      {
        type: "input",
        message: "Enter your GitHub ID.",
        name: "gitHub"
      }
    ])
    .then(async res => {
      const html = await generateHTML.generateHTML(res);
      // const options = { format: 'Letter' };
      pdf.create(html).toFile('./profile.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res.filename, " successfully created!");
      });       
    })
  } catch(err) {
    console.log(err);
  }
}

init();