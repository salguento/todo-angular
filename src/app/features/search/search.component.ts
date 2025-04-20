import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from '../../core/services/search/search.service';

@Component({
  selector: 'app-search',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  readonly dialog = inject(MatDialog);
  constructor(
    private searchService: SearchService,
    private cd: ChangeDetectorRef
  ) {}

  search!: string;
  searchIcon = true;

  ngOnInit() {
    this.search = this.searchService.getCurrentValue();
    this.searchService.data$.subscribe((data) => {
      this.search = data;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogSearchDialog);

    dialogRef.afterClosed().subscribe(() => {
      if (this.search.length) {
        this.searchIcon = false;
        this.cd.detectChanges();
      }
    });
  }

  clearSearch() {
    this.searchService.sendData('');
    this.searchIcon = true;
    this.cd.detectChanges();
  }
}

@Component({
  selector: 'dialog-serch-dialog',
  templateUrl: 'dialog.html',
  styleUrl: 'dialog.scss',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSearchDialog {
  readonly dialog = inject(MatDialog);
  inputValue: string = '';

  constructor(
    private searchService: SearchService,
    private cd: ChangeDetectorRef
  ) {}
  closeDialog() {
    const dialogRef = this.dialog.closeAll();
    this.searchService.sendData(this.inputValue);
    this.cd.detectChanges();
  }
}
