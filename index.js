const express = require("express");
const  https  = require("https");
const APIurl = 'https://s3.amazonaws.com/open-to-cors/assignment.json';
const ejs = require("ejs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

const ProductData = async () => {
  return new Promise((resolve, reject) => {
    https.get(APIurl, (res) => {
        let data = '';
        res.on('data', (ref) => { data =data+ ref });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData.products);
            } catch (err) {
                reject(err);
            };
            });
    });
  });
};

const sortByPopularity = (products) => {
  return Object.values(products).sort((a, b) => b.popularity - a.popularity);
};

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get('/', async (req, res) => {
  try {
    const products = await ProductData();
    const sortedProducts = sortByPopularity(products);

    res.render("frnt",{products:sortedProducts});


  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT,() =>console.log(`Server is running`));