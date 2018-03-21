import { Injectable } from '@angular/core';
import { Slide } from '../models/slide';

const CHAR_A_CODE = 65;
const LETTERS_COUNT = 26;
// https://en.wikipedia.org/wiki/Bullet_(typography)
const BULLET_CHARACTERS: string[] = [
  "•", "∙", "‣", "◦", "⁃", "⁌", "⁍"
];

@Injectable()
export class QuizService {

  letters: string[];

  constructor() {
    this.initLetters();
  }

  initLetters(): void {
    // populate the letters array with the whole alphabet
    this.letters = [];
    for (let i = 0; i < LETTERS_COUNT; i++) {
      this.letters.push(String.fromCharCode(CHAR_A_CODE + i));
    }
  }

  // Checks if given slide is eligible to become a single/multichoice quiz
  isEligible(slide: Slide): boolean {
    /*
    * Eligible if:
    * a) at least A) and B) found in slide text
    * b) or at least A. and B. found in slide text
    * c) or at least two bullet points found in slide text
    */
    return slide.text.length > 0 && (this.isAbParenthesis(slide) || this.isAbDot(slide) || this.isAbBullet(slide));
  }

  isAbParenthesis(slide: Slide): boolean {
    // true if at least A) and B) found in slide text
    return slide.text.indexOf(this.letters[0] + ")") >= 0 && slide.text.indexOf(this.letters[1] + ")") >= 0;
  }

  isAbDot(slide: Slide): boolean {
    // true if at least A. and B. found in slide text
    return slide.text.indexOf(this.letters[0] + ".") >= 0 && slide.text.indexOf(this.letters[1] + ".") >= 0;
  }

  isAbBullet(slide: Slide): boolean {
    // true if at least two bullet points found in slide text
    for (let i = 0; i < BULLET_CHARACTERS.length; i++) {
      if (((slide.text.split(BULLET_CHARACTERS[i])).length - 1) >= 2) {
        return true;
      }
    }
    return false;
  }

  extractOptions(text: string): string[] {
    let out = [];
    for (let i = 0; i < this.letters.length; i++) {
      if (text.indexOf(this.letters[i]) >= 0) {
        out.push(this.letters[i].charAt(0));
      }
    }
    return out;
  }

}
