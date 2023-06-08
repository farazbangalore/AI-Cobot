import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { GithubReference } from '../modules/models/github-repo';
import { Message } from '../modules/models/openAI/message';
import { OpenAIRequestPayload } from '../modules/models/openAI/openAI-request-payload';
// import { Configuration, OpenAIApi } from 'openai';
import { Configuration, OpenAIApi } from "azure-openai";

@Injectable({
  providedIn: 'root'
})
export class AzureOpenaiService {
  private http: HttpClient;

  private host_url: string = 'https://aoai-3-sub1.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview';
  private api_key: string = '891ba87bf137450f991862728523f99b';


  public constructor(http: HttpClient) {
    this.http = http;
  }

  // private openAiApi: OpenAIApi;

  async performAzureOpenAIQuery(query: string): Promise<string> {


    const configuration = new Configuration({
      apiKey: this.api_key,
      azure: {
        apiKey: this.api_key,
        endpoint: 'https://aoai-3-sub1.openai.azure.com/',
        deploymentName: 'gpt-35-turbo',
      }

    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "code-davinci-002",
      messages: [{ "role": "system", "content": "You are an AI assistant that helps people find information." },
      {
        "role": "user",
        "content": query
      }],
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ''
    });
    // console.log("The answer is \n", completion.data.choices[0].message?.content);
    return completion.data.choices[0].message === undefined ? "" : completion.data.choices[0].message.content;

  }


}
