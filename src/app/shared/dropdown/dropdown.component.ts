import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  OnChanges,
  ChangeDetectionStrategy,
  EventEmitter,
  SimpleChanges,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnInit, OnChanges {
  @ViewChild('selectEl') selectEl!: ElementRef<any>;
  @Input() options: any[] = [];
  @Input() heading: string = '';
  @Input() innerHeading: string = '';
  @Input() swappedVal: string | undefined = '';
  @Input() disabled: boolean = false;
  @Output() selectedValue = new EventEmitter<string>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { swappedVal } = changes;
  }

  ngOnInit(): void {}

  setOptions = (val: string) => {
    this.selectEl.nativeElement.value = val;
  };

  sendSelectedValueEvent(e: any) {
    this.selectedValue.emit(e.target.value);
  }
}
