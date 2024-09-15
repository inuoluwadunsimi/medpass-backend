import { Injectable } from "@nestjs/common";
import * as natural from "natural";

@Injectable()
export class AiService {
  private tokenizer: natural.WordTokenizer;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
  }

  analyzeText(text: string, keyword: string): boolean {
    const textTokens = this.tokenizer.tokenize(text).join(" ");
    const keywordTokens = this.tokenizer.tokenize(keyword).join(" ");

    // Using Dice Coefficient to measure similarity
    const similarity = natural.DiceCoefficient(textTokens, keywordTokens);
    return similarity > 0.5; // Adjust threshold as necessary
  }

  analyzeArrayText(textArray: string[], keyword: string): boolean {
    return textArray.some((text) => this.analyzeText(text, keyword));
  }
}
