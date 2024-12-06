const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    // Perform inference
    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    );

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Build data object
    const data = {
      id,
      result: label,
      confidenceScore,
      suggestion,
      createdAt,
    };

    // Store data in database
    await storeData(id, data);

    const message =
      confidenceScore > 99
        ? "Model is predicted successfully"
        : "Model is predicted successfully";

    // Build response
    const response = h.response({
      status: "success",
      message,
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    return h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    }).code(400);
  }
}

async function predictHistories(request, h) {
  try {
    const { Firestore } = require("@google-cloud/firestore");
    const db = new Firestore({ projectId: "soul-scenicgyu-030419-b5" });

    // Fetch prediction histories from Firestore
    const predictCollection = db.collection("predictions");
    const snapshot = await predictCollection.get();

    const result = [];
    snapshot.forEach((doc) => {
      result.push({
        id: doc.id,
        history: {
          id: doc.data().id,
          result: doc.data().result,
          suggestion: doc.data().suggestion,
          createdAt: doc.data().createdAt,
        },
      });
    });

    // Build response
    return h.response({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return h.response({
      status: "error",
      message: "Gagal mengambil riwayat prediksi.",
    }).code(500);
  }
}
module.exports = { postPredictHandler, predictHistories };