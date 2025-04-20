import { Component, Input, model, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task/task.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-task',
  imports: [
    MatCheckboxModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    EditTaskComponent,
    DatePipe,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  todoService = inject(TaskService);

  @Input({ required: true }) task: Task = {
    id: 0,
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toString(),
    updatedAt: undefined,
  };

  toggleTodo(id: number, completed: boolean) {
    this.todoService.update(id, { completed });
  }

  deleteTodo(id: number) {
    this.todoService.delete(id);
  }

  hasTime(i: string): boolean {
    let date = new Date(i);
    return (
      date.getHours() !== 0 ||
      date.getMinutes() !== 0 ||
      date.getSeconds() !== 0 ||
      date.getMilliseconds() !== 0
    );
  }
}
