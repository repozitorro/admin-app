import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../shared/services/categories.service';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MaterialService} from '../../shared/material.service';
import {Category} from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  category: Category
  image: File
  imagePreview = null
  isNew = true
  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required, Validators.minLength[1])
    })

    this.form.disable()
    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }

            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category

            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => {MaterialService.toast(error.error.message)}
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0]
    this.image = file

    // Показать превью картинки
    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Сохранено')
        this.form.enable()

      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

  deleteCategory() {
    this.categoriesService.delete(this.category._id)
      .subscribe(
        response => {
          return MaterialService.toast(response.message)
        },
        error => {
          return MaterialService.toast(error.error.message)
        },
        () => {
          this.router.navigate(['/categories'])
        }
      )
  }
}
