import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../store/store.service';
import { TYPE } from 'src/app/constants/constants';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.store.dispatch(TYPE.PAGE_NAME, 'home');
  }
}
