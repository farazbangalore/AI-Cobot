import { Message } from "./message";

export class OpenAIRequestPayload {
  public messages: Message[];
  public temperature: number;
  public top_p: number;
  public frequency_penalty: number;
  public presence_penalty: number;
  public max_tokens: number;
  public stop: any;
  public stream: boolean
}