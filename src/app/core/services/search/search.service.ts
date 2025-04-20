import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();

  sendData(data: string) {
    this.dataSubject.next(data);
  }

  getCurrentValue(): string {
    return this.dataSubject.value;
  }
}
