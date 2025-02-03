import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  OnDestroy,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Subject, takeUntil } from 'rxjs';

import { logoService } from '../../../services/bl/logo.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, FloatLabelModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LogoSelector),
      multi: true,
    },
  ],
  selector: 'logo-selector',
  templateUrl: 'logo-selector.component.html',
})
export class LogoSelector implements OnInit, OnDestroy, ControlValueAccessor {
  @Output() selectedOptionChange = new EventEmitter<SelectItem>();

  logos: Array<any> = [];

  selectedLogoTest: any = null;

  selectedLogoT: WritableSignal<SelectItem> = signal({
    value: undefined,
  });

  filterValue: string = '';

  filteredOptions: SelectItem[] = [];

  dropdownControl = new FormControl();

  onChange: any = () => {};

  onTouched: any = () => {};

  isLoadingLogos: boolean = false;

  private unsubscribe = new Subject<void>();

  constructor(private logoService: logoService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  getLogos(): void {
    this.logoService.logos.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (logos) => {
        const newLogos: Array<SelectItem> = [];
        logos.forEach((element) => {
          if (element.Logos?.length > 0) {
            const selectItem = {
              value: element.Logos,
              name: element.School ?? '',
              title: element.ID ?? '',
            };
            newLogos.push(selectItem);
          }
        });
        this.logos = [...newLogos];
        this.isLoadingLogos = false;
      },
    });
  }

  onOptionChange(event: any) {
    this.selectedLogoT.set(event.value);
    this.selectedOptionChange.emit(event.value);
    this.onChange(event.value?.value);
    this.onTouched();
    this.dropdownControl.markAsTouched();
  }

  writeValue(value: any): void {
    if (this.logos.length == 0) {
      this.logoService.logos.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (logos) => {
          const newLogos: Array<SelectItem> = [];
          logos.forEach((element) => {
            if (element.Logos?.length > 0) {
              const selectItem = {
                value: element.Logos,
                name: element.School ?? '',
                title: element.ID ?? '',
              };
              newLogos.push(selectItem);
            }
          });
          this.logos = [...newLogos];
          this.isLoadingLogos = false;

          value = this.logos.find((x) =>
            x.value?.find(
              (y: string) =>
                y == (value?.length > 0 ? value[0] : '') ||
                y == (value?.length > 1 ? value[1] : '')
            )
          );

          if (value && value.value) {
            this.dropdownControl.setValue(value, { emitEvent: false });
            this.onChange();
            this.onOptionChange({ value: value });
            this.selectedLogoTest = value;
          }
        },
      });
    } else {
      value = this.logos.find((x) =>
        x.value?.find((y: string) => y == value[0] || y == value[1])
      );

      if (value && value.value) {
        this.dropdownControl.setValue(value, { emitEvent: false });
        this.onChange();
        this.onOptionChange({ value: value });
        this.selectedLogoTest = value;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.dropdownControl.disable();
    } else {
      this.dropdownControl.enable();
    }
  }

  clear(): void {
    this.dropdownControl.reset();
  }
}
