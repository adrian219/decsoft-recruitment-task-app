import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AddressBookService} from '../address-book.service';
import {NgForm} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {
  model: any = {firstName: '', lastName: '', email: '', phones: []};

  id: number;
  photoId: number;
  serviceUrl = environment.apiUrl + '/photos/';
  photoUrl = '';
  previewUrl;
  oldPhoto = false;

  selectedFile: File;

  constructor(private route: ActivatedRoute,
              private addressBookService: AddressBookService,
              private router: Router) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param !== null && param !== undefined && param !== 'undefined') {
      this.id = +param;
    }

    if (this.isEditAction()) {
      this.addressBookService.get(this.id).subscribe(item => {
        this.model = item;
        this.photoId = item.photoId;
        this.oldPhoto = item.photoId !== null;
        this.photoUrl = this.serviceUrl + item.photoId;
      }, error => alert('Wystąpił błąd podczas odczytu! ' + error.message));
    }
  }

  save(): void {
    if (this.isEditAction()) {
      this.addressBookService.edit(this.id, this.model, this.selectedFile).subscribe(() => {
        this.router.navigate(['address-books']);
      }, error => alert('Wystąpił błąd podczas zapisu! ' + error.member));
    } else {
      this.addressBookService.create(this.model, this.selectedFile).subscribe(() => {
        this.router.navigate(['address-books']);
      }, error => alert('Wystąpił błąd podczas zapisu! ' + error.member));
    }
  }

  isEditAction(): boolean {
    return this.id !== null && this.id !== undefined;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.save();
  }

  onAddPhone(): void {
    this.model.phones.push({phoneType: 'HOME', number: ''});
  }

  onDeletePhone(row): void {
    this.model.phones = this.model.phones.filter(item => item !== row);
  }

  selectFile(event): void {
    this.selectedFile = event.target.files.item(0);
    this.model.photoId = null;
    this.preview(event.target.files);
  }

  preview(files): void {
    if (files.length === 0) {
      this.oldPhoto = true;
      this.model.photoId = this.photoId;
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.oldPhoto = true;
      this.model.photoId = this.photoId;
      return;
    }

    this.oldPhoto = false;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.previewUrl = reader.result;
    };
  }

  onBackClick(): void {
    this.router.navigate(['address-books']);
  }

  onDeletePhotoClick(): void {
    this.model.photoId = null;
    this.oldPhoto = false;
  }
}
