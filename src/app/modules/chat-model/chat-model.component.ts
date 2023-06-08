import { Component, OnInit } from '@angular/core';
import * as feather from 'feather-icons';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { GptService } from 'src/app/services/gpt-service';
import { ReplaySubject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-chat-model',
  templateUrl: './chat-model.component.html',
  styleUrls: ['./chat-model.component.scss']
})
export class ChatModelComponent implements OnInit {

  public conversationList: string[] = [];
  public chatModelForm: FormGroup;
  public user = 'user';
  public chatbot = 'chatbot';
  public isGptCallMade: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  private gptService: GptService




  constructor(
    gptService: GptService
  ) {
    this.gptService = gptService;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.chatModelForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngAfterViewInit() {
    feather.replace();
  }

  onSubmitRequest() {
    const query = this.chatModelForm.get("query")?.value;
    this.chatModelForm.get("query")?.setValue("");
    this.conversationList.push(query);
    this.performQuery(query);
  }

  performQuery(query: string) {
    this.isGptCallMade = true;
    this.gptService.performQuery(query).pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: any) => {
      let result = serviceResponse;
      console.log(result[0]['text_response']);
      this.conversationList.push(result[0]['text_response']);
      this.isGptCallMade = false;
    }, (error) => {
      this.isGptCallMade = false;
      this.conversationList.push(error.error['error_message']);
    });

  }

  clearSession() {
    this.conversationList = [];
  }

  getChatSource(index: number): string {
    return (index % 2 === 1) ? 'Bot' : 'User';
  }


}
