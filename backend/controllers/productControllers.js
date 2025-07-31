import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
    `;

    console.log(products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("getAllProductError: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });

  try {
    const newProduct = await sql`
    INSERT INTO products (name, price, image)
    VALUES (${name}, ${price}, ${image})
    RETURNING *
    `;

    console.log("newProduct: ", newProduct);
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("createProductError: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
    SELECT * FROM products WHERE id=${id}
    `;

    console.log("product: ", product);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("getProductError: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  if (!name || !price || !image)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });

  try {
    const updatedProduct = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${image}
      WHERE id=${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.log("updateProductError: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
    DELETE FROM products WHERE id=${id} RETURNING *
    `;

    console.log({ deletedProduct });

    if (deletedProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.log("deleteProductError: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};
