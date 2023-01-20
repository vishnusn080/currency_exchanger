import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DetailspageComponent } from './pages/detailspage/detailspage.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'details', component: DetailspageComponent },
  { path: 'details/:from/:to', component: DetailspageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
