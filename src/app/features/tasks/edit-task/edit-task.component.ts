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
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEditTaskDialog {
  editTask: Task = {
    id: undefined,
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toString(),
    dueDate: undefined,
    tags: [],
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task) {
    this.editTask = data;
  }

  taskService = inject(TaskService);

  updateTask() {
    this.taskService.update(this.editTask.id!, this.editTask);
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTag = model('');
  readonly tags = signal(['']);
  readonly allTags: string[] = ['Casa', 'Trabalho', 'Estudos'];
  readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.allTags.filter((tag) => tag.toLowerCase().includes(currentTag))
      : this.allTags.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.update((tags) => [...tags, value]);
    }

    // Clear the input value
    this.currentTag.set('');
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
    this.tags.update((tags) => [...tags, event.option.viewValue]);
    this.currentTag.set('');
    event.option.deselect();
  }
}
