import { Component } from '@angular/core';
import { Question, Quiz } from '../../../quizClass';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [NgFor, CommonModule, FormsModule],
  providers: [AppService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent {
  quizName!: string;
  //message: string = "";
  displayed: boolean = true;
  displayedQuiz: boolean = false;
  tmpQuestions = new Array(
    new Question("Tajno pitanje?", "#secret")
  );
  //sub?: Subscription;

  public quiz = new Array(
    new Quiz(
      "Cool kviz", new Array(
        new Question("Jesam li kul?", "Je da"),
        new Question("Je si li ti kul?", "Je da"),
        new Question("Je su li oni kul?", "Neee")
      )
    )
  );
  questionsAmount: number = this.quiz.length;

  constructor(private router: Router){}

  /**
   * Setup za rađenje izmjena na /edit (EditComponent) stranici
   */
  ngOnInit(){
    if(history.state != null || history.state != undefined)
      this.quiz[history.state[0]] = history.state[1];
  }
/*
  Does not work

  ngOnInit(): void {
  
    //this.service.currentMessage.subscribe($message => { $message = "eneya"; });
    this.sub = this.service.request.subscribe((r: string) => this.message = r);
    this.service.request.emit();
  }
    */

  /**
   * Klik na tab za pokretanje kviza ili stvaranje novog
   */
  displayTab(tabName: string){
    const containerClass = "container";
    let classes = document.getElementsByClassName(containerClass);
    for(let i = 0; i < classes.length; i++)
      classes[i].className = containerClass;

    document.getElementById(tabName)!.className = containerClass + " active";

  }

  /**
   * Izraditi kopiju input elementa i dodati novo pitanje unutar kviza
   */
  addQuestion(){
    document.querySelector("#create div:nth-child(2)")!.appendChild(
      document.importNode(
        document.querySelectorAll("#create div:nth-child(2) ul")[0], true
      )
    )
  }

  /**
   * Nakon ispunjenih podataka, dodati novi kviz u kolekciju (array) (POST)
   */
  submitQuiz(){
    let inputFlag = true;
    document.querySelectorAll(".formQuiz").forEach($element => {
      let val = (<HTMLInputElement>$element).value;
      if(val == "" || val == null)
        inputFlag = false;
    })

    if(!inputFlag)
        alert("Molimo da unesete podatke u sva polja.")
    else{
      let questionsForQuiz = new Array();
      document.querySelectorAll("#create div:nth-child(2) ul").forEach($question => {
        let questionTitle = (<HTMLInputElement>$question.querySelector("li:first-child input")!).value!;
        let questionAnswer = (<HTMLInputElement>$question.querySelector("li:last-child input")!).value;

        questionsForQuiz.push(new Question(questionTitle, questionAnswer));
      });
      this.quiz.push(new Quiz(
        this.quizName, questionsForQuiz
      ))
      let questionFields = document.querySelectorAll("#create div ul");
      if(questionFields.length > 1)
        for(let i = 1; i < questionFields.length; i++){
          document.querySelector("#create div ul")?.remove();
        }
    }
  }

  /**
   * "Izbrisati kviz", to jest maknuti ga sa popisa te pitanja staviti u dodatno polje (tmpQuestions) (DELETE)
   */
  deleteQuiz(title: string){
    let j = -1;
    for(let i = 0; i < this.quiz.length; i++)
      if(this.quiz[i].title == title){
        j = i;
        break;
      }
    if(j >= 0){
      this.quiz[j].questions.forEach($question =>
        this.tmpQuestions.push($question)
      )
      this.quiz.splice(j, 1);
    }
  }

  /**
   * Uzimanje prvog "izbrisanog" pitanja i popunjavanje polja
   */
  recycleQuestion(){
    if(this.tmpQuestions.length > 0){
      let inputElements = document.querySelectorAll("#create input[type='text']");
      let recycledQuestion = this.tmpQuestions.pop();
      (<HTMLInputElement>inputElements[inputElements.length - 1]).value = recycledQuestion!.answer;
      (<HTMLInputElement>inputElements[inputElements.length - 2]).value = recycledQuestion!.question;
    }
    else
      alert("Nema dodatnih pitanja, molimo unesite nove.");
  }

  /**
   * Otvoriti stranicu i poslati kviz za uređenje na novu stranicu, /edit
   */
  editQuiz(index: number){
    this.router.navigate(["edit"], {state: [index, this.quiz[index]]});
  }

  /**
   * Dohvat svih pitanja, koja nisu "izbrisana" (GET)
   */
  getQuestions(){
    let questions = new Array();
    this.quiz.forEach($element =>
      questions.push($element.questions)
    )
    return questions;
  }
  
  protected currentQuiz?: Quiz;
  protected index: number = 0;
  protected questions?: Question[];
  protected currentQuizTitle?: string;
  protected quizCurrentQuestion?: string;
  protected quizCurrentAnswer?: string;
  next: boolean = true;
  prev: boolean = false;
  revealed: boolean = false;

  /**
   * Započeti kviz na /play (ExecuteComponent) (GET)
   */
  startQuiz(iterator: number){
    this.currentQuiz = this.quiz[iterator];
    this.currentQuizTitle = this.currentQuiz.title;
    this.quizCurrentQuestion = this.currentQuiz.questions[0].question;
    this.quizCurrentAnswer = this.currentQuiz.questions[0].answer;
    this.displayed = false;
    this.displayedQuiz = true;
    if(this.currentQuiz.questions.length == 1)
      this.next = false;
    //this.router.navigate(["play"], {state: });
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
    if(this.index == 0) this.prev = false;
    if(this.index == this.currentQuiz!.questions.length - 1) this.next = false;
    this.quizCurrentQuestion = this.currentQuiz?.questions[this.index].question;
    this.quizCurrentAnswer = this.currentQuiz!.questions[this.index].answer;
  }
  
  /**
   * Vraćanje na početnu stranicu
   */
  returnToAdmin(){
    this.displayedQuiz = false;
    this.displayed = true;
  }
}
