import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DamAlertsContainerComponent, UtilityService } from '@usnistgov/ngx-dam-framework';
import { ApiKeyService } from '../../../api-key/services/api-key.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../api-key/services/auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    DamAlertsContainerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  form: FormGroup;
  constructor(
    private utilityService: UtilityService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });


  }

  sendResetLink() {
    this.utilityService.useLoaderWithErrorAlert(
      this.authService.sendResetLink(this.form.value.email),
      {
        message: {
          fromHttpResponse: true,
        },
        loader: {
          blockUI: true
        }
      }
    ).pipe(
      tap((message) => {
        console.log(message);
        this.router.navigate(["/login"]);

      }),
    ).subscribe();
  }
}
