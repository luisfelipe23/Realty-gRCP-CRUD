const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	client.getAll(null, (err, data) => {
		if (!err) {
			res.render("realties", {
				results: data.realties
			});
		}
	});
});

app.post("/save", (req, res) => {
	let newRealty = {
		title: req.body.title,
		address: req.body.address,
        type: req.body.type,
        rooms: req.body.rooms,
        garages: req.body.garages,
        built: req.body.built,
        ground: req.body.ground,
        price: req.body.price
	};

	client.insert(newRealty, (err, data) => {
		if (err) throw err;

		console.log("Realty created successfully", data);
		res.redirect("/");
	});
});

app.post("/update", (req, res) => {
	const updateRealty = {
		id: req.body.id,
		title: req.body.title,
		address: req.body.address,
        type: req.body.type,
        rooms: req.body.rooms,
        garages: req.body.garages,
        built: req.body.built,
        ground: req.body.ground,
        price: req.body.price
	};

	client.update(updateRealty, (err, data) => {
		if (err) throw err;

		console.log("Realty updated successfully", data);
		res.redirect("/");
	});
});

app.post("/remove", (req, res) => {
	client.remove({ id: req.body.realty_id }, (err, _) => {
		if (err) throw err;

		console.log("Realty removed successfully");
		res.redirect("/");
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Server running at port %d", PORT);
});