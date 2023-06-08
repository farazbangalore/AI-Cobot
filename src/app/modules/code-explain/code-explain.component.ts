import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GithubService } from 'src/app/services/github-service';
import { GithubReference } from '../models/github-repo';
import {AzureOpenaiService} from "../../services/azure-openai-service";

@Component({
  selector: 'app-code-explain',
  templateUrl: './code-explain.component.html',
  styleUrls: ['./code-explain.component.scss']
})
export class CodeExplainComponent implements OnInit {

  public githubDetailsForm: FormGroup;
  public isApiCalled: boolean = false;
  public isFileFetchServiceCalled: boolean = false;
  private githubService: GithubService;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public areFilesLoaded: boolean = false;
  public isFileChosen: boolean = false;
  public fileContent: string;
  public fileName: string;
  public repoList: string[] = [];
  public prList: string[] = [];
  public filesList = new Map<string, string>();
  public filesContentMap = new Map<string, string>();
  public azureOpenAiService: AzureOpenaiService;
  public azureResponseMap = new Map<string, string>();

  constructor(
    githubService: GithubService,
    azureOpenAiService: AzureOpenaiService
  ) {
    this.githubService = githubService;
    this.azureOpenAiService = azureOpenAiService;
  }

  ngOnInit(): void {
    this.githubDetailsForm = new FormGroup({
      selectedRepo: new FormControl(''),
      selectedPr: new FormControl('')
    });
  }

  onRepoSelect() {
    // this.getPrsForRepo();
    // this.resetPrSelection();
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

    });
  }

  onFileSelected(event: any) {
    if (event.target.files[0] === undefined) {
      this.isFileChosen = false;
    }
    else {
      this.isFileChosen = true;
    }
    const selectedFile = event.target.files[0];
    this.fileName = selectedFile.name;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile);
    this.azureResponseMap = new Map<string, string>();
    fileReader.onload = () => {
      this.fileContent = fileReader.result as string;
      this.fileContent = this.generateOpenAiPrompt(this.fileContent);
      console.log(this.fileContent);
    };
  }

  public explainCode() {
    this.isApiCalled = true
    this.makeOpenAPICall(this.fileName, this.fileContent);
  }


  makeOpenAPICall(key: string, query: string) {
    this.isApiCalled = true;
    this.azureOpenAiService.performAzureOpenAIQuery(query).then((response: string) => {
      this.isApiCalled = false;
      console.log("RESPONSE FROM API IS \n", response);
      this.azureResponseMap.set(key, response);
      console.log("FINAL MAP IS ", this.azureResponseMap);
    }, (error: any) => {
      console.log("Error is", error);
      this.isApiCalled = false;
    });
  }

  generateOpenAiPrompt(command: string) {
    let promt = 'Explain the below code in detail in bullet points in report format not more than 100 words\n';
    return promt + command;
  }


  generatReport() {

  }

}
