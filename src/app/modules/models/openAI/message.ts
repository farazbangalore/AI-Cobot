export class Message {
  public role: string;
  public content: string;

  constructor(role: string, content: string){
    this.role = role;
    this.content = content;
  }

}