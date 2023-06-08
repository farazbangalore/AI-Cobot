import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  sendEmail(emailAddress: string, attachmentUrl: string) {
    const subject = 'Email Subject';
    const body = 'Please find the attached file.';
    const mailtoLink = `mailto:${emailAddress}?subject=${
      encodeURIComponent(subject)}&body=${encodeURIComponent(body)}%0D%0A%0D%0ADownload the report from Cobot AI:%0D%0A${attachmentUrl
      }`;
    window.open(mailtoLink);
  }
}
