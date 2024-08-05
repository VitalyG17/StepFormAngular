import {Component, inject, OnInit} from '@angular/core';
import {CountdownService} from '../../services/countdown.service';
import {distinctUntilChanged, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-timer-reset',
  templateUrl: './timer-reset.component.html',
  styleUrls: ['./timer-reset.component.scss'],
})
export class TimerResetComponent implements OnInit {
  protected timeLeft: number = 0;

  protected isPaused: boolean = false;

  protected isPressed: boolean = false;

  private readonly destroy$: Subject<void> = new Subject<void>();

  private readonly countdownService: CountdownService = inject(CountdownService);

  public ngOnInit(): void {
    this.countdownService.timeLeftSubject$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((timeLeft: number) => {
        this.timeLeft = timeLeft;
        if (timeLeft === 0) {
          this.isPressed = false;
        }
      });
  }

  protected startCountdown(seconds: number): void {
    this.isPressed = true;
    this.countdownService.startCountdown(seconds);
  }

  protected resetCountdown(): void {
    this.isPressed = false;
    this.countdownService.resetCountdown();
  }

  protected togglePauseResume(): void {
    this.countdownService.togglePauseResume();
    this.isPaused = !this.isPaused;
  }
}
