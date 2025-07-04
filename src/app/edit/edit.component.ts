import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { Question, Quiz } from '../../../quizClass';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule, NgFor],
  providers: [AppService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})

export class EditComponent {
  private index: number = -1;
  protected questions?: Question[];
  protected quizName?: string;

  constructor(private router: Router){}

  /**
   * Dohvat podataka sa početne stranice (AdminComponent)
   */
  ngOnInit(){
    if(history.state != null || history.state != undefined) {
      this.index = history.state[0];
      let quiz = history.state[1];
      this.quizName = quiz.title;
      this.questions = quiz.questions;
    }
  }

  /**
   * Spremanje izmjena i vraćanje na početnu stranicu sa podacima (PUT)
   */
  saveChanges(){
    let questions: Question[] = new Array();
    document.querySelectorAll("div > ul > li").forEach($element => {
      let question = $element.querySelector("input")!.value;
      let answer = $element.nextElementSibling?.querySelector("input")?.value!;
      questions.push(new Question(question, answer));
    })
    this.router.navigate([""], {state: [this.index, new Quiz(this.quizName!, questions)]});
  }

  /*
    Does not work
  message: any = "";

  constructor(private service: AppService){}

  receiveMessage(event: Event){
    this.message = event;
    console.log(event);
  }

  newMessage(){
    this.app.request.emit(this.message);
    console.log(this.message);
  }

  ngOnInit(){
    console.log(history.state.data)
  let quizTitle = localStorage.getItem("key");
    
    this.service.currentMessage.forEach($element => console.log("El1: " + $element));
    this.service.currentMessage.subscribe($element => {
      console.log("El2: " + $element);
    })
    //this.service.changeReturn().forEach($element => console.log("Element: " + $element));
    //this.quiz!.find()

*/
}
