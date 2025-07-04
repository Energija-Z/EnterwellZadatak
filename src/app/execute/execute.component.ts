import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Question, Quiz } from '../../../quizClass';
import { Router } from '@angular/router';


@Component({
  selector: 'app-execute',
  imports: [NgIf],
  templateUrl: './execute.component.html',
  styleUrl: './execute.component.css'
})
export class ExecuteComponent {
  protected index: number = 0;
  protected questions?: Question[];
  protected quizName?: string;
  protected quizCurrentQuestion?: string;
  protected quizCurrentAnswer?: string;
  next: boolean = true;
  prev: boolean = false;
  revealed: boolean = false;

  constructor(private router: Router){}

  /**
   * Dohvat podataka sa početne stranice (AdminComponent)
   */
  ngOnInit(){
    if(history.state != null || history.state != undefined) {
      let quiz: Quiz = history.state;
      this.quizName = quiz.title;
      this.questions = quiz.questions;
      this.quizCurrentQuestion = this.questions[this.index].question;
      this.quizCurrentAnswer = this.questions[this.index].answer;
      this.next = this.index == this.questions.length - 1 ? false : true;
    }
  }

  /**
   * Pokazivanje odgovora pomoću varijable
   */
  revealAnswer(){
    this.revealed = true;
  }

  /**
   * Pomicanje pozicije pitanja za jedno mjesto unaprijed / unatrag (ako je odgovor prije bio vidljiv, stavlja se na nevidljivo)
   */
  switchQuestion(offset: number){
    this.revealed = false;
    this.prev = true;
    this.next = true;
    this.index += offset;
    this.quizCurrentQuestion = this.questions![this.index].question;
    this.quizCurrentAnswer = this.questions![this.index].answer;
    if(this.index == 0) this.prev = false;
    if(this.index == this.questions!.length - 1) this.next = false;
  }

  /**
   * Vraćanje na početnu stranicu
   */
  returnToAdmin(){
    this.router.navigate([""]);
  }
}
