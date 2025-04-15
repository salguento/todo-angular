import { Component } from "@angular/core";
import { TaskComponent } from "../task/task.component";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
@Component({
  selector: "app-task-list",
  imports: [TaskComponent, MatIconModule, MatTabsModule],
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.scss",
})
export class TaskListComponent {
  items = [1, 2, 3, 4, 5, 6, 7];
  dones = [];
}
