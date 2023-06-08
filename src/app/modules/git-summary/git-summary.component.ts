import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AzureOpenaiService } from 'src/app/services/azure-openai-service';
import { GithubService } from 'src/app/services/github-service';
import { GithubReference } from '../models/github-repo';

@Component({
  selector: 'app-git-summary',
  templateUrl: './git-summary.component.html',
  styleUrls: ['./git-summary.component.scss']
})
export class GitSummaryComponent implements OnInit {
  public githubDetailsForm: FormGroup;
  public isApiCalled: boolean = false;
  public isFileFetchServiceCalled: boolean = false;
  private githubService: GithubService;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public areFilesLoaded: boolean = false;
  public isFileChosen: boolean = false;
  public fileContent: string;
  public repoList: string[] = [];
  public prList: string[] = [];
  public showCommentSuccessMessage: boolean = false;

  public filesPatchList = new Map<string, string>();
  public filesContentMap = new Map<string, string>();

  public azureResponseMap = new Map<string, string>();
  public isAzureCallMade: boolean = false;
  private azureOpenAiService: AzureOpenaiService;



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
    this.getAllRepos();
  }

  onRepoSelect() {
    this.getPrsForRepo();
    this.resetPrSelection();
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

  public getFilesPatchForPr() {
    this.filesPatchList.clear();
    const repo = this.githubDetailsForm.get("selectedRepo")?.value;
    const pr = this.githubDetailsForm.get("selectedPr")?.value;

    this.isFileFetchServiceCalled = true;
    this.githubService.getFilesForPr(repo, pr).pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: any) => {
      let result = serviceResponse;
      result.forEach((repo: GithubReference) => {
        this.filesPatchList.set(repo.filename, repo.patch);
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

  performGitSummary() {
    this.fetchFilesSummary();

  }

  fetchFilesSummary() {
    this.filesContentMap.clear();
    let i = 0;
    this.filesPatchList.forEach((value: string, key: string) => {
      this.isAzureCallMade = true;
      this.azureOpenAiService.performAzureOpenAIQuery(this.generateOpenAiPrompt(value)).then((response: string) => {
        this.isAzureCallMade = false;
        console.log("RESPONSE FROM API IS \n", response);
        this.azureResponseMap.set(key, response);
        console.log("FINAL MAP IS ", this.azureResponseMap);
      }, (error) => {
        console.log("Error is", error);
        this.isAzureCallMade = false;
      });
    });
  }

  commentOnPr() {
    const repo = this.githubDetailsForm.get("selectedRepo")?.value;
    const pr = this.githubDetailsForm.get("selectedPr")?.value;
    let payload = '**AI COBOT Summary:**';
    this.azureResponseMap.forEach((value: string, key: string) => {
      payload = payload + '\n\n **File Name: ' + key + '**\n';
      payload = payload + value + '\n';
    })
    let body = {
      "body": payload
    }
    this.githubService.commentForPr(repo, pr, body).pipe(takeUntil(this.destroyed$)).subscribe((serviceResponse: any) => {
      let result = serviceResponse;
      console.log(result);
      this.showCommentSuccessMessage = true;
    }, (error) => {
      console.log(error);
      this.showCommentSuccessMessage = false;

    })
  }

  generateOpenAiPrompt(input: string) {
    let promt = "I have the github PR patch as shown below. Summarise the changes in bullet points, not more than 50 words  \n";
    return JSON.stringify(promt + input);
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
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile);
    fileReader.onload = () => {
      this.fileContent = fileReader.result as string;
      console.log(this.fileContent);
    };
  }

  getPrLink() {
    const repo = this.githubDetailsForm.get("selectedRepo")?.value;
    const pr = this.githubDetailsForm.get("selectedPr")?.value;
    const url = 'https://github.com/farazbangalore/' + repo + '/pull/' + pr.split(':')[0];
    return url;
  }

}
