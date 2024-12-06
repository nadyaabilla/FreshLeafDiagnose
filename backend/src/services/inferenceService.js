const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    // Preprocess image
    const tensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    // Class model
    const classes = ['Class A', 'Class B', 'Class C'];

    // Model prediction
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];
 
    let explanation, suggestion;

    console.log("score: ", score);
    console.log("confidenceScore: ", confidenceScore);

    if(label === 'Class A') {
      explanation = "Class A adalah ."
      suggestion = "Saran untuk perawatan/menghindari penyakit."
    }

    if(label === 'Class B') {
      explanation = "Class B adalah "
      suggestion = "Saran untuk perawatan/menghindari penyakit."
    }

    if(label === 'Class C') {
      explanation = "Class C adalah "
      suggestion = "Saran untuk perawatan/menghindari penyakit."
    }

    return { label, confidenceScore, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

module.exports = predictClassification;