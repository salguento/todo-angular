import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defer, Observable, Subscription } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task/task.service';

import { TaskComponent } from '../task/task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { map } from 'rxjs/operators';
import { SearchService } from '../../../core/services/search/search.service';
import { DateService } from '../../../core/services/date/date.service';
@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    TaskComponent,
    MatIconModule,
    MatTabsModule,
    MatListModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  taskservice = inject(TaskService);
  tasks$: Observable<Task[]> = this.taskservice.getAll();
  search!: string;
  date!: string;

  constructor(
    private searchService: SearchService,
    private dateService: DateService
  ) {}

  toDo$!: Observable<Task[]>;
  done$!: Observable<Task[]>;
  date$!: Observable<string>;

  ngOnInit() {
    this.filterByStatus();
    this.search = this.searchService.getCurrentValue();
    this.searchService.data$.subscribe((data) => {
      this.search = data;
      this.searchFilter();
    });
    this.date = this.dateService.getCurrentValue();
    this.dateService.data$.subscribe((data) => {
      this.date = data;
      this.dateFilter();
    });
  }

  private filterByStatus(): void {
    this.toDo$ = this.tasks$.pipe(
      map((tasks: Task[]) => tasks.filter((task) => !task.completed))
    );
    this.done$ = this.tasks$.pipe(
      map((tasks: Task[]) => tasks.filter((task) => task.completed))
    );
  }

  private searchFilter(): void {
    this.toDo$ = this.toDo$.pipe(
      map((tasks: Task[]) =>
        tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(this.search.toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes(this.search.toLowerCase()) ||
            task.tags?.some((tag: string) =>
              tag.toLowerCase().includes(this.search.toLowerCase())
            )
        )
      )
    );
    this.done$ = this.done$.pipe(
      map((tasks: Task[]) =>
        tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(this.search.toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes(this.search.toLowerCase()) ||
            task.tags?.some((tag: string) =>
              tag.toLowerCase().includes(this.search.toLowerCase())
            )
        )
      )
    );
  }

  private dateFilter(): void {
    this.toDo$ = this.toDo$.pipe(
      map((tasks: Task[]) =>
        tasks.filter(
          (task) =>
            this.normalizeDate(task.createdAt, this.date) ||
            (task.updatedAt &&
              this.normalizeDate(task?.updatedAt, this.date)) ||
            (task.dueDate && this.normalizeDate(task?.dueDate, this.date))
        )
      )
    );
    this.done$ = this.done$.pipe(
      map((tasks: Task[]) =>
        tasks.filter(
          (task) =>
            this.normalizeDate(task.createdAt, this.date) ||
            (task.updatedAt &&
              this.normalizeDate(task?.updatedAt, this.date)) ||
            (task.dueDate && this.normalizeDate(task?.dueDate, this.date))
        )
      )
    );
  }

  normalizeDate(date1: string, date2: string): boolean {
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
}
