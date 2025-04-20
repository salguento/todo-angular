import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Task } from '../../models/task.model';
import { Tag } from '../../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class DbService extends Dexie {
  tasks!: Dexie.Table<Task, number>;
  tags!: Dexie.Table<Tag, number>;

  constructor() {
    super('ListoDB');
    this.version(1).stores({
      tasks: '++id, title, description, completed, createdAt, dueDate, tags',
      tags: '++id, name',
    });
  }
}
