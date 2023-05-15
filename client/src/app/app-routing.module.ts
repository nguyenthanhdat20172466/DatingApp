import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Route for the home component

  {
    path: '', // Đường dẫn cơ sở cho các tuyến đường được xác thực
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard], // Route guard to protect the child routes
    children: [
      { path: 'members', component: MemberListComponent }, // Route for the member list component
      { path: 'members/:username', component: MemberDetailComponent }, // Route for the member detail component
      {
        path: 'member/edit', // Route for member edit component
        component: MemberEditComponent,
        canDeactivate: [PreventUnsavedChangesGuard] // Route guard to prevent unsaved changes
      },

      { path: 'lists', component: ListsComponent }, // Route for the lists component
      { path: 'messages', component: MessagesComponent }, // Route for the messages component
    ]
  },

  { path: 'errors', component: TestErrorsComponent }, // Route for the test errors component
  { path: 'not-found', component: NotFoundComponent }, // Route for the not found component
  { path: 'server-error', component: ServerErrorComponent }, // Route for the server error component
  { path: '**', component: HomeComponent, pathMatch: 'full' }, // Wildcard route for handling unknown routes

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configuring the router module with the defined routes
  exports: [RouterModule] // Exporting the configured router module
})
export class AppRoutingModule { }
