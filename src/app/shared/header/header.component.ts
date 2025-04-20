import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewTaskComponent } from '../../features/tasks/new-task/new-task.component';
import { Observable } from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { DateService } from '../../core/services/date/date.service';
import { SearchComponent } from '../../features/search/search.component';
registerLocaleData(localePT);
@Component({
  selector: 'app-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    NewTaskComponent,
    DatePipe,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    SearchComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private dateService: DateService) {}
  date!: string;
  ngOnInit() {
    this.date = this.dateService.getCurrentValue();
    this.dateService.data$.subscribe((data) => {
      this.date = data;
    });
    this.dateService.sendData(new Date().toString());
  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  updateDate(): void {
    this.dateService.sendData(this.date);
  }
  closeMenu(): void {
    this.trigger.closeMenu();
  }
}
