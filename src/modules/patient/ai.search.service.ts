// import { Injectable } from "@nestjs/common";
// import * as tf from "@tensorflow/tfjs-node";
// import * as use from "@tensorflow-models/universal-sentence-encoder";
//
// @Injectable()
// export class AiService {
//   private model: use.UniversalSentenceEncoder;
//
//   async loadModel() {
//     this.model = await use.load();
//   }
//
//   async analyzeText(text: string, keyword: string): Promise<boolean> {
//     const embeddings = await this.model.embed([text, keyword]);
//     const textEmbedding = embeddings.slice([0, 0], [1]);
//     const keywordEmbedding = embeddings.slice([1, 0], [1]);
//     const similarity = tf.losses
//       .cosineDistance(textEmbedding, keywordEmbedding, 0)
//       .dataSync();
//     return similarity < 0.5; // Adjust threshold as necessary
//   }
// }
