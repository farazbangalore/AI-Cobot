import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cobot-plugin',
  templateUrl: './cobot-plugin.component.html',
  styleUrls: ['./cobot-plugin.component.scss']
})
export class CobotPluginComponent implements OnInit {

  public fileUrl: SafeResourceUrl | undefined;


  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.initiatePythonFile();
  }

  initiatePythonFile() {
    const data = 'some text';
    const blob = new Blob([data], {
      type: 'application/octet-stream'
    });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

}
