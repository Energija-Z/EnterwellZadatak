import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditComponent } from './edit/edit.component';
import { ExecuteComponent } from './execute/execute.component';

export const routes: Routes = [
    {path: "", component: AdminComponent},
    {path: "edit", component: EditComponent},
    {path: "play", component: ExecuteComponent}
];
 