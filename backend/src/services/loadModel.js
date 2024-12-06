const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel('https://storage.googleapis.com/cancer-detection-bucket1/model.json');
}
module.exports = loadModel;