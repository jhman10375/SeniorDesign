import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputOtpModule],
  selector: 'draft-otp',
  styleUrls: ['draft-otp.component.scss'],
  templateUrl: 'draft-otp.component.html',
})
export class DraftOTPComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('joinDraftButton', { static: false })
  joinDraftButton!: HTMLButtonElement;

  @Input() isLeagueManager: boolean;

  @Input() set draftKey(v: string) {
    this.otp = v;
    this._draftKey = v;
  }

  get draftKey() {
    return this._draftKey;
  }

  @Input() connectedUsers: Array<string>;

  @Input() displayWaitingRoom: boolean;

  @Input() set webSocketError(v: string | null) {
    if (v) {
      const x = window.document.querySelectorAll('input');
      if (x) {
        for (let i = 0; i < x.length; i++) {
          x.item(i).value = '';
        }
        x.item(0).focus();
      }
      this.otp = '';
      this._webSocketError = v;
    }
  }

  get webSocketError() {
    return this._webSocketError;
  }

  @Output() createDraft = new EventEmitter<void>();

  @Output() joinDraft = new EventEmitter<string>();

  @Output() enterDraft = new EventEmitter<void>();

  otp: string = '';

  private _draftKey: string = '';

  private _webSocketError: string | null = null;

  constructor(private clipboard: Clipboard) {}

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
    const q = window.document.getElementsByTagName('input');
    for (let i = 0; i < q.length; i++) {
      q.item(i)?.setAttribute('type', 'number');
    }
  }

  onCreateDraft(): void {
    this.createDraft.emit();
    const x = window.document.querySelectorAll('input');
    if (x) {
      x.item(0).focus();
    }
  }

  onJoinDraft(otp: string): void {
    this.joinDraft.emit(otp);
  }

  onEnterDraft(): void {
    this.enterDraft.emit();
  }

  onCopyDraftKey(): void {
    this.clipboard.copy(this.draftKey);
    navigator.share({
      title: 'Draft Key for your draft',
      text: this.draftKey,
    });
  }

  handleKeyDown(event: KeyboardEvent, index: number) {
    const maxIndex = 6; // Adjust according to OTP length (6 digits)
    if (event.key === 'Enter') {
      if (index === maxIndex) {
        this.joinDraftButton.focus();
      }
    }
  }
}
