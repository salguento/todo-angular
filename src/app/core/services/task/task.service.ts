import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { Task } from '../../models/task.model';
import { liveQuery } from 'dexie';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private db: DbService) {}

  getAll(): Observable<Task[]> {
    return from(liveQuery(() => this.db.tasks.toArray())).pipe(
      map((tasks) => tasks || [])
    );
  }

  add(task: Task) {
    return this.db.tasks.add(task);
  }

  update(id: number, changes: Partial<Task>) {
    return this.db.tasks.update(id, changes);
  }

  delete(id: number) {
    return this.db.tasks.delete(id);
  }

  clearCompleted() {
    return this.db.tasks.where('completed').equals(1).delete();
  }
}
