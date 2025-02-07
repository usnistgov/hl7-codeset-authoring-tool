import { Component, inject } from '@angular/core';
import {
  AlertService,
  ConfirmDialogComponent,
  DamAlertsContainerComponent,
  DataStateRepository,
  IListItemControl,
  ListWidgetComponent,
  MessageHandlerMode,
  MessageType,
  SortOrder,
  UtilityService,
} from '@usnistgov/ngx-dam-framework';
import { Store } from '@ngrx/store';
import { map, mergeMap, of, skip, switchMap, take, tap, throwError } from 'rxjs';
import { ICodesetDescriptor } from '../../models/codeset';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { CodesetService } from '../../services/codeset.service';
import { MatDialog } from '@angular/material/dialog';

export const CodesetListState = new DataStateRepository<ICodesetDescriptor>({
  name: 'codesetList', // unique name for this state variable
  routeLoader: (params, injector, state) => {
    // Hint (Error) : to throw an error while loading the state return an error observable with the error IMessage
    // return throwError(() => ({
    //   status: MessageType.FAILED,
    //   text: 'Could not load entity list',
    // }));
    const codeset = injector.get(CodesetService);
    return codeset.getCodesetList();
  },
});

@Component({
  selector: 'app-codeset-list',
  standalone: true,
  imports: [
    CommonModule,
    ListWidgetComponent,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    DamAlertsContainerComponent
  ],
  templateUrl: './codeset-list.component.html',
  styleUrl: './codeset-list.component.scss',
})
export class CodesetListComponent {
  codesetList = CodesetListState;
  route = inject(ActivatedRoute);
  router = inject(Router);
  sortOrder = SortOrder.ASC;
  controls: IListItemControl<ICodesetDescriptor>[] = [
    {
      key: 'open',
      label: 'Open',
      btnClass: 'btn btn-sm btn-primary',
      iconClass: 'bi bi-enter',
      disabled: () => false,
      hidden: () => false,
      onClick: (item: ICodesetDescriptor) => {
        this.router.navigate(['/', 'codesets', item.id, 'dashboard']);
      },
    },
    {
      key: 'clone',
      label: 'Clone',
      btnClass: 'btn btn-sm btn-success ml-1',
      iconClass: 'bi bi-enter',
      disabled: () => false,
      hidden: () => false,
      onClick: (item: ICodesetDescriptor) => {
        this.cloneCodeSet(item);
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      btnClass: 'btn btn-sm btn-danger ml-1',
      iconClass: 'bi bi-enter',
      disabled: () => false,
      hidden: () => false,
      onClick: (item: ICodesetDescriptor) => {
        this.deleteCodeSet(item);
      },
    },

  ];
  sort: (
    field: string | undefined,
    order: SortOrder
  ) => (a: ICodesetDescriptor, b: ICodesetDescriptor) => number =
    (sortField, sortOrder) => (a, b) => {
      const multiplier = sortOrder === SortOrder.ASC ? 1 : -1;
      switch (sortField) {
        case 'name':
          return (
            (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * multiplier
          );
      }
      return 0;
    };
  sortOptions = [
    {
      name: 'Name',
      key: 'name',
    },
  ];

  sortOrderToggle = SortOrder.ASC;
  // linkTabs = [
  //   {
  //     label: 'Owned',
  //     routerLink: {
  //       command: [],
  //       params: {
  //         type: 'owned',
  //       },
  //     },
  //   },
  //   {
  //     label: 'Public',
  //     routerLink: {
  //       command: [],
  //       params: {
  //         type: 'public',
  //       },
  //     },
  //   },
  //   {
  //     label: 'All',
  //     routerLink: {
  //       command: [],
  //       params: {
  //         type: 'all',
  //       },
  //     },
  //   },
  // ];

  constructor(
    private store: Store,
    private routeSnapshot: ActivatedRoute,
    private codesetService: CodesetService,
    private dialog: MatDialog,
    private utilityService: UtilityService,
  ) {

  }

  ngOnInit(): void {
    this.utilityService.clearAlerts();
    this.routeSnapshot.queryParams
      .pipe(
        skip(1),
        switchMap((queryParams) => {
          return this.codesetService.getCodesetList().pipe(
            tap((values) => {
              CodesetListState.setValue(this.store, values);
            })
          );
        })
      )
      .subscribe();
  }

  deleteCodeSet(item: ICodesetDescriptor) {
    if (!item) return;

    const confirmDialog$ = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete Code Set',
        question: `Are you sure you want to delete this Code Set ${item.name}?`,
      },
    }).afterClosed();

    confirmDialog$.pipe(
      take(1),
      mergeMap((confirmed: boolean) => {
        if (confirmed) {
          return this.utilityService.use(
            this.codesetService.deleteCodeset(item.id),
            {
              loader: {
                blockUI: true
              },
              alert: {
                fromHttpResponse: true,
                mode: MessageHandlerMode.MESSAGE_RESULT_AND_ERROR
              }

            }
          ).pipe(
            mergeMap(res => {
              return this.codesetService.getCodesetList().pipe(
                tap((values) => {
                  CodesetListState.setValue(this.store, values);
                })
              )
            })
          )
        }
        return of();
      })
    ).subscribe();
  }

  cloneCodeSet(item: ICodesetDescriptor) {
    this.utilityService.use(
      this.codesetService.cloneCodeset(item.id),
      {
        loader: {
          blockUI: true
        },
        alert: {
          fromHttpResponse: true,
          mode: MessageHandlerMode.MESSAGE_RESULT_AND_ERROR
        }

      }
    ).pipe(
      map(res => {
        this.router.navigate(['/', 'codesets', res.resourceId, 'dashboard']);
        // CodesetState.getOneValue(this.store).pipe(
        //   take(1),
        //   map((codeset) => {
        //     this.store.dispatch(loadCodeset({ codesetId: codeset.id, redirect: true }));

        //   })
        // ).subscribe()
      })
    ).subscribe()
  }

}
