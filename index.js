import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const blogFilePath = path.join(__dirname, "blog.json");

// Initialize blog variable (empty initially)
let blog = "";

// Middleware to serve static files
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const loadBlog = () => {
  if (fs.existsSync(blogFilePath)) {
    const fileContent = fs.readFileSync(blogFilePath, "utf-8");
    blog = fileContent ? JSON.parse(fileContent).blog : "";
  }
};

const saveBlog = (blogContent) => {
  const blogData = JSON.stringify({ blog: blogContent });
  fs.writeFileSync(blogFilePath, blogData, "utf-8");
};

app.get("/", (req, res) => {
  loadBlog(); // Ensure we load the latest blog content
  res.render("index.ejs", { blog: blog });
});

app.get("/write", (req, res) => {
  res.render("writeBlog.ejs");
});

app.post("/submit", (req, res) => {
  blog = req.body["blog"]; 
  console.log("Blog Content:", blog);
  
  saveBlog(blog);

  res.redirect("/myBlog"); 
});

app.get("/myBlog", (req, res) => {
  loadBlog();
  res.render("myBlog.ejs", { blog: blog });
});

app.post("/reset", (req, res) => {
  blog = "";
  console.log("Blog content reset successfully!");
  saveBlog(blog); // Save the empty blog to the file

  res.render("myBlog.ejs", { blog: blog });
});

/* Start the server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
