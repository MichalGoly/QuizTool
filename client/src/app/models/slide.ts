import { Buffer } from 'buffer';

export class Slide {
  _id: string;
  lectureId: string;
  image: Buffer;
  text: string;
  isQuiz: boolean;
  slideNumber: number;
}
