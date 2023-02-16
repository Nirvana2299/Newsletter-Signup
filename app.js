const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("ts-md5");
const { get } = require("request");
require('dotenv').config();

const audianceId = process.env.list_id;
const apiId = process.env.api_key

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"))

mailchimp.setConfig({
  apiKey: apiId,
  server: "us21",
});

app.post("/", (req, res) => {

  const email = req.body.email;
  const listId = audianceId;
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: email
  };


  const run = async () => {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",

        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log(error)
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", (req,res) => res.redirect("/"))

app.listen(process.env.PORT || 3000, () => console.log("initializing port 3000"));



// const subscriberHash = md5(email.toLowerCase()); 