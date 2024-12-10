import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, tap } from 'rxjs/operators';
import { CodesetService } from '../services/codeset.service';
import { loadCodeset, loadCodesetFailure, loadCodesets, loadCodesetsFailure, loadCodesetsSuccess, loadCodesetSuccess } from './codeset.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { CodesetState, CodesetVersionsState } from '../components/codeset-widget/codeset-widget.component';
import { Store } from '@ngrx/store';

@Injectable()
export class CodesetEffects {
    loadCodesets$ = createEffect(() => inject(Actions).pipe(
        ofType(loadCodesets),
        mergeMap((action) => this.codesetService.getCodesetList()
            .pipe(
                map(codesets => loadCodesetsSuccess({ data: codesets })),
                catchError((error) => of(loadCodesetsFailure({ error })))
            ))
    )
    );
    loadCodeset$ = createEffect(() => inject(Actions).pipe(
        ofType(loadCodeset),
        mergeMap((action) => this.codesetService.getCodesetMetadata(action.codesetId)
            .pipe(
                map(codeset => loadCodesetSuccess({ data: codeset })),
                catchError((error) => of(loadCodesetFailure({ error })))
            ))
    )
    );
    loadCodesetSuccess$ = createEffect(() => inject(Actions).pipe(
        ofType(loadCodesetSuccess),
        tap((action) => {
            console.log(action)
            CodesetState.setValue(this.store, action.data)
            CodesetVersionsState.setValue(this.store, action.data.versions)
            const latestVersion = action.data.versions[0]
            this.router.navigate([`/codesets/${action.data.id}/versions/${latestVersion.id}`]);
        })
    ), { dispatch: false }
    );



    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private codesetService: CodesetService,
        private store: Store,
    ) { }
}