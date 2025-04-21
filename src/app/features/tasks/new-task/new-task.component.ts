import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task/task.service';

import { Tag } from '../../../core/models/tag.model';
import { TagService } from '../../../core/services/tag/tag.service';

import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-new-task',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss',
})
export class NewTaskComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogNewTaskDialog);

    dialogRef.afterClosed().subscribe(() => {});
  }
}

@Component({
  selector: 'dialog-new-task-dialog',
  templateUrl: 'dialog.html',
  styleUrl: 'dialog.scss',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    MatTimepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogNewTaskDialog {
  tagService = inject(TagService);
  tags$: Observable<Tag[]> = this.tagService.getAll();
  taskService = inject(TaskService);

  newTask: Task = {
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toString(),
    dueDate: undefined,
    tags: [],
  };

  addTodo() {
    if (this.newTask.title) {
      this.taskService.add(this.newTask);
      this.newTask = {
        title: '',
        description: '',
        completed: false,
        createdAt: new Date().toString(),
        dueDate: undefined,
        tags: [],
      };
    }
  }

  readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.tags$.pipe(
          map((tags: Tag[]) =>
            tags.filter((tag) => tag.name.toLowerCase().includes(currentTag))
          )
        )
      : this.tags$.pipe(map((tags: Tag[]) => tags.slice()));
  });

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTag = model('');
  readonly tags = signal(['']);

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.newTask.tags?.includes(value)) {
      this.newTask.tags?.push(value);
      this.addTag(value);
      this.tags.update((tags) => [...tags, value]);
    }
  }

  remove(tag: string): void {
    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      return [...tags];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.newTask.tags?.includes(event.option.viewValue)) {
      this.tags.update((tags) => [...tags, event.option.viewValue]);
      this.newTask.tags?.push(event.option.viewValue);
    }
    event.option.deselect();
  }

  addTag(tagString: string) {
    this.tags$.subscribe((tags: Tag[]) => {
      let found = tags.find((tag: Tag) => tag.name === tagString);
      if (!found) {
        this.tagService.add({ name: tagString });
      }
    });
  }
}
