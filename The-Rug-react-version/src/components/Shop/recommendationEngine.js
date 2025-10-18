// utils/recommendationEngine.js
import * as tf from "@tensorflow/tfjs";

export class StyleAdvisor {
  constructor() {
    this.model = null;
    this.products = [];
    this.styleVocab = {};
    this.colorVocab = {};
  }

  async initialize(products) {
    this.products = products;
    this.createVocabularies();
    await this.trainModel();
  }

  createVocabularies() {
    // Extract unique styles and colors
    const allStyles = new Set();
    const allColors = new Set();

    this.products.forEach((product) => {
      if (product.style) allStyles.add(product.style);
      if (product.colors) product.colors.forEach((c) => allColors.add(c));
    });

    // Create vocabulary mappings
    this.styleVocab = [...allStyles].reduce((acc, style, idx) => {
      acc[style] = idx;
      return acc;
    }, {});

    this.colorVocab = [...allColors].reduce((acc, color, idx) => {
      acc[color] = idx;
      return acc;
    }, {});
  }

  async trainModel() {
    // Prepare training data
    const features = this.products.map((p) => this.productToFeature(p));
    const labels = this.products.map((_, i) => i); // Product indices as labels

    // Simple similarity model
    this.model = {
      recommend: (preferences) => {
        const prefFeatures = this.preferencesToFeature(preferences);
        return this.findSimilarProducts(prefFeatures);
      },
    };
  }

  productToFeature(product) {
    const styleVec = Array(Object.keys(this.styleVocab).length).fill(0);
    const colorVec = Array(Object.keys(this.colorVocab).length).fill(0);

    if (product.style) styleVec[this.styleVocab[product.style]] = 1;
    if (product.colors)
      product.colors.forEach((c) => (colorVec[this.colorVocab[c]] = 1));

    return [...styleVec, ...colorVec];
  }

  preferencesToFeature(prefs) {
    const styleVec = Array(Object.keys(this.styleVocab).length).fill(0);
    const colorVec = Array(Object.keys(this.colorVocab).length).fill(0);

    prefs.styles.forEach((s) => (styleVec[this.styleVocab[s]] = 1));
    prefs.colors.forEach((c) => (colorVec[this.colorVocab[c]] = 1));

    return [...styleVec, ...colorVec];
  }

  findSimilarProducts(prefFeatures, k = 6) {
    // Calculate cosine similarity
    const scores = this.products.map((product) => {
      const productFeatures = this.productToFeature(product);
      return this.cosineSimilarity(prefFeatures, productFeatures);
    });

    // Get top k products
    return this.products
      .map((product, idx) => ({ product, score: scores[idx] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((item) => item.product);
  }

  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
