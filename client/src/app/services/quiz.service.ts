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
    return slide.text.length > 0 && (this.isAbParenthesis(slide.text) || this.isAbDot(slide.text) || this.isAbBullet(slide.text));
  }

  isAbParenthesis(text: string): boolean {
    // true if at least A) and B) found in slide text
    return text.indexOf(this.letters[0] + ")") >= 0 && text.indexOf(this.letters[1] + ")") >= 0;
  }

  isAbDot(text: string): boolean {
    // true if at least A. and B. found in slide text
    return text.indexOf(this.letters[0] + ".") >= 0 && text.indexOf(this.letters[1] + ".") >= 0;
  }

  isAbBullet(text: string): boolean {
    // true if at least two bullet points found in slide text
    for (let i = 0; i < BULLET_CHARACTERS.length; i++) {
      if (((text.split(BULLET_CHARACTERS[i])).length - 1) >= 2) {
        return true;
      }
    }
    return false;
  }

  extractOptions(text: string, quizType: string): string[] {
    /*
    * 1. If quizType is truefalse, return ["true", "false"]
    * 2. Otherwise, determine if slide is A)B), A.B. or bullet points
    * 3. Extract the amount of questions from the slide's text
    * 4. Return an array populated with the amount of letters equal to the number of questions
    */
    let options = [];
    if (quizType !== null && quizType !== undefined) {
      if (quizType === "truefalse") {
        options.push("true");
        options.push("false");
      } else if (this.isAbParenthesis(text)) {
        let questionsNumber = this.extractQuestionsNumber(text, ")");
        for (let i = 0; i < questionsNumber; i++) {
          options.push(this.letters[i]);
        }
      } else if (this.isAbDot(text)) {
        let questionsNumber = this.extractQuestionsNumber(text, ".");
        for (let i = 0; i < questionsNumber; i++) {
          options.push(this.letters[i]);
        }
      } else if (this.isAbBullet(text)) {
        // determine the type of the bullet used, then use the counter to generate options
        for (let i = 0; i < BULLET_CHARACTERS.length; i++) {
          let bulletCount = (text.split(BULLET_CHARACTERS[i])).length - 1;
          if (bulletCount >= 2) {
            for (let j = 0; j < bulletCount; j++) {
              options.push(this.letters[j]);
            }
            break;
          }
        }
      }
    }
    return options;
  }

  extractQuestionsNumber(text: string, character: string): number {
    let counter = 0;
    for (let i = 0; i < this.letters.length; i++) {
      if (text.indexOf(this.letters[i] + character) >= 0) {
        counter++;
      } else {
        break;
      }
    }
    return counter;
  }

}
