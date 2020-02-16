const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("html-pdf");
const generateHTML = require("./generateHTML");

// initialize the object "data" - given to the generateHTML function as an argument
const data = {
  color: "",
  username: "",
  avatar_url: "",
  name: "",
  bio: "",
  location: "",
  html_url: "",
  blog: "",
  public_repos: 0,
  followers: 0,
  stars: 0,
  following: 0
}

// function "init"
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
        name: "username"
      }
    ])
    .then(async resPrompt => {
      // assign the data object properties
      data.color = resPrompt.color;
      data.username = resPrompt.username;

      const profileURL = `https://api.github.com/users/${data.username}`;
      const starURL = `https://api.github.com/users/${data.username}/starred`;

      await axios
      .get(profileURL)
      .then(resProfile => {
        // assign the data object properties
        data.avatar_url = resProfile.data.avatar_url;
        data.name = resProfile.data.name;
        data.bio = resProfile.data.bio;
        data.location = resProfile.data.location;
        data.html_url = resProfile.data.html_url;
        data.blog = resProfile.data.blog;
        data.public_repos = resProfile.data.public_repos;
        data.followers = resProfile.data.followers;
        data.following = resProfile.data.following;
      });

      await axios
      .get(starURL)
      .then(resStar => {
        // assign the data object property
        data.stars = resStar.data.length;
      });

      const html = await generateHTML.generateHTML(data);

      // const fs = require("fs");
      // const util = require("util");
      // const writeFileAsync = util.promisify(fs.writeFile);
      // await writeFileAsync("index.html", html, "utf8"); 
      
      pdf.create(html).toFile('./profile.pdf', function(err, resPDF) {
        if (err) return console.log(err);
        console.log(resPDF.filename, " successfully created!");
      });          
    })
  } catch(err) {
    console.log(err);
  }
}
// call the function "init"
init();