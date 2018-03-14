import { Injectable } from '@angular/core';
import { Slide } from '../models/slide';

const CHAR_A_CODE = 65;
const LETTERS_COUNT = 26;

@Injectable()
export class QuizService {

  letters: string[];

  constructor() {
    this.initLetters();
  }

  initLetters(): void {
    // populate the letters array with A), B), C), ..., Z)
    this.letters = [];
    for (let i = 0; i < LETTERS_COUNT; i++) {
      this.letters.push(String.fromCharCode(CHAR_A_CODE + i) + ")");
    }
  }

  // Checks if given slide is eligible to become a quiz by looking at its text
  isEligible(slide: Slide): boolean {
    // true if at least A) and B) found in slide text
    return slide.text.length > 0 && slide.text.indexOf(this.letters[0]) >= 0
      && slide.text.indexOf(this.letters[1]) >= 0;
  }

}
