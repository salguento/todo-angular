import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { Tag } from '../../models/tag.model';
import { liveQuery } from 'dexie';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private db: DbService) {}

  getAll(): Observable<Tag[]> {
    return from(liveQuery(() => this.db.tags.toArray())).pipe(
      map((tags) => tags || [])
    );
  }

  add(tag: Tag) {
    return this.db.tags.add(tag);
  }

  update(id: number, changes: Partial<Tag>) {
    return this.db.tasks.update(id, changes);
  }

  delete(id: number) {
    return this.db.tags.delete(id);
  }

  clearCompleted() {
    return this.db.tags.where('completed').equals(1).delete();
  }
}
