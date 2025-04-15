import { Component } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-task",
  imports: [
    MatCheckboxModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  longText = `The Chihuahua is a Mexican breed of toy dog. It is named for the
    Mexican state of Chihuahua and is among the smallest of all dog breeds. It is
    usually kept as a companion animal or for showing.`;
}
