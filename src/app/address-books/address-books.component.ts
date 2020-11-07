import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {AddressBookDto} from '../../model/address-book.dto';
import {AddressBookService} from './address-book.service';
import {Router} from '@angular/router';
import {PhoneTypeEnum} from '../../model/phone-type.enum';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-address-books',
  templateUrl: './address-books.component.html',
  styleUrls: ['./address-books.component.scss']
})
export class AddressBooksComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'homeNumber', 'workNumber', 'edit', 'delete'];
  dataSource: MatTableDataSource<AddressBookDto>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private addressBookService: AddressBookService, private router: Router) {}

  ngAfterViewInit(): void {
    this.loadData();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.addressBookService.list(this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.body.totalElements;

          return data.body.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource(data));
  }

  onAddClick(): void {
    this.router.navigate(['address-book']);
  }

  onEditClick(id: number): void {
    this.router.navigate([`address-book/${id}`]);
  }

  onDeleteClick(id: number): void {
    this.addressBookService.delete(id).subscribe(() => {
      alert('Usunięto wpis');
      this.loadData();
    });
  }

  getHomePhoneNumber(row): string {
    return row.phones.filter(item => item.phoneType === 'HOME')[0]?.number;
  }

  getWorkPhoneNumber(row): string {
    return row.phones.filter(item => item.phoneType === 'WORK')[0]?.number;
  }

  getPhoneNumber(row, home: PhoneTypeEnum): string {
    const phone = row.phones.filter(item => item.phoneType === home);
    return phone !== null && phone !== undefined ? phone[0].number : 'Brak danych';
  }
}
