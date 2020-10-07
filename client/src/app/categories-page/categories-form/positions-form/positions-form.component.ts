import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from '../../../shared/services/positions.service';
import {Positions} from '../../../shared/interfaces';
import {MaterialInstance, MaterialService} from '../../../shared/material.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  form: FormGroup;
  positions: Positions[] = [];
  loading = false;
  positionId = null;
  modal: MaterialInstance;


  constructor(
    private positionsService: PositionsService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(
      positions => {
        this.positions = positions;
        this.loading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onSelectPosition(position: Positions) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: null
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onDeletePosition(event: Event, position: Positions) {
    event.stopPropagation();
    this.positionsService.delete(position).subscribe(
      response => {
        const idx = this.positions.findIndex(p => p._id === position._id);
        this.positions.splice(idx, 1);
        MaterialService.toast(response.message);
      },
      error => MaterialService.toast(error.error.message)
    );
  }

  onSubmit() {
    this.form.disable();
    const newPosition: Positions = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({name: '', cost: 1});
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Изменения сохранены');
        },
        error => MaterialService.toast(error.error.message),
        completed
      );
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция была создана');
          this.positions.push(position);
        },
        error => MaterialService.toast(error.error.message),
        completed
      );
    }


  }


}
