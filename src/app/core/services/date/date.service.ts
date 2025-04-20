import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DateService {
  private dateSubject = new BehaviorSubject<string>('');
  data$ = this.dateSubject.asObservable();

  sendData(data: string) {
    this.dateSubject.next(data);
  }

  getCurrentValue(): string {
    return this.dateSubject.value;
  }
}
