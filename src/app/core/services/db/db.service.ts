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
    this.configurePersistentStorage();
  }

  private async configurePersistentStorage(): Promise<void> {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        const persistenceGranted = await navigator.storage.persist();
        console.log('Persistence granted:', persistenceGranted);
      }
    }

    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      console.log(`Storage quota: ${estimate.quota}`);
      console.log(`Storage usage: ${estimate.usage}`);
    }
  }
}
