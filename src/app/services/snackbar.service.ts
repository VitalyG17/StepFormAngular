import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class SnackbarService {
  constructor(private readonly toaster: ToastrService) {}

  public successShow(message: string, title: string = ''): void {
    this.toaster.success(message, title);
  }

  public messageShow(message: string, title: string = ''): void {
    this.toaster.info(message, title);
  }

  public warningShow(message: string, title: string = ''): void {
    this.toaster.warning(message, title);
  }

  public errorShow(message: string, title: string = ''): void {
    this.toaster.error(message, title);
  }
}
