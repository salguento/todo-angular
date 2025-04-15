import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./shared/header/header.component";
import { TaskListComponent } from "./features/tasks/task-list/task-list.component";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, TaskListComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "todo-angular";
}
