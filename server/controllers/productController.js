const Product = require("../models/Product.js");

const getProducts = async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (available === "true") {
      filter.isAvailable = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log("RAW BODY:", req.body);
    console.log("FEATURES TYPE:", typeof req.body.features);
    console.log("FEATURES VALUE:", req.body.features);

    const { name, description, category, isAvailable } = req.body;

    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock);

    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const isAvailableBool = req.body.isAvailable === "true";

    let features = {};

    if (req.body.features) {
      try {
        const parsed = JSON.parse(req.body.features);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          features = parsed;
        } else {
          console.log("❌ Features is not a valid object");
        }
      } catch (err) {
        console.log("❌ Features JSON parse error:", err);
      }
    }

    const specifications = req.body.specifications
      ? JSON.parse(req.body.specifications)
      : {};

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      isAvailable: isAvailableBool,
      features,
      specifications,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("RAW BODY:", req.body);
    console.log("FEATURES TYPE:", typeof req.body.features);
    console.log("FEATURES VALUE:", req.body.features);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const isAvailableBool = req.body.isAvailable === "true";
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    let features = product.features;

    if (req.body.features) {
      try {
        const parsed = JSON.parse(req.body.features);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          features = parsed;
        }
      } catch (err) {
        console.log("❌ Features JSON parse error:", err);
      }
    }
    const specifications = req.body.specifications
      ? JSON.parse(req.body.specifications)
      : product.specifications;

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price ? parseFloat(req.body.price) : product.price;
    product.category = req.body.category || product.category;
    product.image = image;
    product.stock = req.body.stock ? parseInt(req.body.stock) : product.stock;
    product.isAvailable =
      req.body.isAvailable !== undefined
        ? req.body.isAvailable
        : product.isAvailable;

    product.features = features;
    product.specifications = specifications;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isAvailable = !product.isAvailable;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
};
