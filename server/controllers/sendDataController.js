import fetch from "node-fetch";
import KPI from "../models/KPI.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

const sendDataController = async (req, res) => {
  try {
    console.log("Données reçues :", req.body);
    // Utiliser Mongoose pour récupérer les données depuis MongoDB
    const kpiData = await KPI.find();
    const productData = await Product.find();
    const transactionData = await Transaction.find();

    // Votre URL de destination depuis le fichier .env
    const destinationURL = process.env.MY_URL;
    // Vérifier si l'URL de destination est définie dans le fichier .env
    if (!destinationURL) {
      return res.status(500).json({
        success: false,
        message: "Destination URL not defined in .env."
      });
    }
    // Utilisation de la fonction fetch pour envoyer les données à l'URL spécifiée
    const response = await fetch(destinationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kpiData,
        productData,
        transactionData
      })
    });

    if (req.method === "POST") {
      console.log("Requête POST reçue !");
      // ... votre logique de traitement pour la requête POST
      res.status(200).json({ message: "Données reçues avec succès." });
    } else {
      res.status(405).json({ error: "Méthode non autorisée." });
    }
    // Vérifier la réponse du serveur et renvoyer une réponse au client Express
    if (response.ok) {
      res
        .status(200)
        .json({ success: true, message: "Data sent successfully." });
    } else {
      res
        .status(response.status)
        .json({ success: false, message: "Failed to send data." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default sendDataController;
