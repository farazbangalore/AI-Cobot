import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ReplaySubject, takeUntil} from 'rxjs';
import {AzureOpenaiService} from 'src/app/services/azure-openai-service';
import {GithubService} from 'src/app/services/github-service';
import {InferService} from 'src/app/services/infer-service';
import {PdfService} from 'src/app/services/pdf-service';
import {GithubReference} from '../models/github-repo';
import {InferFiles} from '../models/infer-files';
import {InferPayload} from '../models/infer-payload';
import {Message} from '../models/openAI/message';
import {OpenAIRequestPayload} from '../models/openAI/openAI-request-payload';

@Component({
  selector: 'app-online-help',
  templateUrl: './online-help.component.html',
  styleUrls: ['./online-help.component.scss']
})
export class OnlineHelpComponent implements OnInit {

  public githubDetailsForm: FormGroup;
  public isApiCalled: boolean = false;
  public isFileFetchServiceCalled: boolean = false;
  private githubService: GithubService;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public areFilesLoaded: boolean = false;
  private azureOpenAiService: AzureOpenaiService;
  public isAzureCallMade: boolean = false;
  public pdfService: PdfService;

  public repoList: string[] = [];
  public prList: string[] = [];

  public filesList = new Map<string, string>();
  public filesContentMap = new Map<string, string>();
  public num: number = 0;
  public azureResponseList = new Map<number, string>();

  constructor(
    githubService: GithubService,
    inferService: InferService,
    azureOpenAiService: AzureOpenaiService,
    pdfService: PdfService
  ) {
    this.githubService = githubService;
    this.azureOpenAiService = azureOpenAiService;
    this.pdfService = pdfService;
  }

  ngOnInit(): void {
    this.githubDetailsForm = new FormGroup({
      selectedRepo: new FormControl(''),
      selectedPr: new FormControl(''),
      message: new FormControl(''),
      speech: new FormControl(false)
    });
  }

  onSend() {
    const str = this.githubDetailsForm.get("message")?.value;
    console.log();
    this.num = this.num + 1;
    this.azureResponseList.set(this.num, str)
    this.isApiCalled = true;
    this.makeOpenAPICall(str);
    this.githubDetailsForm.patchValue({
      message: ''
    });
  }

  public speak(text: string): void {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      synthesis.speak(utterance);
    } else {
      console.log('Text-to-text-to-speech not supported.');
    }
  }

  public stopSpeak(): void {
    if (this.githubDetailsForm.get("speech")?.value === false) {
      const synthesis = window.speechSynthesis;
      synthesis.cancel();
    } else {
      console.log('Text-to-text-to-speech not supported.');
    }
  }

  private getAllRepos(): void {
    this.isApiCalled = true;
    this.githubService.getAllRepos().pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: any) => {
      let result = serviceResponse;
      result.forEach((repo: GithubReference) => {
        this.repoList.push(repo.name);
      });
      this.isApiCalled = false;
    }, () => {
      this.isApiCalled = false;
    });
  }

  public getPrsForRepo() {
    this.prList = [];
    const repo = this.githubDetailsForm.get("selectedRepo")?.value;
    this.isApiCalled = true;
    this.githubService.getPrsForRepo(repo, 'open').pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: any) => {
      let result = serviceResponse;
      result.forEach((repo: GithubReference) => {
        this.prList.push(repo.number + ': ' + repo.title);
      });
      this.isApiCalled = false;
    }, () => {
      this.isApiCalled = false;
    });
  }


  public getFilesForPr() {
    this.filesList.clear();
    const repo = this.githubDetailsForm.get("selectedRepo")?.value;
    const pr = this.githubDetailsForm.get("selectedPr")?.value;
    this.isFileFetchServiceCalled = true;
    this.githubService.getFilesForPr(repo, pr).pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: any) => {
      let result = serviceResponse;
      result.forEach((repo: GithubReference) => {
        this.filesList.set(repo.filename, repo.contents_url);
      });
      this.isFileFetchServiceCalled = false;
      this.areFilesLoaded = true;
    }, () => {
      this.isFileFetchServiceCalled = false;
      this.areFilesLoaded = false;
    });
  }

  resetPrSelection() {
    this.githubDetailsForm.get("selectedPr")?.setValue("");
  }

  performGitScan() {
    this.fetchFilesFromGitUrl();

  }

  fetchFilesFromGitUrl() {
    this.filesContentMap.clear();
    let i = 0;
    this.filesList.forEach((value: string, key: string) => {
      this.githubService.getFileContentFromUrl(value).pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: string) => {
        let result = serviceResponse as string;
        this.filesContentMap.set(key, result);
        console.log("Map is ", this.filesContentMap);
        i++;
        if (i === this.filesList.size) {
          this.performScan();
        }
      }, (error) => {
        i++;
        console.log("Failed", error);
      });
    });
  }

  performScan() {
    console.log("THE FILES ", this.filesContentMap);
    this.filesContentMap.forEach((value: string, key: string) => {
      console.log("GENERATED COMMAND IS", this.generateOpenAiPrompt(value));
    });
  }


  generateOpenAiPrompt(input: string) {
    let promt = "Write the bug and vulnerability report for the following code in a report format, in bullet points. not more than 50 words\n";
    return JSON.stringify(promt + input);
  }


  generatReport() {

  }


  makeOpenAPICall(query: string) {
    this.isAzureCallMade = true;
    this.azureOpenAiService.performAzureOpenAIQuery(query).then((response: string) => {
      this.isAzureCallMade = false;
      console.log("RESPONSE FROM API IS \n", response);
      this.num = this.num + 1;
      this.azureResponseList.set(this.num, response);
      if (this.githubDetailsForm.controls['speech'].value === true) {
        this.speak(response);
      }
    }, (error) => {
      console.log("Error is", error);
      this.isAzureCallMade = false;
    });
  }

  getItem(key: number) {
    if (key % 2 == 0) {
      return 'BOT';
    } else {
      return 'USER';
    }
  }

  // METHOD NOT NEEDED
  getMessage(): OpenAIRequestPayload {
    let message1 = new Message("system", "You are an AI assistant that helps people find information.");
    let message2 = new Message("user", "What is google?");

    let openAIRequestPayload: OpenAIRequestPayload = {
      "messages": [message1, message2],
      "temperature": 0.7,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "max_tokens": 800,
      "stop": null,
      "stream": true
    }
    return openAIRequestPayload;
  }

  downloadReport() {

    this.pdfService.generateAndDownloadPdf('Github Vulnerability Report', this.generateReportContent());
  }

  mailReport() {
    this.pdfService.mailDocumentation('Github Vulnerability Report', '\n\n' + this.generateReportContent());
  }

  generateReportContent() {
    let content = '';
    return content;
  }


}
