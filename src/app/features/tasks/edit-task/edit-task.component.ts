// IMPORTS
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  Input,
  signal,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';

import { FormsModule } from '@angular/forms';
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
import { Observable, map } from 'rxjs';
import { Tag } from '../../../core/models/tag.model';
import { TagService } from '../../../core/services/tag/tag.service';

// EDIT TASK
@Component({
  selector: 'app-edit-task',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  @Input({ required: true }) task!: Task;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogEditTaskDialog, {
      data: this.task,
    });
  }
}

// DIALOG

@Component({
  selector: 'dialog-edit-task-dialog',
  templateUrl: 'dialog.html',
  styleUrl: 'dialog.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTimepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEditTaskDialog {
  newTask!: Task;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task) {
    this.newTask = structuredClone(data);
  }

  tagService = inject(TagService);
  tags$: Observable<Tag[]> = this.tagService.getAll();
  taskService = inject(TaskService);

  updateTask() {
    this.taskService.update(this.newTask.id!, this.newTask);
  }

  ngOnInit() {
    if (this.newTask.tags) {
      this.newTask.tags.map((tag) => {
        this.tags.update((tags) => [...tags, tag]);
      });
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

  remove(t: string): void {
    this.tags.update((tags) => {
      const index = tags.indexOf(t);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${t}`);
      return [...tags];
    });
    const index = this.newTask.tags?.indexOf(t) ?? -1;
    if (index !== -1) {
      this.newTask.tags?.splice(index, 1);
    }
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
