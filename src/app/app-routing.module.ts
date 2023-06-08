import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ChatModelComponent } from './modules/chat-model/chat-model.component';
import { CobotPluginComponent } from './modules/cobot-plugin/cobot-plugin.component';
import { CodeExplainComponent } from './modules/code-explain/code-explain.component';
import { CodeVulnerabilityComponent } from './modules/code-vulnerability/code-vulnerability.component';
import { GitSummaryComponent } from './modules/git-summary/git-summary.component';
import {OnlineHelpComponent} from "./modules/online-help/online-help.component";

const routes: Routes = [
  {
    path: '',
    component: CodeVulnerabilityComponent
  },
  {
    path: 'github-vulnerability',
    component: CodeVulnerabilityComponent
  },
  {
    path: 'git-summary',
    component: GitSummaryComponent
  },
  {
    path: 'code-explain',
    component: CodeExplainComponent
  },
  {
    path: 'online-help',
    component: OnlineHelpComponent
  },
  {
    path: 'cobot-plugin',
    component: CobotPluginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
