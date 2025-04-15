import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  model,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NewTaskComponent } from "../../features/tasks/new-task/new-task.component";

import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";

import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { registerLocaleData } from "@angular/common";
import localePT from "@angular/common/locales/pt";
registerLocaleData(localePT);
@Component({
  selector: "app-header",
  imports: [
    MatIconModule,
    MatButtonModule,
    NewTaskComponent,
    DatePipe,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  date = new Date();

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  closeMenu() {
    this.trigger.closeMenu(); // <-- put this in your dialog open method
  }
}
