import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../models/message.model';
import { HfService } from '../services/hf.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  messages: Message[] = [];

  form = new FormGroup({
    promt: new FormControl(''),
  });

  constructor(private hf: HfService) {}

  loading: boolean = false;

  submit() {
    console.log(this.form.value);

    let promt = this.form.value.promt as string;

    // ******* Mensaje del usuario ********
    let usrMsg: Message = {
      sender: 'me',
      content: promt,
    };

    this.messages.push(usrMsg);

    // ******* Mensaje del bot ********
    let botMsg: Message = {
      sender: 'bot',
      content: '',
    };

    this.messages.push(botMsg);

    this.form.reset();
    this.form.disable();

    this.loading = true;

    setTimeout(() => {
      this.loading = false;

      this.hf.sendQuestion(promt).then((response) => {
        const text = response;
        console.log(text);
        this.typeText(text);
      });

      this.form.enable();
    }, 599);
  }

  typeText(text: string) {
    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if (textIndex < text.length) {
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      } else {
        clearInterval(interval);
      }
    }, 15);
  }
}
