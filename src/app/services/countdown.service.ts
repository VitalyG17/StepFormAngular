import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, takeWhile, tap} from 'rxjs';

@Injectable()
export class CountdownService {
  public timeLeftSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private currentTimerTime: number = 0;

  private isPaused: boolean = true;

  public startCountdown(seconds: number): void {
    this.currentTimerTime = seconds;
    this.timeLeftSubject$.next(seconds);
    this.isPaused = false;

    interval(1000)
      .pipe(
        takeWhile(() => this.timeLeftSubject$.getValue() > 0 && !this.isPaused),
        tap(() => {
          const newValue: number = this.timeLeftSubject$.getValue() - 1;
          this.currentTimerTime = newValue;
          this.timeLeftSubject$.next(newValue);
        }),
      )
      .subscribe();
  }

  public resetCountdown(): void {
    this.isPaused = true;
    this.timeLeftSubject$.next(0);
    this.currentTimerTime = 0;
  }

  public togglePauseResume(): void {
    if (this.isPaused) {
      this.resumeCountdown();
    } else {
      this.pauseCountdown();
    }
  }

  public pauseCountdown(): void {
    this.isPaused = true;
  }

  public resumeCountdown(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.startCountdown(this.currentTimerTime);
    }
  }
}
