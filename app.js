const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// load config file

dotenv.config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);
connectDB();

const app = express();

// Body parser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Handlebars helpers

const {
  formatDate,
  truncate,
  select,
  stripTags,
  editIcon,
} = require("./helpers/hbs");

// Handle Bar
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      truncate,
      select,
      stripTags,
      editIcon,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Express session Middleware

app.use(
  session({
    secret: "Keyboardcat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static Folder

app.use(express.static(path.join(__dirname, "public")));
// Routes

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port:${PORT}`)
);
