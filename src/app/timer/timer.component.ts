import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, OnDestroy {

  @Input() exercises: Exercise[] = [];
  currentEx: number = 0;
  currentRep: number = 0 ;
  phase: number = 0 ;
  timeLeft: any ;
  interval: any;
  
  ngOnInit(): void {
    this.restart();
  }
  
  restart() {
    this.currentEx = 0;
    this.currentRep = 0;
    this.phase = 0;
    const ex = this.exercises[this.currentEx];
    this.timeLeft = this.getTimeOfCurrentPhase();
  }

  formatPhase(phase: number) {
    switch (phase) {
      case 0: return 'Preparacão';
      case 1: return 'Exercicio';
      case 2: return 'Descanso';
      default: return 'error';
    }
  }

  formatTimeLeft(time: number) {
    return (time / 10).toString()
  }

  start() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.next();
        }
      }, 100);
    }
  }

  pause() {
    if(this.interval) {
      clearInterval(this.interval);
      this.interval= undefined;
    }
  }

  ngOnDestroy() {
    this.pause();
  }

  next() {
    if(this.phase < 2) {
      this.phase++;
    } else {
      const ex = this.exercises[this.currentEx];
      if (this.currentRep < ex.repetitions - 1 ) {
        this.currentRep++;
        this.phase = 1;
      } else {
        if (this.currentEx < this.exercises.length -1) {
          this.currentEx++;
          this.currentRep = 0;
          this.phase = 0;
        } else {
          return;
        }
      }
    }
    this.timeLeft = this.getTimeOfCurrentPhase();
  }

  getTimeOfCurrentPhase() {
    const ex = this.exercises[this.currentEx];
    switch(this.phase) {
      case 0: return ex.preparation * 10;
      case 1: return ex.duration * 10;
      case 2: return ex.rest * 10;
      default: return 'error';
    }
  }
}
