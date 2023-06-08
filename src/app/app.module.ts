import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModelComponent } from './modules/chat-model/chat-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavTabComponent } from './modules/nav-tab/nav-tab.component';
import { HttpClientModule } from '@angular/common/http';
import { CodeVulnerabilityComponent } from './modules/code-vulnerability/code-vulnerability.component';
import { GitSummaryComponent } from './modules/git-summary/git-summary.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SidePanelComponent } from './modules/side-panel/side-panel.component';
import { CodeExplainComponent } from './modules/code-explain/code-explain.component';
import { OnlineHelpComponent } from './modules/online-help/online-help.component';
import { CobotPluginComponent } from './modules/cobot-plugin/cobot-plugin.component';

@NgModule({
  declarations: [
    AppComponent,
    SidePanelComponent,
    ChatModelComponent,
    NavTabComponent,
    CodeVulnerabilityComponent,
    CodeExplainComponent,
    GitSummaryComponent,
    HomePageComponent,
    OnlineHelpComponent,
    CobotPluginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
