import { InferFiles } from './infer-files';


export class InferPayload {
  language: string = "Infer-Java";
  action = "tool";
  hasLtiData = false;
  ltiData = {};
  files: InferFiles[];

  constructor(files: InferFiles[]) {
    this.files = files;
    this.language = "Infer-Java";
    this.action = "tool";
    this.hasLtiData = false;
    this.ltiData = {};

  }

}