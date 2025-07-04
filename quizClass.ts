export class Question {
    question!: string;
    answer!: string;

    constructor(question: string, answer: string){
        this.question = question;
        this.answer = answer;
    }
}

export class Quiz{
    title!: string;
    questions!: Question[];

    constructor(title: string, questions: Question[]){
        this.title = title;
        this.questions = questions;
    }
}
